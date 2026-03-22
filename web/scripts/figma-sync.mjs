#!/usr/bin/env node
/**
 * Figma Variables API → DTCG JSON sync
 *
 * Usage:
 *   FIGMA_TOKEN=xxx FIGMA_FILE_ID=xxx node scripts/figma-sync.mjs
 *
 * Without env vars: shows instructions and exits gracefully.
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DTCG_DIR = join(__dirname, '..', 'packages', 'design-system', 'tokens', 'dtcg');

/* ------------------------------------------------------------------ */
/*  ENV check                                                          */
/* ------------------------------------------------------------------ */

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;

if (!FIGMA_TOKEN || !FIGMA_FILE_ID) {
  console.log(`
┌─────────────────────────────────────────────────────────┐
│  Figma Variables Sync — Setup Required                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  This script syncs Figma Variables to DTCG JSON tokens. │
│                                                         │
│  Required environment variables:                        │
│    FIGMA_TOKEN    — Personal access token from Figma    │
│    FIGMA_FILE_ID  — File key from the Figma URL         │
│                                                         │
│  How to get them:                                       │
│    1. Go to Figma → Settings → Personal access tokens   │
│    2. Create a token with "File content" read scope     │
│    3. Copy the file key from your Figma file URL:       │
│       figma.com/design/<FILE_KEY>/...                   │
│                                                         │
│  Example:                                               │
│    FIGMA_TOKEN=figd_xxx \\                               │
│    FIGMA_FILE_ID=abc123 \\                               │
│    node scripts/figma-sync.mjs                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
`);
  process.exit(0);
}

/* ------------------------------------------------------------------ */
/*  Figma API helpers                                                  */
/* ------------------------------------------------------------------ */

const FIGMA_API = 'https://api.figma.com/v1';

async function fetchFigmaVariables() {
  const url = `${FIGMA_API}/files/${FIGMA_FILE_ID}/variables/local`;
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API error ${res.status}: ${text}`);
  }

  return res.json();
}

/* ------------------------------------------------------------------ */
/*  DTCG type mapping                                                  */
/* ------------------------------------------------------------------ */

function figmaTypeToDtcg(resolvedType) {
  const map = {
    COLOR: 'color',
    FLOAT: 'number',
    STRING: 'fontFamily',
    BOOLEAN: 'number',
  };
  return map[resolvedType] || 'number';
}

function figmaColorToHex(color) {
  if (!color || typeof color !== 'object') return color;
  const { r, g, b, a } = color;
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  if (a !== undefined && a < 1) {
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a.toFixed(2)})`;
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function resolveValue(value, resolvedType) {
  if (resolvedType === 'COLOR') return figmaColorToHex(value);
  return value;
}

/* ------------------------------------------------------------------ */
/*  Convert to DTCG grouped by collection                              */
/* ------------------------------------------------------------------ */

function convertToDtcg(apiResponse) {
  const { meta } = apiResponse;
  const { variableCollections, variables } = meta;

  const groups = {};

  for (const [, variable] of Object.entries(variables)) {
    const collection = variableCollections[variable.variableCollectionId];
    if (!collection) continue;

    const collectionName = collection.name.toLowerCase().replace(/\s+/g, '-');
    if (!groups[collectionName]) groups[collectionName] = {};

    const pathParts = variable.name.split('/');
    let current = groups[collectionName];

    for (let i = 0; i < pathParts.length - 1; i++) {
      const key = pathParts[i].trim();
      if (!current[key]) current[key] = {};
      current = current[key];
    }

    const leafKey = pathParts[pathParts.length - 1].trim();

    // Use first mode's value
    const modeId = collection.modes[0]?.modeId;
    const rawValue = modeId ? variable.valuesByMode[modeId] : undefined;

    current[leafKey] = {
      $value: resolveValue(rawValue, variable.resolvedType),
      $type: figmaTypeToDtcg(variable.resolvedType),
    };
  }

  return groups;
}

/* ------------------------------------------------------------------ */
/*  Diff summary                                                       */
/* ------------------------------------------------------------------ */

function flattenDtcg(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && '$value' in value) {
      result[path] = JSON.stringify(value.$value);
    } else if (value && typeof value === 'object' && !key.startsWith('$')) {
      Object.assign(result, flattenDtcg(value, path));
    }
  }
  return result;
}

function computeDiff(oldTokens, newTokens) {
  const added = [];
  const changed = [];
  const removed = [];

  for (const key of Object.keys(newTokens)) {
    if (!(key in oldTokens)) added.push(key);
    else if (oldTokens[key] !== newTokens[key]) changed.push(key);
  }

  for (const key of Object.keys(oldTokens)) {
    if (!(key in newTokens)) removed.push(key);
  }

  return { added, changed, removed };
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  console.log('Fetching variables from Figma...');
  const apiResponse = await fetchFigmaVariables();
  const groups = convertToDtcg(apiResponse);

  if (!existsSync(DTCG_DIR)) {
    mkdirSync(DTCG_DIR, { recursive: true });
  }

  let totalAdded = 0;
  let totalChanged = 0;
  let totalRemoved = 0;

  for (const [name, tokens] of Object.entries(groups)) {
    const filePath = join(DTCG_DIR, `${name}.json`);
    const newFlat = flattenDtcg(tokens);

    let oldFlat = {};
    if (existsSync(filePath)) {
      try {
        const existing = JSON.parse(readFileSync(filePath, 'utf-8'));
        oldFlat = flattenDtcg(existing);
      } catch { /* first run or corrupt file */ }
    }

    const diff = computeDiff(oldFlat, newFlat);
    totalAdded += diff.added.length;
    totalChanged += diff.changed.length;
    totalRemoved += diff.removed.length;

    writeFileSync(filePath, JSON.stringify(tokens, null, 2) + '\n');
    console.log(`  Written: ${filePath}`);

    if (diff.added.length) console.log(`    + ${diff.added.length} added`);
    if (diff.changed.length) console.log(`    ~ ${diff.changed.length} changed`);
    if (diff.removed.length) console.log(`    - ${diff.removed.length} removed`);
  }

  console.log('\n--- Sync Summary ---');
  console.log(`  Collections: ${Object.keys(groups).length}`);
  console.log(`  Added:       ${totalAdded}`);
  console.log(`  Changed:     ${totalChanged}`);
  console.log(`  Removed:     ${totalRemoved}`);
  console.log('Done.');
}

main().catch((err) => {
  console.error('Figma sync failed:', err.message);
  process.exit(1);
});
