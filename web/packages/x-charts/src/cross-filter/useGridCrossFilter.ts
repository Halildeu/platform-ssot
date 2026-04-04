/**
 * useGridCrossFilter — Hook for AG Grid integration with cross-filter bus
 *
 * Subscribes to store via event bridge. On filter change from charts,
 * calls gridApi methods. When grid filter changes, pushes back to store.
 *
 * @see D-006 (cross-filter bus)
 */
import { useEffect, useCallback, useRef } from "react";
import { useCrossFilterStoreApi } from "./useCrossFilterStore";
import { createEventBridge } from "./eventBridge";
import type { CrossFilterEntry, CrossFilterBridge } from "./types";

export interface GridApi {
  setFilterModel: (model: Record<string, unknown>) => void;
  refreshServerSide: (params?: { purge?: boolean }) => void;
  getFilterModel: () => Record<string, unknown>;
}

export interface UseGridCrossFilterOptions {
  /** Unique grid ID for the cross-filter store. */
  gridId: string;
  /** AG Grid API ref. Null until grid is ready. */
  gridApi: GridApi | null;
  /** Whether to automatically push grid filter changes to the store. @default true */
  syncGridToStore?: boolean;
  /** Whether to automatically apply store filters to the grid. @default true */
  syncStoreToGrid?: boolean;
}

export interface UseGridCrossFilterReturn {
  /** Filters from charts that apply to this grid. */
  activeFilters: CrossFilterEntry[];
  /** Manually push current grid filter model to the store. */
  pushGridFilters: () => void;
  /** Bridge instance for direct imperative access (AG Grid datasource). */
  bridge: CrossFilterBridge | null;
}

/**
 * Converts CrossFilterEntry[] to AG Grid FilterModel format.
 */
function toGridFilterModel(
  filters: CrossFilterEntry[],
): Record<string, unknown> {
  const model: Record<string, unknown> = {};
  for (const f of filters) {
    if (f.operator === "eq") {
      model[f.field] = { filterType: "text", type: "equals", filter: f.value };
    } else if (f.operator === "in") {
      model[f.field] = {
        filterType: "set",
        values: Array.isArray(f.value) ? f.value : [f.value],
      };
    } else if (f.operator === "range") {
      const range = f.value as { min: number; max: number };
      model[f.field] = {
        filterType: "number",
        type: "inRange",
        filter: range.min,
        filterTo: range.max,
      };
    }
  }
  return model;
}

export function useGridCrossFilter(
  options: UseGridCrossFilterOptions,
): UseGridCrossFilterReturn {
  const {
    gridId,
    gridApi,
    syncGridToStore = true,
    syncStoreToGrid = true,
  } = options;

  const storeApi = useCrossFilterStoreApi();
  const bridgeRef = useRef<CrossFilterBridge | null>(null);

  const filtersRef = useRef<CrossFilterEntry[]>([]);

  // Create bridge + subscribe to filter changes
  useEffect(() => {
    const bridge = createEventBridge(storeApi);
    bridgeRef.current = bridge;

    bridge.on((event) => {
      // Compute filters for this grid (exclude own)
      const allFilters = event.payload.filters;
      const applicable: CrossFilterEntry[] = [];
      for (const entry of allFilters.values()) {
        if (entry.sourceId !== gridId) applicable.push(entry);
      }
      filtersRef.current = applicable;

      // Apply to grid if sync enabled
      if (syncStoreToGrid && gridApi) {
        const model = toGridFilterModel(applicable);
        gridApi.setFilterModel(model);
        gridApi.refreshServerSide({ purge: true });
      }
    });

    return () => {
      bridge.destroy();
      bridgeRef.current = null;
    };
  }, [storeApi, gridId, gridApi, syncStoreToGrid]);

  // Push grid filter changes to store (imperative — no useCrossFilter needed)
  const pushGridFilters = useCallback(() => {
    if (!gridApi || !syncGridToStore) return;
    const model = gridApi.getFilterModel();
    const store = storeApi.getState();
    for (const [field, config] of Object.entries(model)) {
      const filterConfig = config as Record<string, unknown>;
      store.setFilter({
        sourceId: gridId,
        field,
        value: filterConfig.filter ?? filterConfig.values,
        operator: filterConfig.filterType === "set" ? "in" : "eq",
        createdAt: Date.now(),
      });
    }
  }, [gridApi, gridId, syncGridToStore, storeApi]);

  return {
    activeFilters: filtersRef.current,
    pushGridFilters,
    bridge: bridgeRef.current,
  };
}
