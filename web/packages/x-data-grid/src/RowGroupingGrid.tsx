import React, { useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridApi, GridReadyEvent, IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';
import { cn, GridShell } from '@mfe/design-system';

export interface RowGroupingGridProps<TRow> {
  gridId: string;
  columnDefs: ColDef<TRow>[];
  fetchRows: (params: {
    groupKeys: string[];
    startRow: number;
    endRow: number;
    sortModel: Array<{ colId: string; sort: 'asc' | 'desc' }>;
    filterModel: Record<string, unknown>;
  }) => Promise<{ rows: TRow[]; lastRow: number }>;
  rowGroupCols: string[];
  defaultColDef?: ColDef;
  cacheBlockSize?: number;
  className?: string;
}

export function RowGroupingGrid<TRow>({
  gridId,
  columnDefs,
  fetchRows,
  rowGroupCols,
  defaultColDef,
  cacheBlockSize = 100,
  className,
}: RowGroupingGridProps<TRow>) {
  const gridApiRef = useRef<GridApi<TRow> | null>(null);

  const mergedDefaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      ...defaultColDef,
    }),
    [defaultColDef],
  );

  const enrichedColumnDefs = useMemo<ColDef<TRow>[]>(() => {
    return columnDefs.map((col) => {
      const field = col.field as string | undefined;
      if (!field) return col;

      if (rowGroupCols.includes(field)) {
        return {
          ...col,
          rowGroup: true,
          enableRowGroup: true,
          hide: true,
        };
      }

      return col;
    });
  }, [columnDefs, rowGroupCols]);

  const serverSideDatasource = useMemo<IServerSideDatasource>(
    () => ({
      getRows(params: IServerSideGetRowsParams) {
        const { startRow = 0, endRow = cacheBlockSize, sortModel = [], filterModel = {}, groupKeys = [] } = params.request;

        fetchRows({
          groupKeys: groupKeys as string[],
          startRow,
          endRow,
          sortModel: sortModel as Array<{ colId: string; sort: 'asc' | 'desc' }>,
          filterModel: filterModel as Record<string, unknown>,
        })
          .then(({ rows, lastRow }) => {
            params.success({ rowData: rows, rowCount: lastRow });
          })
          .catch((error) => {
            console.error('[X-Data-Grid] RowGroupingGrid fetch error:', error);
            params.fail();
          });
      },
    }),
    [fetchRows, cacheBlockSize],
  );

  const autoGroupColumnDef = useMemo<ColDef>(
    () => ({
      headerName: 'Group',
      minWidth: 250,
      cellRendererParams: {
        suppressCount: false,
      },
    }),
    [],
  );

  const handleGridReady = useCallback((event: GridReadyEvent<TRow>) => {
    gridApiRef.current = event.api;
  }, []);

  return (
    <GridShell columnDefs={enrichedColumnDefs} className={cn('ag-theme-alpine', className)}>
      <AgGridReact<TRow>
        gridId={gridId}
        columnDefs={enrichedColumnDefs}
        defaultColDef={mergedDefaultColDef}
        rowModelType="serverSide"
        serverSideDatasource={serverSideDatasource}
        autoGroupColumnDef={autoGroupColumnDef}
        cacheBlockSize={cacheBlockSize}
        animateRows
        onGridReady={handleGridReady}
      />
    </GridShell>
  );
}
