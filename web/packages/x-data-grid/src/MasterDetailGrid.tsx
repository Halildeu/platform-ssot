import React, { useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridApi, GridReadyEvent, IDetailCellRendererParams, RowClickedEvent } from 'ag-grid-community';
import { cn, GridShell } from '@mfe/design-system';

export interface MasterDetailGridProps<TParent, TDetail> {
  gridId: string;
  parentColumnDefs: ColDef<TParent>[];
  detailColumnDefs: ColDef<TDetail>[];
  parentData: TParent[];
  getDetailRows: (parentRow: TParent) => TDetail[] | Promise<TDetail[]>;
  detailHeight?: number;
  defaultColDef?: ColDef;
  onParentRowClick?: (row: TParent) => void;
  onDetailRowClick?: (row: TDetail) => void;
  className?: string;
}

export function MasterDetailGrid<TParent, TDetail>({
  gridId,
  parentColumnDefs,
  detailColumnDefs,
  parentData,
  getDetailRows,
  detailHeight = 300,
  defaultColDef,
  onParentRowClick,
  onDetailRowClick,
  className,
}: MasterDetailGridProps<TParent, TDetail>) {
  const gridApiRef = useRef<GridApi<TParent> | null>(null);

  const mergedDefaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      ...defaultColDef,
    }),
    [defaultColDef],
  );

  const detailCellRendererParams = useMemo(
    () => ({
      detailGridOptions: {
        columnDefs: detailColumnDefs as ColDef[],
        defaultColDef: mergedDefaultColDef,
        onRowClicked: onDetailRowClick
          ? (event: RowClickedEvent<TDetail>) => {
              if (event.data) onDetailRowClick(event.data);
            }
          : undefined,
      },
      getDetailRowData: (params: IDetailCellRendererParams) => {
        const result = getDetailRows(params.data as TParent);
        if (result instanceof Promise) {
          result
            .then((rows) => params.successCallback(rows))
            .catch((error) => {
              console.error('[X-Data-Grid] MasterDetailGrid detail fetch error:', error);
              params.successCallback([]);
            });
        } else {
          params.successCallback(result);
        }
      },
    }),
    [detailColumnDefs, mergedDefaultColDef, getDetailRows, onDetailRowClick],
  );

  const handleGridReady = useCallback((event: GridReadyEvent<TParent>) => {
    gridApiRef.current = event.api;
  }, []);

  const handleRowClicked = useCallback(
    (event: RowClickedEvent<TParent>) => {
      if (onParentRowClick && event.data) {
        onParentRowClick(event.data);
      }
    },
    [onParentRowClick],
  );

  return (
    <GridShell className={cn('ag-theme-alpine', className)}>
      <AgGridReact<TParent>
        gridId={gridId}
        columnDefs={parentColumnDefs}
        rowData={parentData}
        defaultColDef={mergedDefaultColDef}
        masterDetail
        detailRowHeight={detailHeight}
        detailCellRendererParams={detailCellRendererParams}
        animateRows
        onGridReady={handleGridReady}
        onRowClicked={handleRowClicked}
      />
    </GridShell>
  );
}
