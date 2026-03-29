// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGridState } from '../useGridState';

const STORAGE_PREFIX = 'x-data-grid-state:';

function createMockGridApi(overrides: Record<string, unknown> = {}) {
  return {
    getColumnState: vi.fn(() => [
      { colId: 'name', width: 200, sort: 'asc' as const },
      { colId: 'age', width: 100, sort: null },
    ]),
    getFilterModel: vi.fn(() => ({ name: { type: 'contains', filter: 'test' } })),
    getColumnGroupState: vi.fn(() => [{ groupId: 'g1', open: true }]),
    applyColumnState: vi.fn(),
    setFilterModel: vi.fn(),
    setColumnGroupState: vi.fn(),
    ...overrides,
  } as any;
}

describe('useGridState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saveState stores column/filter/sort to localStorage', () => {
    const mockApi = createMockGridApi();
    const { result } = renderHook(() => useGridState('test-grid'));

    act(() => {
      result.current.saveState(mockApi);
    });

    const stored = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}test-grid`)!);
    expect(stored.columnState).toEqual([
      { colId: 'name', width: 200, sort: 'asc' },
      { colId: 'age', width: 100, sort: null },
    ]);
    expect(stored.filterModel).toEqual({ name: { type: 'contains', filter: 'test' } });
    expect(stored.sortModel).toEqual([{ colId: 'name', sort: 'asc' }]);
    expect(stored.columnGroupState).toEqual([{ groupId: 'g1', open: true }]);
  });

  it('restoreState applies saved state to grid', () => {
    const savedState = {
      columnState: [{ colId: 'name', width: 200 }],
      filterModel: { name: { type: 'equals', filter: 'foo' } },
      sortModel: [{ colId: 'name', sort: 'asc' }],
      columnGroupState: [{ groupId: 'g1', open: false }],
    };
    localStorage.setItem(`${STORAGE_PREFIX}my-grid`, JSON.stringify(savedState));

    const mockApi = createMockGridApi();
    const { result } = renderHook(() => useGridState('my-grid'));

    act(() => {
      result.current.restoreState(mockApi);
    });

    expect(mockApi.applyColumnState).toHaveBeenCalledWith({
      state: savedState.columnState,
      applyOrder: true,
    });
    expect(mockApi.setFilterModel).toHaveBeenCalledWith(savedState.filterModel);
    expect(mockApi.setColumnGroupState).toHaveBeenCalledWith(savedState.columnGroupState);
  });

  it('clearState removes from localStorage', () => {
    localStorage.setItem(`${STORAGE_PREFIX}clear-grid`, JSON.stringify({ columnState: [] }));
    const { result } = renderHook(() => useGridState('clear-grid'));

    act(() => {
      result.current.clearState();
    });

    expect(localStorage.getItem(`${STORAGE_PREFIX}clear-grid`)).toBeNull();
  });

  it('hasSavedState returns false when no state exists', () => {
    const { result } = renderHook(() => useGridState('empty-grid'));

    expect(result.current.hasSavedState).toBe(false);
  });

  it('hasSavedState returns true after save', () => {
    const mockApi = createMockGridApi();
    const { result } = renderHook(() => useGridState('saved-grid'));

    expect(result.current.hasSavedState).toBe(false);

    act(() => {
      result.current.saveState(mockApi);
    });

    expect(result.current.hasSavedState).toBe(true);
  });

  it('uses gridId as localStorage key', () => {
    const mockApi = createMockGridApi();
    const { result } = renderHook(() => useGridState('unique-id'));

    act(() => {
      result.current.saveState(mockApi);
    });

    expect(localStorage.getItem(`${STORAGE_PREFIX}unique-id`)).not.toBeNull();
    expect(localStorage.getItem(`${STORAGE_PREFIX}other-id`)).toBeNull();
  });

  it('restoreState does nothing when no saved state exists', () => {
    const mockApi = createMockGridApi();
    const { result } = renderHook(() => useGridState('no-state'));

    act(() => {
      result.current.restoreState(mockApi);
    });

    expect(mockApi.applyColumnState).not.toHaveBeenCalled();
    expect(mockApi.setFilterModel).not.toHaveBeenCalled();
  });

  it('hasSavedState returns false after clearState', () => {
    const mockApi = createMockGridApi();
    const { result } = renderHook(() => useGridState('lifecycle-grid'));

    act(() => {
      result.current.saveState(mockApi);
    });
    expect(result.current.hasSavedState).toBe(true);

    act(() => {
      result.current.clearState();
    });
    expect(result.current.hasSavedState).toBe(false);
  });

  it('hasSavedState initializes to true when localStorage already has data', () => {
    localStorage.setItem(`${STORAGE_PREFIX}pre-saved`, JSON.stringify({ columnState: [] }));

    const { result } = renderHook(() => useGridState('pre-saved'));

    expect(result.current.hasSavedState).toBe(true);
  });
});
