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
