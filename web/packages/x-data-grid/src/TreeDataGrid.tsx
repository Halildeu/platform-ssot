import React, { useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GetDataPath, GridApi, GridReadyEvent } from 'ag-grid-community';
import { cn, GridShell } from '@mfe/design-system';

export interface TreeDataGridProps<TRow> {
  gridId: string;
  columnDefs: ColDef<TRow>[];
  data: TRow[];
  getDataPath: (row: TRow) => string[];
  autoGroupColumnDef?: ColDef<TRow>;
  groupDefaultExpanded?: number;
  defaultColDef?: ColDef;
  className?: string;
}

export function TreeDataGrid<TRow>({
  gridId,
  columnDefs,
  data,
  getDataPath,
  autoGroupColumnDef,
  groupDefaultExpanded = -1,
  defaultColDef,
  className,
}: TreeDataGridProps<TRow>) {
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

  const mergedAutoGroupColumnDef = useMemo<ColDef<TRow>>(
    () => ({
      headerName: 'Group',
      minWidth: 250,
      cellRendererParams: {
        suppressCount: false,
      },
      ...autoGroupColumnDef,
    }),
    [autoGroupColumnDef],
  );

  const handleGridReady = useCallback((event: GridReadyEvent<TRow>) => {
    gridApiRef.current = event.api;
  }, []);

  return (
    <GridShell columnDefs={columnDefs} className={cn('ag-theme-alpine text-text-primary', className)}>
      <AgGridReact<TRow>
        gridId={gridId}
        columnDefs={columnDefs}
        rowData={data}
        defaultColDef={mergedDefaultColDef}
        treeData
        getDataPath={getDataPath as GetDataPath<TRow>}
        autoGroupColumnDef={mergedAutoGroupColumnDef}
        groupDefaultExpanded={groupDefaultExpanded}
        animateRows
        onGridReady={handleGridReady}
      />
    </GridShell>
  );
}
