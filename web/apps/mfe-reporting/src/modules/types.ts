import type { ReactNode } from 'react';
import type { SharedReportId } from '@platform/capabilities';
import type { ColumnDef, GridRequest, GridResponse } from '../grid';

export type TranslateFn = (key: string, params?: Record<string, unknown>) => string;

export interface FilterRenderContext<TFilters extends Record<string, unknown>> {
  values: TFilters;
  submit: () => void;
  setFieldValue: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void;
  t: TranslateFn;
}

export interface FilterInitContext {
  searchParams?: URLSearchParams;
}

export interface ReportModule<TFilters extends Record<string, unknown>, TRow> {
  id: string;
  sharedReportId: SharedReportId;
  route: string;
  titleKey: string;
  descriptionKey: string;
  breadcrumbKeys: Array<{ key: string; to?: string }>;
  navKey: string;
  createInitialFilters: (context?: FilterInitContext) => TFilters;
  renderFilters: (ctx: FilterRenderContext<TFilters>) => ReactNode;
  getColumns: (t: TranslateFn) => ColumnDef<TRow>[];
  fetchRows: (filters: TFilters, request: GridRequest) => Promise<GridResponse<TRow>>;
  renderDashboard?: (t: TranslateFn) => ReactNode;
  renderDetail?: (row: TRow | null, t: TranslateFn) => ReactNode;
  exportRows?: (
    filters: TFilters,
    format: "csv" | "json",
  ) => Promise<{ blob: Blob; filename: string }>;
}
