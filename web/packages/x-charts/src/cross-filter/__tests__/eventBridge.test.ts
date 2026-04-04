/**
 * Contract Test: Event Bridge
 *
 * Validates subscribe/unsubscribe and typed event firing.
 *
 * @see D-006 (cross-filter bus)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createCrossFilterStore } from "../createCrossFilterStore";
import { createEventBridge } from "../eventBridge";
import type { CrossFilterEvent } from "../types";

describe("createEventBridge", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("fires FILTER_CHANGED on setFilter", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const bridge = createEventBridge(store);
    const listener = vi.fn<[CrossFilterEvent], void>();

    bridge.on(listener);
    store.getState().setFilter({
      sourceId: "c1",
      field: "region",
      value: "EU",
      operator: "eq",
      createdAt: Date.now(),
    });
    vi.advanceTimersByTime(0);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].type).toBe("FILTER_CHANGED");
    bridge.destroy();
  });

  it("fires FILTERS_CLEARED on clearAllFilters", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const bridge = createEventBridge(store);
    const listener = vi.fn<[CrossFilterEvent], void>();

    store.getState().setFilter({
      sourceId: "c1", field: "a", value: 1, operator: "eq", createdAt: Date.now(),
    });
    vi.advanceTimersByTime(0);

    bridge.on(listener);
    store.getState().clearAllFilters();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].type).toBe("FILTERS_CLEARED");
    bridge.destroy();
  });

  it("fires DRILL_CHANGED on drillDown", () => {
    const store = createCrossFilterStore();
    const bridge = createEventBridge(store);
    const listener = vi.fn<[CrossFilterEvent], void>();

    bridge.on(listener);
    store.getState().drillDown({ field: "region", value: "EU", label: "EU" });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].type).toBe("DRILL_CHANGED");
    bridge.destroy();
  });

  it("fires DRILL_RESET on drillToRoot", () => {
    const store = createCrossFilterStore();
    const bridge = createEventBridge(store);

    store.getState().drillDown({ field: "region", value: "EU", label: "EU" });

    const listener = vi.fn<[CrossFilterEvent], void>();
    bridge.on(listener);
    store.getState().drillToRoot();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].type).toBe("DRILL_RESET");
    bridge.destroy();
  });

  it("off removes listener", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const bridge = createEventBridge(store);
    const listener = vi.fn<[CrossFilterEvent], void>();

    bridge.on(listener);
    bridge.off(listener);

    store.getState().setFilter({
      sourceId: "c1", field: "a", value: 1, operator: "eq", createdAt: Date.now(),
    });
    vi.advanceTimersByTime(0);

    expect(listener).not.toHaveBeenCalled();
    bridge.destroy();
  });

  it("getState returns current state", () => {
    const store = createCrossFilterStore({ groupId: "test" });
    const bridge = createEventBridge(store);

    const state = bridge.getState();
    expect(state.activeGroup).toBe("test");
    expect(state.filters.size).toBe(0);
    bridge.destroy();
  });

  it("destroy stops all events", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const bridge = createEventBridge(store);
    const listener = vi.fn<[CrossFilterEvent], void>();

    bridge.on(listener);
    bridge.destroy();

    store.getState().setFilter({
      sourceId: "c1", field: "a", value: 1, operator: "eq", createdAt: Date.now(),
    });
    vi.advanceTimersByTime(0);

    expect(listener).not.toHaveBeenCalled();
  });

  it("swallows listener errors without breaking other listeners", () => {
    const store = createCrossFilterStore({ debounceMs: 0 });
    const bridge = createEventBridge(store);

    const badListener = vi.fn(() => { throw new Error("boom"); });
    const goodListener = vi.fn<[CrossFilterEvent], void>();

    bridge.on(badListener);
    bridge.on(goodListener);

    store.getState().setFilter({
      sourceId: "c1", field: "a", value: 1, operator: "eq", createdAt: Date.now(),
    });
    vi.advanceTimersByTime(0);

    expect(badListener).toHaveBeenCalledTimes(1);
    expect(goodListener).toHaveBeenCalledTimes(1);
    bridge.destroy();
  });
});
