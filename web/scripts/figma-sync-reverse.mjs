#!/usr/bin/env node
/**
 * figma-sync-reverse.mjs
 * ----------------------
 * Syncs code-side token changes back to Figma via Variables API.
 *
 * Usage:
 *   FIGMA_TOKEN=xxx FIGMA_FILE_ID=yyy node scripts/figma-sync-reverse.mjs [options]
 *
 * Options:
 *   --dry-run       Show what would change without writing (DEFAULT)
 *   --write         Actually write to Figma API
 *   --category X    Only sync tokens in category X (color, spacing, etc.)
 *   --json          Output diff as JSON instead of table
 *   --verbose       Show detailed per-token logs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  flattenFigmaRaw,
  flattenTsTokens,
  normalizeValue,
  hexToFigmaColor,
  hashValue,
} from './tokens/shared-flatten.mjs';
import {
  detectCategory,
  loadMergeStrategy,
  computeFullDiff,
} from './tokens/merge-strategy.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/* ------------------------------------------------------------------ */
/*  Paths                                                              */
/* ------------------------------------------------------------------ */

const FIGMA_TOKENS_PATH = join(ROOT, 'design-tokens', 'figma.tokens.json');
const CODE_TOKENS_PATH = join(ROOT, 'packages', 'design-system', 'src', 'tokens', 'build', 'tokens.json');
const SYNC_STATE_PATH = join(ROOT, '.figma-sync-state.json');

/* ------------------------------------------------------------------ */
/*  CLI arg parsing                                                    */
/* ------------------------------------------------------------------ */

export function parseArgs(argv = process.argv.slice(2)) {
  const opts = {
    dryRun: true,
    write: false,
    category: null,
    json: false,
    verbose: false,
  };

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--dry-run':
        opts.dryRun = true;
        opts.write = false;
        break;
      case '--write':
        opts.write = true;
        opts.dryRun = false;
        break;
      case '--category':
        opts.category = argv[++i] || null;
        break;
      case '--json':
        opts.json = true;
        break;
      case '--verbose':
        opts.verbose = true;
        break;
    }
  }
  return opts;
}

/* ------------------------------------------------------------------ */
/*  Load tokens                                                        */
/* ------------------------------------------------------------------ */

export function loadCodeTokens(path = CODE_TOKENS_PATH) {
  if (!existsSync(path)) {
    throw new Error(
      `Code tokens not found at ${path}.\n` +
      'Run "npm run tokens:build" first to generate tokens.json.'
    );
  }
  const raw = JSON.parse(readFileSync(path, 'utf-8'));
  return flattenTsTokens(raw);
}

export function loadFigmaTokens(path = FIGMA_TOKENS_PATH) {
  if (!existsSync(path)) {
    throw new Error(`Figma tokens not found at ${path}.`);
  }
  const data = JSON.parse(readFileSync(path, 'utf-8'));
  // Flatten the "raw" section (Figma export uses { value: "..." } format)
  if (data.raw) {
    return flattenFigmaRaw(data.raw);
  }
  return flattenFigmaRaw(data);
}

export function loadSyncState(path = SYNC_STATE_PATH) {
  if (!existsSync(path)) {
    return { lastSyncTimestamp: null, lastSyncDirection: null, tokenHashes: {}, figmaFileVersion: null };
  }
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return { lastSyncTimestamp: null, lastSyncDirection: null, tokenHashes: {}, figmaFileVersion: null };
  }
}

export function saveSyncState(state, path = SYNC_STATE_PATH) {
  writeFileSync(path, JSON.stringify(state, null, 2) + '\n');
}

/* ------------------------------------------------------------------ */
/*  Build last-sync token map from hashes                              */
/* ------------------------------------------------------------------ */

/**
 * Reconstruct a flat "last sync" token map from sync state hashes.
 * Since we store hashes (not values), we compare against current values:
 * if a value's hash matches the stored hash, the token hasn't changed
 * since last sync — we use the current value as the "last sync" value.
 */
export function buildLastSyncMap(figmaFlat, codeFlat, syncState) {
  const lastSync = {};
  const hashes = syncState.tokenHashes || {};
  const allPaths = new Set([...Object.keys(figmaFlat), ...Object.keys(codeFlat)]);

  for (const path of allPaths) {
    const stored = hashes[path];
    if (!stored) {
      // No previous sync record — treat as if figma was the baseline
      lastSync[path] = figmaFlat[path] ?? codeFlat[path] ?? null;
      continue;
    }

    // Check which current value matches the stored hash
    const figmaVal = figmaFlat[path];
    const codeVal = codeFlat[path];

    if (figmaVal !== undefined && hashValue(figmaVal) === stored) {
      lastSync[path] = figmaVal;
    } else if (codeVal !== undefined && hashValue(codeVal) === stored) {
      lastSync[path] = codeVal;
    } else {
      // Both have changed since last sync — use stored hash as sentinel
      // (the merge strategy will resolve the conflict)
      lastSync[path] = `__hash:${stored}`;
    }
  }

  return lastSync;
}

/* ------------------------------------------------------------------ */
/*  Diff filtering                                                     */
/* ------------------------------------------------------------------ */

export function filterByCategory(diff, category) {
  if (!category) return diff;
  return diff.filter((entry) => detectCategory(entry.path) === category);
}

/**
 * Filter diff to only include entries where code should push to Figma.
 * For reverse sync, we care about: code-ahead, code-only, and conflicts
 * where code wins.
 */
export function filterCodeToFigma(diff) {
  return diff.filter((entry) => {
    if (entry.resolution === 'in-sync') return false;
    if (entry.resolution === 'code-ahead') return true;
    if (entry.resolution === 'code-only') return true;
    if (entry.resolution === 'conflict' && entry.winner === 'code') return true;
    return false;
  });
}

/* ------------------------------------------------------------------ */
/*  Figma API helpers                                                  */
/* ------------------------------------------------------------------ */

const FIGMA_API = 'https://api.figma.com/v1';

/**
 * Fetch existing Figma variables to find variable IDs, collection IDs, and mode IDs.
 */
export async function fetchFigmaVariables(fileId, token) {
  const url = `${FIGMA_API}/files/${fileId}/variables/local`;
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': token },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API error ${res.status}: ${text}`);
  }

  return res.json();
}

/**
 * Build a lookup from token path → { variableId, collectionId, modeId, resolvedType }
 * by inspecting the Figma Variables API response.
 */
export function buildVariableLookup(apiResponse) {
  const { meta } = apiResponse;
  const { variableCollections, variables } = meta;
  const lookup = {};

  for (const [varId, variable] of Object.entries(variables)) {
    const collection = variableCollections[variable.variableCollectionId];
    if (!collection) continue;

    // Build the token path from the variable name (Figma uses "/" separators)
    const pathParts = variable.name.split('/').map((p) => p.trim());
    const collectionPrefix = collection.name.toLowerCase().replace(/\s+/g, '-');

    // Key with collection prefix to match figma.tokens.json structure
    const tokenPath = pathParts.join('.');

    const modeId = collection.modes[0]?.modeId;

    lookup[tokenPath] = {
      variableId: varId,
      collectionId: variable.variableCollectionId,
      modeId,
      resolvedType: variable.resolvedType,
      name: variable.name,
    };
  }

  return lookup;
}

/**
 * Convert a code token value to the Figma API value format.
 */
export function codeValueToFigmaValue(value, resolvedType) {
  if (resolvedType === 'COLOR') {
    // Convert hex string to Figma color object
    const strVal = String(value);
    if (strVal.startsWith('#')) {
      return hexToFigmaColor(strVal);
    }
    // If it's already an object with r,g,b, pass through
    if (typeof value === 'object' && value !== null && 'r' in value) {
      return value;
    }
    return value;
  }

  if (resolvedType === 'FLOAT') {
    const num = parseFloat(value);
    return isNaN(num) ? value : num;
  }

  // STRING, BOOLEAN, etc.
  return value;
}

/**
 * Build the Figma Variables API POST payload for a batch of token updates.
 */
export function buildFigmaPayload(updates) {
  const variables = updates.map((u) => ({
    action: 'UPDATE',
    id: u.variableId,
    name: u.name,
    resolvedType: u.resolvedType,
    valuesByMode: {
      [u.modeId]: u.figmaValue,
    },
  }));

  return { variables, variableCollections: [] };
}

/**
 * POST variable updates to the Figma API.
 */
export async function postFigmaVariables(fileId, token, payload) {
  const url = `${FIGMA_API}/files/${fileId}/variables`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Figma-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API write error ${res.status}: ${text}`);
  }

  return res.json();
}

/* ------------------------------------------------------------------ */
/*  Diff reporting                                                     */
/* ------------------------------------------------------------------ */

// ANSI color helpers
const C = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

export function formatDiffTable(diff, verbose = false) {
  if (diff.length === 0) {
    return `${C.green}No code→Figma changes detected.${C.reset}`;
  }

  const lines = [];
  lines.push('');
  lines.push(`${C.bold}Code → Figma Reverse Sync Diff${C.reset}`);
  lines.push(`${'─'.repeat(80)}`);
  lines.push(
    `  ${C.dim}${'Token Path'.padEnd(45)}${'Resolution'.padEnd(16)}${'Code Value'.padEnd(20)}${C.reset}`
  );
  lines.push(`${'─'.repeat(80)}`);

  for (const entry of diff) {
    const icon = entry.resolution === 'code-ahead' ? `${C.green}↑${C.reset}`
      : entry.resolution === 'code-only' ? `${C.cyan}+${C.reset}`
        : entry.resolution === 'conflict' ? `${C.yellow}!${C.reset}`
          : ' ';

    const path = entry.path.length > 44 ? '…' + entry.path.slice(-43) : entry.path;
    const resolution = entry.resolution.padEnd(15);
    const codeVal = String(entry.codeValue ?? '').slice(0, 19);

    lines.push(`${icon} ${path.padEnd(44)} ${resolution} ${codeVal}`);

    if (verbose && entry.figmaValue) {
      lines.push(`  ${C.dim}  figma: ${entry.figmaValue}${C.reset}`);
    }
  }

  lines.push(`${'─'.repeat(80)}`);

  const counts = {
    codeAhead: diff.filter((d) => d.resolution === 'code-ahead').length,
    codeOnly: diff.filter((d) => d.resolution === 'code-only').length,
    conflict: diff.filter((d) => d.resolution === 'conflict').length,
  };

  lines.push(
    `  ${C.green}↑ code-ahead: ${counts.codeAhead}${C.reset}  ` +
    `${C.cyan}+ code-only: ${counts.codeOnly}${C.reset}  ` +
    `${C.yellow}! conflict(code wins): ${counts.conflict}${C.reset}`
  );
  lines.push(`  Total: ${diff.length} token(s) to push to Figma`);
  lines.push('');

  return lines.join('\n');
}

export function formatDiffJson(diff) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    direction: 'code-to-figma',
    totalChanges: diff.length,
    changes: diff.map((d) => ({
      path: d.path,
      resolution: d.resolution,
      winner: d.winner,
      codeValue: d.codeValue,
      figmaValue: d.figmaValue,
      resolvedValue: d.resolvedValue,
      category: detectCategory(d.path),
    })),
  }, null, 2);
}

/* ------------------------------------------------------------------ */
/*  Sync state update                                                  */
/* ------------------------------------------------------------------ */

export function updateSyncState(syncState, appliedChanges, figmaFlat, codeFlat) {
  const newHashes = { ...syncState.tokenHashes };

  // Update hashes for all current tokens (both sides)
  const allPaths = new Set([...Object.keys(figmaFlat), ...Object.keys(codeFlat)]);
  for (const path of allPaths) {
    const val = codeFlat[path] ?? figmaFlat[path];
    if (val !== undefined && val !== null) {
      newHashes[path] = hashValue(val);
    }
  }

  // For applied changes, use the resolved (code) value
  for (const change of appliedChanges) {
    if (change.resolvedValue !== undefined && change.resolvedValue !== null) {
      newHashes[change.path] = hashValue(change.resolvedValue);
    }
  }

  return {
    lastSyncTimestamp: new Date().toISOString(),
    lastSyncDirection: 'code-to-figma',
    tokenHashes: newHashes,
    figmaFileVersion: syncState.figmaFileVersion,
  };
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  const opts = parseArgs();

  /* --- Load tokens ------------------------------------------------ */

  let codeFlat, figmaFlat, syncState;

  try {
    codeFlat = loadCodeTokens();
  } catch (err) {
    console.error(`${C.red}Error:${C.reset} ${err.message}`);
    process.exit(1);
  }

  try {
    figmaFlat = loadFigmaTokens();
  } catch (err) {
    console.error(`${C.red}Error:${C.reset} ${err.message}`);
    process.exit(1);
  }

  syncState = loadSyncState();

  if (opts.verbose) {
    console.log(`Code tokens:  ${Object.keys(codeFlat).length} entries`);
    console.log(`Figma tokens: ${Object.keys(figmaFlat).length} entries`);
    console.log(`Sync state:   ${Object.keys(syncState.tokenHashes).length} hashes`);
  }

  /* --- Compute diff ----------------------------------------------- */

  const strategy = await loadMergeStrategy();
  const lastSyncMap = buildLastSyncMap(figmaFlat, codeFlat, syncState);
  const fullDiff = computeFullDiff(figmaFlat, codeFlat, lastSyncMap, strategy);

  // Filter to code→figma direction only
  let reverseDiff = filterCodeToFigma(fullDiff);

  // Apply category filter
  if (opts.category) {
    reverseDiff = filterByCategory(reverseDiff, opts.category);
  }

  /* --- Report ----------------------------------------------------- */

  if (opts.json) {
    console.log(formatDiffJson(reverseDiff));
  } else {
    console.log(formatDiffTable(reverseDiff, opts.verbose));

    if (opts.dryRun && reverseDiff.length > 0) {
      console.log(`${C.dim}(dry-run mode — use --write to push changes to Figma)${C.reset}`);
    }
  }

  /* --- Write to Figma --------------------------------------------- */

  if (opts.write && reverseDiff.length > 0) {
    const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
    const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;

    if (!FIGMA_TOKEN || !FIGMA_FILE_ID) {
      console.error(`${C.red}Error:${C.reset} FIGMA_TOKEN and FIGMA_FILE_ID required for --write mode.`);
      process.exit(1);
    }

    console.log(`\n${C.bold}Fetching Figma variable metadata...${C.reset}`);
    const apiResponse = await fetchFigmaVariables(FIGMA_FILE_ID, FIGMA_TOKEN);
    const lookup = buildVariableLookup(apiResponse);

    const updates = [];
    const skipped = [];

    for (const change of reverseDiff) {
      const info = lookup[change.path];
      if (!info) {
        skipped.push(change.path);
        if (opts.verbose) {
          console.log(`  ${C.dim}skip: ${change.path} (no matching Figma variable)${C.reset}`);
        }
        continue;
      }

      const figmaValue = codeValueToFigmaValue(change.resolvedValue, info.resolvedType);

      updates.push({
        variableId: info.variableId,
        collectionId: info.collectionId,
        modeId: info.modeId,
        resolvedType: info.resolvedType,
        name: info.name,
        figmaValue,
        tokenPath: change.path,
      });
    }

    if (updates.length > 0) {
      console.log(`\n${C.bold}Pushing ${updates.length} variable(s) to Figma...${C.reset}`);
      const payload = buildFigmaPayload(updates);
      await postFigmaVariables(FIGMA_FILE_ID, FIGMA_TOKEN, payload);
      console.log(`${C.green}Successfully updated ${updates.length} variable(s).${C.reset}`);
    }

    if (skipped.length > 0) {
      console.log(`${C.yellow}Skipped ${skipped.length} token(s) with no Figma variable match.${C.reset}`);
    }

    // Update sync state
    const newState = updateSyncState(syncState, reverseDiff, figmaFlat, codeFlat);
    saveSyncState(newState);
    console.log(`${C.dim}Sync state updated.${C.reset}`);
  } else if (opts.write && reverseDiff.length === 0) {
    console.log(`${C.green}Nothing to push — code and Figma are in sync.${C.reset}`);
  }

  // Always update sync state on dry-run too (just the hashes, not the direction)
  if (opts.dryRun) {
    const newState = updateSyncState(syncState, [], figmaFlat, codeFlat);
    // Don't overwrite direction on dry-run
    newState.lastSyncDirection = syncState.lastSyncDirection;
    newState.lastSyncTimestamp = syncState.lastSyncTimestamp;
    // Don't save on dry-run — just report
  }
}

main().catch((err) => {
  console.error(`${C.red}Reverse sync failed:${C.reset}`, err.message);
  process.exit(1);
});
