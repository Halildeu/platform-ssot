// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDashboardComposition } from '../composition/useDashboardComposition';

describe('useDashboardComposition', () => {
  it('initialises with empty filters and default date range', () => {
    const { result } = renderHook(() => useDashboardComposition());
    expect(result.current.filters).toEqual({});
    expect(result.current.dateRange.start).toBeInstanceOf(Date);
    expect(result.current.dateRange.end).toBeInstanceOf(Date);
    expect(result.current.widgetCount).toBe(0);
  });

  it('accepts initial filters', () => {
    const { result } = renderHook(() =>
      useDashboardComposition({ initialFilters: { region: 'EU' } }),
    );
    expect(result.current.filters).toEqual({ region: 'EU' });
  });

  it('setFilter adds/updates a filter key', () => {
    const { result } = renderHook(() => useDashboardComposition());

    act(() => result.current.setFilter('status', 'active'));
    expect(result.current.filters.status).toBe('active');

    act(() => result.current.setFilter('status', 'inactive'));
    expect(result.current.filters.status).toBe('inactive');
  });

  it('clearFilters resets all filters', () => {
    const { result } = renderHook(() =>
      useDashboardComposition({ initialFilters: { a: 1, b: 2 } }),
    );

    act(() => result.current.clearFilters());
    expect(result.current.filters).toEqual({});
  });

  it('setDateRange updates the shared date range', () => {
    const { result } = renderHook(() => useDashboardComposition());
    const start = new Date('2026-01-01');
    const end = new Date('2026-03-31');

    act(() => result.current.setDateRange(start, end));

    expect(result.current.dateRange.start).toEqual(start);
    expect(result.current.dateRange.end).toEqual(end);
  });

  it('registerWidget / unregisterWidget tracks widgets', () => {
    const { result } = renderHook(() => useDashboardComposition());

    act(() => {
      result.current.registerWidget('chart-1', vi.fn());
      result.current.registerWidget('grid-1', vi.fn());
    });
    expect(result.current.widgetCount).toBe(2);

    act(() => result.current.unregisterWidget('chart-1'));
    expect(result.current.widgetCount).toBe(1);
  });

  it('refreshAll calls all widget refresh callbacks', () => {
    const refresh1 = vi.fn();
    const refresh2 = vi.fn();
    const { result } = renderHook(() => useDashboardComposition());

    act(() => {
      result.current.registerWidget('w1', refresh1);
      result.current.registerWidget('w2', refresh2);
    });

    const before = result.current.lastRefreshed;

    act(() => result.current.refreshAll());

    expect(refresh1).toHaveBeenCalledTimes(1);
    expect(refresh2).toHaveBeenCalledTimes(1);
    expect(result.current.lastRefreshed.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });

  it('refreshAll handles widget errors gracefully', () => {
    const failingRefresh = vi.fn(() => {
      throw new Error('widget error');
    });
    const goodRefresh = vi.fn();
    const { result } = renderHook(() => useDashboardComposition());

    act(() => {
      result.current.registerWidget('bad', failingRefresh);
      result.current.registerWidget('good', goodRefresh);
    });

    // Should not throw
    act(() => result.current.refreshAll());
    expect(goodRefresh).toHaveBeenCalled();
  });
});
