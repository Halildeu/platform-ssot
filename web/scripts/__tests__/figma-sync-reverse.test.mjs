import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';

/*
 * We import the pure/exported helpers from the reverse-sync script.
 * The main() function is side-effectful and not tested directly here —
 * instead we test each building-block in isolation.
 */
import {
  parseArgs,
  loadCodeTokens,
  loadFigmaTokens,
  loadSyncState,
  buildLastSyncMap,
  filterByCategory,
  filterCodeToFigma,
  buildVariableLookup,
  codeValueToFigmaValue,
  buildFigmaPayload,
  formatDiffTable,
  formatDiffJson,
  updateSyncState,
} from '../figma-sync-reverse.mjs';

import { hashValue, normalizeValue } from '../tokens/shared-flatten.mjs';
import { computeFullDiff, loadMergeStrategy, detectCategory } from '../tokens/merge-strategy.mjs';

/* ------------------------------------------------------------------ */
/*  Fixtures                                                           */
/* ------------------------------------------------------------------ */

const MOCK_FIGMA_FLAT = {
  'color.brand.primary.500': '#3b82f6',
  'color.brand.primary.600': '#2563eb',
  'radius.sm': '4',
  'spacing.4': '16',
};

const MOCK_CODE_FLAT = {
  'color.brand.primary.500': '#3b82f6', // same
  'color.brand.primary.600': '#1d4ed8', // changed in code
  'radius.sm': '4',                     // same
  'spacing.4': '16',                    // same
  'spacing.8': '32',                    // new in code
};

const MOCK_SYNC_STATE = {
  lastSyncTimestamp: '2025-01-01T00:00:00.000Z',
  lastSyncDirection: 'figma-to-code',
  tokenHashes: {
    'color.brand.primary.500': hashValue('#3b82f6'),
    'color.brand.primary.600': hashValue('#2563eb'),
    'radius.sm': hashValue('4'),
    'spacing.4': hashValue('16'),
  },
  figmaFileVersion: null,
};

const MOCK_API_RESPONSE = {
  meta: {
    variableCollections: {
      'coll-1': {
        name: 'primitives',
        modes: [{ modeId: 'mode-1', name: 'Default' }],
      },
    },
    variables: {
      'var-1': {
        variableCollectionId: 'coll-1',
        name: 'color/brand/primary/500',
        resolvedType: 'COLOR',
        valuesByMode: { 'mode-1': { r: 0.231, g: 0.51, b: 0.965, a: 1 } },
      },
      'var-2': {
        variableCollectionId: 'coll-1',
        name: 'color/brand/primary/600',
        resolvedType: 'COLOR',
        valuesByMode: { 'mode-1': { r: 0.145, g: 0.388, b: 0.922, a: 1 } },
      },
      'var-3': {
        variableCollectionId: 'coll-1',
        name: 'radius/sm',
        resolvedType: 'FLOAT',
        valuesByMode: { 'mode-1': 4 },
      },
      'var-4': {
        variableCollectionId: 'coll-1',
        name: 'spacing/4',
        resolvedType: 'FLOAT',
        valuesByMode: { 'mode-1': 16 },
      },
    },
  },
};

/* ================================================================== */
/*  Tests                                                              */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  CLI arg parsing                                                    */
/* ------------------------------------------------------------------ */

describe('parseArgs', () => {
  it('defaults to dry-run mode', () => {
    const opts = parseArgs([]);
    assert.equal(opts.dryRun, true);
    assert.equal(opts.write, false);
  });

  it('enables write mode with --write', () => {
    const opts = parseArgs(['--write']);
    assert.equal(opts.write, true);
    assert.equal(opts.dryRun, false);
  });

  it('parses --dry-run explicitly', () => {
    const opts = parseArgs(['--dry-run']);
    assert.equal(opts.dryRun, true);
    assert.equal(opts.write, false);
  });

  it('parses --category with value', () => {
    const opts = parseArgs(['--category', 'color']);
    assert.equal(opts.category, 'color');
  });

  it('parses --json flag', () => {
    const opts = parseArgs(['--json']);
    assert.equal(opts.json, true);
  });

  it('parses --verbose flag', () => {
    const opts = parseArgs(['--verbose']);
    assert.equal(opts.verbose, true);
  });

  it('handles combined flags', () => {
    const opts = parseArgs(['--write', '--category', 'spacing', '--json', '--verbose']);
    assert.equal(opts.write, true);
    assert.equal(opts.dryRun, false);
    assert.equal(opts.category, 'spacing');
    assert.equal(opts.json, true);
    assert.equal(opts.verbose, true);
  });

  it('--write overrides prior --dry-run', () => {
    const opts = parseArgs(['--dry-run', '--write']);
    assert.equal(opts.write, true);
    assert.equal(opts.dryRun, false);
  });

  it('--dry-run overrides prior --write', () => {
    const opts = parseArgs(['--write', '--dry-run']);
    assert.equal(opts.dryRun, true);
    assert.equal(opts.write, false);
  });

  it('--category with missing value sets null', () => {
    const opts = parseArgs(['--category']);
    assert.equal(opts.category, null);
  });
});

/* ------------------------------------------------------------------ */
/*  Diff computation with mock data                                    */
/* ------------------------------------------------------------------ */

describe('diff computation', () => {
  it('detects code-ahead changes', async () => {
    const strategy = await loadMergeStrategy();
    const lastSync = buildLastSyncMap(MOCK_FIGMA_FLAT, MOCK_CODE_FLAT, MOCK_SYNC_STATE);
    const diff = computeFullDiff(MOCK_FIGMA_FLAT, MOCK_CODE_FLAT, lastSync, strategy);

    const codeAhead = diff.filter((d) => d.resolution === 'code-ahead');
    // color.brand.primary.600 changed only in code
    assert.ok(codeAhead.some((d) => d.path === 'color.brand.primary.600'));
  });

  it('detects code-only tokens', async () => {
    const strategy = await loadMergeStrategy();
    const lastSync = buildLastSyncMap(MOCK_FIGMA_FLAT, MOCK_CODE_FLAT, MOCK_SYNC_STATE);
    const diff = computeFullDiff(MOCK_FIGMA_FLAT, MOCK_CODE_FLAT, lastSync, strategy);

    const codeOnly = diff.filter((d) => d.resolution === 'code-only');
    assert.ok(codeOnly.some((d) => d.path === 'spacing.8'));
  });

  it('marks unchanged tokens as in-sync', async () => {
    const strategy = await loadMergeStrategy();
    const lastSync = buildLastSyncMap(MOCK_FIGMA_FLAT, MOCK_CODE_FLAT, MOCK_SYNC_STATE);
    const diff = computeFullDiff(MOCK_FIGMA_FLAT, MOCK_CODE_FLAT, lastSync, strategy);

    const inSync = diff.filter((d) => d.resolution === 'in-sync');
    assert.ok(inSync.some((d) => d.path === 'color.brand.primary.500'));
    assert.ok(inSync.some((d) => d.path === 'radius.sm'));
  });
});

/* ------------------------------------------------------------------ */
/*  Figma API payload construction                                     */
/* ------------------------------------------------------------------ */

describe('buildFigmaPayload', () => {
  it('constructs correct payload structure', () => {
    const updates = [
      {
        variableId: 'var-2',
        name: 'color/brand/primary/600',
        resolvedType: 'COLOR',
        modeId: 'mode-1',
        figmaValue: { r: 0.114, g: 0.306, b: 0.847, a: 1 },
      },
    ];

    const payload = buildFigmaPayload(updates);

    assert.ok(Array.isArray(payload.variables));
    assert.equal(payload.variables.length, 1);
    assert.equal(payload.variables[0].action, 'UPDATE');
    assert.equal(payload.variables[0].id, 'var-2');
    assert.equal(payload.variables[0].resolvedType, 'COLOR');
    assert.deepEqual(payload.variables[0].valuesByMode, {
      'mode-1': { r: 0.114, g: 0.306, b: 0.847, a: 1 },
    });
    assert.ok(Array.isArray(payload.variableCollections));
  });

  it('handles multiple updates in one payload', () => {
    const updates = [
      { variableId: 'var-1', name: 'a', resolvedType: 'COLOR', modeId: 'm1', figmaValue: {} },
      { variableId: 'var-2', name: 'b', resolvedType: 'FLOAT', modeId: 'm1', figmaValue: 8 },
    ];

    const payload = buildFigmaPayload(updates);
    assert.equal(payload.variables.length, 2);
  });

  it('produces empty payload for no updates', () => {
    const payload = buildFigmaPayload([]);
    assert.equal(payload.variables.length, 0);
  });
});

/* ------------------------------------------------------------------ */
/*  codeValueToFigmaValue                                              */
/* ------------------------------------------------------------------ */

describe('codeValueToFigmaValue', () => {
  it('converts hex color to Figma color object', () => {
    const result = codeValueToFigmaValue('#ff0000', 'COLOR');
    assert.ok(typeof result === 'object');
    assert.ok(Math.abs(result.r - 1) < 0.01);
    assert.ok(Math.abs(result.g) < 0.01);
    assert.ok(Math.abs(result.b) < 0.01);
    assert.equal(result.a, 1);
  });

  it('converts FLOAT value to number', () => {
    const result = codeValueToFigmaValue('16', 'FLOAT');
    assert.equal(result, 16);
  });

  it('passes through string values for STRING type', () => {
    const result = codeValueToFigmaValue('Inter', 'STRING');
    assert.equal(result, 'Inter');
  });

  it('passes through existing Figma color objects', () => {
    const color = { r: 0.5, g: 0.5, b: 0.5, a: 1 };
    const result = codeValueToFigmaValue(color, 'COLOR');
    assert.deepEqual(result, color);
  });
});

/* ------------------------------------------------------------------ */
/*  buildVariableLookup                                                */
/* ------------------------------------------------------------------ */

describe('buildVariableLookup', () => {
  it('maps token paths to variable metadata', () => {
    const lookup = buildVariableLookup(MOCK_API_RESPONSE);

    assert.ok('color.brand.primary.500' in lookup);
    assert.equal(lookup['color.brand.primary.500'].variableId, 'var-1');
    assert.equal(lookup['color.brand.primary.500'].resolvedType, 'COLOR');
    assert.equal(lookup['color.brand.primary.500'].modeId, 'mode-1');
  });

  it('handles missing collection gracefully', () => {
    const response = {
      meta: {
        variableCollections: {},
        variables: {
          'var-orphan': {
            variableCollectionId: 'missing-coll',
            name: 'orphan/token',
            resolvedType: 'FLOAT',
            valuesByMode: {},
          },
        },
      },
    };
    const lookup = buildVariableLookup(response);
    assert.equal(Object.keys(lookup).length, 0);
  });
});

/* ------------------------------------------------------------------ */
/*  Sync state update logic                                            */
/* ------------------------------------------------------------------ */

describe('updateSyncState', () => {
  it('updates timestamp and direction', () => {
    const changes = [{ path: 'spacing.8', resolvedValue: '32' }];
    const result = updateSyncState(MOCK_SYNC_STATE, changes, MOCK_FIGMA_FLAT, MOCK_CODE_FLAT);

    assert.equal(result.lastSyncDirection, 'code-to-figma');
    assert.ok(result.lastSyncTimestamp);
  });

  it('updates hashes for changed tokens', () => {
    const changes = [{ path: 'spacing.8', resolvedValue: '32' }];
    const result = updateSyncState(MOCK_SYNC_STATE, changes, MOCK_FIGMA_FLAT, MOCK_CODE_FLAT);

    assert.equal(result.tokenHashes['spacing.8'], hashValue('32'));
  });

  it('preserves hashes for unchanged tokens', () => {
    const changes = [];
    const result = updateSyncState(MOCK_SYNC_STATE, changes, MOCK_FIGMA_FLAT, MOCK_CODE_FLAT);

    // radius.sm should still have a hash
    assert.ok(result.tokenHashes['radius.sm']);
  });

  it('overwrites old hashes with current values', () => {
    const changes = [{ path: 'color.brand.primary.600', resolvedValue: '#1d4ed8' }];
    const result = updateSyncState(MOCK_SYNC_STATE, changes, MOCK_FIGMA_FLAT, MOCK_CODE_FLAT);

    assert.equal(result.tokenHashes['color.brand.primary.600'], hashValue('#1d4ed8'));
  });
});

/* ------------------------------------------------------------------ */
/*  --json output format                                               */
/* ------------------------------------------------------------------ */

describe('formatDiffJson', () => {
  it('produces valid JSON', () => {
    const diff = [
      { path: 'spacing.8', resolution: 'code-only', winner: 'code', codeValue: '32', figmaValue: null, resolvedValue: '32' },
    ];

    const output = formatDiffJson(diff);
    const parsed = JSON.parse(output);

    assert.equal(parsed.direction, 'code-to-figma');
    assert.equal(parsed.totalChanges, 1);
    assert.equal(parsed.changes[0].path, 'spacing.8');
    assert.equal(parsed.changes[0].category, 'spacing');
  });

  it('includes timestamp', () => {
    const output = formatDiffJson([]);
    const parsed = JSON.parse(output);
    assert.ok(parsed.timestamp);
  });

  it('handles empty diff array', () => {
    const output = formatDiffJson([]);
    const parsed = JSON.parse(output);
    assert.equal(parsed.totalChanges, 0);
    assert.deepEqual(parsed.changes, []);
  });
});

/* ------------------------------------------------------------------ */
/*  Category filtering                                                 */
/* ------------------------------------------------------------------ */

describe('filterByCategory', () => {
  const diff = [
    { path: 'color.primary.500', resolution: 'code-ahead' },
    { path: 'spacing.4', resolution: 'code-ahead' },
    { path: 'radius.sm', resolution: 'code-ahead' },
  ];

  it('filters to a single category', () => {
    const result = filterByCategory(diff, 'color');
    assert.equal(result.length, 1);
    assert.equal(result[0].path, 'color.primary.500');
  });

  it('returns all when category is null', () => {
    const result = filterByCategory(diff, null);
    assert.equal(result.length, 3);
  });

  it('returns empty for non-matching category', () => {
    const result = filterByCategory(diff, 'motion');
    assert.equal(result.length, 0);
  });
});

/* ------------------------------------------------------------------ */
/*  filterCodeToFigma                                                  */
/* ------------------------------------------------------------------ */

describe('filterCodeToFigma', () => {
  it('includes code-ahead entries', () => {
    const diff = [{ resolution: 'code-ahead', winner: 'code' }];
    assert.equal(filterCodeToFigma(diff).length, 1);
  });

  it('includes code-only entries', () => {
    const diff = [{ resolution: 'code-only', winner: 'code' }];
    assert.equal(filterCodeToFigma(diff).length, 1);
  });

  it('includes conflict entries where code wins', () => {
    const diff = [{ resolution: 'conflict', winner: 'code' }];
    assert.equal(filterCodeToFigma(diff).length, 1);
  });

  it('excludes in-sync entries', () => {
    const diff = [{ resolution: 'in-sync', winner: null }];
    assert.equal(filterCodeToFigma(diff).length, 0);
  });

  it('excludes figma-ahead entries', () => {
    const diff = [{ resolution: 'figma-ahead', winner: 'figma' }];
    assert.equal(filterCodeToFigma(diff).length, 0);
  });

  it('excludes conflict entries where figma wins', () => {
    const diff = [{ resolution: 'conflict', winner: 'figma' }];
    assert.equal(filterCodeToFigma(diff).length, 0);
  });
});

/* ------------------------------------------------------------------ */
/*  Idempotency                                                        */
/* ------------------------------------------------------------------ */

describe('idempotency', () => {
  it('same input twice produces same diff output', async () => {
    const strategy = await loadMergeStrategy();
    const lastSync1 = buildLastSyncMap(MOCK_FIGMA_FLAT, MOCK_CODE_FLAT, MOCK_SYNC_STATE);
    const diff1 = computeFullDiff(MOCK_FIGMA_FLAT, MOCK_CODE_FLAT, lastSync1, strategy);
    const reverse1 = filterCodeToFigma(diff1);

    const lastSync2 = buildLastSyncMap(MOCK_FIGMA_FLAT, MOCK_CODE_FLAT, MOCK_SYNC_STATE);
    const diff2 = computeFullDiff(MOCK_FIGMA_FLAT, MOCK_CODE_FLAT, lastSync2, strategy);
    const reverse2 = filterCodeToFigma(diff2);

    assert.deepEqual(reverse1, reverse2);
  });

  it('JSON output is deterministic', () => {
    const diff = [
      { path: 'a', resolution: 'code-ahead', winner: 'code', codeValue: '1', figmaValue: '0', resolvedValue: '1' },
    ];
    const out1 = formatDiffJson(diff);
    const out2 = formatDiffJson(diff);

    // Timestamps will differ, but structure is the same
    const parsed1 = JSON.parse(out1);
    const parsed2 = JSON.parse(out2);
    assert.deepEqual(parsed1.changes, parsed2.changes);
    assert.equal(parsed1.totalChanges, parsed2.totalChanges);
  });
});

/* ------------------------------------------------------------------ */
/*  formatDiffTable                                                    */
/* ------------------------------------------------------------------ */

describe('formatDiffTable', () => {
  it('shows "no changes" message for empty diff', () => {
    const output = formatDiffTable([]);
    assert.ok(output.includes('No code→Figma changes'));
  });

  it('includes token paths in output', () => {
    const diff = [
      { path: 'spacing.8', resolution: 'code-only', winner: 'code', codeValue: '32', figmaValue: null },
    ];
    const output = formatDiffTable(diff);
    assert.ok(output.includes('spacing.8'));
  });

  it('shows summary counts', () => {
    const diff = [
      { path: 'a', resolution: 'code-ahead', codeValue: '1' },
      { path: 'b', resolution: 'code-only', codeValue: '2' },
    ];
    const output = formatDiffTable(diff);
    assert.ok(output.includes('Total: 2'));
  });
});

/* ------------------------------------------------------------------ */
/*  buildLastSyncMap                                                   */
/* ------------------------------------------------------------------ */

describe('buildLastSyncMap', () => {
  it('uses figma value as baseline when no sync history', () => {
    const emptySyncState = { tokenHashes: {} };
    const map = buildLastSyncMap(MOCK_FIGMA_FLAT, MOCK_CODE_FLAT, emptySyncState);

    // For tokens present in figma, figma value should be baseline
    assert.equal(map['color.brand.primary.500'], '#3b82f6');
  });

  it('uses matching current value when hash matches', () => {
    const map = buildLastSyncMap(MOCK_FIGMA_FLAT, MOCK_CODE_FLAT, MOCK_SYNC_STATE);

    // radius.sm hasn't changed — both sides match the stored hash
    assert.equal(map['radius.sm'], '4');
  });

  it('handles code-only tokens with no sync history', () => {
    const emptySyncState = { tokenHashes: {} };
    const map = buildLastSyncMap(MOCK_FIGMA_FLAT, MOCK_CODE_FLAT, emptySyncState);

    // spacing.8 only in code, no figma — should use code value as baseline
    assert.equal(map['spacing.8'], '32');
  });
});

/* ------------------------------------------------------------------ */
/*  Mock HTTP for API calls                                            */
/* ------------------------------------------------------------------ */

describe('Figma API (mocked)', () => {
  it('buildFigmaPayload creates valid POST body', () => {
    const updates = [
      {
        variableId: 'var-2',
        name: 'color/brand/primary/600',
        resolvedType: 'COLOR',
        modeId: 'mode-1',
        figmaValue: { r: 0.114, g: 0.306, b: 0.847, a: 1 },
      },
    ];

    const payload = buildFigmaPayload(updates);
    const body = JSON.stringify(payload);
    const parsed = JSON.parse(body);

    assert.ok(parsed.variables);
    assert.ok(parsed.variableCollections);
    assert.equal(parsed.variables[0].action, 'UPDATE');
  });
});
