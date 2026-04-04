/**
 * Storybook: Drill-Down Demo
 *
 * Bar chart with 3-level drill (region → city → store).
 * Breadcrumb navigation. Chart type changes per level.
 *
 * @see feature_execution_contract (P2 DoD #20)
 */
import React from "react";
import { CrossFilterProvider, useCrossFilter } from "../cross-filter";
import { useDrillDown } from "../drill-down/useDrillDown";
import { DrillDownBreadcrumb } from "../drill-down/DrillDownBreadcrumb";
import { ChartToolbar } from "../ChartToolbar";
import { useChartInteractions } from "../useChartInteractions";

/* ------------------------------------------------------------------ */
/*  Sample Data (3 levels)                                             */
/* ------------------------------------------------------------------ */

type DataRow = { region: string; city: string; store: string; value: number };

const DATA: DataRow[] = [
  { region: "Europe", city: "Berlin", store: "Store A", value: 1200 },
  { region: "Europe", city: "Berlin", store: "Store B", value: 800 },
  { region: "Europe", city: "Paris", store: "Store C", value: 1500 },
  { region: "Europe", city: "Paris", store: "Store D", value: 900 },
  { region: "Asia", city: "Tokyo", store: "Store E", value: 2200 },
  { region: "Asia", city: "Tokyo", store: "Store F", value: 1800 },
  { region: "Asia", city: "Seoul", store: "Store G", value: 1100 },
  { region: "Americas", city: "NYC", store: "Store H", value: 1900 },
  { region: "Americas", city: "NYC", store: "Store I", value: 1400 },
  { region: "Americas", city: "SF", store: "Store J", value: 2100 },
];

const LEVELS = [
  { field: "region" as const, label: "Region" },
  { field: "city" as const, label: "City", chartType: "pie" },
  { field: "store" as const, label: "Store", chartType: "bar" },
];

/* ------------------------------------------------------------------ */
/*  Drill Chart                                                        */
/* ------------------------------------------------------------------ */

function DrillChart() {
  const {
    currentDepth,
    chartTypeOverride,
    canDrillDeeper,
    breadcrumbs,
    drillDown,
    drillUp,
    drillTo,
    drillPath,
  } = useDrillDown({ levels: LEVELS, rootLabel: "All Regions" });

  const canUndo = useCrossFilter((s) => s.past.length > 0);
  const canRedo = useCrossFilter((s) => s.future.length > 0);
  const undo = useCrossFilter((s) => s.undo);
  const redo = useCrossFilter((s) => s.redo);

  const [interactions] = useChartInteractions({ enableZoom: true });

  // Filter data based on drill path
  let filteredData = DATA;
  for (const level of drillPath) {
    filteredData = filteredData.filter(
      (d) => d[level.field as keyof DataRow] === level.value,
    );
  }

  // Determine grouping field
  const groupField = currentDepth < LEVELS.length
    ? LEVELS[currentDepth].field
    : LEVELS[LEVELS.length - 1].field;

  // Aggregate
  const groups = new Map<string, number>();
  for (const row of filteredData) {
    const key = row[groupField as keyof DataRow] as string;
    groups.set(key, (groups.get(key) ?? 0) + row.value);
  }
  const items = Array.from(groups.entries()).map(([label, value]) => ({ label, value }));
  const maxVal = Math.max(...items.map((i) => i.value), 1);

  const chartType = chartTypeOverride ?? "bar";
  const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <DrillDownBreadcrumb items={breadcrumbs} onNavigate={drillTo} />
        <ChartToolbar
          interactions={interactions}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onDrillUp={drillUp}
          drillDepth={currentDepth}
        />
      </div>

      <div style={{ fontSize: 12, color: "var(--text-secondary, #6b7280)" }}>
        Chart type: <strong>{chartType}</strong> | Depth: {currentDepth}/{LEVELS.length}
        {canDrillDeeper && " | Click to drill"}
      </div>

      {/* Simulated chart rendering */}
      {chartType === "bar" ? (
        <div style={{ display: "flex", gap: 8, alignItems: "end", height: 200 }}>
          {items.map((item, i) => (
            <div
              key={item.label}
              onClick={canDrillDeeper ? () => drillDown(item.label, item.label) : undefined}
              style={{
                flex: 1,
                height: `${(item.value / maxVal) * 100}%`,
                background: colors[i % colors.length],
                borderRadius: "4px 4px 0 0",
                cursor: canDrillDeeper ? "pointer" : "default",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "end",
                paddingBottom: 4,
                fontSize: 11,
                color: "#fff",
                transition: "height 0.3s ease",
                minHeight: 20,
              }}
            >
              <div>{item.label}</div>
              <div style={{ fontSize: 10 }}>${item.value.toLocaleString()}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {items.map((item, i) => (
            <div
              key={item.label}
              onClick={canDrillDeeper ? () => drillDown(item.label, item.label) : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 8,
                border: "2px solid " + colors[i % colors.length],
                cursor: canDrillDeeper ? "pointer" : "default",
              }}
            >
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: colors[i % colors.length] }} />
              <div>
                <div style={{ fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>${item.value.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Story                                                              */
/* ------------------------------------------------------------------ */

export default {
  title: "Charts/DrillDownDemo",
};

export const Default = () => (
  <CrossFilterProvider options={{ groupId: "drill-demo" }}>
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>Drill-Down Demo</h2>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--text-secondary, #6b7280)" }}>
        Click bars to drill: Region → City → Store. Use breadcrumb or ↑ button to go back.
      </p>
      <DrillChart />
    </div>
  </CrossFilterProvider>
);
