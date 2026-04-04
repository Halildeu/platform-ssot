/**
 * useChartGridLink — React hook for chart ↔ grid deep linking
 *
 * Connects a GridAdapter to a chart component via the cross-filter
 * bus. Handles:
 *   - Chart click → grid filter
 *   - Grid selection → chart highlight
 *   - Grid filter → chart update
 *   - Column → encoding auto-mapping
 *
 * @see contract P4 DoD
 */

import { useEffect, useCallback, useMemo, useRef } from 'react';
import type {
  GridAdapter,
  GridFilterEntry,
  GridSelectionEvent,
  ChartGridLinkConfig,
  ColumnChartMapping,
  GridColumnDef,
} from './types';

export interface ChartGridLinkState {
  /** Active grid filters (from grid → chart direction) */
  gridFilters: GridFilterEntry[];
  /** Selected row IDs from grid (for chart highlighting) */
  selectedRowIds: string[];
  /** Auto-mapped chart encoding from grid columns */
  chartEncoding: Record<string, string>;
  /** Push a chart click filter to the grid */
  pushChartFilter: (field: string, value: unknown) => void;
  /** Clear all chart-originated filters from the grid */
  clearChartFilters: () => void;
  /** Highlight chart data points matching row IDs */
  highlightFromGrid: string[];
}

/**
 * Auto-map grid columns to chart encoding channels.
 * Rules:
 *   - First string column → x (label)
 *   - First number column → y (value)
 *   - Second number column → size
 *   - Remaining string columns → color/label
 */
export function autoMapColumns(
  columns: GridColumnDef[],
  overrides?: ColumnChartMapping[],
): Record<string, string> {
  const mapping: Record<string, string> = {};

  // Apply overrides first
  if (overrides) {
    for (const o of overrides) {
      mapping[o.chartChannel] = o.gridField;
    }
  }

  // Auto-fill unmapped channels
  const strings = columns.filter((c) => c.type === 'string');
  const numbers = columns.filter((c) => c.type === 'number');

  if (!mapping.x && strings.length > 0) mapping.x = strings[0].field;
  if (!mapping.y && numbers.length > 0) mapping.y = numbers[0].field;
  if (!mapping.size && numbers.length > 1) mapping.size = numbers[1].field;
  if (!mapping.color && strings.length > 1) mapping.color = strings[1].field;
  if (!mapping.label && strings.length > 0) mapping.label = strings[0].field;

  return mapping;
}

export function useChartGridLink(config: ChartGridLinkConfig): ChartGridLinkState {
  const {
    gridAdapter,
    chartId,
    columnMapping = [],
    chartClickFiltersGrid = true,
    gridSelectionHighlightsChart = true,
    rowIdField = 'id',
  } = config;

  const gridFiltersRef = useRef<GridFilterEntry[]>([]);
  const selectedRowIdsRef = useRef<string[]>([]);
  const chartFiltersRef = useRef<GridFilterEntry[]>([]);

  // Auto-map columns
  const chartEncoding = useMemo(() => {
    const cols = gridAdapter.getColumnDefs();
    return autoMapColumns(cols, columnMapping);
  }, [gridAdapter, columnMapping]);

  // Listen to grid filter changes
  useEffect(() => {
    const unsub = gridAdapter.onFilterChange((filters) => {
      gridFiltersRef.current = filters;
    });
    return unsub;
  }, [gridAdapter]);

  // Listen to grid selection changes
  useEffect(() => {
    if (!gridSelectionHighlightsChart) return;

    const unsub = gridAdapter.onSelectionChange((event: GridSelectionEvent) => {
      selectedRowIdsRef.current = event.selectedRowIds;
    });
    return unsub;
  }, [gridAdapter, gridSelectionHighlightsChart]);

  // Push chart click filter to grid
  const pushChartFilter = useCallback(
    (field: string, value: unknown) => {
      if (!chartClickFiltersGrid) return;
      const filter: GridFilterEntry = { field, operator: 'eq', value };
      chartFiltersRef.current = [...chartFiltersRef.current, filter];
      gridAdapter.applyExternalFilter(chartFiltersRef.current);
    },
    [gridAdapter, chartClickFiltersGrid],
  );

  // Clear chart filters from grid
  const clearChartFilters = useCallback(() => {
    chartFiltersRef.current = [];
    gridAdapter.applyExternalFilter([]);
  }, [gridAdapter]);

  return {
    gridFilters: gridFiltersRef.current,
    selectedRowIds: selectedRowIdsRef.current,
    chartEncoding,
    pushChartFilter,
    clearChartFilters,
    highlightFromGrid: selectedRowIdsRef.current,
  };
}
