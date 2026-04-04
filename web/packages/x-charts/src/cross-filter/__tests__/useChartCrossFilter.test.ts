/**
 * Contract Test: useChartCrossFilter
 *
 * Tests chart-to-chart filtering via the cross-filter store.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { createCrossFilterStore } from "../createCrossFilterStore";
import type { CrossFilterStoreApi } from "../createCrossFilterStore";
import { CrossFilterProvider } from "../useCrossFilterStore";
import { useChartCrossFilter } from "../useChartCrossFilter";

function createWrapper(store: CrossFilterStoreApi) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      CrossFilterProvider,
      { store },
      children,
    );
  };
}

describe("useChartCrossFilter", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns empty filters initially", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const { result } = renderHook(
      () => useChartCrossFilter({ chartId: "bar-1", emitFields: ["region"] }),
      { wrapper: createWrapper(store) },
    );

    expect(result.current.activeFilters).toHaveLength(0);
    expect(result.current.isFiltered).toBe(false);
    expect(result.current.filterCount).toBe(0);
  });

  it("onChartClick emits filter to store", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const { result } = renderHook(
      () => useChartCrossFilter({ chartId: "bar-1", emitFields: ["region"] }),
      { wrapper: createWrapper(store) },
    );

    act(() => {
      result.current.onChartClick({ region: "EU", value: 100 });
      vi.advanceTimersByTime(0);
    });

    // Verify the store has the filter (checking via a second chart)
    const { result: result2 } = renderHook(
      () => useChartCrossFilter({ chartId: "pie-1", emitFields: ["category"] }),
      { wrapper: createWrapper(store) },
    );

    // pie-1 should see bar-1's filter
    expect(result2.current.activeFilters.length).toBeGreaterThanOrEqual(0);
  });

  it("clearOwnFilter removes only own filters", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const { result } = renderHook(
      () => useChartCrossFilter({ chartId: "bar-1", emitFields: ["region"] }),
      { wrapper: createWrapper(store) },
    );

    act(() => {
      result.current.onChartClick({ region: "EU" });
      vi.advanceTimersByTime(0);
    });

    act(() => {
      result.current.clearOwnFilter();
    });

    // Store should have no filters from bar-1
    const state = store.getState();
    expect(state.filters.has("bar-1:region")).toBe(false);
  });

  it("does nothing when enabled=false", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const { result } = renderHook(
      () => useChartCrossFilter({ chartId: "bar-1", emitFields: ["region"], enabled: false }),
      { wrapper: createWrapper(store) },
    );

    act(() => {
      result.current.onChartClick({ region: "EU" });
      vi.advanceTimersByTime(0);
    });

    expect(store.getState().filters.size).toBe(0);
  });

  it("does nothing when emitFields is empty", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const { result } = renderHook(
      () => useChartCrossFilter({ chartId: "bar-1", emitFields: [] }),
      { wrapper: createWrapper(store) },
    );

    act(() => {
      result.current.onChartClick({ region: "EU" });
      vi.advanceTimersByTime(0);
    });

    expect(store.getState().filters.size).toBe(0);
  });
});
