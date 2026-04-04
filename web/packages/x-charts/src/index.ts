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

/* P3: New ECharts-native chart types */
export { FunnelChart } from "./FunnelChart";
export type { FunnelChartProps, FunnelStage } from "./FunnelChart";
export { SankeyChart } from "./SankeyChart";
export type { SankeyChartProps, SankeyNode, SankeyLink } from "./SankeyChart";
export { SunburstChart } from "./SunburstChart";
export type { SunburstChartProps, SunburstNode } from "./SunburstChart";

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

/* Wave 4 — Mobile responsive hooks */
export { useResponsiveBreakpoint, useResponsiveChartConfig } from "./useResponsiveChart";
export type {
  Breakpoint,
  ResponsiveChartConfig,
} from "./useResponsiveChart";

/* ------------------------------------------------------------------ */
/*  ECharts Foundation (P1)                                           */
/* ------------------------------------------------------------------ */

/* Renderers */
export { registerECharts, echarts } from "./renderers/echarts-imports";
export { useEChartsRenderer } from "./renderers/echarts-renderer";
export type { EChartsRendererOptions, EChartsRendererState } from "./renderers/echarts-renderer";

/* Spec (declarative chart contract) */
export { chartSpecToEChartsOption } from "./spec/chartSpecToEChartsOption";
export { validateChartSpec } from "./spec/validateChartSpec";
export type { ChartSpec, ChartType, ChartChannel, ChartEncoding } from "./spec/ChartSpec";

/* Theme */
export { DesignLabEChartsTheme } from "./theme/DesignLabEChartsTheme";
export { buildDesignLabEChartsDarkTheme, isDarkMode } from "./theme/DesignLabEChartsDarkTheme";
export { buildDesignLabEChartsHighContrastTheme } from "./theme/DesignLabEChartsHighContrastTheme";
export { buildDesignLabEChartsPrintTheme } from "./theme/DesignLabEChartsPrintTheme";
export { COLORBLIND_PALETTES } from "./theme/colorblind-palettes";
export { DECAL_PATTERNS } from "./theme/decal-patterns";

/* Security */
export { sanitizeChartText, sanitizeChartData, validateStreamUrl } from "./security/sanitizeChartText";

/* A11y */
export { ChartKeyboardNav } from "./a11y/ChartKeyboardNav";
export type { ChartKeyboardNavProps } from "./a11y/ChartKeyboardNav";
export { ChartDataTable } from "./a11y/ChartDataTable";
export type { ChartDataTableProps, ChartDataTableColumn } from "./a11y/ChartDataTable";
export { ChartAriaLive } from "./a11y/ChartAriaLive";
export type { ChartAriaLiveProps } from "./a11y/ChartAriaLive";
export { useReducedMotion } from "./a11y/useReducedMotion";

/* States */
export { ChartLoadingState } from "./states/ChartLoadingState";
export type { ChartLoadingStateProps } from "./states/ChartLoadingState";
export { ChartEmptyState } from "./states/ChartEmptyState";
export type { ChartEmptyStateProps } from "./states/ChartEmptyState";
export { ChartErrorState } from "./states/ChartErrorState";
export type { ChartErrorStateProps } from "./states/ChartErrorState";
export { ChartErrorBoundary } from "./states/ChartErrorBoundary";
export type { ChartErrorBoundaryProps } from "./states/ChartErrorBoundary";

/* ------------------------------------------------------------------ */
/*  P2 Interaction Layer                                               */
/* ------------------------------------------------------------------ */

/* Cross-Filter Bus */
export {
  createCrossFilterStore,
  createEventBridge,
  CrossFilterProvider,
  useCrossFilter,
  useCrossFilterStoreApi,
  filtersByGroup, filtersForChart, activeFilterCount,
  canUndo, canRedo, bookmarkList, drillDepth, isQuerying,
} from "./cross-filter";
export type {
  CrossFilterEntry, CrossFilterState, CrossFilterStore,
  CrossFilterEvent, CrossFilterEventType, FilterOperator,
  DrillLevel, HistoryEntry, Bookmark,
  CrossFilterStoreApi, CrossFilterBridge, CrossFilterProviderProps,
} from "./cross-filter";

/* Drill-Down */
export { useDrillDown } from "./drill-down";
export type { UseDrillDownOptions, UseDrillDownReturn, DrillDownLevelSpec, BreadcrumbItem } from "./drill-down";
export { DrillDownBreadcrumb } from "./drill-down";
export type { DrillDownBreadcrumbProps } from "./drill-down";

/* Animation */
export { useChartAnimation } from "./animation";
export type { ChartAnimationConfig, AnimationOptionFragment } from "./animation";

/* Touch Gestures */
export { useTouchGestures } from "./touch";
export type { TouchGestureOptions, TouchGestureState, UseTouchGesturesReturn } from "./touch";
export { MobileTooltip } from "./touch";
export type { MobileTooltipProps } from "./touch";

/* Data Volume Indicator */
export { DataVolumeIndicator } from "./components/DataVolumeIndicator";
export type { DataVolumeIndicatorProps } from "./components/DataVolumeIndicator";

/* Types */
export type { ChartSize, ChartDataPoint, ChartSeries } from "@mfe/design-system";
