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
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ExcelStyle,
  SideBarDef,
} from "ag-grid-community";

// Side-effect: ensures modules are registered
import "./setup";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type GridTheme = "quartz" | "balham" | "alpine" | "material";
export type GridDensity = "comfortable" | "compact";

export interface GridShellApi<RowData = unknown> {
  getGridApi: () => GridApi<RowData> | null;
}

export interface GridShellProps<RowData = unknown> {
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
  onPaginationChanged?: (event: { api: GridApi<RowData> }) => void;
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
  /** Children rendered below the grid (e.g., pagination) */
  children?: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DENSITY_ROW_HEIGHT: Record<GridDensity, number> = {
  comfortable: 48,
  compact: 36,
};

const DEFAULT_COL_DEF: ColDef = {
  sortable: true,
  filter: "agMultiColumnFilter",
  floatingFilter: true,
  resizable: true,
  minWidth: 120,
  flex: 1,
  menuTabs: ["generalMenuTab", "filterMenuTab", "columnsMenuTab"],
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function GridShellInner<RowData = unknown>(
  props: GridShellProps<RowData>,
  ref: React.Ref<GridShellApi<RowData>>,
): React.ReactElement {
  const {
    columnDefs,
    defaultColDef,
    gridOptions,
    rowData,
    rowModelType = "clientSide",
    sideBar,
    localeText,
    excelStyles,
    overlayLoadingTemplate,
    overlayNoRowsTemplate,
    rowHeight,
    rowSelection,
    theme = "quartz",
    density = "comfortable",
    animateRows = true,
    onGridReady,
    onRowDoubleClick,
    onPaginationChanged,
    height = 600,
    enableCharts = false,
    chartThemeOverrides,
    className,
    gridKey,
    children,
  } = props;

  const gridApiRef = useRef<GridApi<RowData> | null>(null);

  useImperativeHandle(ref, () => ({
    getGridApi: () => gridApiRef.current,
  }));

  const resolvedRowHeight = rowHeight ?? DENSITY_ROW_HEIGHT[density];
  const themeClassName = `ag-theme-${theme}`;

  const mergedDefaultColDef = useMemo(
    () => ({ ...DEFAULT_COL_DEF, ...defaultColDef }),
    [defaultColDef],
  );

  const handleGridReady = useCallback(
    (event: GridReadyEvent<RowData>) => {
      gridApiRef.current = event.api;
      onGridReady?.(event);
    },
    [onGridReady],
  );

  const handleRowDoubleClicked = useCallback(
    (event: { data: RowData | undefined }) => {
      if (event.data && onRowDoubleClick) {
        onRowDoubleClick(event.data);
      }
    },
    [onRowDoubleClick],
  );

  const handlePaginationChanged = useCallback(
    () => {
      if (onPaginationChanged && gridApiRef.current) {
        onPaginationChanged({ api: gridApiRef.current });
      }
    },
    [onPaginationChanged],
  );

  return (
    <div
      className={[className ?? ""].join(" ").trim() || undefined}
      data-component="grid-shell"
      data-density={density}
    >
      <div
        className={themeClassName}
        style={{ width: "100%", height: typeof height === "number" ? `${height}px` : height }}
      >
        {/* @ts-expect-error AG Grid React type compatibility with @types/react */}
        <AgGridReact<RowData>
          key={gridKey}
          rowData={rowModelType === "clientSide" ? rowData : undefined}
          columnDefs={columnDefs}
          defaultColDef={mergedDefaultColDef as any}
          rowModelType={rowModelType}
          sideBar={sideBar}
          localeText={localeText}
          excelStyles={excelStyles}
          overlayLoadingTemplate={overlayLoadingTemplate}
          overlayNoRowsTemplate={overlayNoRowsTemplate}
          rowHeight={resolvedRowHeight}
          headerHeight={density === "compact" ? 40 : 48}
          rowSelection={rowSelection}
          animateRows={animateRows}
          enableAdvancedFilter
          enableCharts={enableCharts}
          chartThemeOverrides={chartThemeOverrides}
          popupParent={typeof document !== "undefined" ? document.body : undefined}
          onGridReady={handleGridReady}
          onRowDoubleClicked={handleRowDoubleClicked}
          onPaginationChanged={handlePaginationChanged}
          {...gridOptions}
        />
      </div>
      {children}
    </div>
  );
}

export const GridShell = forwardRef(GridShellInner) as <RowData = unknown>(
  props: GridShellProps<RowData> & { ref?: React.Ref<GridShellApi<RowData>> },
) => React.ReactElement;

// @ts-expect-error -- generic forwardRef cast loses static properties
GridShell.displayName = "GridShell";

export default GridShell;
