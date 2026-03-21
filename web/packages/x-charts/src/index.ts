/* ------------------------------------------------------------------ */
/*  @mfe/x-charts — Barrel export                                     */
/* ------------------------------------------------------------------ */

/* Re-export existing chart types from design-system */
export { BarChart, LineChart, AreaChart, PieChart } from "@mfe/design-system";
export type { BarChartProps } from "@mfe/design-system";
export type { LineChartProps } from "@mfe/design-system";
export type { AreaChartProps } from "@mfe/design-system";
export type { PieChartProps } from "@mfe/design-system";

/* New chart types */
export { ScatterChart } from "./ScatterChart";
export type { ScatterChartProps } from "./ScatterChart";

export { RadarChart } from "./RadarChart";
export type { RadarChartProps } from "./RadarChart";

export { TreemapChart } from "./TreemapChart";
export type { TreemapChartProps } from "./TreemapChart";

export { HeatmapChart } from "./HeatmapChart";
export type { HeatmapChartProps } from "./HeatmapChart";

export { GaugeChart } from "./GaugeChart";
export type { GaugeChartProps } from "./GaugeChart";

export { WaterfallChart } from "./WaterfallChart";
export type { WaterfallChartProps } from "./WaterfallChart";

/* Composition wrapper */
export { ChartContainer } from "./ChartContainer";
export type { ChartContainerProps } from "./ChartContainer";

/* Dashboard composition */
export { ChartDashboard } from "./ChartDashboard";
export type { ChartDashboardProps, ChartDashboardItemProps } from "./ChartDashboard";

/* Sparklines & mini charts */
export { SparklineChart } from "./SparklineChart";
export type { SparklineChartProps } from "./SparklineChart";

export { MiniChart } from "./MiniChart";
export type { MiniChartProps, MiniChartDataPoint } from "./MiniChart";

/* Dashboard widgets */
export { KPICard } from "./KPICard";
export type { KPICardProps, KPICardTrend } from "./KPICard";

export { StatWidget } from "./StatWidget";
export type { StatWidgetProps } from "./StatWidget";

/* Standalone legend */
export { ChartLegend } from "./ChartLegend";
export type { ChartLegendProps, ChartLegendItem } from "./ChartLegend";

/* Chart interactions */
export { useChartInteractions } from "./useChartInteractions";
export type {
  ChartInteractionState,
  ChartInteractionOptions,
  ChartInteractionHandlers,
} from "./useChartInteractions";

export { ChartToolbar } from "./ChartToolbar";
export type { ChartToolbarProps } from "./ChartToolbar";

/* Responsive resize */
export { useChartResize } from "./useChartResize";
export type { ChartResizeState, UseChartResizeOptions } from "./useChartResize";

/* Real-time data */
export { useRealTimeData } from "./useRealTimeData";
export type { RealTimeDataOptions, RealTimeDataState } from "./useRealTimeData";

/* Wave 3 — Cross-package composition */
export { useDashboardComposition } from "./composition/useDashboardComposition";
export type {
  DateRange,
  UseDashboardCompositionOptions,
  UseDashboardCompositionReturn,
} from "./composition/useDashboardComposition";

/* Wave 3 — Variant system */
export { useChartVariants } from "./useChartVariants";
export type {
  ChartConfig,
  ChartVariant,
  UseChartVariantsReturn,
} from "./useChartVariants";

/* Types */
export type { ChartSize, ChartDataPoint, ChartSeries } from "@mfe/design-system";
