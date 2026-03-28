import { useState, useCallback, useRef, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/*  Dashboard Composition Hook                                        */
/*  KPI + Chart + Grid + Kanban on the same page with shared state.   */
/* ------------------------------------------------------------------ */

export interface DateRange {
  start: Date;
  end: Date;
}

export interface UseDashboardCompositionOptions {
  /** Initial global filters */
  initialFilters?: Record<string, unknown>;
  /** Initial date range */
  initialDateRange?: DateRange;
}

export interface UseDashboardCompositionReturn {
  /** Global filters that apply to all widgets */
  filters: Record<string, unknown>;
  /** Set a single filter key/value */
  setFilter: (key: string, value: unknown) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Shared date range across widgets */
  dateRange: DateRange;
  /** Update the shared date range */
  setDateRange: (start: Date, end: Date) => void;
  /** Trigger refresh on all registered widgets */
  refreshAll: () => void;
  /** Timestamp of last global refresh */
  lastRefreshed: Date;
  /** Register a widget's refresh callback */
  registerWidget: (id: string, refresh: () => void) => void;
  /** Unregister a widget when it unmounts */
  unregisterWidget: (id: string) => void;
  /** Count of currently registered widgets */
  widgetCount: number;
}

function defaultDateRange(): DateRange {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { start: thirtyDaysAgo, end: now };
}

/**
 * Orchestrates a multi-widget dashboard with shared filters, date range,
 * and coordinated refresh.
 *
 * ```tsx
 * const dashboard = useDashboardComposition();
 * // Each widget calls registerWidget on mount, unregisterWidget on unmount
 * // Filters and dateRange flow down to all widgets
 * ```
 */
export function useDashboardComposition(
  options: UseDashboardCompositionOptions = {},
): UseDashboardCompositionReturn {
  const { initialFilters = {}, initialDateRange } = options;

  const [filters, setFilters] = useState<Record<string, unknown>>(initialFilters);
  const [dateRange, setDateRangeState] = useState<DateRange>(
    initialDateRange ?? defaultDateRange(),
  );
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [widgetCount, setWidgetCount] = useState(0);

  // Widgets registry (ref to avoid re-renders on registration)
  const widgetsRef = useRef<Map<string, () => void>>(new Map());

  const setFilter = useCallback((key: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const setDateRange = useCallback((start: Date, end: Date) => {
    setDateRangeState({ start, end });
  }, []);

  const refreshAll = useCallback(() => {
    widgetsRef.current.forEach((refresh) => {
      try {
        refresh();
      } catch {
        // Swallow widget-level errors during bulk refresh
      }
    });
    setLastRefreshed(new Date());
  }, []);

  const registerWidget = useCallback((id: string, refresh: () => void) => {
    widgetsRef.current.set(id, refresh);
    setWidgetCount(widgetsRef.current.size);
  }, []);

  const unregisterWidget = useCallback((id: string) => {
    widgetsRef.current.delete(id);
    setWidgetCount(widgetsRef.current.size);
  }, []);

  return useMemo(
    () => ({
      filters,
      setFilter,
      clearFilters,
      dateRange,
      setDateRange,
      refreshAll,
      lastRefreshed,
      registerWidget,
      unregisterWidget,
      widgetCount,
    }),
    [
      filters,
      setFilter,
      clearFilters,
      dateRange,
      setDateRange,
      refreshAll,
      lastRefreshed,
      registerWidget,
      unregisterWidget,
      widgetCount,
    ],
  );
}
