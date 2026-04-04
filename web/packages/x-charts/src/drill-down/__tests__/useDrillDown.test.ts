/**
 * Contract Test: useDrillDown
 *
 * Tests drill-down state machine: drill, up, root, breadcrumbs, chart type override.
 */
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { createCrossFilterStore } from "../../cross-filter/createCrossFilterStore";
import type { CrossFilterStoreApi } from "../../cross-filter/createCrossFilterStore";
import { CrossFilterProvider } from "../../cross-filter/useCrossFilterStore";
import { useDrillDown } from "../useDrillDown";

const LEVELS = [
  { field: "region", label: "Region" },
  { field: "city", label: "City", chartType: "pie" },
  { field: "store", label: "Store", chartType: "bar" },
];

function createWrapper(store: CrossFilterStoreApi) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(CrossFilterProvider, { store }, children);
  };
}

describe("useDrillDown", () => {
  it("starts at root with depth 0", () => {
    const store = createCrossFilterStore();
    const { result } = renderHook(
      () => useDrillDown({ levels: LEVELS }),
      { wrapper: createWrapper(store) },
    );

    expect(result.current.currentDepth).toBe(0);
    expect(result.current.canDrillDeeper).toBe(true);
    expect(result.current.chartTypeOverride).toBeUndefined();
    expect(result.current.breadcrumbs).toHaveLength(1);
    expect(result.current.breadcrumbs[0].label).toBe("All");
    expect(result.current.breadcrumbs[0].isCurrent).toBe(true);
  });

  it("drills down one level", () => {
    const store = createCrossFilterStore();
    const { result } = renderHook(
      () => useDrillDown({ levels: LEVELS }),
      { wrapper: createWrapper(store) },
    );

    act(() => result.current.drillDown("EU", "Europe"));

    expect(result.current.currentDepth).toBe(1);
    expect(result.current.breadcrumbs).toHaveLength(2);
    expect(result.current.breadcrumbs[1].label).toBe("Europe");
    expect(result.current.breadcrumbs[1].isCurrent).toBe(true);
  });

  it("drills to 3 levels with chart type overrides", () => {
    const store = createCrossFilterStore();
    const { result } = renderHook(
      () => useDrillDown({ levels: LEVELS }),
      { wrapper: createWrapper(store) },
    );

    act(() => result.current.drillDown("EU", "Europe"));
    act(() => result.current.drillDown("Berlin", "Berlin"));
    act(() => result.current.drillDown("StoreA", "Store A"));

    expect(result.current.currentDepth).toBe(3);
    expect(result.current.canDrillDeeper).toBe(false);
    expect(result.current.chartTypeOverride).toBe("bar");
    expect(result.current.breadcrumbs).toHaveLength(4);
  });

  it("drillUp goes back one level", () => {
    const store = createCrossFilterStore();
    const { result } = renderHook(
      () => useDrillDown({ levels: LEVELS }),
      { wrapper: createWrapper(store) },
    );

    act(() => result.current.drillDown("EU", "Europe"));
    act(() => result.current.drillDown("Berlin", "Berlin"));
    act(() => result.current.drillUp());

    expect(result.current.currentDepth).toBe(1);
    expect(result.current.breadcrumbs).toHaveLength(2);
  });

  it("drillToRoot returns to root", () => {
    const store = createCrossFilterStore();
    const { result } = renderHook(
      () => useDrillDown({ levels: LEVELS }),
      { wrapper: createWrapper(store) },
    );

    act(() => result.current.drillDown("EU", "Europe"));
    act(() => result.current.drillDown("Berlin", "Berlin"));
    act(() => result.current.drillToRoot());

    expect(result.current.currentDepth).toBe(0);
    expect(result.current.breadcrumbs).toHaveLength(1);
  });

  it("drillTo navigates to specific breadcrumb", () => {
    const store = createCrossFilterStore();
    const { result } = renderHook(
      () => useDrillDown({ levels: LEVELS }),
      { wrapper: createWrapper(store) },
    );

    act(() => result.current.drillDown("EU", "Europe"));
    act(() => result.current.drillDown("Berlin", "Berlin"));
    act(() => result.current.drillDown("StoreA", "Store A"));
    act(() => result.current.drillTo(0)); // back to first drill level

    expect(result.current.currentDepth).toBe(1);
    expect(result.current.breadcrumbs[1].label).toBe("Europe");
  });

  it("drillTo(-1) returns to root", () => {
    const store = createCrossFilterStore();
    const { result } = renderHook(
      () => useDrillDown({ levels: LEVELS }),
      { wrapper: createWrapper(store) },
    );

    act(() => result.current.drillDown("EU", "Europe"));
    act(() => result.current.drillTo(-1));

    expect(result.current.currentDepth).toBe(0);
  });

  it("custom root label", () => {
    const store = createCrossFilterStore();
    const { result } = renderHook(
      () => useDrillDown({ levels: LEVELS, rootLabel: "Tümü" }),
      { wrapper: createWrapper(store) },
    );

    expect(result.current.breadcrumbs[0].label).toBe("Tümü");
  });

  it("chartTypeOverride reflects current level", () => {
    const store = createCrossFilterStore();
    const { result } = renderHook(
      () => useDrillDown({ levels: LEVELS }),
      { wrapper: createWrapper(store) },
    );

    // Root: no override
    expect(result.current.chartTypeOverride).toBeUndefined();

    // Level 1 (region): no chartType defined
    act(() => result.current.drillDown("EU", "Europe"));
    expect(result.current.chartTypeOverride).toBeUndefined();

    // Level 2 (city): chartType = "pie"
    act(() => result.current.drillDown("Berlin", "Berlin"));
    expect(result.current.chartTypeOverride).toBe("pie");
  });
});
