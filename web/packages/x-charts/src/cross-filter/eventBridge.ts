/**
 * Event Bridge — Non-React subscription adapter for AG Grid
 *
 * Wraps Zustand store.subscribe() to fire typed events.
 * AG Grid datasource adapters use this instead of React hooks.
 *
 * @see decisions/topics/chart-viz-engine-selection.v1.json (D-006)
 */
import type { CrossFilterStoreApi } from "./createCrossFilterStore";
import type {
  CrossFilterEvent,
  CrossFilterEventListener,
  CrossFilterEventType,
  CrossFilterState,
} from "./types";

export interface CrossFilterBridge {
  /** Subscribe to cross-filter events. */
  on: (listener: CrossFilterEventListener) => void;
  /** Unsubscribe from events. */
  off: (listener: CrossFilterEventListener) => void;
  /** Get current state imperatively. */
  getState: () => CrossFilterState;
  /** Destroy bridge and unsubscribe from store. */
  destroy: () => void;
}

function detectEventType(
  prev: CrossFilterState,
  next: CrossFilterState,
): CrossFilterEventType | null {
  if (next.filters.size === 0 && prev.filters.size > 0) return "FILTERS_CLEARED";
  if (next.filters !== prev.filters) {
    return next.filters.size >= prev.filters.size ? "FILTER_CHANGED" : "FILTER_REMOVED";
  }
  if (next.drillPath !== prev.drillPath) {
    return next.drillPath.length === 0 ? "DRILL_RESET" : "DRILL_CHANGED";
  }
  return null;
}

export function createEventBridge(store: CrossFilterStoreApi): CrossFilterBridge {
  const listeners = new Set<CrossFilterEventListener>();

  const unsubscribe = store.subscribe((next, prev) => {
    const type = detectEventType(prev, next);
    if (!type || listeners.size === 0) return;

    const event: CrossFilterEvent = {
      type,
      payload: {
        filters: next.filters,
        drillPath: next.drillPath,
      },
      timestamp: Date.now(),
    };

    for (const listener of listeners) {
      try {
        listener(event);
      } catch {
        // Swallow listener errors to prevent cascade
      }
    }
  });

  return {
    on: (listener) => listeners.add(listener),
    off: (listener) => listeners.delete(listener),
    getState: () => {
      const s = store.getState();
      return {
        filters: s.filters,
        activeGroup: s.activeGroup,
        drillPath: s.drillPath,
        past: s.past,
        future: s.future,
        bookmarks: s.bookmarks,
        pendingQueryCount: s.pendingQueryCount,
      };
    },
    destroy: () => {
      listeners.clear();
      unsubscribe();
    },
  };
}
