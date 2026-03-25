import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { writeFileSync, unlinkSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';

import {
  detectCategory,
  resolveToken,
  computeFullDiff,
  loadMergeStrategy,
  DEFAULT_RULES,
} from '../merge-strategy.mjs';

// ---------------------------------------------------------------------------
// detectCategory
// ---------------------------------------------------------------------------
describe('detectCategory', () => {
  it('maps "color.primary.500" → "color"', () => {
    assert.equal(detectCategory('color.primary.500'), 'color');
  });

  it('maps "spacing.4" → "spacing"', () => {
    assert.equal(detectCategory('spacing.4'), 'spacing');
  });

  it('maps "font.size.base" → "typography"', () => {
    assert.equal(detectCategory('font.size.base'), 'typography');
  });

  it('maps "unknown.thing" → "_default"', () => {
    assert.equal(detectCategory('unknown.thing'), '_default');
  });
});

// ---------------------------------------------------------------------------
// resolveToken
// ---------------------------------------------------------------------------
describe('resolveToken', () => {
  const strategy = { ...DEFAULT_RULES };

  it('returns in-sync when figma and code values match', () => {
    const result = resolveToken({
      tokenPath: 'color.primary.500',
      lastSyncValue: '#ff0000',
      figmaValue: '#ff0000',
      codeValue: '#ff0000',
      strategy,
    });
    assert.equal(result.resolution, 'in-sync');
    assert.equal(result.winner, null);
    assert.equal(result.value, '#ff0000');
  });

  it('returns figma-ahead when only figma changed', () => {
    const result = resolveToken({
      tokenPath: 'color.primary.500',
      lastSyncValue: '#ff0000',
      figmaValue: '#00ff00',
      codeValue: '#ff0000',
      strategy,
    });
    assert.equal(result.resolution, 'figma-ahead');
    assert.equal(result.winner, 'figma');
    assert.equal(result.value, '#00ff00');
  });

  it('returns code-ahead when only code changed', () => {
    const result = resolveToken({
      tokenPath: 'spacing.4',
      lastSyncValue: '16px',
      figmaValue: '16px',
      codeValue: '20px',
      strategy,
    });
    assert.equal(result.resolution, 'code-ahead');
    assert.equal(result.winner, 'code');
    assert.equal(result.value, '20px');
  });

  it('resolves conflict for color category → figma wins', () => {
    const result = resolveToken({
      tokenPath: 'color.primary.500',
      lastSyncValue: '#ff0000',
      figmaValue: '#00ff00',
      codeValue: '#0000ff',
      strategy,
    });
    assert.equal(result.resolution, 'conflict');
    assert.equal(result.winner, 'figma');
    assert.equal(result.value, '#00ff00');
  });

  it('resolves conflict for spacing category → code wins', () => {
    const result = resolveToken({
      tokenPath: 'spacing.4',
      lastSyncValue: '16px',
      figmaValue: '18px',
      codeValue: '20px',
      strategy,
    });
    assert.equal(result.resolution, 'conflict');
    assert.equal(result.winner, 'code');
    assert.equal(result.value, '20px');
  });

  it('uses figmaValue as base when lastSyncValue is null (no prior sync)', () => {
    // When lastSyncValue equals figmaValue (the fallback), and code differs,
    // it looks like only code changed → code-ahead.
    const result = resolveToken({
      tokenPath: 'spacing.4',
      lastSyncValue: '16px', // same as figmaValue → simulates no prior sync fallback
      figmaValue: '16px',
      codeValue: '20px',
      strategy,
    });
    assert.equal(result.resolution, 'code-ahead');
    assert.equal(result.winner, 'code');
    assert.equal(result.value, '20px');
  });
});

// ---------------------------------------------------------------------------
// computeFullDiff
// ---------------------------------------------------------------------------
describe('computeFullDiff', () => {
  const strategy = { ...DEFAULT_RULES };

  it('correctly categorises mixed tokens', () => {
    const figma = { 'color.primary.500': '#00ff00', 'spacing.4': '16px' };
    const code = { 'color.primary.500': '#ff0000', 'spacing.4': '20px' };
    const lastSync = { 'color.primary.500': '#ff0000', 'spacing.4': '16px' };

    const diff = computeFullDiff(figma, code, lastSync, strategy);

    const colorResult = diff.find((d) => d.path === 'color.primary.500');
    assert.equal(colorResult.resolution, 'figma-ahead');
    assert.equal(colorResult.resolvedValue, '#00ff00');

    const spacingResult = diff.find((d) => d.path === 'spacing.4');
    assert.equal(spacingResult.resolution, 'code-ahead');
    assert.equal(spacingResult.resolvedValue, '20px');
  });

  it('detects figma-only tokens', () => {
    const figma = { 'color.accent.100': '#aabbcc' };
    const code = {};
    const lastSync = {};

    const diff = computeFullDiff(figma, code, lastSync, strategy);
    assert.equal(diff.length, 1);
    assert.equal(diff[0].resolution, 'figma-only');
    assert.equal(diff[0].winner, 'figma');
    assert.equal(diff[0].resolvedValue, '#aabbcc');
  });

  it('detects code-only tokens', () => {
    const figma = {};
    const code = { 'spacing.8': '32px' };
    const lastSync = {};

    const diff = computeFullDiff(figma, code, lastSync, strategy);
    assert.equal(diff.length, 1);
    assert.equal(diff[0].resolution, 'code-only');
    assert.equal(diff[0].winner, 'code');
    assert.equal(diff[0].resolvedValue, '32px');
  });
});

// ---------------------------------------------------------------------------
// loadMergeStrategy
// ---------------------------------------------------------------------------
describe('loadMergeStrategy', () => {
  it('returns defaults when no config path is provided', async () => {
    const strategy = await loadMergeStrategy();
    assert.deepEqual(strategy, DEFAULT_RULES);
  });

  it('merges overrides from a config file', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'merge-test-'));
    const configPath = join(dir, 'merge-strategy.json');
    writeFileSync(configPath, JSON.stringify({ color: 'code', customCategory: 'code' }));

    try {
      const strategy = await loadMergeStrategy(configPath);
      assert.equal(strategy.color, 'code'); // overridden
      assert.equal(strategy.spacing, 'code'); // preserved from defaults
      assert.equal(strategy.customCategory, 'code'); // new key
    } finally {
      unlinkSync(configPath);
    }
  });

  it('falls back to defaults when config file does not exist', async () => {
    const strategy = await loadMergeStrategy('/tmp/nonexistent-merge-config.json');
    assert.deepEqual(strategy, DEFAULT_RULES);
  });
});
