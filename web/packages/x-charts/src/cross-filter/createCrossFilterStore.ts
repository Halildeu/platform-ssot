/**
 * Cross-Filter Store — Zustand Store Factory
 *
 * Central state management for chart cross-filtering, drill-down,
 * undo/redo, bookmarks, and query tracking.
 *
 * @see decisions/topics/chart-viz-engine-selection.v1.json (D-006)
 */
import { createStore } from "zustand/vanilla";
import type {
  CrossFilterStore,
  CrossFilterState,
  CrossFilterEntry,
  DrillLevel,
  HistoryEntry,
} from "./types";

const HISTORY_CAP = 50;
const DEFAULT_DEBOUNCE_MS = 150;

function makeSnapshot(state: CrossFilterState, label: string): HistoryEntry {
  return {
    filters: new Map(state.filters),
    drillPath: [...state.drillPath],
    timestamp: Date.now(),
    label,
  };
}

function filterKey(entry: CrossFilterEntry): string {
  return `${entry.sourceId}:${entry.field}`;
}

export interface CreateCrossFilterStoreOptions {
  /** Debounce delay for filter propagation. @default 150 */
  debounceMs?: number;
  /** Max history entries. @default 50 */
  historyCap?: number;
  /** Initial cross-filter group. */
  groupId?: string;
}

export function createCrossFilterStore(
  options: CreateCrossFilterStoreOptions = {},
) {
  const {
    debounceMs = DEFAULT_DEBOUNCE_MS,
    historyCap = HISTORY_CAP,
    groupId = null,
  } = options;

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  return createStore<CrossFilterStore>()((set, get) => ({
    // State
    filters: new Map(),
    activeGroup: groupId,
    drillPath: [],
    past: [],
    future: [],
    bookmarks: new Map(),
    pendingQueryCount: 0,

    // Actions
    setFilter: (entry: CrossFilterEntry) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const state = get();
        const snapshot = makeSnapshot(state, `Filter: ${entry.field}=${String(entry.value)}`);
        const newFilters = new Map(state.filters);
        newFilters.set(filterKey(entry), entry);
        set({
          filters: newFilters,
          past: [...state.past.slice(-(historyCap - 1)), snapshot],
          future: [],
        });
      }, debounceMs);
    },

    removeFilter: (key: string) => {
      const state = get();
      if (!state.filters.has(key)) return;
      const snapshot = makeSnapshot(state, `Remove filter: ${key}`);
      const newFilters = new Map(state.filters);
      newFilters.delete(key);
      set({
        filters: newFilters,
        past: [...state.past.slice(-(historyCap - 1)), snapshot],
        future: [],
      });
    },

    clearAllFilters: () => {
      const state = get();
      if (state.filters.size === 0) return;
      const snapshot = makeSnapshot(state, "Clear all filters");
      set({
        filters: new Map(),
        past: [...state.past.slice(-(historyCap - 1)), snapshot],
        future: [],
      });
    },

    drillDown: (level: DrillLevel) => {
      const state = get();
      const snapshot = makeSnapshot(state, `Drill: ${level.field}=${String(level.value)}`);
      set({
        drillPath: [...state.drillPath, level],
        past: [...state.past.slice(-(historyCap - 1)), snapshot],
        future: [],
      });
    },

    drillUp: () => {
      const state = get();
      if (state.drillPath.length === 0) return;
      const snapshot = makeSnapshot(state, "Drill up");
      set({
        drillPath: state.drillPath.slice(0, -1),
        past: [...state.past.slice(-(historyCap - 1)), snapshot],
        future: [],
      });
    },

    drillToRoot: () => {
      const state = get();
      if (state.drillPath.length === 0) return;
      const snapshot = makeSnapshot(state, "Drill to root");
      set({
        drillPath: [],
        past: [...state.past.slice(-(historyCap - 1)), snapshot],
        future: [],
      });
    },

    drillTo: (index: number) => {
      const state = get();
      if (index < 0 || index >= state.drillPath.length) return;
      const snapshot = makeSnapshot(state, `Drill to level ${index}`);
      set({
        drillPath: state.drillPath.slice(0, index + 1),
        past: [...state.past.slice(-(historyCap - 1)), snapshot],
        future: [],
      });
    },

    undo: () => {
      const state = get();
      if (state.past.length === 0) return;
      const previous = state.past[state.past.length - 1];
      const currentSnapshot = makeSnapshot(state, "Before undo");
      set({
        filters: new Map(previous.filters),
        drillPath: [...previous.drillPath],
        past: state.past.slice(0, -1),
        future: [currentSnapshot, ...state.future],
      });
    },

    redo: () => {
      const state = get();
      if (state.future.length === 0) return;
      const next = state.future[0];
      const currentSnapshot = makeSnapshot(state, "Before redo");
      set({
        filters: new Map(next.filters),
        drillPath: [...next.drillPath],
        past: [...state.past, currentSnapshot],
        future: state.future.slice(1),
      });
    },

    saveBookmark: (id: string, name: string) => {
      const state = get();
      const newBookmarks = new Map(state.bookmarks);
      newBookmarks.set(id, {
        name,
        state: makeSnapshot(state, `Bookmark: ${name}`),
        createdAt: Date.now(),
      });
      set({ bookmarks: newBookmarks });
    },

    loadBookmark: (id: string) => {
      const state = get();
      const bookmark = state.bookmarks.get(id);
      if (!bookmark) return;
      const snapshot = makeSnapshot(state, `Load bookmark: ${bookmark.name}`);
      set({
        filters: new Map(bookmark.state.filters),
        drillPath: [...bookmark.state.drillPath],
        past: [...state.past.slice(-(historyCap - 1)), snapshot],
        future: [],
      });
    },

    deleteBookmark: (id: string) => {
      const state = get();
      if (!state.bookmarks.has(id)) return;
      const newBookmarks = new Map(state.bookmarks);
      newBookmarks.delete(id);
      set({ bookmarks: newBookmarks });
    },

    incrementPendingQuery: () => {
      set((s) => ({ pendingQueryCount: s.pendingQueryCount + 1 }));
    },

    decrementPendingQuery: () => {
      set((s) => ({ pendingQueryCount: Math.max(0, s.pendingQueryCount - 1) }));
    },
  }));
}

export type CrossFilterStoreApi = ReturnType<typeof createCrossFilterStore>;
