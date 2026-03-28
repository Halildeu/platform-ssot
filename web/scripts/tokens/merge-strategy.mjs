#!/usr/bin/env node
/**
 * merge-strategy.mjs
 * ------------------
 * Configurable per-category merge rules for Figma ↔ Code token sync.
 */

// Default category rules: which side "wins" for each token category
const DEFAULT_RULES = {
  // Visual design authority → Figma wins
  color: 'figma',
  typography: 'figma',

  // Engineering-driven → Code wins
  spacing: 'code',
  motion: 'code',
  elevation: 'code',
  radius: 'code',

  // Implementation details → Code wins
  density: 'code',
  opacity: 'code',
  zIndex: 'code',
  focusRing: 'code',

  // Default for unknown categories
  _default: 'figma',
};

/**
 * Detect which category a token belongs to based on its key path.
 * @param {string} tokenPath - e.g., "color.primary.500", "spacing.4"
 * @returns {string} category name
 */
export function detectCategory(tokenPath) {
  const first = tokenPath.split('.')[0].toLowerCase();
  // Map known prefixes to categories
  const categoryMap = {
    palette: 'color', color: 'color', accent: 'color',
    font: 'typography', text: 'typography', letter: 'typography', line: 'typography',
    spacing: 'spacing', gap: 'spacing',
    radius: 'radius', border: 'radius',
    elevation: 'elevation', shadow: 'elevation',
    duration: 'motion', easing: 'motion', motion: 'motion',
    density: 'density',
    opacity: 'opacity',
    z: 'zIndex', zIndex: 'zIndex',
    focus: 'focusRing',
  };
  return categoryMap[first] || '_default';
}

/**
 * Load merge strategy (default + optional overrides from config file).
 * @param {string} [configPath] - Optional path to merge-strategy.json
 * @returns {Record<string, 'figma' | 'code'>}
 */
export async function loadMergeStrategy(configPath) {
  let overrides = {};
  if (configPath) {
    try {
      const fs = await import('fs');
      overrides = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch { /* use defaults */ }
  }
  return { ...DEFAULT_RULES, ...overrides };
}

/**
 * Resolve a merge conflict for a single token.
 * @param {object} params
 * @param {string} params.tokenPath
 * @param {string} params.lastSyncValue - Value at last sync
 * @param {string} params.figmaValue - Current Figma value
 * @param {string} params.codeValue - Current code value
 * @param {Record<string, string>} params.strategy - Merge rules
 * @returns {{ resolution: 'in-sync' | 'figma-ahead' | 'code-ahead' | 'conflict' | 'both-changed', winner: 'figma' | 'code' | null, value: string }}
 */
export function resolveToken({ tokenPath, lastSyncValue, figmaValue, codeValue, strategy }) {
  // Both same → in-sync
  if (figmaValue === codeValue) {
    return { resolution: 'in-sync', winner: null, value: figmaValue };
  }

  const figmaChanged = figmaValue !== lastSyncValue;
  const codeChanged = codeValue !== lastSyncValue;

  // Only Figma changed
  if (figmaChanged && !codeChanged) {
    return { resolution: 'figma-ahead', winner: 'figma', value: figmaValue };
  }

  // Only Code changed
  if (!figmaChanged && codeChanged) {
    return { resolution: 'code-ahead', winner: 'code', value: codeValue };
  }

  // Both changed → apply category rule
  const category = detectCategory(tokenPath);
  const rule = strategy[category] || strategy._default || 'figma';

  // If both changed to same value → resolved
  if (figmaValue === codeValue) {
    return { resolution: 'in-sync', winner: null, value: figmaValue };
  }

  return {
    resolution: 'conflict',
    winner: rule,
    value: rule === 'figma' ? figmaValue : codeValue,
  };
}

/**
 * Compute full diff between Figma and Code token sets.
 * @param {Record<string, string>} figmaTokens - Flat Figma tokens
 * @param {Record<string, string>} codeTokens - Flat code tokens
 * @param {Record<string, string>} lastSyncTokens - Flat tokens at last sync
 * @param {Record<string, string>} strategy - Merge rules
 * @returns {Array<{ path: string, resolution: string, winner: string|null, figmaValue: string, codeValue: string, resolvedValue: string }>}
 */
export function computeFullDiff(figmaTokens, codeTokens, lastSyncTokens, strategy) {
  const allPaths = new Set([...Object.keys(figmaTokens), ...Object.keys(codeTokens)]);
  const results = [];

  for (const path of allPaths) {
    const figmaValue = figmaTokens[path] ?? null;
    const codeValue = codeTokens[path] ?? null;
    const lastSyncValue = lastSyncTokens[path] ?? null;

    // Token only in Figma (new from design)
    if (figmaValue && !codeValue) {
      results.push({ path, resolution: 'figma-only', winner: 'figma', figmaValue, codeValue: null, resolvedValue: figmaValue });
      continue;
    }

    // Token only in Code (new from engineering)
    if (!figmaValue && codeValue) {
      results.push({ path, resolution: 'code-only', winner: 'code', figmaValue: null, codeValue, resolvedValue: codeValue });
      continue;
    }

    const { resolution, winner, value } = resolveToken({
      tokenPath: path,
      lastSyncValue: lastSyncValue ?? figmaValue, // If no prior sync, assume figma was source
      figmaValue,
      codeValue,
      strategy,
    });

    results.push({ path, resolution, winner, figmaValue, codeValue, resolvedValue: value });
  }

  return results;
}

export { DEFAULT_RULES };
