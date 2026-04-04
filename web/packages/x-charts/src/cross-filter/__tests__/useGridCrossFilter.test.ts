/**
 * Contract Test: useGridCrossFilter
 *
 * Tests chart-to-grid and grid-to-chart filtering via cross-filter store.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { createCrossFilterStore } from "../createCrossFilterStore";
import type { CrossFilterStoreApi } from "../createCrossFilterStore";
import { CrossFilterProvider } from "../useCrossFilterStore";
import { useGridCrossFilter, type GridApi } from "../useGridCrossFilter";

function createWrapper(store: CrossFilterStoreApi) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      CrossFilterProvider,
      { store },
      children,
    );
  };
}

function createMockGridApi(): GridApi {
  return {
    setFilterModel: vi.fn(),
    refreshServerSide: vi.fn(),
    getFilterModel: vi.fn(() => ({})),
  };
}

describe("useGridCrossFilter", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns empty filters initially", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const gridApi = createMockGridApi();

    const { result } = renderHook(
      () => useGridCrossFilter({ gridId: "grid-1", gridApi }),
      { wrapper: createWrapper(store) },
    );

    expect(result.current.activeFilters).toHaveLength(0);
  });

  it("applies store filters to grid when chart emits filter", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const gridApi = createMockGridApi();

    renderHook(
      () => useGridCrossFilter({ gridId: "grid-1", gridApi }),
      { wrapper: createWrapper(store) },
    );

    // Simulate chart emitting a filter
    act(() => {
      store.getState().setFilter({
        sourceId: "chart-1",
        field: "region",
        value: "EU",
        operator: "eq",
        createdAt: Date.now(),
      });
      vi.advanceTimersByTime(0);
    });

    expect(gridApi.setFilterModel).toHaveBeenCalled();
    expect(gridApi.refreshServerSide).toHaveBeenCalledWith({ purge: true });
  });

  it("pushGridFilters sends grid model to store", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const gridApi = createMockGridApi();
    (gridApi.getFilterModel as ReturnType<typeof vi.fn>).mockReturnValue({
      status: { filterType: "set", values: ["active", "pending"] },
    });

    const { result } = renderHook(
      () => useGridCrossFilter({ gridId: "grid-1", gridApi }),
      { wrapper: createWrapper(store) },
    );

    act(() => {
      result.current.pushGridFilters();
      vi.advanceTimersByTime(0);
    });

    expect(store.getState().filters.has("grid-1:status")).toBe(true);
  });

  it("does not sync to grid when syncStoreToGrid=false", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const gridApi = createMockGridApi();

    renderHook(
      () => useGridCrossFilter({ gridId: "grid-1", gridApi, syncStoreToGrid: false }),
      { wrapper: createWrapper(store) },
    );

    act(() => {
      store.getState().setFilter({
        sourceId: "chart-1", field: "a", value: 1, operator: "eq", createdAt: Date.now(),
      });
      vi.advanceTimersByTime(0);
    });

    expect(gridApi.setFilterModel).not.toHaveBeenCalled();
  });

  it("handles null gridApi gracefully", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });

    const { result } = renderHook(
      () => useGridCrossFilter({ gridId: "grid-1", gridApi: null }),
      { wrapper: createWrapper(store) },
    );

    // Should not throw
    act(() => {
      result.current.pushGridFilters();
    });
  });
});
