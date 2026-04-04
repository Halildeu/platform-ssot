export type {
  ChartSpec,
  ChartType,
  ChartChannel,
  ChartEncoding,
  ChartDataSpec,
  ChartTransform,
  ChartInteractionSpec,
  ChartCrossFilterSpec,
  ChartAccessibilitySpec,
  ChartStatesSpec,
  ChartAnimationSpec,
  ChartLocaleSpec,
  ChartSecuritySpec,
  ChartPerformanceSpec,
  ChartAnnotation,
  ChartResponsiveSpec,
  ChartExportSpec,
  DrillDownLevel,
  ContextMenuItem,
  ColorblindPalette,
  FieldType,
  AggregateType,
  DataSourceType,
} from './ChartSpec';

export { chartSpecToEChartsOption } from './chartSpecToEChartsOption';
export { validateChartSpec } from './validateChartSpec';
export type { ValidationResult } from './validateChartSpec';
