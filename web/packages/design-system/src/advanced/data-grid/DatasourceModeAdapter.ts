/**
 * DatasourceModeAdapter — Server-side vs client-side branching.
 *
 * Responsibilities:
 * - SSRM datasource factory invocation and grid attachment
 * - Block caching configuration
 * - Mode transition handling (server→client→server)
 * - getRowId resolution for server mode
 *
 * v34 API notes:
 * - setGridOption('serverSideDatasource', ds) replaces old setServerSideDatasource()
 * - createServerSideDatasource receives only { gridApi } (no columnApi)
 * - rowModelType set on AgGridReact, not at runtime
 */
import { useCallback, useEffect, useRef } from "react";
import type { GridApi, IServerSideDatasource, GetRowIdParams } from "ag-grid-community";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type DataSourceMode = "server" | "client";

export type CreateServerSideDatasource<RowData = unknown> = (params: {
  gridApi: GridApi<RowData>;
}) => IServerSideDatasource | null | undefined;

export interface DatasourceModeAdapterOptions<RowData = unknown> {
  /** Current datasource mode */
  mode: DataSourceMode;
  /** Reference to current GridApi */
  gridApi: GridApi<RowData> | null;
  /** Factory for creating SSRM datasource */
  createServerSideDatasource?: CreateServerSideDatasource<RowData>;
  /** Custom getRowId for SSRM (required for partial refresh) */
  getRowId?: (params: GetRowIdParams<RowData>) => string;
  /** SSRM block cache size (default: 100) */
  cacheBlockSize?: number;
  /** Max blocks in cache (default: 10) */
  maxBlocksInCache?: number;
  /** Callback when effective mode changes */
  onEffectiveModeChange?: (mode: DataSourceMode) => void;
}

export interface DatasourceModeAdapterResult {
  /** The rowModelType to pass to AgGridReact */
  rowModelType: "clientSide" | "serverSide";
  /** Attach datasource (call from onGridReady) */
  attachDatasource: (api: GridApi) => void;
  /** Detach datasource (call when switching to client mode) */
  detachDatasource: () => void;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export const useDatasourceModeAdapter = <RowData = unknown>(
  options: DatasourceModeAdapterOptions<RowData>,
): DatasourceModeAdapterResult => {
  const {
    mode,
    gridApi,
    createServerSideDatasource,
    cacheBlockSize = 100,
    maxBlocksInCache = 10,
    onEffectiveModeChange,
  } = options;

  const isServerMode = mode === "server";
  const datasourceRef = useRef<IServerSideDatasource | null>(null);
  const attachedRef = useRef(false);

  const attachDatasource = useCallback(
    (api: GridApi) => {
      if (!isServerMode || !createServerSideDatasource) return;

      const ds = createServerSideDatasource({ gridApi: api as GridApi<RowData> });
      if (!ds) return;

      datasourceRef.current = ds;
      attachedRef.current = true;

      // v34: use setGridOption for datasource attachment
      api.setGridOption?.("serverSideDatasource", ds);
      api.setGridOption?.("cacheBlockSize", cacheBlockSize);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- AG Grid v34 typing gap
      (api.setGridOption as any)?.("maxBlocksInCache", maxBlocksInCache);
    },
    [isServerMode, createServerSideDatasource, cacheBlockSize, maxBlocksInCache],
  );

  const detachDatasource = useCallback(() => {
    datasourceRef.current = null;
    attachedRef.current = false;
  }, []);

  // Re-attach datasource when mode switches to server after initial mount
  useEffect(() => {
    if (!gridApi) return;

    if (isServerMode && !attachedRef.current && createServerSideDatasource) {
      attachDatasource(gridApi as GridApi);
    } else if (!isServerMode && attachedRef.current) {
      detachDatasource();
    }

    onEffectiveModeChange?.(mode);
  }, [isServerMode, gridApi, createServerSideDatasource, attachDatasource, detachDatasource, mode, onEffectiveModeChange]);

  return {
    rowModelType: isServerMode ? "serverSide" : "clientSide",
    attachDatasource,
    detachDatasource,
  };
};

export default useDatasourceModeAdapter;
