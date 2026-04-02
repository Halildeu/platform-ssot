/**
 * generateReportConfig — Converts wizard state into a ReportDefinition JSON.
 *
 * This is the wizard's output — posted to POST /v1/reports to create a dynamic report.
 */

import type { BuilderState, JoinDef, LookupDef, FilterDef } from '../hooks/useBuilderState';
import { inferColumnType } from '../../../../../apps/mfe-reporting/src/utils/schemaColumnMapper';

/* ------------------------------------------------------------------ */
/*  ReportDefinition — matches backend dynamic report contract         */
/* ------------------------------------------------------------------ */

export interface ReportDefinition {
  id?: string;
  title: string;
  description: string;
  category: string;
  version: number;
  sourceSchema: string;
  sourceTables: string[];
  columns: ReportColumnDef[];
  joins: JoinDef[];
  filters: FilterDef[];
  lookups: LookupDef[];
  defaultSort?: { field: string; direction: 'asc' | 'desc' };
  /* Future-proof fields (Faz 9-13) */
  metrics?: string[];
  alerts?: unknown[];
  schedule?: unknown;
  embed?: unknown;
  parameters?: unknown[];
  cache?: unknown;
  accessPolicy?: {
    schemaAccess?: string[];
    tableAccess?: string[];
    columnBlacklist?: string[];
    rowFilter?: string;
  };
}

export interface ReportColumnDef {
  field: string;
  headerName: string;
  columnType: string;
  width?: number;
  config?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/*  Generator                                                          */
/* ------------------------------------------------------------------ */

export function generateReportConfig(state: BuilderState): ReportDefinition {
  const sourceTables = [state.primaryTable, ...state.relatedTables].filter(Boolean);

  const columns: ReportColumnDef[] = state.selectedColumns.map((col) => ({
    field: col.field,
    headerName: col.headerName,
    columnType: col.columnType,
    width: col.width,
    config: col.config,
  }));

  return {
    title: state.reportTitle || 'Yeni Rapor',
    description: state.reportDescription || '',
    category: state.reportCategory || 'Genel',
    version: 1,
    sourceSchema: state.schema,
    sourceTables,
    columns,
    joins: state.joins,
    filters: state.filters,
    lookups: state.lookups,
  };
}

/**
 * Validates a ReportDefinition before saving.
 */
export function validateReportConfig(config: ReportDefinition): string[] {
  const errors: string[] = [];

  if (!config.title.trim()) errors.push('Rapor başlığı gerekli');
  if (!config.sourceSchema) errors.push('Schema seçimi gerekli');
  if (!config.sourceTables.length) errors.push('En az bir tablo seçilmeli');
  if (!config.columns.length) errors.push('En az bir sütun seçilmeli');

  /* Check for duplicate fields */
  const fields = new Set<string>();
  for (const col of config.columns) {
    if (fields.has(col.field)) errors.push(`Tekrarlayan sütun: ${col.field}`);
    fields.add(col.field);
  }

  /* Check joins reference valid tables */
  const tableSet = new Set(config.sourceTables.map((t) => t.toUpperCase()));
  for (const join of config.joins) {
    if (!tableSet.has(join.fromTable.toUpperCase())) errors.push(`Join: ${join.fromTable} sourceTables'da yok`);
    if (!tableSet.has(join.toTable.toUpperCase())) errors.push(`Join: ${join.toTable} sourceTables'da yok`);
  }

  return errors;
}
