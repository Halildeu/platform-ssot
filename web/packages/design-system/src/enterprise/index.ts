'use client';
/* ------------------------------------------------------------------ */
/*  Enterprise Components — domain-agnostic building blocks             */
/*  for executive dashboards, governance, and business intelligence.    */
/* ------------------------------------------------------------------ */

// Shared types & utilities
export {
  formatValue,
  getTrendColor,
  getTrendIcon,
  getToneClasses,
} from './types';
export type {
  NumberFormat,
  FormatOptions,
  TrendDirection,
  TrendInfo,
  EnterpriseTone,
} from './types';

// KPI & Metrics
export { ExecutiveKPIStrip } from './ExecutiveKPIStrip';

// Workflow & Approvals
export { ApprovalWorkflow } from './ApprovalWorkflow';

// Risk & Governance
export { RiskMatrix } from './RiskMatrix';
export { GovernanceBoard } from './GovernanceBoard';

// Project & Timeline
export { GanttTimeline } from './GanttTimeline';

// Financial & Analytics
export { AgingBuckets } from './AgingBuckets';
export { FunnelChart } from './FunnelChart';
export { ComparisonTable } from './ComparisonTable';

// HR & Training
export { TrainingTracker } from './TrainingTracker';

// Visualization
export { BulletChart } from './BulletChart';
export { MicroChart } from './MicroChart';
export { TreemapChart } from './TreemapChart';
export { SankeyDiagram } from './SankeyDiagram';
export { RadarChart } from './RadarChart';

// Date & Time
export { DateRangePicker } from './DateRangePicker';

// Layout
export { ThemeLayout } from './ThemeLayout';

// Process & Flow
export { ProcessFlow } from './ProcessFlow';
export { ValueStream } from './ValueStream';

// Status & Timeline
export { StatusTimeline } from './StatusTimeline';

// Notifications
export { NotificationCenter } from './NotificationCenter';
export type { NotificationCenterLocaleText } from './NotificationCenter';

// Editing
export { InlineEdit } from './InlineEdit';

// Empty States
export { EmptyStateBuilder } from './EmptyStateBuilder';
export type { EmptyStateBuilderLocaleText } from './EmptyStateBuilder';

// Filters
export { FilterPresets } from './FilterPresets';
export type { FilterPresetsLocaleText } from './FilterPresets';

// Export
export { DataExportDialog } from './DataExportDialog';
export type { DataExportDialogLocaleText } from './DataExportDialog';

// Fine-Kinney Risk Assessment
export { FineKinney } from './FineKinney';
export type { FineKinneyProps, FineKinneyRisk } from './FineKinney';

// Waterfall Chart
export { WaterfallChart } from './WaterfallChart';
export type { WaterfallChartProps, WaterfallItem } from './WaterfallChart';

// Pareto Chart
export { ParetoChart } from './ParetoChart';
export type { ParetoChartProps, ParetoItem } from './ParetoChart';

// Heatmap Calendar
export { HeatmapCalendar } from './HeatmapCalendar';
export type { HeatmapCalendarProps, HeatmapDay } from './HeatmapCalendar';

// Organization Chart
export { OrgChart } from './OrgChart';
export type { OrgChartProps, OrgChartNode } from './OrgChart';

// Gauge Chart
export { GaugeChart } from './GaugeChart';
export type { GaugeChartProps, GaugeThreshold } from './GaugeChart';

// Pivot Table
export { PivotTable } from './PivotTable';
export type { PivotTableProps, PivotValueConfig, PivotCellClickEvent } from './PivotTable';

// Comment Thread
export { CommentThread } from './CommentThread';
export type { CommentThreadProps, Comment } from './CommentThread';

// Activity Feed
export { ActivityFeed } from './ActivityFeed';
export type { ActivityFeedProps, ActivityItem } from './ActivityFeed';

// Box Plot
export { BoxPlot } from './BoxPlot';
export type { BoxPlotProps, BoxPlotData } from './BoxPlot';

// Histogram Chart
export { HistogramChart } from './HistogramChart';
export type { HistogramChartProps, HistogramBin } from './HistogramChart';

// Control Chart
export { ControlChart } from './ControlChart';
export type { ControlChartProps, ControlChartPoint } from './ControlChart';
