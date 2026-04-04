/**
 * Cross-Filter Selectors — Surgical re-render helpers
 *
 * Each selector extracts a minimal slice of state so React components
 * only re-render when their specific data changes.
 */
import type { CrossFilterStore, CrossFilterEntry } from "./types";

/** All filters belonging to a specific cross-filter group. */
export function filtersByGroup(
  state: CrossFilterStore,
  groupId: string,
): CrossFilterEntry[] {
  const result: CrossFilterEntry[] = [];
  for (const entry of state.filters.values()) {
    // All filters in the store belong to the active group by convention
    if (state.activeGroup === groupId) {
      result.push(entry);
    }
  }
  return result;
}

/** Filters NOT created by a specific chart (filters TO apply on that chart). */
export function filtersForChart(
  state: CrossFilterStore,
  chartId: string,
): CrossFilterEntry[] {
  const result: CrossFilterEntry[] = [];
  for (const entry of state.filters.values()) {
    if (entry.sourceId !== chartId) {
      result.push(entry);
    }
  }
  return result;
}

/** Total active filter count. */
export function activeFilterCount(state: CrossFilterStore): number {
  return state.filters.size;
}

/** Whether undo is available. */
export function canUndo(state: CrossFilterStore): boolean {
  return state.past.length > 0;
}

/** Whether redo is available. */
export function canRedo(state: CrossFilterStore): boolean {
  return state.future.length > 0;
}

/** List of bookmark entries (id + name). */
export function bookmarkList(
  state: CrossFilterStore,
): Array<{ id: string; name: string; createdAt: number }> {
  const result: Array<{ id: string; name: string; createdAt: number }> = [];
  for (const [id, bookmark] of state.bookmarks) {
    result.push({ id, name: bookmark.name, createdAt: bookmark.createdAt });
  }
  return result;
}

/** Current drill depth. */
export function drillDepth(state: CrossFilterStore): number {
  return state.drillPath.length;
}

/** Whether any query is in flight. */
export function isQuerying(state: CrossFilterStore): boolean {
  return state.pendingQueryCount > 0;
}
