/**
 * useCrossFilterStore — React hook + Context provider for cross-filter store
 *
 * Allows multiple dashboard instances to have isolated stores via Context.
 * Components use `useCrossFilter(selector)` for surgical re-renders.
 */
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import {
  createCrossFilterStore,
  type CrossFilterStoreApi,
  type CreateCrossFilterStoreOptions,
} from "./createCrossFilterStore";
import type { CrossFilterStore } from "./types";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const CrossFilterContext = createContext<CrossFilterStoreApi | null>(null);

export interface CrossFilterProviderProps {
  children: React.ReactNode;
  options?: CreateCrossFilterStoreOptions;
}

/**
 * Provides an isolated cross-filter store to a dashboard subtree.
 *
 * @example
 * ```tsx
 * <CrossFilterProvider options={{ groupId: "sales-dashboard" }}>
 *   <BarChart ... />
 *   <PieChart ... />
 * </CrossFilterProvider>
 * ```
 */
export function CrossFilterProvider({ children, options }: CrossFilterProviderProps) {
  const storeRef = useRef<CrossFilterStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createCrossFilterStore(options);
  }

  return (
    <CrossFilterContext.Provider value={storeRef.current}>
      {children}
    </CrossFilterContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

/**
 * Access the cross-filter store from within a CrossFilterProvider.
 *
 * @example
 * ```tsx
 * const filterCount = useCrossFilter((s) => s.filters.size);
 * const canUndo = useCrossFilter((s) => s.past.length > 0);
 * const setFilter = useCrossFilter((s) => s.setFilter);
 * ```
 */
export function useCrossFilter<T>(
  selector: (state: CrossFilterStore) => T,
  equalityFn?: (a: T, b: T) => boolean,
): T {
  const store = useContext(CrossFilterContext);
  if (!store) {
    throw new Error("useCrossFilter must be used within a <CrossFilterProvider>");
  }
  return useStore(store, selector, equalityFn);
}

/**
 * Access the raw store API (for event bridge creation or imperative access).
 */
export function useCrossFilterStoreApi(): CrossFilterStoreApi {
  const store = useContext(CrossFilterContext);
  if (!store) {
    throw new Error("useCrossFilterStoreApi must be used within a <CrossFilterProvider>");
  }
  return store;
}
