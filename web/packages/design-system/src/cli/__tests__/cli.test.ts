// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { generateBlockCode } from '../commands/add';
import { listBlocks } from '../commands/list';
import { searchBlocksCLI } from '../commands/search';

describe('CLI: add command', () => {
  it('generates code for known block', () => {
    const result = generateBlockCode('metric-card');
    expect(result.success).toBe(true);
    expect(result.block?.name).toBe('MetricCard');
    expect(result.message).toContain('MetricCard');
  });

  it('generated code includes component imports', () => {
    const result = generateBlockCode('login-form');
    expect(result.success).toBe(true);
    expect(result.message).toContain('Input');
    expect(result.message).toContain('Button');
  });

  it('returns error for unknown block', () => {
    const result = generateBlockCode('nonexistent');
    expect(result.success).toBe(false);
    expect(result.block).toBeNull();
  });

  it('lists expected output files', () => {
    const result = generateBlockCode('metric-card');
    expect(result.files.length).toBe(2);
    expect(result.files[0]).toContain('MetricCard.tsx');
  });
});

describe('CLI: list command', () => {
  it('lists all blocks', () => {
    const result = listBlocks();
    expect(result.total).toBeGreaterThanOrEqual(30);
  });

  it('filters by category', () => {
    const result = listBlocks('dashboard');
    expect(result.total).toBeGreaterThan(0);
    expect(result.blocks.every(b => b.category === 'dashboard')).toBe(true);
  });

  it('returns empty for unknown category', () => {
    const result = listBlocks('nonexistent');
    expect(result.total).toBe(0);
  });
});

describe('CLI: search command', () => {
  it('finds blocks by query', () => {
    const result = searchBlocksCLI('login');
    expect(result.blocks.length).toBeGreaterThan(0);
    expect(result.query).toBe('login');
  });

  it('returns empty for no matches', () => {
    const result = searchBlocksCLI('xyznonexistent');
    expect(result.blocks).toEqual([]);
  });

  it('finds by tag', () => {
    const result = searchBlocksCLI('kpi');
    expect(result.blocks.length).toBeGreaterThan(0);
  });
});
