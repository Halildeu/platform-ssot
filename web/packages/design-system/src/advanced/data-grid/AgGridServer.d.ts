/**
 * AgGridServer — Server-side AG Grid wrapper.
 *
 * Thin wrapper over GridShell configured for SSRM with a getData callback.
 * Automatically creates and attaches a server-side datasource from the
 * provided getData function.
 *
 * AG Grid v34.3.1 compatible.
 */
import React from "react";
import { type AccessControlledProps } from '../../internal/access-controller';
import type { ColDef as AgColDef, ColGroupDef as AgColGroupDef, GridOptions as AgGridOptions } from "ag-grid-community";
import { type GridDensity, type GridTheme } from "./GridShell";
export type ColDef = AgColDef<any>;
export type ColGroupDef = AgColGroupDef<any>;
export type GridOptions = AgGridOptions<any>;
export type ServerSideDataRequest = {
    startRow: number;
    endRow: number;
    sortModel?: {
        colId: string;
        sort: string;
    }[];
    filterModel?: Record<string, unknown>;
};
export type ServerSideDataResult = {
    rows: unknown[];
    total?: number;
};
export type FetchServerSideData = (request: ServerSideDataRequest) => Promise<ServerSideDataResult>;
export interface AgGridServerMessages {
    loadingLabel?: string;
    noRowsLabel?: string;
}
/** Props for the AgGridServer component.
 * @example
 * ```tsx
 * <AgGridServer />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/ag-grid-server)
 */
export interface AgGridServerProps extends AccessControlledProps {
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
/** AG Grid wrapper with server-side row model, infinite scrolling, and block caching. */
export declare const AgGridServer: React.FC<AgGridServerProps>;
export default AgGridServer;
