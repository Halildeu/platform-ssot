/**
 * useChartCrossFilter — Hook for chart components to participate in cross-filtering
 *
 * On chart click, pushes filter to store. Subscribes via event bridge
 * to receive filters from other charts. Imperative store access to avoid
 * re-render loops from multiple zustand selectors.
 *
 * @see D-006 (cross-filter bus)
 */
import { useCallback, useRef, useEffect, useState } from "react";
import { useCrossFilterStoreApi } from "./useCrossFilterStore";
import { createEventBridge } from "./eventBridge";
import type { CrossFilterEntry, FilterOperator } from "./types";

export interface UseChartCrossFilterOptions {
  /** This chart's unique ID. */
  chartId: string;
  /** Fields this chart emits on click. */
  emitFields?: string[];
  /** Whether cross-filter is enabled. @default true */
  enabled?: boolean;
}

export interface UseChartCrossFilterReturn {
  /** Filters from other charts that this chart should apply. */
  activeFilters: CrossFilterEntry[];
  /** Call this on chart click to emit a cross-filter. */
  onChartClick: (datum: Record<string, unknown>) => void;
  /** Whether this chart is currently filtering (has active incoming filters). */
  isFiltered: boolean;
  /** Count of active incoming filters. */
  filterCount: number;
  /** Clear this chart's own emitted filter. */
  clearOwnFilter: () => void;
}

export function useChartCrossFilter(
  options: UseChartCrossFilterOptions,
): UseChartCrossFilterReturn {
  const { chartId, emitFields = [], enabled = true } = options;
  const storeApi = useCrossFilterStoreApi();
  const [activeFilters, setActiveFilters] = useState<CrossFilterEntry[]>([]);

  // Subscribe via event bridge to avoid zustand selector re-render loops
  useEffect(() => {
    const bridge = createEventBridge(storeApi);

    const updateFilters = () => {
      const filters = storeApi.getState().filters;
      const applicable: CrossFilterEntry[] = [];
      for (const entry of filters.values()) {
        if (entry.sourceId !== chartId) applicable.push(entry);
      }
      setActiveFilters(applicable);
    };

    // Initial state
    updateFilters();

    bridge.on(() => updateFilters());

    return () => bridge.destroy();
  }, [storeApi, chartId]);

  const onChartClick = useCallback(
    (datum: Record<string, unknown>) => {
      if (!enabled || emitFields.length === 0) return;

      for (const field of emitFields) {
        const value = datum[field];
        if (value === undefined) continue;

        const operator: FilterOperator = Array.isArray(value) ? "in" : "eq";
        storeApi.getState().setFilter({
          sourceId: chartId,
          field,
          value,
          operator,
          createdAt: Date.now(),
        });
      }
    },
    [chartId, emitFields, enabled, storeApi],
  );

  const clearOwnFilter = useCallback(() => {
    for (const field of emitFields) {
      storeApi.getState().removeFilter(`${chartId}:${field}`);
    }
  }, [chartId, emitFields, storeApi]);

  return {
    activeFilters,
    onChartClick,
    isFiltered: activeFilters.length > 0,
    filterCount: activeFilters.length,
    clearOwnFilter,
  };
}
