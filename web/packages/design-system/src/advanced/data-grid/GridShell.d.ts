/**
 * GridShell — Core AG Grid v34 wrapper.
 *
 * Responsibilities:
 * - AgGridReact rendering with ref forwarding
 * - Theme class injection (ag-theme-quartz, etc.)
 * - Density attribute for CSS variable switching
 * - License guard via setup.ts side-effect import
 * - onGridReady event forwarding
 */
import React from "react";
import { type AccessControlledProps } from '../../internal/access-controller';
import type { ColDef, FilterChangedEvent, GridApi, GridOptions, GridReadyEvent, ExcelStyle, SideBarDef } from "ag-grid-community";
import "./setup";
export type GridTheme = "quartz" | "balham" | "alpine" | "material";
export type GridDensity = "comfortable" | "compact";
export interface GridShellApi<RowData = unknown> {
    getGridApi: () => GridApi<RowData> | null;
}
/** Props for the GridShell component. */
export interface GridShellProps<RowData = unknown> extends AccessControlledProps {
    /** AG Grid column definitions */
    columnDefs: ColDef<RowData>[];
    /** Default column definition applied to all columns */
    defaultColDef?: ColDef<RowData>;
    /** AG Grid options (passed through to AgGridReact) */
    gridOptions?: GridOptions<RowData>;
    /** Row data for client-side mode (undefined for server-side) */
    rowData?: RowData[];
    /** Row model type */
    rowModelType?: "clientSide" | "serverSide" | "infinite";
    /** AG Grid sidebar definition */
    sideBar?: SideBarDef | string | string[] | boolean;
    /** AG Grid locale text overrides */
    localeText?: Record<string, string>;
    /** Excel export styles */
    excelStyles?: ExcelStyle[];
    /** Loading overlay template */
    overlayLoadingTemplate?: string;
    /** No-rows overlay template */
    overlayNoRowsTemplate?: string;
    /** Row height (overrides density default) */
    rowHeight?: number;
    /** Row selection config */
    rowSelection?: GridOptions<RowData>["rowSelection"];
    /** Theme name */
    theme?: GridTheme;
    /** Density setting */
    density?: GridDensity;
    /** Animate rows */
    animateRows?: boolean;
    /** Grid ready callback */
    onGridReady?: (event: GridReadyEvent<RowData>) => void;
    /** Row double-click callback */
    onRowDoubleClick?: (row: RowData) => void;
    /** Pagination changed callback (for useAgGridTablePagination) */
    onPaginationChanged?: (event: {
        api: GridApi<RowData>;
    }) => void;
    /** Container height */
    height?: number | string;
    /** Container className */
    className?: string;
    /** Unique key for grid remounting */
    gridKey?: string;
    /** Enable AG Grid integrated charts (requires IntegratedChartsModule) */
    enableCharts?: boolean;
    /** AG Charts theme overrides for integrated charts */
    chartThemeOverrides?: Record<string, unknown>;
    /** Callback fired when any filter (column or advanced) changes */
    onFilterChanged?: (event: FilterChangedEvent<RowData>) => void;
    /** Children rendered below the grid (e.g., pagination) */
    children?: React.ReactNode;
}
/** Core AG Grid shell with theme, density, selection, empty state, and imperative API access.
 * @example
 * ```tsx
 * <GridShell />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/grid-shell)
 */
export declare const GridShell: <RowData = unknown>(props: GridShellProps<RowData> & {
    ref?: React.Ref<GridShellApi<RowData>>;
}) => React.ReactElement;
export default GridShell;
