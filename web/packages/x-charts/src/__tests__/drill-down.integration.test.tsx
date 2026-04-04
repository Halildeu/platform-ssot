/**
 * Integration Test: Drill-Down
 *
 * Full drill-down lifecycle: drill 3 levels, breadcrumb, back nav, undo.
 *
 * @see feature_execution_contract (P2 DoD #21)
 */
import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { createCrossFilterStore } from "../cross-filter/createCrossFilterStore";
import { CrossFilterProvider, useCrossFilter } from "../cross-filter/useCrossFilterStore";
import { useDrillDown } from "../drill-down/useDrillDown";
import { DrillDownBreadcrumb } from "../drill-down/DrillDownBreadcrumb";

const LEVELS = [
  { field: "region", label: "Region" },
  { field: "city", label: "City", chartType: "pie" },
  { field: "store", label: "Store" },
];

function DrillTestComponent() {
  const {
    currentDepth,
    chartTypeOverride,
    canDrillDeeper,
    breadcrumbs,
    drillDown,
    drillUp,
    drillToRoot,
    drillTo,
  } = useDrillDown({ levels: LEVELS });

  const canUndo = useCrossFilter((s) => s.past.length > 0);
  const undo = useCrossFilter((s) => s.undo);

  return (
    <div>
      <DrillDownBreadcrumb items={breadcrumbs} onNavigate={drillTo} />
      <span data-testid="depth">{currentDepth}</span>
      <span data-testid="chart-type">{chartTypeOverride ?? "default"}</span>
      <span data-testid="can-drill">{String(canDrillDeeper)}</span>

      {canDrillDeeper && (
        <>
          <button data-testid="drill-eu" onClick={() => drillDown("EU", "Europe")}>Drill EU</button>
          <button data-testid="drill-berlin" onClick={() => drillDown("Berlin", "Berlin")}>Drill Berlin</button>
          <button data-testid="drill-storeA" onClick={() => drillDown("StoreA", "Store A")}>Drill StoreA</button>
        </>
      )}

      <button data-testid="drill-up" onClick={drillUp}>Up</button>
      <button data-testid="drill-root" onClick={drillToRoot}>Root</button>
      <button data-testid="undo" onClick={undo} disabled={!canUndo}>Undo</button>
    </div>
  );
}

function renderDrill() {
  const store = createCrossFilterStore();
  return render(
    <CrossFilterProvider store={store}>
      <DrillTestComponent />
    </CrossFilterProvider>,
  );
}

describe("Drill-Down Integration", () => {
  it("starts at root with default chart type", () => {
    renderDrill();
    expect(screen.getByTestId("depth").textContent).toBe("0");
    expect(screen.getByTestId("chart-type").textContent).toBe("default");
    expect(screen.getByTestId("can-drill").textContent).toBe("true");
  });

  it("drill to level 1 updates depth and breadcrumb", () => {
    renderDrill();
    fireEvent.click(screen.getByTestId("drill-eu"));

    expect(screen.getByTestId("depth").textContent).toBe("1");
    expect(screen.getByText("Europe")).toBeInTheDocument();
  });

  it("drill to level 2 shows chart type override", () => {
    renderDrill();
    fireEvent.click(screen.getByTestId("drill-eu"));
    fireEvent.click(screen.getByTestId("drill-berlin"));

    expect(screen.getByTestId("depth").textContent).toBe("2");
    expect(screen.getByTestId("chart-type").textContent).toBe("pie");
  });

  it("drill to level 3 disables further drilling", () => {
    renderDrill();
    fireEvent.click(screen.getByTestId("drill-eu"));
    fireEvent.click(screen.getByTestId("drill-berlin"));
    fireEvent.click(screen.getByTestId("drill-storeA"));

    expect(screen.getByTestId("depth").textContent).toBe("3");
    expect(screen.getByTestId("can-drill").textContent).toBe("false");
  });

  it("drill-up goes back one level", () => {
    renderDrill();
    fireEvent.click(screen.getByTestId("drill-eu"));
    fireEvent.click(screen.getByTestId("drill-berlin"));
    fireEvent.click(screen.getByTestId("drill-up"));

    expect(screen.getByTestId("depth").textContent).toBe("1");
  });

  it("drill-root returns to depth 0", () => {
    renderDrill();
    fireEvent.click(screen.getByTestId("drill-eu"));
    fireEvent.click(screen.getByTestId("drill-berlin"));
    fireEvent.click(screen.getByTestId("drill-root"));

    expect(screen.getByTestId("depth").textContent).toBe("0");
  });

  it("breadcrumb click navigates to level", () => {
    renderDrill();
    fireEvent.click(screen.getByTestId("drill-eu"));
    fireEvent.click(screen.getByTestId("drill-berlin"));
    fireEvent.click(screen.getByTestId("drill-storeA"));

    // Click "Europe" breadcrumb (index 0)
    fireEvent.click(screen.getByLabelText("Navigate to Europe"));
    expect(screen.getByTestId("depth").textContent).toBe("1");
  });

  it("breadcrumb root click returns to root", () => {
    renderDrill();
    fireEvent.click(screen.getByTestId("drill-eu"));
    fireEvent.click(screen.getByTestId("drill-berlin"));

    fireEvent.click(screen.getByLabelText("Navigate to All"));
    expect(screen.getByTestId("depth").textContent).toBe("0");
  });

  it("undo reverses drill operation", () => {
    renderDrill();
    fireEvent.click(screen.getByTestId("drill-eu"));
    fireEvent.click(screen.getByTestId("drill-berlin"));

    expect(screen.getByTestId("depth").textContent).toBe("2");

    fireEvent.click(screen.getByTestId("undo"));
    expect(screen.getByTestId("depth").textContent).toBe("1");

    fireEvent.click(screen.getByTestId("undo"));
    expect(screen.getByTestId("depth").textContent).toBe("0");
  });
});
