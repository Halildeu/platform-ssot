/**
 * ChartsListing — Design Lab Charts category landing page
 *
 * Displays all chart components from @mfe/x-charts organized by group.
 */

import React from "react";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Chart Items Data                                                   */
/* ------------------------------------------------------------------ */

interface ChartItem {
  id: string;
  name: string;
  description: string;
  group: string;
  tier: "core" | "enterprise" | "interaction" | "ai" | "perf";
  icon: string;
}

const CHART_GROUPS = [
  { id: "charts_core", title: "Core Charts", description: "Temel grafik tipleri" },
  { id: "charts_enterprise", title: "Enterprise Charts", description: "Gelismis analitik grafik tipleri" },
  { id: "charts_interaction", title: "Interaction & Composition", description: "Chart container, dashboard, cross-filter" },
  { id: "charts_ai", title: "AI & Transforms", description: "Otomatik chart onerisi, anomali, trend, NL->Chart" },
  { id: "charts_perf", title: "Performance & Infra", description: "Downsampling, lazy loading, cache, code-split" },
] as const;

const CHART_ITEMS: ChartItem[] = [
  // Core
  { id: "bar-chart", name: "BarChart", description: "Kategorik karsilastirma. Dikey/yatay, multi-series.", group: "charts_core", tier: "core", icon: "bar" },
  { id: "line-chart", name: "LineChart", description: "Trend analizi. Zaman serisi veya sirali veri.", group: "charts_core", tier: "core", icon: "line" },
  { id: "area-chart", name: "AreaChart", description: "Stacked area, gradient fill, kumulatif gosterim.", group: "charts_core", tier: "core", icon: "area" },
  { id: "pie-chart", name: "PieChart", description: "Oran dagilimi. Donut modu, innerLabel.", group: "charts_core", tier: "core", icon: "pie" },
  { id: "scatter-chart", name: "ScatterChart", description: "Iki degisken arasi korelasyon.", group: "charts_core", tier: "core", icon: "scatter" },
  // Enterprise
  { id: "gauge-chart", name: "GaugeChart", description: "KPI gostergesi, tek deger, hedef araligi.", group: "charts_enterprise", tier: "enterprise", icon: "gauge" },
  { id: "radar-chart", name: "RadarChart", description: "Cok boyutlu karsilastirma (performans profili).", group: "charts_enterprise", tier: "enterprise", icon: "radar" },
  { id: "treemap-chart", name: "TreemapChart", description: "Hiyerarsik orantili alan gosterimi.", group: "charts_enterprise", tier: "enterprise", icon: "treemap" },
  { id: "heatmap-chart", name: "HeatmapChart", description: "Iki boyutlu yogunluk matrisi.", group: "charts_enterprise", tier: "enterprise", icon: "heatmap" },
  { id: "waterfall-chart", name: "WaterfallChart", description: "Artis/azalis kumulatif analiz.", group: "charts_enterprise", tier: "enterprise", icon: "waterfall" },
  { id: "funnel-chart", name: "FunnelChart", description: "Donusum hunisi, asama bazli dusus.", group: "charts_enterprise", tier: "enterprise", icon: "funnel" },
  { id: "sankey-chart", name: "SankeyChart", description: "Akis diyagrami, kaynak-hedef iliskileri.", group: "charts_enterprise", tier: "enterprise", icon: "sankey" },
  { id: "sunburst-chart", name: "SunburstChart", description: "Cok katmanli hiyerarsik dagilim.", group: "charts_enterprise", tier: "enterprise", icon: "sunburst" },
  // Interaction
  { id: "chart-container", name: "ChartContainer", description: "ECharts wrapper, tema, resize, error boundary.", group: "charts_interaction", tier: "interaction", icon: "container" },
  { id: "chart-dashboard", name: "ChartDashboard", description: "Multi-chart layout, grid composition.", group: "charts_interaction", tier: "interaction", icon: "dashboard" },
  { id: "chart-toolbar", name: "ChartToolbar", description: "Undo/redo, drill-up, export actions.", group: "charts_interaction", tier: "interaction", icon: "toolbar" },
  { id: "kpi-card", name: "KPICard", description: "Tek deger + trend gostergesi.", group: "charts_interaction", tier: "interaction", icon: "kpi" },
  { id: "sparkline-chart", name: "SparklineChart", description: "Inline mini grafik.", group: "charts_interaction", tier: "interaction", icon: "sparkline" },
  { id: "cross-filter", name: "CrossFilterProvider", description: "Chart-to-chart, chart-to-grid cross-filter bus.", group: "charts_interaction", tier: "interaction", icon: "filter" },
  // AI
  { id: "nl-to-chart", name: "nlToChartSpec", description: "Dogal dil -> ChartSpec donusturucusu.", group: "charts_ai", tier: "ai", icon: "ai" },
  { id: "suggest-chart", name: "suggestChartType", description: "Veri seklinden otomatik chart tipi onerisi.", group: "charts_ai", tier: "ai", icon: "suggest" },
  { id: "detect-anomalies", name: "detectAnomalies", description: "IQR-based outlier detection.", group: "charts_ai", tier: "ai", icon: "anomaly" },
  { id: "identify-trends", name: "identifyTrends", description: "OLS regression trend identification.", group: "charts_ai", tier: "ai", icon: "trend" },
  { id: "chart-description", name: "generateChartDescription", description: "A11y alt text uretici.", group: "charts_ai", tier: "ai", icon: "a11y" },
  // Performance
  { id: "lttb", name: "downsampleLTTB", description: "100K+ nokta icin LTTB downsampling.", group: "charts_perf", tier: "perf", icon: "perf" },
  { id: "progressive-render", name: "useProgressiveRender", description: "Batch rendering, requestIdleCallback.", group: "charts_perf", tier: "perf", icon: "progressive" },
  { id: "lazy-chart", name: "useLazyChart", description: "Viewport-aware lazy initialization.", group: "charts_perf", tier: "perf", icon: "lazy" },
  { id: "lru-cache", name: "LRUCache", description: "Bounded cache for query results.", group: "charts_perf", tier: "perf", icon: "cache" },
  { id: "code-split", name: "lazyChartImport", description: "React.lazy chart type code splitting.", group: "charts_perf", tier: "perf", icon: "split" },
];

/* ------------------------------------------------------------------ */
/*  Tier Badge                                                         */
/* ------------------------------------------------------------------ */

const TIER_COLORS: Record<string, string> = {
  core: "bg-blue-100 text-blue-700",
  enterprise: "bg-purple-100 text-purple-700",
  interaction: "bg-green-100 text-green-700",
  ai: "bg-amber-100 text-amber-700",
  perf: "bg-rose-100 text-rose-700",
};

const TierBadge: React.FC<{ tier: string }> = ({ tier }) => (
  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${TIER_COLORS[tier] ?? "bg-gray-100 text-gray-600"}`}>
    {tier}
  </span>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const ChartsListing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Charts</h1>
        <p className="mt-1 text-sm text-text-secondary">
          @mfe/x-charts — 13 chart tipi, cross-filter, AI, performance. ECharts engine.
        </p>
        <div className="mt-3 flex gap-2 text-xs text-text-tertiary">
          <span>{CHART_ITEMS.length} component/hook</span>
          <span>|</span>
          <span>466 test</span>
          <span>|</span>
          <span>P0-P8 complete</span>
        </div>
      </div>

      {/* Groups */}
      {CHART_GROUPS.map((group) => {
        const items = CHART_ITEMS.filter((i) => i.group === group.id);
        if (items.length === 0) return null;

        return (
          <section key={group.id}>
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-text-primary">{group.title}</h2>
              <p className="text-xs text-text-secondary">{group.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(`/admin/design-lab/charts/${item.id}`)}
                  className="group flex flex-col gap-1 rounded-xl border border-border-subtle bg-surface-default p-4 text-left transition hover:border-action-primary hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-text-primary group-hover:text-action-primary">
                      {item.name}
                    </span>
                    <TierBadge tier={item.tier} />
                  </div>
                  <span className="text-xs text-text-secondary line-clamp-2">
                    {item.description}
                  </span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ChartsListing;
