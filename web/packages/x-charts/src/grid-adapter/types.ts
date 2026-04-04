/**
 * Grid Adapter — Vendor-neutral grid abstraction
 *
 * Defines the contract for grid ↔ chart integration.
 * AGGridAdapter is the reference implementation (P4).
 * Future: TanStack Table, custom implementations.
 *
 * @see contract P4 DoD: "GridAdapter interface definition"
 * @see DCP D-003: "Grid abstraction interface (forward-compatible)"
 */

/* ------------------------------------------------------------------ */
/*  Column Definitions                                                 */
/* ------------------------------------------------------------------ */

export interface GridColumnDef {
  field: string;
  headerName: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  sortable?: boolean;
  filterable?: boolean;
  /** AG Grid colId or equivalent */
  colId?: string;
}

/* ------------------------------------------------------------------ */
/*  Filter / Sort Models                                               */
/* ------------------------------------------------------------------ */

export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'range' | 'contains';

export interface GridFilterEntry {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export type SortDirection = 'asc' | 'desc';

export interface GridSortEntry {
  field: string;
  direction: SortDirection;
}

/* ------------------------------------------------------------------ */
/*  Selection                                                          */
/* ------------------------------------------------------------------ */

export interface GridSelectionEvent {
  selectedRows: Record<string, unknown>[];
  selectedRowIds: string[];
}

/* ------------------------------------------------------------------ */
/*  Grid Adapter Interface                                             */
/* ------------------------------------------------------------------ */

export interface GridAdapter {
  /** Unique adapter instance ID */
  readonly id: string;

  /** Set the data source rows */
  setData(rows: Record<string, unknown>[]): void;

  /** Get currently selected rows */
  getSelectedRows(): Record<string, unknown>[];

  /** Get column definitions */
  getColumnDefs(): GridColumnDef[];

  /** Apply an external filter (from chart click, cross-filter bus, etc.) */
  applyExternalFilter(filters: GridFilterEntry[]): void;

  /** Get current filter model */
  getFilterModel(): GridFilterEntry[];

  /** Get current sort model */
  getSortModel(): GridSortEntry[];

  /** Register a callback for filter changes */
  onFilterChange(callback: (filters: GridFilterEntry[]) => void): () => void;

  /** Register a callback for sort changes */
  onSortChange(callback: (sorts: GridSortEntry[]) => void): () => void;

  /** Register a callback for selection changes */
  onSelectionChange(callback: (event: GridSelectionEvent) => void): () => void;

  /** Highlight specific rows (from chart selection) */
  highlightRows(rowIds: string[]): void;

  /** Clear all highlights */
  clearHighlights(): void;

  /** Refresh/re-render the grid */
  refresh(): void;

  /** Dispose the adapter and clean up event listeners */
  destroy(): void;
}

/* ------------------------------------------------------------------ */
/*  Chart ↔ Grid Linking                                               */
/* ------------------------------------------------------------------ */

export interface ChartGridLinkConfig {
  /** Grid adapter instance */
  gridAdapter: GridAdapter;
  /** Chart ID for cross-filter */
  chartId: string;
  /** Grid column → chart encoding mapping */
  columnMapping: ColumnChartMapping[];
  /** Whether chart click filters the grid. @default true */
  chartClickFiltersGrid?: boolean;
  /** Whether grid selection highlights chart. @default true */
  gridSelectionHighlightsChart?: boolean;
  /** Row ID field in grid data. @default 'id' */
  rowIdField?: string;
}

export interface ColumnChartMapping {
  /** Grid column field */
  gridField: string;
  /** Chart encoding channel (x, y, color, size) */
  chartChannel: 'x' | 'y' | 'color' | 'size' | 'label';
  /** Chart data type */
  chartType: 'nominal' | 'quantitative' | 'temporal' | 'ordinal';
}
