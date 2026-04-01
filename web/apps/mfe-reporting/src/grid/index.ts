import type React from 'react';
// Reporting MFE altından grid altyapısını dışa aktarır.
// Uygulamalar grid'i 'mfe_reporting/grid' üzerinden tüketsin.
export { EntityGridTemplate } from '../components/entity-grid';
export type {
  EntityGridTemplateProps,
  GridExportConfig,
  EntityGridQueryParams,
  MapAdvancedFilter,
} from '../components/entity-grid';
export { buildEntityGridQueryParams } from '../components/entity-grid';

// Legacy hafif-grid tipleri için minimal tanımlar (rapor modüllerinde kullanılıyor)
export type SortDirection = 'asc' | 'desc';
export type SortModelItem = { colId: string; sort: SortDirection };
export type FilterModel = Record<string, unknown>;
export type GridRequest = {
  page: number;
  pageSize: number;
  sortModel?: SortModelItem[];
  filterModel?: FilterModel;
  quickFilter?: string;
  advancedFilter?: string;
};
export type GridResponse<T = unknown> = { rows: T[]; total: number };
export type ColumnDef<TRow = unknown> = {
  field?: string;
  headerName?: string;
  width?: number;
  minWidth?: number;
  flex?: number | null;
  filterType?: 'text' | 'number' | 'date' | 'set';
  sortable?: boolean;
  filter?: boolean | string;
  floatingFilter?: boolean;
  pinned?: 'left' | 'right';
  wrapText?: boolean;
  autoHeight?: boolean;
  cellRenderer?: ((params: { value: unknown; data: TRow | undefined }) => React.ReactNode) | string;
  valueFormatter?: (params: { value: unknown; data: TRow | undefined }) => string;
  valueGetter?: (params: { data: TRow | undefined }) => unknown;
  filterParams?: Record<string, unknown>;
  cellClass?: string | string[];
};
