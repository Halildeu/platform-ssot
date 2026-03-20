/**
 * AgGridServer — Server-side AG Grid wrapper.
 *
 * Thin wrapper over GridShell configured for SSRM with a getData callback.
 * Automatically creates and attaches a server-side datasource from the
 * provided getData function.
 *
 * AG Grid v34.3.1 compatible.
 */
import React, { useCallback, useMemo } from "react";
import type {
  ColDef as AgColDef,
  ColGroupDef as AgColGroupDef,
  GridOptions as AgGridOptions,
  GridApi,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from "ag-grid-community";

import { GridShell, type GridDensity, type GridTheme } from "./GridShell";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ColDef = AgColDef<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ColGroupDef = AgColGroupDef<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GridOptions = AgGridOptions<any>;

export type ServerSideDataRequest = {
  startRow: number;
  endRow: number;
  sortModel?: { colId: string; sort: string }[];
  filterModel?: Record<string, unknown>;
};

export type ServerSideDataResult = {
  rows: unknown[];
  total?: number;
};

export type FetchServerSideData = (
  request: ServerSideDataRequest,
) => Promise<ServerSideDataResult>;

export interface AgGridServerMessages {
  loadingLabel?: string;
  noRowsLabel?: string;
}

export interface AgGridServerProps {
  /** Column definitions */
  columnDefs: (ColDef | ColGroupDef)[];
  /** Default column definition */
  defaultColDef?: ColDef;
  /** Container className */
  className?: string;
  /** Container height */
  height?: number | string;
  /** Server-side data fetching function */
  getData: FetchServerSideData;
  /** Additional AG Grid options */
  gridOptions?: GridOptions;
  /** i18n messages */
  messages?: AgGridServerMessages;
  /** Theme */
  theme?: GridTheme;
  /** Density */
  density?: GridDensity;
  /** Block cache size (default: 100) */
  cacheBlockSize?: number;
  /** Max blocks in cache (default: 10) */
  maxBlocksInCache?: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const AgGridServer: React.FC<AgGridServerProps> = ({
  columnDefs,
  defaultColDef,
  className,
  height = 600,
  getData,
  gridOptions,
  messages,
  theme = "quartz",
  density = "comfortable",
  cacheBlockSize = 100,
  maxBlocksInCache = 10,
}) => {
  // Create SSRM datasource from getData callback
  const handleGridReady = useCallback(
    (event: { api: GridApi }) => {
      const datasource: IServerSideDatasource = {
        getRows: async (params: IServerSideGetRowsParams) => {
          try {
            const result = await getData({
              startRow: params.request.startRow ?? 0,
              endRow: params.request.endRow ?? cacheBlockSize,
              sortModel: params.request.sortModel as ServerSideDataRequest["sortModel"],
              filterModel: params.request.filterModel as Record<string, unknown>,
            });
            params.success({
              rowData: result.rows,
              rowCount: result.total,
            });
          } catch {
            params.fail();
          }
        },
      };

      // v34: use setGridOption for datasource attachment
      event.api.setGridOption?.("serverSideDatasource", datasource);
      event.api.setGridOption?.("cacheBlockSize", cacheBlockSize);
      (event.api.setGridOption as any)?.("maxBlocksInCache", maxBlocksInCache);
    },
    [getData, cacheBlockSize, maxBlocksInCache],
  );

  const mergedGridOptions = useMemo<GridOptions>(
    () => ({
      ...gridOptions,
    }),
    [gridOptions],
  );

  return (
    <GridShell
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      gridOptions={mergedGridOptions}
      rowModelType="serverSide"
      theme={theme}
      density={density}
      height={height}
      className={className}
      onGridReady={handleGridReady}
      overlayLoadingTemplate={messages?.loadingLabel}
      overlayNoRowsTemplate={messages?.noRowsLabel}
      data-component="ag-grid-server"
    />
  );
};

export default AgGridServer;
