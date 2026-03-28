import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChartVariants, type ChartConfig } from '../useChartVariants';

const STORAGE_KEY = 'x-chart-variants';

const sampleConfig: ChartConfig = {
  type: 'bar',
  colors: ['var(--action-primary)', 'var(--state-danger-text)'],
  showGrid: true,
  showLegend: true,
};

describe('useChartVariants', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty variants', () => {
    const { result } = renderHook(() => useChartVariants('test-chart'));
    expect(result.current.variants).toHaveLength(0);
    expect(result.current.activeVariant).toBeNull();
  });

  it('saveVariant persists to localStorage and activates', () => {
    const { result } = renderHook(() => useChartVariants('test-chart'));

    let saved: ReturnType<typeof result.current.saveVariant>;
    act(() => {
      saved = result.current.saveVariant('My View', sampleConfig);
    });

    expect(result.current.variants).toHaveLength(1);
    expect(result.current.activeVariant?.name).toBe('My View');
    expect(result.current.activeVariant?.config).toEqual(sampleConfig);

    // Check localStorage
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored['test-chart']).toHaveLength(1);
  });

  it('loadVariant activates an existing variant', () => {
    const { result } = renderHook(() => useChartVariants('test-chart'));

    let v1Id: string;
    act(() => {
      const v1 = result.current.saveVariant('View 1', sampleConfig);
      v1Id = v1.id;
    });
    act(() => {
      result.current.saveVariant('View 2', { ...sampleConfig, type: 'line' });
    });

    expect(result.current.activeVariant?.name).toBe('View 2');

    act(() => result.current.loadVariant(v1Id!));
    expect(result.current.activeVariant?.name).toBe('View 1');
  });

  it('deleteVariant removes and clears active if needed', () => {
    const { result } = renderHook(() => useChartVariants('test-chart'));

    let id: string;
    act(() => {
      id = result.current.saveVariant('To Delete', sampleConfig).id;
    });

    act(() => result.current.deleteVariant(id!));

    expect(result.current.variants).toHaveLength(0);
    expect(result.current.activeVariant).toBeNull();
  });

  it('setDefault marks one variant as default', () => {
    const { result } = renderHook(() => useChartVariants('test-chart'));

    let v1Id: string;
    act(() => {
      v1Id = result.current.saveVariant('V1', sampleConfig).id;
    });
    act(() => {
      result.current.saveVariant('V2', { ...sampleConfig, type: 'pie' });
    });

    act(() => result.current.setDefault(v1Id!));

    const defaultVariant = result.current.variants.find((v) => v.isDefault);
    expect(defaultVariant?.name).toBe('V1');
  });

  it('updateVariant patches config', () => {
    const { result } = renderHook(() => useChartVariants('test-chart'));

    let id: string;
    act(() => {
      id = result.current.saveVariant('Updatable', sampleConfig).id;
    });

    act(() => result.current.updateVariant(id!, { showGrid: false, stacked: true }));

    const updated = result.current.variants.find((v) => v.id === id!);
    expect(updated?.config.showGrid).toBe(false);
    expect(updated?.config.stacked).toBe(true);
    expect(updated?.config.type).toBe('bar'); // unchanged
  });

  it('loads default variant on init from localStorage', () => {
    // Pre-populate localStorage
    const variant = {
      id: 'pre-1',
      name: 'Saved',
      chartId: 'persisted',
      config: sampleConfig,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ persisted: [variant] }));

    const { result } = renderHook(() => useChartVariants('persisted'));
    expect(result.current.variants).toHaveLength(1);
    expect(result.current.activeVariant?.id).toBe('pre-1');
  });
});
