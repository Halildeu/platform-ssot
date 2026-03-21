import React, { useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridApi, GridReadyEvent, SideBarDef } from 'ag-grid-community';
import { cn, GridShell } from '@mfe/design-system';

export interface PivotGridProps<TRow> {
  gridId: string;
  columnDefs: ColDef<TRow>[];
  data: TRow[];
  pivotMode?: boolean;
  rowGroupCols?: string[];
  valueCols?: Array<{ field: string; aggFunc: 'sum' | 'avg' | 'count' | 'min' | 'max' }>;
  pivotCols?: string[];
  sideBar?: boolean | SideBarDef;
  defaultColDef?: ColDef;
  className?: string;
}

export function PivotGrid<TRow>({
  gridId,
  columnDefs,
  data,
  pivotMode = true,
  rowGroupCols = [],
  valueCols = [],
  pivotCols = [],
  sideBar = true,
  defaultColDef,
  className,
}: PivotGridProps<TRow>) {
  const gridApiRef = useRef<GridApi<TRow> | null>(null);

  const mergedDefaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      ...defaultColDef,
    }),
    [defaultColDef],
  );

  const enrichedColumnDefs = useMemo<ColDef<TRow>[]>(() => {
    return columnDefs.map((col) => {
      const field = col.field as string | undefined;
      if (!field) return col;

      const enriched: ColDef<TRow> = { ...col };

      if (rowGroupCols.includes(field)) {
        enriched.rowGroup = true;
        enriched.enableRowGroup = true;
      }

      if (pivotCols.includes(field)) {
        enriched.pivot = true;
        enriched.enablePivot = true;
      }

      const valueCol = valueCols.find((vc) => vc.field === field);
      if (valueCol) {
        enriched.aggFunc = valueCol.aggFunc;
        enriched.enableValue = true;
      }

      return enriched;
    });
  }, [columnDefs, rowGroupCols, valueCols, pivotCols]);

  const sideBarDef = useMemo<boolean | SideBarDef>(() => {
    if (typeof sideBar === 'object') return sideBar;
    if (sideBar) {
      return {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
          },
          {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
          },
        ],
        defaultToolPanel: 'columns',
      };
    }
    return false;
  }, [sideBar]);

  const handleGridReady = useCallback((event: GridReadyEvent<TRow>) => {
    gridApiRef.current = event.api;
  }, []);

  return (
    <GridShell columnDefs={enrichedColumnDefs} className={cn('ag-theme-alpine', className)}>
      <AgGridReact<TRow>
        gridId={gridId}
        columnDefs={enrichedColumnDefs}
        rowData={data}
        defaultColDef={mergedDefaultColDef}
        pivotMode={pivotMode}
        sideBar={sideBarDef}
        animateRows
        onGridReady={handleGridReady}
      />
    </GridShell>
  );
}
