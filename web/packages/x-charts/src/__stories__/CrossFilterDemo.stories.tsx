/**
 * Storybook: Cross-Filter Demo
 *
 * 3 charts sharing a cross-filter group. Click any chart to filter others.
 * Includes DataVolumeIndicator, undo/redo, bookmark save/load.
 *
 * @see feature_execution_contract (P2 DoD #19)
 */
import React, { useCallback, useState } from "react";
import { CrossFilterProvider, useCrossFilter, useCrossFilterStoreApi } from "../cross-filter";
import { useChartCrossFilter } from "../cross-filter/useChartCrossFilter";
import { DataVolumeIndicator } from "../components/DataVolumeIndicator";
import { ChartToolbar } from "../ChartToolbar";
import { useChartInteractions } from "../useChartInteractions";

/* ------------------------------------------------------------------ */
/*  Sample Data                                                        */
/* ------------------------------------------------------------------ */

const SALES_DATA = [
  { region: "Europe", category: "Electronics", value: 4200 },
  { region: "Europe", category: "Clothing", value: 3100 },
  { region: "Europe", category: "Food", value: 2800 },
  { region: "Asia", category: "Electronics", value: 5500 },
  { region: "Asia", category: "Clothing", value: 2200 },
  { region: "Asia", category: "Food", value: 4100 },
  { region: "Americas", category: "Electronics", value: 3800 },
  { region: "Americas", category: "Clothing", value: 2900 },
  { region: "Americas", category: "Food", value: 3200 },
];

/* ------------------------------------------------------------------ */
/*  Chart Panels (simulated — real ECharts would render here)          */
/* ------------------------------------------------------------------ */

function RegionBarChart() {
  const { activeFilters, onChartClick, isFiltered, filterCount } = useChartCrossFilter({
    chartId: "region-bar",
    emitFields: ["region"],
  });

  const regions = [...new Set(SALES_DATA.map((d) => d.region))];
  const filteredData = isFiltered
    ? SALES_DATA.filter((d) => activeFilters.every((f) => d[f.field as keyof typeof d] === f.value))
    : SALES_DATA;

  const totals = regions.map((r) => ({
    region: r,
    total: filteredData.filter((d) => d.region === r).reduce((s, d) => s + d.value, 0),
  }));

  return (
    <div style={{ border: "1px solid var(--border-default, #e5e7eb)", borderRadius: 8, padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        Sales by Region {isFiltered && <span style={{ color: "var(--action-primary)", fontSize: 12 }}>({filterCount} filter)</span>}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "end", height: 120 }}>
        {totals.map((t) => (
          <div
            key={t.region}
            onClick={() => onChartClick({ region: t.region })}
            style={{
              flex: 1,
              height: `${Math.max(10, (t.total / 12000) * 100)}%`,
              background: "var(--action-primary, #3b82f6)",
              borderRadius: "4px 4px 0 0",
              cursor: "pointer",
              display: "flex",
              alignItems: "end",
              justifyContent: "center",
              paddingBottom: 4,
              fontSize: 11,
              color: "#fff",
              transition: "height 0.3s ease",
            }}
          >
            {t.region}
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryPieChart() {
  const { activeFilters, onChartClick, isFiltered } = useChartCrossFilter({
    chartId: "category-pie",
    emitFields: ["category"],
  });

  const filteredData = isFiltered
    ? SALES_DATA.filter((d) => activeFilters.every((f) => d[f.field as keyof typeof d] === f.value))
    : SALES_DATA;

  const categories = [...new Set(SALES_DATA.map((d) => d.category))];
  const colors = ["#3b82f6", "#22c55e", "#f59e0b"];

  return (
    <div style={{ border: "1px solid var(--border-default, #e5e7eb)", borderRadius: 8, padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Sales by Category</div>
      <div style={{ display: "flex", gap: 12 }}>
        {categories.map((c, i) => {
          const total = filteredData.filter((d) => d.category === c).reduce((s, d) => s + d.value, 0);
          return (
            <div
              key={c}
              onClick={() => onChartClick({ category: c })}
              style={{
                display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                padding: "4px 8px", borderRadius: 4,
                background: "var(--bg-muted, #f9fafb)",
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: colors[i] }} />
              <span style={{ fontSize: 13 }}>{c}: {total.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SummaryPanel() {
  const { activeFilters } = useChartCrossFilter({
    chartId: "summary",
    emitFields: [],
  });

  const filteredData = activeFilters.length > 0
    ? SALES_DATA.filter((d) => activeFilters.every((f) => d[f.field as keyof typeof d] === f.value))
    : SALES_DATA;

  const total = filteredData.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ border: "1px solid var(--border-default, #e5e7eb)", borderRadius: 8, padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600 }}>Total Sales</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "var(--action-primary, #3b82f6)" }}>
        ${total.toLocaleString()}
      </div>
      <DataVolumeIndicator count={filteredData.length} total={SALES_DATA.length} label="rows" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Controls                                                 */
/* ------------------------------------------------------------------ */

function DashboardControls() {
  const canUndo = useCrossFilter((s) => s.past.length > 0);
  const canRedo = useCrossFilter((s) => s.future.length > 0);
  const undo = useCrossFilter((s) => s.undo);
  const redo = useCrossFilter((s) => s.redo);
  const clearAll = useCrossFilter((s) => s.clearAllFilters);
  const saveBookmark = useCrossFilter((s) => s.saveBookmark);
  const loadBookmark = useCrossFilter((s) => s.loadBookmark);
  const bookmarks = useCrossFilter((s) => s.bookmarks);
  const filterCount = useCrossFilter((s) => s.filters.size);

  const [interactions] = useChartInteractions({ enableZoom: true, enableBrush: true });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <ChartToolbar
        interactions={interactions}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <button
        type="button"
        onClick={clearAll}
        disabled={filterCount === 0}
        style={{ fontSize: 12, padding: "4px 12px", borderRadius: 4, cursor: "pointer" }}
      >
        Clear All ({filterCount})
      </button>
      <button
        type="button"
        onClick={() => saveBookmark(`bm-${Date.now()}`, `Snapshot ${bookmarks.size + 1}`)}
        style={{ fontSize: 12, padding: "4px 12px", borderRadius: 4, cursor: "pointer" }}
      >
        Save Bookmark
      </button>
      {Array.from(bookmarks.entries()).map(([id, bm]) => (
        <button
          key={id}
          type="button"
          onClick={() => loadBookmark(id)}
          style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, cursor: "pointer", background: "var(--bg-muted)" }}
        >
          {bm.name}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Story                                                              */
/* ------------------------------------------------------------------ */

export default {
  title: "Charts/CrossFilterDemo",
};

export const Default = () => (
  <CrossFilterProvider options={{ groupId: "sales-dashboard", debounceMs: 100 }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Cross-Filter Dashboard Demo</h2>
      <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary, #6b7280)" }}>
        Click any chart element to filter. Undo/Redo and Bookmarks are active.
      </p>
      <DashboardControls />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <RegionBarChart />
        <CategoryPieChart />
        <SummaryPanel />
      </div>
    </div>
  </CrossFilterProvider>
);
