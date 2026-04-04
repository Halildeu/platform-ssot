/**
 * ChartDetail -- Design Lab individual chart documentation page
 *
 * 6 tabs: Overview | Playground | API | Examples | Themes | Quality
 * Self-contained with hardcoded chart catalog (13 charts).
 */

import React, { useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Layers,
  Gamepad2,
  FileCode2,
  BookOpen,
  Palette,
  ShieldCheck,
  Copy,
  Check,
  ChevronRight,
  BarChart3,
  Cpu,
  Sparkles,
  Eye,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChartProp {
  name: string;
  type: string;
  required: boolean;
  default: string;
  description: string;
}

interface ChartMeta {
  id: string;
  name: string;
  description: string;
  importPath: string;
  tier: "core" | "enterprise";
  props: ChartProp[];
  sampleCode: string;
  features: string[];
  a11y: string[];
  themes: string[];
}

/* ------------------------------------------------------------------ */
/*  Tab definitions                                                    */
/* ------------------------------------------------------------------ */

type ChartTab = "overview" | "playground" | "api" | "examples" | "themes" | "quality";

const TABS: Array<{ id: ChartTab; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Overview", icon: <Layers className="h-3.5 w-3.5" /> },
  { id: "playground", label: "Playground", icon: <Gamepad2 className="h-3.5 w-3.5" /> },
  { id: "api", label: "API", icon: <FileCode2 className="h-3.5 w-3.5" /> },
  { id: "examples", label: "Examples", icon: <BookOpen className="h-3.5 w-3.5" /> },
  { id: "themes", label: "Themes", icon: <Palette className="h-3.5 w-3.5" /> },
  { id: "quality", label: "Quality", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
];

/* ------------------------------------------------------------------ */
/*  Chart catalog (13 charts)                                          */
/* ------------------------------------------------------------------ */

const CHART_CATALOG: Record<string, ChartMeta> = {
  "bar-chart": {
    id: "bar-chart",
    name: "BarChart",
    description: "Vertical or horizontal bar chart for categorical comparison. Supports grouped series, value labels, and click interaction.",
    importPath: "import { BarChart } from '@mfe/x-charts';",
    tier: "core",
    props: [
      { name: "data", type: "ChartDataPoint[]", required: true, default: "[]", description: "Array of { label, value, color? } data points" },
      { name: "orientation", type: "'vertical' | 'horizontal'", required: false, default: "'vertical'", description: "Bar direction" },
      { name: "size", type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: "Chart container size preset" },
      { name: "showValues", type: "boolean", required: false, default: "false", description: "Display value labels on each bar" },
      { name: "showGrid", type: "boolean", required: false, default: "true", description: "Show background grid lines" },
      { name: "showLegend", type: "boolean", required: false, default: "false", description: "Show color legend below chart" },
      { name: "valueFormatter", type: "(v: number) => string", required: false, default: "String", description: "Custom value formatting function" },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable enter/update animations" },
      { name: "colors", type: "string[]", required: false, default: "theme", description: "Custom color palette override" },
      { name: "title", type: "string", required: false, default: "undefined", description: "Accessible chart title" },
      { name: "series", type: "ChartSeries[]", required: false, default: "undefined", description: "Multi-series grouped data" },
      { name: "onDataPointClick", type: "(point: DataPoint) => void", required: false, default: "undefined", description: "Click handler for individual bars" },
    ],
    sampleCode: `<BarChart
  data={[
    { label: "Jan", value: 120 },
    { label: "Feb", value: 200 },
    { label: "Mar", value: 150 },
    { label: "Apr", value: 280 },
  ]}
  showValues
  showGrid
  title="Monthly Revenue"
/>`,
    features: ["cross-filter", "a11y-keyboard", "responsive", "theme-aware", "animation", "tooltip"],
    a11y: ["keyboard-nav", "data-table-fallback", "aria-live", "reduced-motion"],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "line-chart": {
    id: "line-chart",
    name: "LineChart",
    description: "Time-series and trend visualization with optional area fill, dots, and curved interpolation. Multi-series capable.",
    importPath: "import { LineChart } from '@mfe/x-charts';",
    tier: "core",
    props: [
      { name: "series", type: "ChartSeries[]", required: true, default: "[]", description: "Array of named data series" },
      { name: "labels", type: "string[]", required: true, default: "[]", description: "X-axis category labels" },
      { name: "size", type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: "Chart container size preset" },
      { name: "showDots", type: "boolean", required: false, default: "true", description: "Show data point markers" },
      { name: "showGrid", type: "boolean", required: false, default: "true", description: "Show background grid" },
      { name: "showLegend", type: "boolean", required: false, default: "false", description: "Show series legend" },
      { name: "showArea", type: "boolean", required: false, default: "false", description: "Fill area under the line" },
      { name: "curved", type: "boolean", required: false, default: "false", description: "Use bezier curve interpolation" },
      { name: "valueFormatter", type: "(v: number) => string", required: false, default: "String", description: "Custom value formatting" },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable animations" },
      { name: "title", type: "string", required: false, default: "undefined", description: "Accessible chart title" },
      { name: "onDataPointClick", type: "(point: DataPoint) => void", required: false, default: "undefined", description: "Click handler for data points" },
    ],
    sampleCode: `<LineChart
  series={[
    { name: "Revenue", data: [30, 40, 35, 50, 49, 60] },
    { name: "Expenses", data: [20, 25, 30, 28, 35, 32] },
  ]}
  labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
  showDots
  showArea
  curved
/>`,
    features: ["multi-series", "area-fill", "cross-filter", "tooltip", "responsive", "animation"],
    a11y: ["keyboard-nav", "data-table-fallback", "aria-live", "reduced-motion"],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "pie-chart": {
    id: "pie-chart",
    name: "PieChart",
    description: "Proportional data visualization with optional donut mode, percentage labels, and inner content slot.",
    importPath: "import { PieChart } from '@mfe/x-charts';",
    tier: "core",
    props: [
      { name: "data", type: "ChartDataPoint[]", required: true, default: "[]", description: "Array of { label, value, color? } slices" },
      { name: "size", type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: "Chart size preset" },
      { name: "donut", type: "boolean", required: false, default: "false", description: "Enable donut (ring) mode" },
      { name: "showLabels", type: "boolean", required: false, default: "false", description: "Show slice labels" },
      { name: "showLegend", type: "boolean", required: false, default: "false", description: "Show color legend" },
      { name: "showPercentage", type: "boolean", required: false, default: "false", description: "Display percentage on slices" },
      { name: "valueFormatter", type: "(v: number) => string", required: false, default: "String", description: "Custom value formatting" },
      { name: "innerLabel", type: "ReactNode", required: false, default: "undefined", description: "Content inside donut center" },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable animations" },
      { name: "title", type: "string", required: false, default: "undefined", description: "Accessible chart title" },
      { name: "onDataPointClick", type: "(point: DataPoint) => void", required: false, default: "undefined", description: "Click handler for slices" },
    ],
    sampleCode: `<PieChart
  data={[
    { label: "Desktop", value: 60 },
    { label: "Mobile", value: 30 },
    { label: "Tablet", value: 10 },
  ]}
  donut
  showPercentage
  showLegend
/>`,
    features: ["donut-mode", "inner-label", "tooltip", "responsive", "animation"],
    a11y: ["keyboard-nav", "data-table-fallback", "aria-live", "reduced-motion"],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "area-chart": {
    id: "area-chart",
    name: "AreaChart",
    description: "Stacked or overlapping area chart for volume and cumulative trend display. Built on the LineChart engine with gradient fill.",
    importPath: "import { AreaChart } from '@mfe/x-charts';",
    tier: "core",
    props: [
      { name: "series", type: "ChartSeries[]", required: true, default: "[]", description: "Array of named data series" },
      { name: "labels", type: "string[]", required: true, default: "[]", description: "X-axis labels" },
      { name: "size", type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: "Chart size preset" },
      { name: "stacked", type: "boolean", required: false, default: "false", description: "Stack areas on top of each other" },
      { name: "showDots", type: "boolean", required: false, default: "false", description: "Show data point markers" },
      { name: "showGrid", type: "boolean", required: false, default: "true", description: "Show grid lines" },
      { name: "showLegend", type: "boolean", required: false, default: "false", description: "Show series legend" },
      { name: "gradient", type: "boolean", required: false, default: "true", description: "Apply gradient fill to areas" },
      { name: "curved", type: "boolean", required: false, default: "false", description: "Bezier interpolation" },
      { name: "valueFormatter", type: "(v: number) => string", required: false, default: "String", description: "Value formatting function" },
      { name: "animate", type: "boolean", required: false, default: "true", description: "Enable animations" },
      { name: "title", type: "string", required: false, default: "undefined", description: "Accessible chart title" },
    ],
    sampleCode: `<AreaChart
  series={[
    { name: "Organic", data: [40, 50, 45, 70, 65, 80] },
    { name: "Paid", data: [20, 30, 25, 35, 40, 50] },
  ]}
  labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
  stacked
  gradient
/>`,
    features: ["stacked", "gradient-fill", "tooltip", "responsive", "animation"],
    a11y: ["keyboard-nav", "data-table-fallback", "aria-live", "reduced-motion"],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "scatter-chart": {
    id: "scatter-chart",
    name: "ScatterChart",
    description: "Two-dimensional data point distribution chart for correlation analysis and clustering visualization.",
    importPath: "import { ScatterChart } from '@mfe/x-charts';",
    tier: "core",
    props: [
      { name: "data", type: "ScatterDataPoint[]", required: true, default: "[]", description: "Array of { x, y, size?, label? } points" },
      { name: "size", type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: "Chart size preset" },
      { name: "title", type: "string", required: false, default: "undefined", description: "Accessible chart title" },
      { name: "showLegend", type: "boolean", required: false, default: "false", description: "Show series legend" },
    ],
    sampleCode: `<ScatterChart
  data={[
    { x: 10, y: 20, label: "A" },
    { x: 30, y: 50, label: "B" },
    { x: 50, y: 30, label: "C" },
    { x: 70, y: 80, label: "D" },
  ]}
  title="Correlation Plot"
/>`,
    features: ["bubble-size", "tooltip", "responsive", "zoom"],
    a11y: ["keyboard-nav", "data-table-fallback", "aria-live"],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "gauge-chart": {
    id: "gauge-chart",
    name: "GaugeChart",
    description: "Radial gauge for KPI display with configurable min/max range and threshold coloring.",
    importPath: "import { GaugeChart } from '@mfe/x-charts';",
    tier: "enterprise",
    props: [
      { name: "value", type: "number", required: true, default: "0", description: "Current gauge value" },
      { name: "min", type: "number", required: false, default: "0", description: "Minimum range value" },
      { name: "max", type: "number", required: false, default: "100", description: "Maximum range value" },
      { name: "title", type: "string", required: false, default: "undefined", description: "Gauge label" },
    ],
    sampleCode: `<GaugeChart
  value={73}
  min={0}
  max={100}
  title="CPU Usage"
/>`,
    features: ["threshold-colors", "animation", "responsive"],
    a11y: ["aria-live", "reduced-motion"],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "radar-chart": {
    id: "radar-chart",
    name: "RadarChart",
    description: "Multi-axis radar (spider) chart for multi-dimensional data comparison across categories.",
    importPath: "import { RadarChart } from '@mfe/x-charts';",
    tier: "enterprise",
    props: [
      { name: "data", type: "RadarDataPoint[]", required: true, default: "[]", description: "Array of { axis, value } entries" },
      { name: "title", type: "string", required: false, default: "undefined", description: "Chart title" },
      { name: "showLegend", type: "boolean", required: false, default: "false", description: "Show legend" },
    ],
    sampleCode: `<RadarChart
  data={[
    { axis: "Speed", value: 80 },
    { axis: "Reliability", value: 90 },
    { axis: "Cost", value: 60 },
    { axis: "Flexibility", value: 70 },
    { axis: "Scalability", value: 85 },
  ]}
  title="Service Comparison"
/>`,
    features: ["multi-axis", "overlay", "tooltip", "responsive"],
    a11y: ["data-table-fallback", "aria-live"],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "treemap-chart": {
    id: "treemap-chart",
    name: "TreemapChart",
    description: "Hierarchical data visualization using nested rectangles proportional to value. Supports drill-down navigation.",
    importPath: "import { TreemapChart } from '@mfe/x-charts';",
    tier: "enterprise",
    props: [
      { name: "data", type: "TreemapNode[]", required: true, default: "[]", description: "Nested tree structure with value" },
      { name: "title", type: "string", required: false, default: "undefined", description: "Chart title" },
    ],
    sampleCode: `<TreemapChart
  data={[
    { name: "Engineering", value: 40,
      children: [
        { name: "Frontend", value: 20 },
        { name: "Backend", value: 20 },
      ] },
    { name: "Design", value: 25 },
    { name: "Marketing", value: 35 },
  ]}
  title="Budget Allocation"
/>`,
    features: ["drill-down", "tooltip", "responsive", "animation"],
    a11y: ["keyboard-nav", "data-table-fallback"],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "heatmap-chart": {
    id: "heatmap-chart",
    name: "HeatmapChart",
    description: "Two-dimensional color-intensity matrix for displaying density, correlation, or time-based patterns.",
    importPath: "import { HeatmapChart } from '@mfe/x-charts';",
    tier: "enterprise",
    props: [
      { name: "data", type: "HeatmapCell[]", required: true, default: "[]", description: "Array of { x, y, value } cells" },
      { name: "title", type: "string", required: false, default: "undefined", description: "Chart title" },
    ],
    sampleCode: `<HeatmapChart
  data={[
    { x: "Mon", y: "9am", value: 10 },
    { x: "Mon", y: "12pm", value: 30 },
    { x: "Tue", y: "9am", value: 20 },
    { x: "Tue", y: "12pm", value: 45 },
  ]}
  title="Activity Heatmap"
/>`,
    features: ["color-scale", "tooltip", "responsive"],
    a11y: ["data-table-fallback", "aria-live"],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "waterfall-chart": {
    id: "waterfall-chart",
    name: "WaterfallChart",
    description: "Sequential incremental chart showing how values build up or break down from an initial to a final value.",
    importPath: "import { WaterfallChart } from '@mfe/x-charts';",
    tier: "enterprise",
    props: [
      { name: "data", type: "WaterfallItem[]", required: true, default: "[]", description: "Array of { label, value, type? } items" },
      { name: "title", type: "string", required: false, default: "undefined", description: "Chart title" },
    ],
    sampleCode: `<WaterfallChart
  data={[
    { label: "Starting", value: 100, type: "total" },
    { label: "Sales", value: 40 },
    { label: "Refunds", value: -15 },
    { label: "Costs", value: -25 },
    { label: "Net", value: 100, type: "total" },
  ]}
  title="Revenue Breakdown"
/>`,
    features: ["total-markers", "color-coding", "tooltip", "responsive"],
    a11y: ["data-table-fallback", "aria-live"],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "funnel-chart": {
    id: "funnel-chart",
    name: "FunnelChart",
    description: "Stage-by-stage conversion funnel chart for pipeline and process flow visualization.",
    importPath: "import { FunnelChart } from '@mfe/x-charts';",
    tier: "enterprise",
    props: [
      { name: "data", type: "FunnelStage[]", required: true, default: "[]", description: "Array of { label, value } stages" },
      { name: "title", type: "string", required: false, default: "undefined", description: "Chart title" },
    ],
    sampleCode: `<FunnelChart
  data={[
    { label: "Visitors", value: 5000 },
    { label: "Leads", value: 2500 },
    { label: "Qualified", value: 1200 },
    { label: "Proposals", value: 600 },
    { label: "Closed", value: 200 },
  ]}
  title="Sales Funnel"
/>`,
    features: ["conversion-rates", "tooltip", "responsive", "animation"],
    a11y: ["data-table-fallback", "aria-live"],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "sankey-chart": {
    id: "sankey-chart",
    name: "SankeyChart",
    description: "Flow diagram showing weighted connections between nodes. Ideal for budget flows, user journeys, and energy diagrams.",
    importPath: "import { SankeyChart } from '@mfe/x-charts';",
    tier: "enterprise",
    props: [
      { name: "data", type: "SankeyData", required: true, default: "{}", description: "Object with nodes[] and links[] arrays" },
      { name: "title", type: "string", required: false, default: "undefined", description: "Chart title" },
    ],
    sampleCode: `<SankeyChart
  data={{
    nodes: [
      { id: "budget" }, { id: "engineering" },
      { id: "marketing" }, { id: "sales" },
    ],
    links: [
      { source: "budget", target: "engineering", value: 40 },
      { source: "budget", target: "marketing", value: 35 },
      { source: "budget", target: "sales", value: 25 },
    ],
  }}
  title="Budget Flow"
/>`,
    features: ["node-dragging", "tooltip", "responsive", "animation"],
    a11y: ["data-table-fallback", "aria-live"],
    themes: ["light", "dark", "high-contrast", "print"],
  },
  "sunburst-chart": {
    id: "sunburst-chart",
    name: "SunburstChart",
    description: "Multi-level radial treemap for hierarchical data with drill-down ring navigation.",
    importPath: "import { SunburstChart } from '@mfe/x-charts';",
    tier: "enterprise",
    props: [
      { name: "data", type: "SunburstNode[]", required: true, default: "[]", description: "Nested hierarchical tree structure" },
      { name: "title", type: "string", required: false, default: "undefined", description: "Chart title" },
    ],
    sampleCode: `<SunburstChart
  data={[
    { name: "Tech", value: 50,
      children: [
        { name: "Frontend", value: 25 },
        { name: "Backend", value: 25 },
      ] },
    { name: "Business", value: 30,
      children: [
        { name: "Sales", value: 15 },
        { name: "Marketing", value: 15 },
      ] },
    { name: "Ops", value: 20 },
  ]}
  title="Organization"
/>`,
    features: ["drill-down", "tooltip", "responsive", "animation"],
    a11y: ["keyboard-nav", "data-table-fallback"],
    themes: ["light", "dark", "high-contrast", "print"],
  },
};

/* ------------------------------------------------------------------ */
/*  Playground default prop values per chart                           */
/* ------------------------------------------------------------------ */

function getPlaygroundDefaults(chartId: string): Record<string, boolean | string> {
  switch (chartId) {
    case "bar-chart":
      return { showValues: false, showGrid: true, showLegend: false, animate: true, orientation: "vertical" };
    case "line-chart":
      return { showDots: true, showGrid: true, showLegend: false, showArea: false, curved: false, animate: true };
    case "pie-chart":
      return { donut: false, showLabels: false, showLegend: false, showPercentage: false, animate: true };
    case "area-chart":
      return { stacked: false, showDots: false, showGrid: true, showLegend: false, gradient: true, curved: false, animate: true };
    default:
      return {};
  }
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

const ChartDetail: React.FC = () => {
  const { chartId } = useParams<{ chartId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ChartTab>("overview");
  const [copied, setCopied] = useState(false);

  const chart = useMemo(
    () => (chartId ? CHART_CATALOG[chartId] : undefined),
    [chartId],
  );

  const handleCopyImport = useCallback(async () => {
    if (!chart?.importPath) return;
    try {
      await navigator.clipboard.writeText(chart.importPath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }, [chart?.importPath]);

  /* ---- Not found ---- */
  if (!chart) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-border-subtle bg-surface-default text-center">
        <BarChart3 className="h-8 w-8 text-text-tertiary" />
        <p className="mt-3 text-sm font-medium text-text-primary">
          Chart not found
        </p>
        <p className="mt-1 text-xs text-text-secondary">
          No chart registered with id &quot;{chartId}&quot;
        </p>
        <button
          type="button"
          onClick={() => navigate("/admin/design-lab/charts")}
          className="mt-4 rounded-lg bg-action-primary px-4 py-2 text-xs font-medium text-text-inverse transition hover:opacity-90"
        >
          Back to Charts
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* -- Breadcrumb -- */}
      <nav className="flex items-center gap-1.5 text-xs text-text-secondary">
        <button
          type="button"
          onClick={() => navigate("/admin/design-lab")}
          className="rounded-md px-1.5 py-0.5 transition-colors hover:bg-surface-muted hover:text-text-primary"
        >
          Design Lab
        </button>
        <ChevronRight className="h-3 w-3 opacity-40" />
        <button
          type="button"
          onClick={() => navigate("/admin/design-lab/charts")}
          className="rounded-md px-1.5 py-0.5 transition-colors hover:bg-surface-muted hover:text-text-primary"
        >
          Charts
        </button>
        <ChevronRight className="h-3 w-3 opacity-40" />
        <span className="rounded-md bg-surface-muted px-2 py-0.5 font-medium text-text-primary">
          {chart.name}
        </span>
      </nav>

      {/* -- Hero header -- */}
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-linear-to-br from-surface-default via-surface-default to-surface-canvas p-6 sm:p-8">
        {/* Decorative dots */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {chart.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
            {chart.description}
          </p>

          {/* Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-state-success-bg px-3 py-1 text-xs font-semibold text-state-success-text">
              <span className="h-1.5 w-1.5 rounded-full bg-state-success-text" />
              stable
            </span>
            <span
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                chart.tier === "enterprise"
                  ? "bg-action-primary/10 text-action-primary"
                  : "bg-state-info-bg text-state-info-text",
              ].join(" ")}
            >
              {chart.tier}
            </span>
            <span className="rounded-full border border-border-subtle bg-surface-canvas px-2.5 py-0.5 text-xs font-medium text-text-secondary">
              ECharts 5.6
            </span>
            <span className="rounded-full border border-border-subtle bg-surface-canvas px-2.5 py-0.5 text-xs font-medium text-text-secondary">
              @mfe/x-charts
            </span>
          </div>
        </div>

        {/* Import statement */}
        <div className="relative mt-5 flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-canvas/80 px-4 py-2.5 backdrop-blur-xs">
          <div className="mr-2 rounded-md bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            import
          </div>
          <code className="flex-1 overflow-x-auto font-mono text-xs text-text-primary">
            {chart.importPath}
          </code>
          <button
            type="button"
            onClick={handleCopyImport}
            className="shrink-0 rounded-lg p-1.5 text-text-secondary transition hover:bg-surface-muted hover:text-text-primary"
            aria-label="Copy import"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-state-success-text" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* -- Tab navigation (pill style) -- */}
      <div className="rounded-xl border border-border-subtle bg-surface-default p-1.5">
        <div className="flex gap-1">
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={[
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                activeTab === id
                  ? "bg-action-primary text-text-inverse shadow-xs"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
              ].join(" ")}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* -- Tab content -- */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && <OverviewTab chart={chart} />}
        {activeTab === "playground" && <PlaygroundTab chart={chart} />}
        {activeTab === "api" && <ApiTab chart={chart} />}
        {activeTab === "examples" && <ExamplesTab chart={chart} />}
        {activeTab === "themes" && <ThemesTab chart={chart} />}
        {activeTab === "quality" && <QualityTab chart={chart} />}
      </div>
    </div>
  );
};

export default ChartDetail;

/* ================================================================== */
/*  OverviewTab                                                        */
/* ================================================================== */

function OverviewTab({ chart }: { chart: ChartMeta }) {
  return (
    <div className="flex flex-col gap-8">
      {/* Sample data preview */}
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
        <div className="flex items-center gap-3 border-b border-border-subtle bg-linear-to-r from-state-info-bg to-transparent px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-state-info-bg">
            <Eye className="h-4 w-4 text-state-info-text" />
          </div>
          <span className="text-sm font-semibold text-text-primary">
            Preview
          </span>
        </div>
        <div className="flex items-center justify-center bg-surface-canvas p-8">
          <ChartPreviewPlaceholder chart={chart} />
        </div>
      </div>

      {/* Metadata cards (2-col grid) */}
      <div className="grid gap-4 sm:grid-cols-2">
        <MetadataCard
          icon={<FileCode2 className="h-3.5 w-3.5 text-state-info-text" />}
          iconBg="bg-state-info-bg"
          label="Props"
          value={String(chart.props.length)}
          detail={`${chart.props.filter((p) => p.required).length} required`}
        />
        <MetadataCard
          icon={<Palette className="h-3.5 w-3.5 text-action-primary" />}
          iconBg="bg-action-primary/10"
          label="Themes"
          value={String(chart.themes.length)}
          detail="light, dark, HC, print"
        />
        <MetadataCard
          icon={<Cpu className="h-3.5 w-3.5 text-state-warning-text" />}
          iconBg="bg-state-warning-bg"
          label="Engine"
          value="ECharts 5.6"
          detail="Apache ECharts"
        />
        <MetadataCard
          icon={<Sparkles className="h-3.5 w-3.5 text-state-success-text" />}
          iconBg="bg-state-success-bg"
          label="Features"
          value={String(chart.features.length)}
          detail={chart.features.slice(0, 3).join(", ")}
        />
      </div>

      {/* Features list */}
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
          Capabilities
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {chart.features.map((f) => (
            <span
              key={f}
              className="rounded-full border border-border-subtle bg-surface-canvas px-3 py-1 text-xs font-medium text-text-secondary"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  PlaygroundTab                                                      */
/* ================================================================== */

function PlaygroundTab({ chart }: { chart: ChartMeta }) {
  const defaults = useMemo(() => getPlaygroundDefaults(chart.id), [chart.id]);
  const [pgState, setPgState] = useState<Record<string, boolean | string>>(defaults);

  const booleanProps = useMemo(
    () => chart.props.filter((p) => p.type === "boolean"),
    [chart.props],
  );

  const handleToggle = useCallback((propName: string) => {
    setPgState((prev) => ({ ...prev, [propName]: !prev[propName] }));
  }, []);

  const generatedCode = useMemo(() => {
    const propLines = Object.entries(pgState)
      .filter(([, v]) => v !== false && v !== undefined)
      .map(([k, v]) => {
        if (typeof v === "boolean" && v) return `  ${k}`;
        return `  ${k}="${String(v)}"`;
      })
      .join("\n");

    return `<${chart.name}\n  data={sampleData}\n${propLines}\n/>`;
  }, [chart.name, pgState]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Controls panel */}
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-5 lg:col-span-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
            Props Editor
          </span>
          <div className="mt-4 flex flex-col gap-3">
            {booleanProps.map((prop) => (
              <label
                key={prop.name}
                className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-surface-muted"
              >
                <div>
                  <span className="text-sm font-medium text-text-primary">
                    {prop.name}
                  </span>
                  <p className="text-xs text-text-tertiary">{prop.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!pgState[prop.name]}
                  onClick={() => handleToggle(prop.name)}
                  className={[
                    "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
                    pgState[prop.name] ? "bg-action-primary" : "bg-surface-muted border border-border-subtle",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-block h-3.5 w-3.5 rounded-full bg-white shadow-xs transition-transform",
                      pgState[prop.name] ? "translate-x-4" : "translate-x-0.5",
                    ].join(" ")}
                  />
                </button>
              </label>
            ))}
            {booleanProps.length === 0 && (
              <p className="text-xs text-text-tertiary">
                No toggleable boolean props for this chart.
              </p>
            )}
          </div>
        </div>

        {/* Live preview area */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex-1 rounded-2xl border border-border-subtle bg-surface-canvas p-8">
            <div className="flex h-48 items-center justify-center">
              <ChartPreviewPlaceholder chart={chart} />
            </div>
          </div>

          {/* Generated code */}
          <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-default">
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                Generated Code
              </span>
            </div>
            <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-text-primary">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  ApiTab                                                             */
/* ================================================================== */

function ApiTab({ chart }: { chart: ChartMeta }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
        <div className="flex items-center gap-3 border-b border-border-subtle bg-linear-to-r from-state-info-bg to-transparent px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-state-info-bg">
            <FileCode2 className="h-4 w-4 text-state-info-text" />
          </div>
          <span className="text-sm font-semibold text-text-primary">
            Props API
          </span>
          <span className="ml-auto rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-text-secondary">
            {chart.props.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Prop
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Type
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Default
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {chart.props.map((p) => (
                <tr key={p.name} className="transition hover:bg-surface-muted/50">
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-xs font-medium text-action-primary">
                      {p.name}
                    </span>
                    {p.required && (
                      <span className="ml-1.5 text-[9px] font-semibold text-state-danger-text">
                        *
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-text-tertiary">
                    {p.type}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-text-secondary">
                    {p.default === "undefined" ? (
                      <span className="text-text-tertiary">--</span>
                    ) : (
                      <code className="rounded bg-surface-muted px-1.5 py-0.5 text-[11px]">
                        {p.default}
                      </code>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-text-secondary">
                    {p.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  ExamplesTab                                                        */
/* ================================================================== */

function ExamplesTab({ chart }: { chart: ChartMeta }) {
  const examples = useMemo(() => buildExamples(chart), [chart]);

  return (
    <div className="flex flex-col gap-6">
      {examples.map((ex) => (
        <div
          key={ex.title}
          className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default transition-all duration-300 hover:shadow-sm"
        >
          <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-3">
            <BookOpen className="h-3.5 w-3.5 text-text-secondary" />
            <span className="text-sm font-semibold text-text-primary">
              {ex.title}
            </span>
            <span className="ml-auto rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-tertiary">
              {ex.tag}
            </span>
          </div>
          <p className="border-b border-border-subtle bg-surface-canvas/50 px-5 py-2.5 text-xs text-text-secondary">
            {ex.description}
          </p>
          <pre className="overflow-x-auto p-5 text-xs leading-relaxed text-text-primary">
            <code>{ex.code}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}

type ExampleItem = { title: string; tag: string; description: string; code: string };

function buildExamples(chart: ChartMeta): ExampleItem[] {
  const items: ExampleItem[] = [
    {
      title: "Basic Usage",
      tag: "starter",
      description: `Minimal ${chart.name} setup with default configuration.`,
      code: chart.sampleCode,
    },
  ];

  if (chart.id === "bar-chart") {
    items.push({
      title: "Horizontal Bars",
      tag: "orientation",
      description: "Switch to horizontal layout for long category labels.",
      code: `<BarChart\n  data={data}\n  orientation="horizontal"\n  showValues\n/>`,
    });
    items.push({
      title: "Grouped Series",
      tag: "multi-series",
      description: "Compare multiple series side by side within each category.",
      code: `<BarChart\n  series={[\n    { name: "2024", data: [120, 200, 150] },\n    { name: "2025", data: [180, 220, 190] },\n  ]}\n  showLegend\n  showGrid\n/>`,
    });
  } else if (chart.id === "line-chart") {
    items.push({
      title: "Area Fill with Curves",
      tag: "area",
      description: "Smooth bezier curves with gradient area fill.",
      code: `<LineChart\n  series={[{ name: "Trend", data: [10, 40, 25, 60, 35, 70] }]}\n  labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}\n  showArea\n  curved\n  showDots\n/>`,
    });
  } else if (chart.id === "pie-chart") {
    items.push({
      title: "Donut with Center Label",
      tag: "donut",
      description: "Ring chart with custom content in the center.",
      code: `<PieChart\n  data={data}\n  donut\n  innerLabel={<span className="text-xl font-bold">85%</span>}\n  showPercentage\n/>`,
    });
  } else if (chart.id === "area-chart") {
    items.push({
      title: "Stacked Areas",
      tag: "stacked",
      description: "Stack multiple series to show cumulative totals.",
      code: `<AreaChart\n  series={[\n    { name: "Organic", data: [40, 50, 45, 70] },\n    { name: "Paid", data: [20, 30, 25, 35] },\n  ]}\n  labels={["Q1", "Q2", "Q3", "Q4"]}\n  stacked\n  gradient\n  showLegend\n/>`,
    });
  }

  // Common: theme variant example
  items.push({
    title: "Dark Theme",
    tag: "theme",
    description: `${chart.name} rendered within a dark theme context.`,
    code: `<ThemeProvider theme="dark">\n  ${chart.sampleCode.split("\n")[0]}\n    {...props}\n  />\n</ThemeProvider>`,
  });

  return items;
}

/* ================================================================== */
/*  ThemesTab                                                          */
/* ================================================================== */

const THEME_CONFIG = [
  { id: "light", label: "Light", bg: "bg-white", text: "text-gray-900", accent: "#3b82f6", muted: "#e5e7eb" },
  { id: "dark", label: "Dark", bg: "bg-gray-900", text: "text-gray-100", accent: "#60a5fa", muted: "#374151" },
  { id: "high-contrast", label: "High Contrast", bg: "bg-black", text: "text-white", accent: "#facc15", muted: "#525252" },
  { id: "print", label: "Print", bg: "bg-white", text: "text-black", accent: "#1f2937", muted: "#d1d5db" },
] as const;

function ThemesTab({ chart }: { chart: ChartMeta }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
          Theme Comparison
        </span>
        <p className="mt-1 text-xs text-text-tertiary">
          {chart.name} adapts to all 4 supported themes via design token resolution.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {THEME_CONFIG.map((theme) => (
          <div
            key={theme.id}
            className="overflow-hidden rounded-2xl border border-border-subtle transition-all duration-300 hover:shadow-sm"
          >
            <div className="flex items-center gap-2 border-b border-border-subtle bg-surface-muted px-4 py-2.5">
              <span
                className="h-3 w-3 rounded-full border border-border-subtle"
                style={{ backgroundColor: theme.accent }}
              />
              <span className="text-xs font-semibold text-text-primary">
                {theme.label}
              </span>
            </div>
            {/* Mock chart preview area */}
            <div className={`flex items-center justify-center p-6 ${theme.bg}`}>
              <div className="flex h-32 w-full items-end justify-center gap-2 px-4">
                {[0.4, 0.7, 0.55, 0.85, 0.65].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md transition-all duration-500"
                    style={{
                      height: `${h * 100}%`,
                      backgroundColor: i % 2 === 0 ? theme.accent : theme.muted,
                      opacity: 0.9,
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Token swatch row */}
            <div className="flex items-center gap-3 border-t border-border-subtle bg-surface-default px-4 py-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-text-tertiary">accent</span>
                <span
                  className="h-3 w-3 rounded-sm border border-border-subtle"
                  style={{ backgroundColor: theme.accent }}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-text-tertiary">muted</span>
                <span
                  className="h-3 w-3 rounded-sm border border-border-subtle"
                  style={{ backgroundColor: theme.muted }}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-text-tertiary">bg</span>
                <span className={`h-3 w-3 rounded-sm border border-border-subtle ${theme.bg}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  QualityTab                                                         */
/* ================================================================== */

const A11Y_CHECKS = [
  { id: "keyboard", label: "Keyboard Navigation", description: "All data points reachable via Tab/Arrow keys" },
  { id: "table", label: "Data Table Fallback", description: "Screen readers get a hidden <table> summary of chart data" },
  { id: "aria", label: "aria-live Announcements", description: "Value changes announced to assistive technology" },
  { id: "motion", label: "Reduced Motion", description: "Respects prefers-reduced-motion media query" },
  { id: "contrast", label: "Color Contrast", description: "Minimum 4.5:1 contrast ratio for labels and values" },
  { id: "focus", label: "Focus Indicators", description: "Visible focus ring on interactive chart elements" },
];

const PERF_GATES = [
  { label: "Bundle Size", threshold: "< 45 KB gzipped", status: "pass" as const },
  { label: "Memory Leak Test", threshold: "No detached DOM after unmount", status: "pass" as const },
  { label: "LTTB Downsampling", threshold: "Auto-downsample > 2000 points", status: "pass" as const },
  { label: "Render @ 10k points", threshold: "< 200ms initial paint", status: "pass" as const },
  { label: "Re-render Budget", threshold: "< 16ms (60 fps)", status: "pass" as const },
];

function QualityTab({ chart }: { chart: ChartMeta }) {
  return (
    <div className="flex flex-col gap-6">
      {/* A11y checklist */}
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
        <div className="flex items-center gap-3 border-b border-border-subtle bg-linear-to-r from-state-success-bg to-transparent px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-state-success-bg">
            <ShieldCheck className="h-4 w-4 text-state-success-text" />
          </div>
          <span className="text-sm font-semibold text-text-primary">
            Accessibility Checklist
          </span>
          <span className="ml-auto rounded-full bg-state-success-bg px-2 py-0.5 text-[10px] font-semibold text-state-success-text">
            {chart.a11y.length}/{A11Y_CHECKS.length} supported
          </span>
        </div>
        <div className="divide-y divide-border-subtle">
          {A11Y_CHECKS.map((check) => {
            const supported = chart.a11y.includes(check.id) ||
              chart.a11y.some((a) => a.replace("-", "").includes(check.id.replace("-", "")));
            return (
              <div
                key={check.id}
                className="flex items-center gap-3 px-5 py-3 transition hover:bg-surface-muted/50"
              >
                <span
                  className={[
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    supported
                      ? "bg-state-success-bg text-state-success-text"
                      : "bg-surface-muted text-text-tertiary",
                  ].join(" ")}
                >
                  {supported ? <Check className="h-3 w-3" /> : "--"}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium text-text-primary">
                    {check.label}
                  </span>
                  <p className="text-xs text-text-tertiary">{check.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance gates */}
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
        <div className="flex items-center gap-3 border-b border-border-subtle bg-linear-to-r from-state-info-bg to-transparent px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-state-info-bg">
            <Cpu className="h-4 w-4 text-state-info-text" />
          </div>
          <span className="text-sm font-semibold text-text-primary">
            Performance Gates
          </span>
        </div>
        <div className="divide-y divide-border-subtle">
          {PERF_GATES.map((gate) => (
            <div
              key={gate.label}
              className="flex items-center justify-between px-5 py-3 transition hover:bg-surface-muted/50"
            >
              <div>
                <span className="text-sm font-medium text-text-primary">
                  {gate.label}
                </span>
                <p className="text-xs text-text-tertiary">{gate.threshold}</p>
              </div>
              <span className="rounded-full bg-state-success-bg px-2.5 py-0.5 text-[10px] font-semibold uppercase text-state-success-text">
                {gate.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Shared helper components                                           */
/* ================================================================== */

function MetadataCard({
  icon,
  iconBg,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-default p-5 transition-all duration-300 hover:border-border-default hover:shadow-sm">
      <div className="flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconBg}`}>
          {icon}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
          {label}
        </span>
        <span className="ml-auto rounded-full bg-surface-muted px-2 py-0.5 text-xs font-bold tabular-nums text-text-primary">
          {value}
        </span>
      </div>
      <p className="mt-2 text-xs text-text-tertiary">{detail}</p>
      <div className="pointer-events-none absolute -bottom-3 -right-3 h-12 w-12 rounded-full bg-linear-to-tl from-action-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

function ChartPreviewPlaceholder({ chart }: { chart: ChartMeta }) {
  const barHeights = [0.4, 0.7, 0.55, 0.85, 0.65, 0.75];

  if (chart.id === "pie-chart" || chart.id === "sunburst-chart") {
    return (
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-subtle, #e5e7eb)" strokeWidth="2" />
          <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="var(--action-primary, #3b82f6)" opacity="0.7" />
          <path d="M95 50 A45 45 0 0 1 50 95 L50 50 Z" fill="var(--action-primary, #3b82f6)" opacity="0.4" />
          <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="var(--action-primary, #3b82f6)" opacity="0.25" />
          <path d="M5 50 A45 45 0 0 1 50 5 L50 50 Z" fill="var(--action-primary, #3b82f6)" opacity="0.55" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-text-secondary">
          {chart.name}
        </span>
      </div>
    );
  }

  if (chart.id === "line-chart" || chart.id === "area-chart") {
    return (
      <div className="h-36 w-full max-w-md">
        <svg viewBox="0 0 200 80" className="h-full w-full" preserveAspectRatio="none">
          {chart.id === "area-chart" && (
            <path
              d="M0 60 L33 45 L66 50 L100 30 L133 35 L166 20 L200 25 L200 80 L0 80 Z"
              fill="var(--action-primary, #3b82f6)"
              opacity="0.15"
            />
          )}
          <polyline
            points="0,60 33,45 66,50 100,30 133,35 166,20 200,25"
            fill="none"
            stroke="var(--action-primary, #3b82f6)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {[
            [0, 60], [33, 45], [66, 50], [100, 30], [133, 35], [166, 20], [200, 25],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill="var(--action-primary, #3b82f6)" />
          ))}
        </svg>
      </div>
    );
  }

  if (chart.id === "gauge-chart") {
    return (
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 100 60" className="h-full w-full">
          <path
            d="M10 55 A40 40 0 0 1 90 55"
            fill="none"
            stroke="var(--border-subtle, #e5e7eb)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M10 55 A40 40 0 0 1 72 20"
            fill="none"
            stroke="var(--action-primary, #3b82f6)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <text x="50" y="50" textAnchor="middle" className="text-xs font-bold" fill="currentColor">
            73%
          </text>
        </svg>
      </div>
    );
  }

  if (chart.id === "radar-chart") {
    return (
      <div className="h-36 w-36">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <polygon points="50,10 90,35 80,80 20,80 10,35" fill="none" stroke="var(--border-subtle, #e5e7eb)" strokeWidth="1" />
          <polygon points="50,25 75,38 70,65 30,65 25,38" fill="var(--action-primary, #3b82f6)" opacity="0.2" stroke="var(--action-primary, #3b82f6)" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  if (chart.id === "funnel-chart") {
    return (
      <div className="flex h-36 w-full max-w-xs flex-col items-center justify-center gap-1">
        {[100, 80, 60, 40, 25].map((w, i) => (
          <div
            key={i}
            className="rounded-sm transition-all"
            style={{
              width: `${w}%`,
              height: "20%",
              backgroundColor: "var(--action-primary, #3b82f6)",
              opacity: 1 - i * 0.15,
            }}
          />
        ))}
      </div>
    );
  }

  /* Default: bar chart style */
  return (
    <div className="flex h-36 w-full max-w-md items-end justify-center gap-3 px-4">
      {barHeights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-md transition-all duration-500"
          style={{
            height: `${h * 100}%`,
            backgroundColor: "var(--action-primary, #3b82f6)",
            opacity: 0.5 + i * 0.08,
          }}
        />
      ))}
    </div>
  );
}
