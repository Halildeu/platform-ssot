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
import React from "react";
import type { ColDef as AgColDef, GridOptions as AgGridOptions, GridReadyEvent as AgGridReadyEvent, GridApi as AgGridApi, SideBarDef as AgSideBarDef, ExcelStyle as AgExcelStyle, ProcessCellForExportParams as AgProcessCellForExportParams, IServerSideDatasource as AgIServerSideDatasource } from "ag-grid-community";
import { type AccessControlledProps } from '../../internal/access-controller';
export type ColDef<RowData = any> = AgColDef<RowData>;
export type GridOptions<RowData = any> = AgGridOptions<RowData>;
export type GridReadyEvent<RowData = any> = AgGridReadyEvent<RowData>;
export type SideBarDef = AgSideBarDef;
export type ExcelStyle = AgExcelStyle;
export type ProcessCellForExportParams<RowData = any> = AgProcessCellForExportParams<RowData>;
export type GridApi<RowData = any> = AgGridApi<RowData>;
export type IServerSideDatasource = AgIServerSideDatasource;
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
export interface EntityGridTemplateProps<RowData extends Record<string, unknown> = Record<string, unknown>> extends AccessControlledProps {
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
    themeOptions?: readonly {
        label: string;
        value: ThemeValue;
    }[];
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
/** Full-featured entity grid orchestrator combining GridShell, toolbar, pagination, and variant management.
 * @example
 * ```tsx
 * <EntityGridTemplate />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/entity-grid-template)
 */
export declare function EntityGridTemplate<RowData extends Record<string, unknown> = Record<string, unknown>>(props: EntityGridTemplateProps<RowData>): React.ReactElement;
export declare namespace EntityGridTemplate {
    var displayName: string;
}
export default EntityGridTemplate;
