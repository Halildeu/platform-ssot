import { useState, useCallback, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/*  Grid -> Chart Drill-down Composition Hook                         */
/*  Clicking a grid row filters/highlights a chart.                   */
/* ------------------------------------------------------------------ */

export interface UseGridChartDrilldownReturn<TRow> {
  /** Currently selected row (null when nothing selected) */
  selectedRow: TRow | null;
  /** Derived filter object from the selected row */
  chartFilter: Record<string, unknown> | null;
  /** Spread on grid's onRowClicked / onRowClick handler */
  onRowClick: (row: TRow) => void;
  /** Filter an external data array using the active chart filter */
  filterData: <T>(data: T[], filterKey: keyof T & string) => T[];
  /** Clear the current selection and filter */
  clearSelection: () => void;
}

export interface UseGridChartDrilldownOptions<TRow> {
  /** Key(s) to extract from the row into the chart filter */
  filterKeys?: (keyof TRow & string)[];
  /** Optional transform before the filter is applied */
  transformFilter?: (row: TRow) => Record<string, unknown>;
  /** Toggle-style: clicking the same row deselects */
  toggleSelect?: boolean;
}

/**
 * Connects a data-grid row selection to chart data filtering.
 *
 * ```tsx
 * const { onRowClick, filterData, clearSelection } = useGridChartDrilldown<Sale>({
 *   filterKeys: ['region'],
 * });
 * // Spread onRowClick on the grid, use filterData to narrow chart data
 * ```
 */
export function useGridChartDrilldown<TRow extends Record<string, unknown>>(
  options: UseGridChartDrilldownOptions<TRow> = {},
): UseGridChartDrilldownReturn<TRow> {
  const { filterKeys, transformFilter, toggleSelect = true } = options;

  const [selectedRow, setSelectedRow] = useState<TRow | null>(null);

  const chartFilter = useMemo<Record<string, unknown> | null>(() => {
    if (!selectedRow) return null;
    if (transformFilter) return transformFilter(selectedRow);
    if (filterKeys && filterKeys.length > 0) {
      const filter: Record<string, unknown> = {};
      for (const key of filterKeys) {
        filter[key] = selectedRow[key];
      }
      return filter;
    }
    // Default: use entire row as filter
    return { ...selectedRow };
  }, [selectedRow, filterKeys, transformFilter]);

  const onRowClick = useCallback(
    (row: TRow) => {
      setSelectedRow((prev) => {
        if (toggleSelect && prev && JSON.stringify(prev) === JSON.stringify(row)) {
          return null;
        }
        return row;
      });
    },
    [toggleSelect],
  );

  const filterData = useCallback(
    <T,>(data: T[], filterKey: keyof T & string): T[] => {
      if (!chartFilter) return data;
      const filterValue = chartFilter[filterKey as string];
      if (filterValue === undefined) return data;
      return data.filter((item) => item[filterKey] === filterValue);
    },
    [chartFilter],
  );

  const clearSelection = useCallback(() => {
    setSelectedRow(null);
  }, []);

  return {
    selectedRow,
    chartFilter,
    onRowClick,
    filterData,
    clearSelection,
  };
}
