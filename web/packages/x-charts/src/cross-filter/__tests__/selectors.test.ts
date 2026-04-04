/**
 * Contract Test: Cross-Filter Selectors
 *
 * Validates selector correctness and edge cases.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createCrossFilterStore } from "../createCrossFilterStore";
import {
  filtersByGroup,
  filtersForChart,
  activeFilterCount,
  canUndo,
  canRedo,
  bookmarkList,
  drillDepth,
  isQuerying,
} from "../selectors";

describe("selectors", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("filtersByGroup returns filters for active group", () => {
    const store = createCrossFilterStore({ groupId: "sales", debounceMs: 0 });
    store.getState().setFilter({
      sourceId: "c1", field: "region", value: "EU", operator: "eq", createdAt: Date.now(),
    });
    vi.advanceTimersByTime(0);

    const result = filtersByGroup(store.getState(), "sales");
    expect(result).toHaveLength(1);
    expect(result[0].field).toBe("region");
  });

  it("filtersByGroup returns empty for wrong group", () => {
    const store = createCrossFilterStore({ groupId: "sales", debounceMs: 0 });
    store.getState().setFilter({
      sourceId: "c1", field: "region", value: "EU", operator: "eq", createdAt: Date.now(),
    });
    vi.advanceTimersByTime(0);

    expect(filtersByGroup(store.getState(), "other")).toHaveLength(0);
  });

  it("filtersForChart excludes own filters", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    store.getState().setFilter({
      sourceId: "chart-A", field: "region", value: "EU", operator: "eq", createdAt: Date.now(),
    });
    vi.advanceTimersByTime(0);
    store.getState().setFilter({
      sourceId: "chart-B", field: "city", value: "Berlin", operator: "eq", createdAt: Date.now(),
    });
    vi.advanceTimersByTime(0);

    const forA = filtersForChart(store.getState(), "chart-A");
    expect(forA).toHaveLength(1);
    expect(forA[0].sourceId).toBe("chart-B");
  });

  it("activeFilterCount returns filter count", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    expect(activeFilterCount(store.getState())).toBe(0);

    store.getState().setFilter({
      sourceId: "c1", field: "a", value: 1, operator: "eq", createdAt: Date.now(),
    });
    vi.advanceTimersByTime(0);
    expect(activeFilterCount(store.getState())).toBe(1);
  });

  it("canUndo/canRedo reflect history state", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    expect(canUndo(store.getState())).toBe(false);
    expect(canRedo(store.getState())).toBe(false);

    store.getState().setFilter({
      sourceId: "c1", field: "a", value: 1, operator: "eq", createdAt: Date.now(),
    });
    vi.advanceTimersByTime(0);
    expect(canUndo(store.getState())).toBe(true);

    store.getState().undo();
    expect(canRedo(store.getState())).toBe(true);
  });

  it("bookmarkList returns id, name, createdAt", () => {
    const store = createCrossFilterStore();
    store.getState().saveBookmark("bm1", "First");
    store.getState().saveBookmark("bm2", "Second");

    const list = bookmarkList(store.getState());
    expect(list).toHaveLength(2);
    expect(list[0].id).toBe("bm1");
    expect(list[1].name).toBe("Second");
  });

  it("drillDepth returns path length", () => {
    const store = createCrossFilterStore();
    expect(drillDepth(store.getState())).toBe(0);

    store.getState().drillDown({ field: "region", value: "EU", label: "EU" });
    expect(drillDepth(store.getState())).toBe(1);
  });

  it("isQuerying reflects pending queries", () => {
    const store = createCrossFilterStore();
    expect(isQuerying(store.getState())).toBe(false);

    store.getState().incrementPendingQuery();
    expect(isQuerying(store.getState())).toBe(true);
  });
});
