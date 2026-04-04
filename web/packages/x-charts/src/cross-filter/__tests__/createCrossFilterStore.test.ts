/**
 * Contract Test: Cross-Filter Store
 *
 * Validates all store actions, history stack, debounce, bookmarks.
 *
 * @see D-006 (cross-filter bus)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createCrossFilterStore } from "../createCrossFilterStore";
import type { CrossFilterEntry, DrillLevel } from "../types";

function makeFilter(field: string, value: unknown, sourceId = "chart-1"): CrossFilterEntry {
  return { sourceId, field, value, operator: "eq", createdAt: Date.now() };
}

function makeDrill(field: string, value: string): DrillLevel {
  return { field, value, label: `${field}: ${value}` };
}

describe("createCrossFilterStore", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("initializes with empty state", () => {
    const store = createCrossFilterStore();
    const state = store.getState();
    expect(state.filters.size).toBe(0);
    expect(state.drillPath).toHaveLength(0);
    expect(state.past).toHaveLength(0);
    expect(state.future).toHaveLength(0);
    expect(state.bookmarks.size).toBe(0);
    expect(state.pendingQueryCount).toBe(0);
  });

  it("accepts initial groupId", () => {
    const store = createCrossFilterStore({ groupId: "sales" });
    expect(store.getState().activeGroup).toBe("sales");
  });

  describe("setFilter", () => {
    it("adds filter after debounce", () => {
      const store = createCrossFilterStore({ debounceMs: 100 });
      store.getState().setFilter(makeFilter("region", "EU"));

      // Before debounce
      expect(store.getState().filters.size).toBe(0);

      vi.advanceTimersByTime(100);
      expect(store.getState().filters.size).toBe(1);
    });

    it("coalesces rapid filter changes", () => {
      const store = createCrossFilterStore({ debounceMs: 100 });
      const { setFilter } = store.getState();

      setFilter(makeFilter("region", "EU"));
      vi.advanceTimersByTime(50);
      setFilter(makeFilter("region", "US"));
      vi.advanceTimersByTime(100);

      // Only last value applied
      expect(store.getState().filters.size).toBe(1);
      const entry = store.getState().filters.get("chart-1:region");
      expect(entry?.value).toBe("US");
    });

    it("pushes to history", () => {
      const store = createCrossFilterStore({ debounceMs: 0 });
      store.getState().setFilter(makeFilter("region", "EU"));
      vi.advanceTimersByTime(0);
      expect(store.getState().past).toHaveLength(1);
    });

    it("clears future on new filter", () => {
      const store = createCrossFilterStore({ debounceMs: 0 });
      const s = store.getState;

      s().setFilter(makeFilter("a", 1));
      vi.advanceTimersByTime(0);
      s().setFilter(makeFilter("b", 2));
      vi.advanceTimersByTime(0);
      s().undo();
      expect(s().future).toHaveLength(1);

      s().setFilter(makeFilter("c", 3));
      vi.advanceTimersByTime(0);
      expect(s().future).toHaveLength(0);
    });
  });

  describe("removeFilter", () => {
    it("removes existing filter", () => {
      const store = createCrossFilterStore({ debounceMs: 0 });
      store.getState().setFilter(makeFilter("region", "EU"));
      vi.advanceTimersByTime(0);
      store.getState().removeFilter("chart-1:region");
      expect(store.getState().filters.size).toBe(0);
    });

    it("no-op for non-existing key", () => {
      const store = createCrossFilterStore({ debounceMs: 0 });
      store.getState().removeFilter("nonexistent");
      expect(store.getState().past).toHaveLength(0);
    });
  });

  describe("clearAllFilters", () => {
    it("clears all and pushes history", () => {
      const store = createCrossFilterStore({ debounceMs: 0 });
      store.getState().setFilter(makeFilter("a", 1));
      vi.advanceTimersByTime(0);
      store.getState().setFilter(makeFilter("b", 2, "chart-2"));
      vi.advanceTimersByTime(0);

      store.getState().clearAllFilters();
      expect(store.getState().filters.size).toBe(0);
      expect(store.getState().past.length).toBeGreaterThan(0);
    });

    it("no-op when already empty", () => {
      const store = createCrossFilterStore({ debounceMs: 0 });
      store.getState().clearAllFilters();
      expect(store.getState().past).toHaveLength(0);
    });
  });

  describe("drill-down", () => {
    it("drillDown pushes level", () => {
      const store = createCrossFilterStore();
      store.getState().drillDown(makeDrill("region", "EU"));
      expect(store.getState().drillPath).toHaveLength(1);
      expect(store.getState().drillPath[0].value).toBe("EU");
    });

    it("drillUp pops last level", () => {
      const store = createCrossFilterStore();
      store.getState().drillDown(makeDrill("region", "EU"));
      store.getState().drillDown(makeDrill("city", "Berlin"));
      store.getState().drillUp();
      expect(store.getState().drillPath).toHaveLength(1);
    });

    it("drillToRoot clears path", () => {
      const store = createCrossFilterStore();
      store.getState().drillDown(makeDrill("region", "EU"));
      store.getState().drillDown(makeDrill("city", "Berlin"));
      store.getState().drillToRoot();
      expect(store.getState().drillPath).toHaveLength(0);
    });

    it("drillTo navigates to specific index", () => {
      const store = createCrossFilterStore();
      store.getState().drillDown(makeDrill("region", "EU"));
      store.getState().drillDown(makeDrill("city", "Berlin"));
      store.getState().drillDown(makeDrill("store", "StoreA"));
      store.getState().drillTo(0);
      expect(store.getState().drillPath).toHaveLength(1);
      expect(store.getState().drillPath[0].value).toBe("EU");
    });
  });

  describe("undo/redo", () => {
    it("undo restores previous state", () => {
      const store = createCrossFilterStore({ debounceMs: 0 });
      store.getState().setFilter(makeFilter("a", 1));
      vi.advanceTimersByTime(0);
      expect(store.getState().filters.size).toBe(1);

      store.getState().undo();
      expect(store.getState().filters.size).toBe(0);
    });

    it("redo re-applies undone state", () => {
      const store = createCrossFilterStore({ debounceMs: 0 });
      store.getState().setFilter(makeFilter("a", 1));
      vi.advanceTimersByTime(0);
      store.getState().undo();
      store.getState().redo();
      expect(store.getState().filters.size).toBe(1);
    });

    it("undo no-op when past is empty", () => {
      const store = createCrossFilterStore();
      store.getState().undo();
      expect(store.getState().future).toHaveLength(0);
    });

    it("redo no-op when future is empty", () => {
      const store = createCrossFilterStore();
      store.getState().redo();
      expect(store.getState().past).toHaveLength(0);
    });
  });

  describe("history cap", () => {
    it("caps history at configured limit", () => {
      const store = createCrossFilterStore({ debounceMs: 0, historyCap: 5 });
      for (let i = 0; i < 10; i++) {
        store.getState().setFilter(makeFilter(`f${i}`, i));
        vi.advanceTimersByTime(0);
      }
      expect(store.getState().past.length).toBeLessThanOrEqual(5);
    });
  });

  describe("bookmarks", () => {
    it("saves and loads bookmark", () => {
      const store = createCrossFilterStore({ debounceMs: 0 });
      store.getState().setFilter(makeFilter("region", "EU"));
      vi.advanceTimersByTime(0);
      store.getState().saveBookmark("bm1", "EU Filter");

      store.getState().clearAllFilters();
      expect(store.getState().filters.size).toBe(0);

      store.getState().loadBookmark("bm1");
      expect(store.getState().filters.size).toBe(1);
    });

    it("deletes bookmark", () => {
      const store = createCrossFilterStore();
      store.getState().saveBookmark("bm1", "Test");
      expect(store.getState().bookmarks.size).toBe(1);
      store.getState().deleteBookmark("bm1");
      expect(store.getState().bookmarks.size).toBe(0);
    });

    it("load non-existing bookmark is no-op", () => {
      const store = createCrossFilterStore();
      store.getState().loadBookmark("nonexistent");
      expect(store.getState().past).toHaveLength(0);
    });
  });

  describe("pendingQueryCount", () => {
    it("increments and decrements", () => {
      const store = createCrossFilterStore();
      store.getState().incrementPendingQuery();
      store.getState().incrementPendingQuery();
      expect(store.getState().pendingQueryCount).toBe(2);
      store.getState().decrementPendingQuery();
      expect(store.getState().pendingQueryCount).toBe(1);
    });

    it("does not go below 0", () => {
      const store = createCrossFilterStore();
      store.getState().decrementPendingQuery();
      expect(store.getState().pendingQueryCount).toBe(0);
    });
  });

  describe("performance", () => {
    it("1000 rapid filter changes complete in < 100ms", () => {
      const store = createCrossFilterStore({ debounceMs: 0 });
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        store.getState().setFilter(makeFilter(`f${i % 10}`, i));
        vi.advanceTimersByTime(0);
      }
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(100);
    });
  });
});
