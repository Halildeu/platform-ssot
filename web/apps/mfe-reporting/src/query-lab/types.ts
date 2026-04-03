/**
 * Query Lab Types — SQL editor and execution.
 */

export interface QueryExecution {
  id: string;
  sql: string;
  schema: string;
  status: 'running' | 'success' | 'error';
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  rowCount?: number;
  columns?: string[];
  rows?: unknown[][];
  error?: string;
}

export interface QueryHistoryEntry {
  id: string;
  sql: string;
  schema: string;
  executedAt: string;
  durationMs: number;
  rowCount: number;
  status: 'success' | 'error';
}

export interface SqlAutocompleteItem {
  label: string;
  type: 'table' | 'column' | 'keyword' | 'function';
  detail?: string;
}
