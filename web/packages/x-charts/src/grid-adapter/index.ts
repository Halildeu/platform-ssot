/* Grid Adapter — vendor-neutral grid abstraction */

export type {
  GridAdapter,
  GridColumnDef,
  GridFilterEntry,
  GridSortEntry,
  GridSelectionEvent,
  FilterOperator,
  SortDirection,
  ChartGridLinkConfig,
  ColumnChartMapping,
} from './types';

export { AGGridAdapter } from './AGGridAdapter';
export type { AGGridApi } from './AGGridAdapter';

export { useChartGridLink, autoMapColumns } from './useChartGridLink';
export type { ChartGridLinkState } from './useChartGridLink';
