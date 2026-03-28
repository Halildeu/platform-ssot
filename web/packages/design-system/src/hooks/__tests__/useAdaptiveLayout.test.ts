// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAdaptiveLayout, type AdaptiveBlock } from '../useAdaptiveLayout';

const blocks: AdaptiveBlock[] = [
  { key: 'table', type: 'table', priority: 'medium', span: 2 },
  { key: 'metrics', type: 'metric', priority: 'high', span: 4 },
  { key: 'actions', type: 'action', priority: 'low', span: 1 },
];

describe('useAdaptiveLayout', () => {
  it('sorts blocks by priority (high → medium → low)', () => {
    const { result } = renderHook(() => useAdaptiveLayout(blocks, 1280));
    expect(result.current.orderedBlocks[0].key).toBe('metrics');
    expect(result.current.orderedBlocks[1].key).toBe('table');
    expect(result.current.orderedBlocks[2].key).toBe('actions');
  });

  it('returns 1 column for mobile viewport', () => {
    const { result } = renderHook(() => useAdaptiveLayout(blocks, 375));
    expect(result.current.gridConfig.columns).toBe(1);
  });

  it('returns 2 columns for tablet viewport', () => {
    const { result } = renderHook(() => useAdaptiveLayout(blocks, 768));
    expect(result.current.gridConfig.columns).toBe(2);
  });

  it('returns 3 columns for small desktop', () => {
    const { result } = renderHook(() => useAdaptiveLayout(blocks, 1024));
    expect(result.current.gridConfig.columns).toBe(3);
  });

  it('returns 4 columns for large desktop', () => {
    const { result } = renderHook(() => useAdaptiveLayout(blocks, 1440));
    expect(result.current.gridConfig.columns).toBe(4);
  });

  it('uses smaller gap on mobile', () => {
    const { result } = renderHook(() => useAdaptiveLayout(blocks, 375));
    expect(result.current.gridConfig.gap).toBe('0.75rem');
  });

  it('uses standard gap on desktop', () => {
    const { result } = renderHook(() => useAdaptiveLayout(blocks, 1280));
    expect(result.current.gridConfig.gap).toBe('1rem');
  });

  it('handles empty blocks array', () => {
    const { result } = renderHook(() => useAdaptiveLayout([], 1280));
    expect(result.current.orderedBlocks).toEqual([]);
    expect(result.current.gridConfig.columns).toBe(4);
  });
});
