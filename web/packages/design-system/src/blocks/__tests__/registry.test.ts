// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { blockRegistry, getAllBlocks, getBlocksByCategory, searchBlocks, getBlock } from '../registry';

describe('Block Registry', () => {
  it('has version', () => {
    expect(blockRegistry.version).toBe('1.0.0');
  });

  it('has 30+ blocks', () => {
    expect(blockRegistry.blocks.length).toBeGreaterThanOrEqual(30);
  });

  it('each block has required fields', () => {
    for (const block of blockRegistry.blocks) {
      expect(block.id).toBeTruthy();
      expect(block.name).toBeTruthy();
      expect(block.category).toBeTruthy();
      expect(block.description).toBeTruthy();
      expect(block.components.length).toBeGreaterThan(0);
      expect(block.tags.length).toBeGreaterThan(0);
    }
  });

  it('block ids are unique', () => {
    const ids = blockRegistry.blocks.map(b => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getAllBlocks returns all blocks', () => {
    expect(getAllBlocks().length).toBe(blockRegistry.blocks.length);
  });

  it('getBlocksByCategory filters correctly', () => {
    const dashboard = getBlocksByCategory('dashboard');
    expect(dashboard.length).toBeGreaterThan(0);
    expect(dashboard.every(b => b.category === 'dashboard')).toBe(true);
  });

  it('searchBlocks finds by name', () => {
    const results = searchBlocks('login');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(b => b.id === 'login-form')).toBe(true);
  });

  it('searchBlocks finds by tag', () => {
    const results = searchBlocks('kpi');
    expect(results.length).toBeGreaterThan(0);
  });

  it('searchBlocks limits to 10 results', () => {
    const results = searchBlocks('a'); // matches many
    expect(results.length).toBeLessThanOrEqual(10);
  });

  it('getBlock returns block by id', () => {
    const block = getBlock('metric-card');
    expect(block).toBeDefined();
    expect(block?.name).toBe('MetricCard');
  });

  it('getBlock returns undefined for unknown id', () => {
    expect(getBlock('nonexistent')).toBeUndefined();
  });

  it('has blocks in all categories', () => {
    const categories = new Set(blockRegistry.blocks.map(b => b.category));
    expect(categories.has('dashboard')).toBe(true);
    expect(categories.has('crud')).toBe(true);
    expect(categories.has('admin')).toBe(true);
    expect(categories.has('review')).toBe(true);
    expect(categories.has('form')).toBe(true);
    expect(categories.has('layout')).toBe(true);
  });
});
