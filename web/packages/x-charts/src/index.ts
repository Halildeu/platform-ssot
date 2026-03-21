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

/* Types */
export type { ChartSize, ChartDataPoint, ChartSeries } from "@mfe/design-system";
