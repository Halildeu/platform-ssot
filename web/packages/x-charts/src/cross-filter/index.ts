/**
 * Cross-Filter — Public API
 *
 * @see decisions/topics/chart-viz-engine-selection.v1.json (D-006)
 */

// Store
export { createCrossFilterStore } from "./createCrossFilterStore";
export type { CreateCrossFilterStoreOptions, CrossFilterStoreApi } from "./createCrossFilterStore";

// Event Bridge
export { createEventBridge } from "./eventBridge";
export type { CrossFilterBridge } from "./eventBridge";

// React Hook + Provider
export { CrossFilterProvider, useCrossFilter, useCrossFilterStoreApi } from "./useCrossFilterStore";
export type { CrossFilterProviderProps } from "./useCrossFilterStore";

// Selectors
export {
  filtersByGroup,
  filtersForChart,
  activeFilterCount,
  canUndo,
  canRedo,
  bookmarkList,
  drillDepth,
  isQuerying,
} from "./selectors";

// Chart Cross-Filter Hook
export { useChartCrossFilter } from "./useChartCrossFilter";
export type { UseChartCrossFilterOptions, UseChartCrossFilterReturn } from "./useChartCrossFilter";

// Grid Cross-Filter Hook
export { useGridCrossFilter } from "./useGridCrossFilter";
export type { UseGridCrossFilterOptions, UseGridCrossFilterReturn, GridApi } from "./useGridCrossFilter";

// Query Cancellation
export { useQueryCancellation } from "./useQueryCancellation";
export type { UseQueryCancellationReturn } from "./useQueryCancellation";

// Types
export type {
  CrossFilterEntry,
  CrossFilterState,
  CrossFilterActions,
  CrossFilterStore,
  CrossFilterEvent,
  CrossFilterEventType,
  CrossFilterEventListener,
  FilterOperator,
  DrillLevel,
  HistoryEntry,
  Bookmark,
} from "./types";
