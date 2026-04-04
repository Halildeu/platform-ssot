/**
 * Cross-Filter Bus — Type Definitions
 *
 * Central types for the cross-filter store, event bridge, and drill-down state.
 * Used by all P2 interaction layer components.
 *
 * @see decisions/topics/chart-viz-engine-selection.v1.json (D-006)
 */

/* ------------------------------------------------------------------ */
/*  Filter                                                             */
/* ------------------------------------------------------------------ */

export type FilterOperator = "eq" | "in" | "range" | "brush";

export interface CrossFilterEntry {
  /** ID of the source chart/grid that created this filter. */
  sourceId: string;
  /** Data field being filtered. */
  field: string;
  /** Filter value(s). */
  value: unknown;
  /** Operator type. */
  operator: FilterOperator;
  /** Timestamp of filter creation. */
  createdAt: number;
}

/* ------------------------------------------------------------------ */
/*  Drill-Down                                                         */
/* ------------------------------------------------------------------ */

export interface DrillLevel {
  /** Field used for this drill level. */
  field: string;
  /** Selected value at this level. */
  value: unknown;
  /** Human-readable label. */
  label: string;
  /** Optional chart type override at this level. */
  chartType?: string;
}

/* ------------------------------------------------------------------ */
/*  History (undo/redo)                                                */
/* ------------------------------------------------------------------ */

export interface HistoryEntry {
  /** Snapshot of all filters. */
  filters: Map<string, CrossFilterEntry>;
  /** Snapshot of drill path. */
  drillPath: DrillLevel[];
  /** When this snapshot was taken. */
  timestamp: number;
  /** Human-readable description. */
  label: string;
}

/* ------------------------------------------------------------------ */
/*  Bookmark                                                           */
/* ------------------------------------------------------------------ */

export interface Bookmark {
  name: string;
  state: HistoryEntry;
  createdAt: number;
}

/* ------------------------------------------------------------------ */
/*  Store State                                                        */
/* ------------------------------------------------------------------ */

export interface CrossFilterState {
  /** Active filters. Key format: `${sourceId}:${field}` */
  filters: Map<string, CrossFilterEntry>;
  /** Active cross-filter group ID. */
  activeGroup: string | null;
  /** Current drill-down path. */
  drillPath: DrillLevel[];
  /** Undo stack. Max 50 entries. */
  past: HistoryEntry[];
  /** Redo stack. */
  future: HistoryEntry[];
  /** Saved bookmarks. */
  bookmarks: Map<string, Bookmark>;
  /** Count of in-flight queries (for DataVolumeIndicator). */
  pendingQueryCount: number;
}

export interface CrossFilterActions {
  setFilter: (entry: CrossFilterEntry) => void;
  removeFilter: (key: string) => void;
  clearAllFilters: () => void;
  drillDown: (level: DrillLevel) => void;
  drillUp: () => void;
  drillToRoot: () => void;
  drillTo: (index: number) => void;
  undo: () => void;
  redo: () => void;
  saveBookmark: (id: string, name: string) => void;
  loadBookmark: (id: string) => void;
  deleteBookmark: (id: string) => void;
  incrementPendingQuery: () => void;
  decrementPendingQuery: () => void;
}

export type CrossFilterStore = CrossFilterState & CrossFilterActions;

/* ------------------------------------------------------------------ */
/*  Event Bridge                                                       */
/* ------------------------------------------------------------------ */

export type CrossFilterEventType =
  | "FILTER_CHANGED"
  | "FILTER_REMOVED"
  | "FILTERS_CLEARED"
  | "DRILL_CHANGED"
  | "DRILL_RESET";

export interface CrossFilterEvent {
  type: CrossFilterEventType;
  payload: {
    filters: Map<string, CrossFilterEntry>;
    drillPath: DrillLevel[];
  };
  timestamp: number;
}

export type CrossFilterEventListener = (event: CrossFilterEvent) => void;
