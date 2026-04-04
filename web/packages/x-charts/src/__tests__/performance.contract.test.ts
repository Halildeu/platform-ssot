/**
 * Contract Tests: Performance — LTTB, Worker Bridge, LRU Cache, Code Split
 *
 * @see contract P6 DoD
 */
import { describe, it, expect, vi } from 'vitest';
import { downsampleLTTB } from '../performance/lttb';
import type { LTTBPoint } from '../performance/lttb';
import { createWorkerBridge } from '../performance/worker-bridge';
import { LRUCache } from '../performance/lru-cache';
import { lazyChartImport } from '../performance/code-split';

/* ================================================================== */
/*  LTTB Downsampling                                                  */
/* ================================================================== */

describe('downsampleLTTB', () => {
  function makePoints(n: number): LTTBPoint[] {
    return Array.from({ length: n }, (_, i) => ({
      x: i,
      y: Math.sin(i / 10) * 100 + Math.random() * 10,
    }));
  }

  it('returns all points when threshold >= data length', () => {
    const data = makePoints(10);
    expect(downsampleLTTB(data, 10)).toHaveLength(10);
    expect(downsampleLTTB(data, 20)).toHaveLength(10);
  });

  it('returns threshold number of points', () => {
    const data = makePoints(1000);
    const result = downsampleLTTB(data, 100);
    expect(result).toHaveLength(100);
  });

  it('always keeps first and last points', () => {
    const data = makePoints(500);
    const result = downsampleLTTB(data, 50);
    expect(result[0].x).toBe(data[0].x);
    expect(result[result.length - 1].x).toBe(data[data.length - 1].x);
  });

  it('preserves originalIndex', () => {
    const data = makePoints(100);
    const result = downsampleLTTB(data, 20);
    expect(result[0].originalIndex).toBe(0);
    expect(result[result.length - 1].originalIndex).toBe(99);
    for (const p of result) {
      expect(p.originalIndex).toBeDefined();
      expect(p.originalIndex).toBeGreaterThanOrEqual(0);
    }
  });

  it('handles empty array', () => {
    expect(downsampleLTTB([], 10)).toEqual([]);
  });

  it('handles threshold < 2', () => {
    const data = makePoints(10);
    expect(downsampleLTTB(data, 1)).toHaveLength(10); // returns original
  });

  it('100K points → 500 in reasonable time', () => {
    const data = makePoints(100_000);
    const start = performance.now();
    const result = downsampleLTTB(data, 500);
    const elapsed = performance.now() - start;
    expect(result).toHaveLength(500);
    expect(elapsed).toBeLessThan(500); // < 500ms
  });
});

/* ================================================================== */
/*  Worker Bridge                                                      */
/* ================================================================== */

describe('createWorkerBridge', () => {
  it('falls back to synchronous executor when no Worker', async () => {
    const bridge = createWorkerBridge(undefined, (task) => {
      return (task.payload as number) * 2;
    });

    expect(bridge.isWorkerAvailable).toBe(false);
    const result = await bridge.execute({ type: 'double', payload: 21 });
    expect(result).toBe(42);
  });

  it('rejects when no Worker and no fallback', async () => {
    const bridge = createWorkerBridge();
    await expect(bridge.execute({ type: 'test', payload: null })).rejects.toThrow();
  });

  it('terminate is safe to call', () => {
    const bridge = createWorkerBridge();
    expect(() => bridge.terminate()).not.toThrow();
  });
});

/* ================================================================== */
/*  LRU Cache                                                          */
/* ================================================================== */

describe('LRUCache', () => {
  it('stores and retrieves values', () => {
    const cache = new LRUCache<string, number>(10);
    cache.set('a', 1);
    cache.set('b', 2);
    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(2);
  });

  it('returns undefined for missing keys', () => {
    const cache = new LRUCache<string, number>(10);
    expect(cache.get('missing')).toBeUndefined();
  });

  it('evicts LRU when full', () => {
    const cache = new LRUCache<string, number>(3);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('d', 4); // evicts 'a'
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe(2);
    expect(cache.size).toBe(3);
  });

  it('access refreshes order (prevents eviction)', () => {
    const cache = new LRUCache<string, number>(3);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.get('a'); // refresh 'a'
    cache.set('d', 4); // evicts 'b' (oldest after refresh)
    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBeUndefined();
  });

  it('overwrite existing key keeps size', () => {
    const cache = new LRUCache<string, number>(3);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('a', 10);
    expect(cache.size).toBe(2);
    expect(cache.get('a')).toBe(10);
  });

  it('clear empties cache', () => {
    const cache = new LRUCache<string, number>(10);
    cache.set('a', 1);
    cache.clear();
    expect(cache.size).toBe(0);
    expect(cache.get('a')).toBeUndefined();
  });

  it('has checks existence', () => {
    const cache = new LRUCache<string, number>(10);
    cache.set('a', 1);
    expect(cache.has('a')).toBe(true);
    expect(cache.has('b')).toBe(false);
  });

  it('delete removes entry', () => {
    const cache = new LRUCache<string, number>(10);
    cache.set('a', 1);
    expect(cache.delete('a')).toBe(true);
    expect(cache.get('a')).toBeUndefined();
    expect(cache.size).toBe(0);
  });

  it('keys returns all keys', () => {
    const cache = new LRUCache<string, number>(10);
    cache.set('a', 1);
    cache.set('b', 2);
    expect(cache.keys()).toEqual(['a', 'b']);
  });
});

/* ================================================================== */
/*  Code Split                                                         */
/* ================================================================== */

describe('lazyChartImport', () => {
  it('throws for unknown chart type', () => {
    expect(() => lazyChartImport('nonexistent')).toThrow('Unknown lazy chart type');
  });

  it('returns a component for known types', () => {
    // These return lazy components (React.lazy) — we just verify no throw
    for (const type of ['gauge', 'radar', 'treemap', 'heatmap', 'waterfall', 'funnel', 'sankey', 'sunburst']) {
      expect(() => lazyChartImport(type)).not.toThrow();
    }
  });
});
