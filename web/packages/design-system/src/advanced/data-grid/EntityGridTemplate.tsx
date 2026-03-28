/**
 * EntityGridTemplate — Orchestrator component.
 *
 * Composes 4 modular parts:
 * - GridShell (core AG Grid wrapper)
 * - GridToolbar (filter, export, density, theme controls)
 * - VariantIntegration (save/load/clone column state)
 * - DatasourceModeAdapter (server vs client mode)
 *
 * This is the main public API for grid consumers in the monorepo.
 * AG Grid v34.3.1 compatible.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import type {
  ColDef as AgColDef,
  GridOptions as AgGridOptions,
  GridReadyEvent as AgGridReadyEvent,
  GridApi as AgGridApi,
  SideBarDef as AgSideBarDef,
  ExcelStyle as AgExcelStyle,
  ProcessCellForExportParams as AgProcessCellForExportParams,
  IServerSideDatasource as AgIServerSideDatasource,
} from "ag-grid-community";

import { resolveAccessState, accessStyles, type AccessControlledProps } from '../../internal/access-controller';
import { GridShell, type GridShellApi, type GridTheme, type GridDensity } from "./GridShell";
import { GridToolbar, type GridToolbarMessages } from "./GridToolbar";
import { VariantIntegration, type VariantIntegrationMessages } from "./VariantIntegration";
import { useDatasourceModeAdapter, type DataSourceMode } from "./DatasourceModeAdapter";
import { TablePagination, useAgGridTablePagination } from "./TablePagination";

/* ------------------------------------------------------------------ */
/*  Re-exported AG Grid types (convenience for consumers)              */
/* ------------------------------------------------------------------ */

/* eslint-disable @typescript-eslint/no-explicit-any -- AG Grid generic defaults
 */
export type ColDef<RowData = any> = AgColDef<RowData>;
export type GridOptions<RowData = any> = AgGridOptions<RowData>;
export type GridReadyEvent<RowData = any> = AgGridReadyEvent<RowData>;
export type SideBarDef = AgSideBarDef;
export type ExcelStyle = AgExcelStyle;
export type ProcessCellForExportParams<RowData = any> = AgProcessCellForExportParams<RowData>;
export type GridApi<RowData = any> = AgGridApi<RowData>;
export type IServerSideDatasource = AgIServerSideDatasource;
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ------------------------------------------------------------------ */
/*  Component types                                                    */
/* ------------------------------------------------------------------ */

export interface GridExportConfig<RowData> {
  fileBaseName: string;
  sheetName?: string;
  processCellCallback?: (params: ProcessCellForExportParams<RowData>) => string;
  csvFileBaseName?: string;
  csvColumnSeparator?: string;
  csvBom?: boolean;
}

export interface EntityGridTemplateMessages {
  defaultVariantName?: string;
  quickFilterPlaceholder?: string;
  themeLabel?: string;
  quickFilterLabel?: string;
  variantLabel?: string;
  densityToggleLabel?: string;
  comfortableDensityLabel?: string;
  compactDensityLabel?: string;
  densityResetLabel?: string;
  fullscreenTooltip?: string;
  resetFiltersLabel?: string;
  excelVisibleLabel?: string;
  excelAllLabel?: string;
  csvVisibleLabel?: string;
  csvAllLabel?: string;
  exportFileBaseName?: string;
  exportSheetName?: string;
  variantModalTitle?: string;
  variantNewButtonLabel?: string;
  variantNamePlaceholder?: string;
  overlayLoadingLabel?: string;
  overlayNoRowsLabel?: string;
  densityStatusUsingGlobal?: string;
  densityStatusOverride?: string;
  gridNotReadyLabel?: string;
  resetFiltersSuccessLabel?: string;
  pageSizeLabel?: string;
  recordCountLabel?: string;
  pageIndicatorLabel?: string;
  firstPageLabel?: string;
  previousPageLabel?: string;
  nextPageLabel?: string;
  lastPageLabel?: string;
  variantsLoadingOptionLabel?: string;
  variantSelectOptionLabel?: string;
  clearVariantSelectionLabel?: string;
  manageVariantsLabel?: string;
  closeVariantManagerLabel?: string;
  personalVariantsTitle?: string;
  personalVariantsEmptyLabel?: string;
  globalVariantsTitle?: string;
  globalVariantsEmptyLabel?: string;
  dismissToastLabel?: string;
  variantOptionGlobalLabel?: string;
  variantOptionGlobalDefaultLabel?: string;
  variantOptionDefaultLabel?: string;
  variantOptionIncompatibleLabel?: string;
  selectedVariantNotFoundLabel?: string;
  selectedVariantIncompatibleLabel?: string;
  variantSaveBlockedLabel?: string;
  variantSavedLabel?: string;
  variantSaveFailedLabel?: string;
  variantNameEmptyLabel?: string;
  variantNameUpdatedLabel?: string;
  variantNameUpdateFailedLabel?: string;
  variantPromotedToGlobalLabel?: string;
  variantDemotedToPersonalLabel?: string;
  variantGlobalStatusUpdateFailedLabel?: string;
  globalDefaultEnabledLabel?: string;
  globalDefaultDisabledLabel?: string;
  globalDefaultUpdateFailedLabel?: string;
  newVariantNameEmptyLabel?: string;
  variantCreatedLabel?: string;
  variantCreateFailedLabel?: string;
  defaultViewEnabledLabel?: string;
  defaultViewDisabledLabel?: string;
  defaultStateUpdateFailedLabel?: string;
  globalVariantUserDefaultEnabledLabel?: string;
  globalVariantUserDefaultDisabledLabel?: string;
  variantPreferenceUpdateFailedLabel?: string;
  variantCorruptedStateLabel?: string;
  deleteVariantConfirmationLabel?: string;
  variantDeletedLabel?: string;
  variantDeleteFailedLabel?: string;
  menuSelectLabel?: string;
  menuRenameLabel?: string;
  menuUnsetDefaultLabel?: string;
  menuSetDefaultLabel?: string;
  menuUnsetGlobalDefaultLabel?: string;
  menuSetGlobalDefaultLabel?: string;
  menuMoveToPersonalLabel?: string;
  menuMoveToGlobalLabel?: string;
  menuDeleteLabel?: string;
  saveLabel?: string;
  cancelLabel?: string;
  selectedTagLabel?: string;
  globalPublicDefaultTagLabel?: string;
  globalPublicTagLabel?: string;
  personalTagLabel?: string;
  personalDefaultTagLabel?: string;
  recentlyUsedTagLabel?: string;
  incompatibleTagLabel?: string;
  hideDetailsLabel?: string;
  showDetailsLabel?: string;
  variantActionsLabel?: string;
  moveToPersonalTitle?: string;
  moveToGlobalTitle?: string;
  saveCurrentLayoutTitle?: string;
  saveCurrentStateLabel?: string;
  personalDefaultSwitchLabel?: string;
  globalDefaultSwitchLabel?: string;
  newVariantToPersonalTitle?: string;
  newVariantToGlobalTitle?: string;
  newVariantUnsetGlobalDefaultTitle?: string;
  newVariantSetGlobalDefaultTitle?: string;
  newVariantUnsetPersonalDefaultTitle?: string;
  newVariantSetPersonalDefaultTitle?: string;
  saveTitle?: string;
}

type ThemeValue = "quartz" | "balham" | "material" | "alpine";

/** Props for the EntityGridTemplate component. */
export interface EntityGridTemplateProps<
  RowData extends Record<string, unknown> = Record<string, unknown>,
> extends AccessControlledProps {
  /** Unique identifier for grid state persistence and variant storage. */
  gridId: string;
  /** Schema version used to detect incompatible saved column states. */
  gridSchemaVersion: number;
  /** Row data array for client-side mode. */
  rowData?: RowData[];
  /** Total number of rows across all pages. */
  total?: number;
  /** Current page number (1-indexed). */
  page?: number;
  /** Number of rows per page. */
  pageSize?: number;
  /** Callback fired when page or page size changes. */
  onPageChange?: (page: number, pageSize: number) => void;
  /** Column definitions for the AG Grid instance. */
  columnDefs: ColDef<RowData>[];
  /** Default column definition applied to all columns. */
  defaultColDef?: ColDef<RowData>;
  gridOptions?: GridOptions<RowData>;
  sideBar?: SideBarDef;
  localeText?: Record<string, string>;
  excelStyles?: ExcelStyle[];
  overlayLoadingTemplate?: string;
  overlayNoRowsTemplate?: string;
  rowHeight?: number;
  onGridReady?: (params: GridReadyEvent<RowData>) => void;
  onRowDoubleClick?: (row: RowData) => void;
  isFullscreen?: boolean;
  onRequestFullscreen?: () => void;
  toolbarExtras?: React.ReactNode;
  exportConfig?: GridExportConfig<RowData>;
  quickFilterPlaceholder?: string;
  initialTheme?: ThemeValue;
  themeOptions?: readonly { label: string; value: ThemeValue }[];
  pageSizeOptions?: number[];
  pageSizeSelectId?: string;
  quickFilterInitialValue?: string;
  initialVariantId?: string;
  formatNumber?: (value: number) => string;
  themeLabel?: string;
  quickFilterLabel?: string;
  variantLabel?: string;
  densityToggleLabel?: string;
  comfortableDensityLabel?: string;
  compactDensityLabel?: string;
  densityResetLabel?: string;
  fullscreenTooltip?: string;
  resetFiltersLabel?: string;
  excelVisibleLabel?: string;
  excelAllLabel?: string;
  csvVisibleLabel?: string;
  csvAllLabel?: string;
  variantModalTitle?: string;
  variantNewButtonLabel?: string;
  variantNamePlaceholder?: string;
  messages?: EntityGridTemplateMessages;
  /** Whether user can promote personal variants to global */
  canPromoteVariantToGlobal?: boolean;
  /** Whether user can demote global variants to personal */
  canDemoteVariantToPersonal?: boolean;
  /** Whether user can delete global variants */
  canDeleteGlobalVariant?: boolean;
  rowSelection?: GridOptions<RowData>["rowSelection"];
  dataSourceMode?: "server" | "client";
  createServerSideDatasource?: (params: {
    gridApi: GridApi<RowData>;
  }) => IServerSideDatasource | null | undefined;
  onEffectiveModeChange?: (mode: "server" | "client") => void;
}

/* ------------------------------------------------------------------ */
/*  EntityGridTemplate orchestrator                                    */
/* ------------------------------------------------------------------ */

/** Full-featured entity grid orchestrator combining GridShell, toolbar, pagination, and variant management. 
 * @example
 * ```tsx
 * <EntityGridTemplate />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/entity-grid-template)
 */
export function EntityGridTemplate<
  RowData extends Record<string, unknown> = Record<string, unknown>,
>(props: EntityGridTemplateProps<RowData>): React.ReactElement {
  const {
    gridId,
    gridSchemaVersion,
    rowData,
    total,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    page,
    pageSize: pageSizeProp,
    onPageChange,
    columnDefs,
    defaultColDef,
    gridOptions,
    sideBar,
    localeText,
    excelStyles,
    overlayLoadingTemplate,
    overlayNoRowsTemplate,
    rowHeight,
    onGridReady: onGridReadyProp,
    onRowDoubleClick,
    isFullscreen = false,
    onRequestFullscreen,
    toolbarExtras,
    exportConfig,
    quickFilterPlaceholder,
    initialTheme = "quartz",
    themeOptions,
    pageSizeOptions = [10, 20, 50, 100],
    quickFilterInitialValue,
    initialVariantId,
    messages,
    canPromoteVariantToGlobal = process.env.NODE_ENV !== 'production',
    canDemoteVariantToPersonal = process.env.NODE_ENV !== 'production',
    canDeleteGlobalVariant = process.env.NODE_ENV !== 'production',
    rowSelection,
    dataSourceMode = "server",
    createServerSideDatasource,
    onEffectiveModeChange,
    access,
    accessReason,
  } = props;

  const accessState = resolveAccessState(access);
  if (accessState.isHidden) return <></> as unknown as React.ReactElement;

  // ── State ──────────────────────────────────────────────────────
  const [gridApi, setGridApi] = useState<GridApi<RowData> | null>(null);
  const [theme, setTheme] = useState<GridTheme>(initialTheme);
  const [density, setDensity] = useState<GridDensity>("comfortable");
  const [activeVariantId, setActiveVariantId] = useState<string | null>(initialVariantId ?? null);
  const gridShellRef = useRef<GridShellApi<RowData>>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContainerFullscreen, setIsContainerFullscreen] = useState(false);

  // ── Fullscreen (grid-scoped) ─────────────────────────────────
  const handleToggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setIsContainerFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const effectiveFullscreen = isFullscreen || isContainerFullscreen;
  const effectiveFullscreenHandler = onRequestFullscreen ?? handleToggleFullscreen;

  // ── Datasource mode adapter ────────────────────────────────────
  const { rowModelType, attachDatasource } = useDatasourceModeAdapter({
    mode: dataSourceMode as DataSourceMode,
    gridApi,
    createServerSideDatasource,
    onEffectiveModeChange,
  });

  // ── Pagination (client mode only) ──────────────────────────────
  const isServerMode = dataSourceMode === "server";
  const pagination = useAgGridTablePagination<RowData>({
    initialPageSize: pageSizeProp ?? 20,
    totalItems: total ?? rowData?.length ?? 0,
  });

  // ── Grid ready handler ─────────────────────────────────────────
  const handleGridReady = useCallback(
    (event: GridReadyEvent<RowData>) => {
      setGridApi(event.api);

      // Register grid API for pagination sync
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- pagination API typing gap
      pagination.registerGridApi(event.api as any);

      // Attach SSRM datasource if server mode
      if (isServerMode) {
        attachDatasource(event.api);
      }

      onGridReadyProp?.(event);
    },
    [onGridReadyProp, isServerMode, attachDatasource, pagination],
  );

  // ── Pagination changed → refresh snapshot ──────────────────────
  const handlePaginationChanged = useCallback(
    (event: { api: GridApi<RowData> }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- pagination API typing gap
      pagination.refreshPaginationSnapshot(event.api as any);
    },
    [pagination],
  );

  // ── Toolbar messages ───────────────────────────────────────────
  const toolbarMessages: GridToolbarMessages = {
    quickFilterPlaceholder: messages?.quickFilterPlaceholder ?? quickFilterPlaceholder,
    densityComfortableLabel: messages?.comfortableDensityLabel,
    densityCompactLabel: messages?.compactDensityLabel,
    densityResetLabel: messages?.densityResetLabel,
    themeLabel: messages?.themeLabel,
    fullscreenLabel: messages?.fullscreenTooltip,
    fullscreenTooltip: messages?.fullscreenTooltip,
    resetFiltersLabel: messages?.resetFiltersLabel,
    excelVisibleLabel: messages?.excelVisibleLabel,
    excelAllLabel: messages?.excelAllLabel,
    csvVisibleLabel: messages?.csvVisibleLabel,
    csvAllLabel: messages?.csvAllLabel,
  };

  // ── Variant messages ───────────────────────────────────────────
  const variantMessages: VariantIntegrationMessages = {
    variantLabel: messages?.variantLabel,
    variantPlaceholder: messages?.variantSelectOptionLabel,
    variantNewButtonLabel: messages?.variantNewButtonLabel,
    variantNamePlaceholder: messages?.variantNamePlaceholder,
    variantModalTitle: messages?.variantModalTitle,
    defaultVariantName: messages?.defaultVariantName,
    // Section headers
    personalVariantsTitle: messages?.personalVariantsTitle,
    globalVariantsTitle: messages?.globalVariantsTitle,
    personalVariantsEmptyLabel: messages?.personalVariantsEmptyLabel,
    globalVariantsEmptyLabel: messages?.globalVariantsEmptyLabel,
    // Actions
    menuSelectLabel: messages?.menuSelectLabel,
    menuRenameLabel: messages?.menuRenameLabel,
    menuSetDefaultLabel: messages?.menuSetDefaultLabel,
    menuUnsetDefaultLabel: messages?.menuUnsetDefaultLabel,
    menuSetGlobalDefaultLabel: messages?.menuSetGlobalDefaultLabel,
    menuUnsetGlobalDefaultLabel: messages?.menuUnsetGlobalDefaultLabel,
    menuMoveToGlobalLabel: messages?.menuMoveToGlobalLabel,
    menuMoveToPersonalLabel: messages?.menuMoveToPersonalLabel,
    menuDeleteLabel: messages?.menuDeleteLabel,
    saveCurrentStateLabel: messages?.saveCurrentStateLabel,
    saveLabel: messages?.saveLabel,
    cancelLabel: messages?.cancelLabel,
    // Tags
    selectedTagLabel: messages?.selectedTagLabel,
    personalTagLabel: messages?.personalTagLabel,
    personalDefaultTagLabel: messages?.personalDefaultTagLabel,
    globalPublicTagLabel: messages?.globalPublicTagLabel,
    globalPublicDefaultTagLabel: messages?.globalPublicDefaultTagLabel,
    incompatibleTagLabel: messages?.incompatibleTagLabel,
    // Detail
    showDetailsLabel: messages?.showDetailsLabel,
    hideDetailsLabel: messages?.hideDetailsLabel,
    variantActionsLabel: messages?.variantActionsLabel,
    moveToPersonalTitle: messages?.moveToPersonalTitle,
    moveToGlobalTitle: messages?.moveToGlobalTitle,
    saveCurrentLayoutTitle: messages?.saveCurrentLayoutTitle,
    saveTitle: messages?.saveTitle,
    // Feedback
    variantSavedLabel: messages?.variantSavedLabel,
    variantSaveFailedLabel: messages?.variantSaveFailedLabel,
    variantCreatedLabel: messages?.variantCreatedLabel,
    variantCreateFailedLabel: messages?.variantCreateFailedLabel,
    variantDeletedLabel: messages?.variantDeletedLabel,
    variantDeleteFailedLabel: messages?.variantDeleteFailedLabel,
    variantPromotedToGlobalLabel: messages?.variantPromotedToGlobalLabel,
    variantDemotedToPersonalLabel: messages?.variantDemotedToPersonalLabel,
    variantGlobalStatusUpdateFailedLabel: messages?.variantGlobalStatusUpdateFailedLabel,
    defaultViewEnabledLabel: messages?.defaultViewEnabledLabel,
    defaultViewDisabledLabel: messages?.defaultViewDisabledLabel,
    defaultStateUpdateFailedLabel: messages?.defaultStateUpdateFailedLabel,
    deleteVariantConfirmationLabel: messages?.deleteVariantConfirmationLabel,
    closeVariantManagerLabel: messages?.closeVariantManagerLabel,
    variantNameEmptyLabel: messages?.variantNameEmptyLabel,
    variantNameUpdatedLabel: messages?.variantNameUpdatedLabel,
    variantNameUpdateFailedLabel: messages?.variantNameUpdateFailedLabel,
  };

  // ── Client pagination page change ──────────────────────────────
  const handlePageChange = useCallback(
    (nextPage: number) => {
      pagination.handlePageChange(nextPage);
      onPageChange?.(nextPage, pagination.pageSize);
    },
    [pagination, onPageChange],
  );

  const handlePageSizeChange = useCallback(
    (nextPageSize: number) => {
      pagination.handlePageSizeChange(nextPageSize);
      onPageChange?.(1, nextPageSize);
    },
    [pagination, onPageChange],
  );

  return (
    <div
      ref={containerRef}
      data-access-state={accessState.state}
      className={`relative flex flex-col ${isContainerFullscreen ? 'h-screen w-screen bg-surface-default p-4' : ''} ${accessStyles(accessState.state)}`}
      data-component="entity-grid-template"
      data-grid-id={gridId}
      title={accessReason}
    >
      {/* Toolbar */}
      <GridToolbar<RowData>
        gridApi={gridApi}
        theme={theme}
        onThemeChange={setTheme}
        themeOptions={themeOptions}
        density={density}
        onDensityChange={setDensity}
        isServerMode={isServerMode}
        quickFilterInitialValue={quickFilterInitialValue}
        exportConfig={exportConfig}
        onRequestFullscreen={effectiveFullscreenHandler}
        isFullscreen={effectiveFullscreen}
        messages={toolbarMessages}
        extras={<>
          {gridApi && (
            <QuickGroupMenu
              gridApi={gridApi}
              columnDefs={columnDefs}
            />
          )}
          {toolbarExtras}
        </>}
        variantSlot={
          <VariantIntegration<RowData>
            gridId={gridId}
            gridSchemaVersion={gridSchemaVersion}
            gridApi={gridApi}
            activeVariantId={activeVariantId ?? undefined}
            onActiveVariantChange={setActiveVariantId}
            messages={variantMessages}
            canPromoteToGlobal={canPromoteVariantToGlobal}
            canDemoteToPersonal={canDemoteVariantToPersonal}
            canDeleteGlobal={canDeleteGlobalVariant}
          />
        }
      />

      {/* Grid */}
      <GridShell<RowData>
        ref={gridShellRef}
        gridKey={`${gridId}-${dataSourceMode}`}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        gridOptions={gridOptions}
        rowData={isServerMode ? undefined : rowData}
        rowModelType={rowModelType}
        sideBar={sideBar}
        localeText={localeText}
        excelStyles={excelStyles}
        overlayLoadingTemplate={overlayLoadingTemplate}
        overlayNoRowsTemplate={overlayNoRowsTemplate}
        rowHeight={rowHeight}
        rowSelection={rowSelection}
        theme={theme}
        density={density}
        onGridReady={handleGridReady}
        onRowDoubleClick={onRowDoubleClick}
        onPaginationChanged={handlePaginationChanged}
        height={effectiveFullscreen ? '100%' : 600}
        className={effectiveFullscreen ? 'min-h-0 flex-1' : undefined}
      >
        {/* Client-side pagination footer */}
        {!isServerMode && (
          <TablePagination
            totalItems={total ?? rowData?.length ?? 0}
            page={pagination.paginationSnapshot.page}
            pageSize={pagination.paginationSnapshot.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={pageSizeOptions}
            showFirstLastButtons
            localeText={{
              rowsPerPageLabel: messages?.pageSizeLabel,
              previousButtonLabel: messages?.previousPageLabel,
              nextButtonLabel: messages?.nextPageLabel,
              firstButtonLabel: messages?.firstPageLabel,
              lastButtonLabel: messages?.lastPageLabel,
            }}
          />
        )}
      </GridShell>
    </div>
  );
}

EntityGridTemplate.displayName = "EntityGridTemplate";

export default EntityGridTemplate;

/* ── QuickGroupMenu ─────────────────────────────────────────────── */

function QuickGroupMenu<RowData>({
  gridApi,
  columnDefs,
}: {
  gridApi: GridApi<RowData>;
  columnDefs: ColDef<RowData>[];
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Get groupable columns (those with field + headerName)
  const groupableColumns = React.useMemo(() => {
    return columnDefs
      .filter((c) => c.field && c.headerName && c.enableRowGroup !== false)
      .map((c) => ({ field: c.field as string, label: c.headerName as string }));
  }, [columnDefs]);

  const applyGroup = (fields: string[]) => {
    const state = gridApi.getColumnState().map((col) => ({
      ...col,
      rowGroup: fields.includes(col.colId),
      rowGroupIndex: fields.indexOf(col.colId) >= 0 ? fields.indexOf(col.colId) : null,
    }));
    gridApi.applyColumnState({ state });
    setOpen(false);
  };

  const clearGroups = () => {
    const state = gridApi.getColumnState().map((col) => ({
      ...col,
      rowGroup: false,
      rowGroupIndex: null,
    }));
    gridApi.applyColumnState({ state });
    setOpen(false);
  };

  if (groupableColumns.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-8 items-center gap-1 rounded-md bg-surface-muted px-2.5 text-xs font-medium text-text-secondary hover:bg-surface-raised"
        title="Hizli gruplama"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
        </svg>
        Grupla
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border-subtle bg-surface-default py-1 shadow-lg">
          <button
            type="button"
            onClick={clearGroups}
            className="w-full px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-surface-muted"
          >
            Gruplamayı kaldır
          </button>
          <div className="my-1 border-t border-border-subtle" />
          {groupableColumns.map((col) => (
            <button
              key={col.field}
              type="button"
              onClick={() => applyGroup([col.field])}
              className="w-full px-3 py-1.5 text-left text-xs text-text-primary hover:bg-surface-muted"
            >
              {col.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
