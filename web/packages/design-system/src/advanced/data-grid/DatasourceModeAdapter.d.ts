import type { GridApi, IServerSideDatasource, GetRowIdParams } from "ag-grid-community";
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
export declare const useDatasourceModeAdapter: <RowData = unknown>(options: DatasourceModeAdapterOptions<RowData>) => DatasourceModeAdapterResult;
export default useDatasourceModeAdapter;
