/**
 * Integration Test: Cross-Filter Dashboard
 *
 * Full integration: 2 charts sharing store, undo/redo, bookmarks, debounce.
 *
 * @see feature_execution_contract (P2 DoD #21)
 */
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { createCrossFilterStore } from "../cross-filter/createCrossFilterStore";
import { CrossFilterProvider, useCrossFilter } from "../cross-filter/useCrossFilterStore";
import { useChartCrossFilter } from "../cross-filter/useChartCrossFilter";
import { DataVolumeIndicator } from "../components/DataVolumeIndicator";

/* ------------------------------------------------------------------ */
/*  Test Components                                                    */
/* ------------------------------------------------------------------ */

function ChartA() {
  const { activeFilters, onChartClick, filterCount } = useChartCrossFilter({
    chartId: "chartA",
    emitFields: ["region"],
  });

  return (
    <div data-testid="chart-a">
      <span data-testid="a-filter-count">{filterCount}</span>
      <button data-testid="a-click-eu" onClick={() => onChartClick({ region: "EU" })}>
        Click EU
      </button>
      <button data-testid="a-click-us" onClick={() => onChartClick({ region: "US" })}>
        Click US
      </button>
    </div>
  );
}

function ChartB() {
  const { activeFilters, filterCount } = useChartCrossFilter({
    chartId: "chartB",
    emitFields: ["category"],
  });

  return (
    <div data-testid="chart-b">
      <span data-testid="b-filter-count">{filterCount}</span>
      <span data-testid="b-filters">
        {activeFilters.map((f) => `${f.field}=${String(f.value)}`).join(",")}
      </span>
    </div>
  );
}

function Controls() {
  const canUndo = useCrossFilter((s) => s.past.length > 0);
  const canRedo = useCrossFilter((s) => s.future.length > 0);
  const undo = useCrossFilter((s) => s.undo);
  const redo = useCrossFilter((s) => s.redo);
  const clearAll = useCrossFilter((s) => s.clearAllFilters);
  const filterSize = useCrossFilter((s) => s.filters.size);
  const saveBookmark = useCrossFilter((s) => s.saveBookmark);
  const loadBookmark = useCrossFilter((s) => s.loadBookmark);

  return (
    <div data-testid="controls">
      <button data-testid="undo" onClick={undo} disabled={!canUndo}>Undo</button>
      <button data-testid="redo" onClick={redo} disabled={!canRedo}>Redo</button>
      <button data-testid="clear" onClick={clearAll}>Clear</button>
      <button data-testid="save-bm" onClick={() => saveBookmark("test-bm", "Test")}>Save</button>
      <button data-testid="load-bm" onClick={() => loadBookmark("test-bm")}>Load</button>
      <span data-testid="total-filters">{filterSize}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe("Cross-Filter Integration", () => {
  // Use real timers — debounceMs: 0 means setTimeout(fn, 0) which resolves immediately
  // waitFor polls with real timers to detect async state changes

  function renderDashboard() {
    const store = createCrossFilterStore({ debounceMs: 0, groupId: "test" });
    return render(
      <CrossFilterProvider store={store}>
        <Controls />
        <ChartA />
        <ChartB />
        <DataVolumeIndicator count={5} total={10} />
      </CrossFilterProvider>,
    );
  }

  it("renders all components", () => {
    renderDashboard();
    expect(screen.getByTestId("chart-a")).toBeInTheDocument();
    expect(screen.getByTestId("chart-b")).toBeInTheDocument();
    expect(screen.getByTestId("controls")).toBeInTheDocument();
    expect(screen.getByTestId("data-volume-indicator")).toBeInTheDocument();
  });

  it("chart A click filters chart B", async () => {
    renderDashboard();

    fireEvent.click(screen.getByTestId("a-click-eu"));
    await waitFor(() => expect(screen.getByTestId("total-filters").textContent).toBe("1"));
    expect(screen.getByTestId("b-filters").textContent).toContain("region=EU");
  });

  it("undo restores previous state", async () => {
    renderDashboard();

    fireEvent.click(screen.getByTestId("a-click-eu"));
    await waitFor(() => expect(screen.getByTestId("total-filters").textContent).toBe("1"));
    fireEvent.click(screen.getByTestId("undo"));
    await waitFor(() => expect(screen.getByTestId("total-filters").textContent).toBe("0"));
  });

  it("redo re-applies undone action", async () => {
    renderDashboard();

    fireEvent.click(screen.getByTestId("a-click-eu"));
    await waitFor(() => expect(screen.getByTestId("total-filters").textContent).toBe("1"));
    fireEvent.click(screen.getByTestId("undo"));
    await waitFor(() => expect(screen.getByTestId("total-filters").textContent).toBe("0"));
    fireEvent.click(screen.getByTestId("redo"));
    await waitFor(() => expect(screen.getByTestId("total-filters").textContent).toBe("1"));
  });

  it("clear removes all filters", async () => {
    renderDashboard();

    fireEvent.click(screen.getByTestId("a-click-eu"));
    await waitFor(() => expect(screen.getByTestId("total-filters").textContent).toBe("1"));
    fireEvent.click(screen.getByTestId("clear"));
    await waitFor(() => expect(screen.getByTestId("total-filters").textContent).toBe("0"));
  });

  it("bookmark save and load restores state", async () => {
    renderDashboard();

    fireEvent.click(screen.getByTestId("a-click-eu"));
    await waitFor(() => expect(screen.getByTestId("total-filters").textContent).toBe("1"));
    fireEvent.click(screen.getByTestId("save-bm"));
    fireEvent.click(screen.getByTestId("clear"));
    await waitFor(() => expect(screen.getByTestId("total-filters").textContent).toBe("0"));
    fireEvent.click(screen.getByTestId("load-bm"));
    await waitFor(() => expect(screen.getByTestId("total-filters").textContent).toBe("1"));
  });

  it("new filter replaces previous from same source+field", async () => {
    renderDashboard();

    fireEvent.click(screen.getByTestId("a-click-eu"));
    await waitFor(() => expect(screen.getByTestId("total-filters").textContent).toBe("1"));
    fireEvent.click(screen.getByTestId("a-click-us"));
    await waitFor(() => {
      expect(screen.getByTestId("total-filters").textContent).toBe("1");
      expect(screen.getByTestId("b-filters").textContent).toContain("region=US");
    });
  });

  it("DataVolumeIndicator shows count", () => {
    renderDashboard();
    expect(screen.getByTestId("data-volume-indicator").textContent).toContain("5");
    expect(screen.getByTestId("data-volume-indicator").textContent).toContain("10");
  });
});
