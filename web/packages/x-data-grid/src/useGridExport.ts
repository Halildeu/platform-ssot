import { useCallback, useMemo } from 'react';
import type { CsvExportParams, ExcelExportParams, GridApi } from 'ag-grid-community';

export interface ExcelExportOptions extends ExcelExportParams {
  /** Custom file name without extension */
  fileName?: string;
}

export interface CsvExportOptions extends CsvExportParams {
  /** Custom file name without extension */
  fileName?: string;
}

export function useGridExport<TRow>(gridApi: GridApi<TRow> | null) {
  const exportExcel = useCallback(
    (options?: ExcelExportOptions) => {
      if (!gridApi) {
        console.warn('[X-Data-Grid] useGridExport: gridApi is not available');
        return;
      }
      gridApi.exportDataAsExcel({
        fileName: options?.fileName ?? 'export',
        ...options,
      });
    },
    [gridApi],
  );

  const exportCsv = useCallback(
    (options?: CsvExportOptions) => {
      if (!gridApi) {
        console.warn('[X-Data-Grid] useGridExport: gridApi is not available');
        return;
      }
      gridApi.exportDataAsCsv({
        fileName: options?.fileName ?? 'export',
        ...options,
      });
    },
    [gridApi],
  );

  const exportVisibleExcel = useCallback(() => {
    if (!gridApi) return;
    gridApi.exportDataAsExcel({
      fileName: 'export-visible',
      onlySelected: false,
      exportedRows: 'filteredAndSorted',
    });
  }, [gridApi]);

  const exportVisibleCsv = useCallback(() => {
    if (!gridApi) return;
    gridApi.exportDataAsCsv({
      fileName: 'export-visible',
      exportedRows: 'filteredAndSorted',
    });
  }, [gridApi]);

  const exportAllExcel = useCallback(() => {
    if (!gridApi) return;
    gridApi.exportDataAsExcel({
      fileName: 'export-all',
      allColumns: true,
    });
  }, [gridApi]);

  const exportAllCsv = useCallback(() => {
    if (!gridApi) return;
    gridApi.exportDataAsCsv({
      fileName: 'export-all',
      allColumns: true,
    });
  }, [gridApi]);

  return useMemo(
    () => ({
      exportExcel,
      exportCsv,
      exportVisibleExcel,
      exportVisibleCsv,
      exportAllExcel,
      exportAllCsv,
    }),
    [exportExcel, exportCsv, exportVisibleExcel, exportVisibleCsv, exportAllExcel, exportAllCsv],
  );
}
