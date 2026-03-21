// Re-export core infrastructure
export { EntityGridTemplate } from '@mfe/design-system';
export type { EntityGridTemplateProps } from '@mfe/design-system';
export { GridShell } from '@mfe/design-system';
export { GridToolbar } from '@mfe/design-system';
export { TablePagination } from '@mfe/design-system';

// New recipe components
export { DataGridFilterChips } from './DataGridFilterChips';
export type { DataGridFilterChipsProps, ActiveFilter } from './DataGridFilterChips';
export { DataGridSelectionBar } from './DataGridSelectionBar';
export type { DataGridSelectionBarProps } from './DataGridSelectionBar';
export { ServerDataSource } from './ServerDataSource';
export type { ServerDataSourceConfig } from './ServerDataSource';
export { useColumnBuilder } from './useColumnBuilder';

// Advanced AG Grid recipe components
export { MasterDetailGrid } from './MasterDetailGrid';
export type { MasterDetailGridProps } from './MasterDetailGrid';
export { TreeDataGrid } from './TreeDataGrid';
export type { TreeDataGridProps } from './TreeDataGrid';
export { PivotGrid } from './PivotGrid';
export type { PivotGridProps } from './PivotGrid';
export { EditableGrid } from './EditableGrid';
export type { EditableGridProps } from './EditableGrid';
export { RowGroupingGrid } from './RowGroupingGrid';
export type { RowGroupingGridProps } from './RowGroupingGrid';

// Advanced hooks
export { useGridExport } from './useGridExport';
export type { ExcelExportOptions, CsvExportOptions } from './useGridExport';
export { useGridState } from './useGridState';

/* Wave 3 — Cross-package composition */
export { useGridChartDrilldown } from './composition/useGridChartDrilldown';
export type {
  UseGridChartDrilldownReturn,
  UseGridChartDrilldownOptions,
} from './composition/useGridChartDrilldown';

export { useGridFormSync } from './composition/useGridFormSync';
export type {
  UseGridFormSyncReturn,
  UseGridFormSyncOptions,
} from './composition/useGridFormSync';
