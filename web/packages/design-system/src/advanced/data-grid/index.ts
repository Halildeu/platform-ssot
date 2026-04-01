/* ------------------------------------------------------------------ */
/*  Data Grid — AG Grid wrapper components                             */
/*                                                                     */
/*  Importing from this module automatically triggers AG Grid setup.   */
/* ------------------------------------------------------------------ */

// Ensure AG Grid modules are registered + license applied
import "./setup";

// Design token mapping for AG Grid themes
import "./grid-theme.css";

// --- AgGridServer ---
export { AgGridServer } from "./AgGridServer";
export type {
  AgGridServerProps,
  AgGridServerMessages,
  FetchServerSideData,
  ServerSideDataRequest,
  ServerSideDataResult,
} from "./AgGridServer";

// --- GridShell (core wrapper) ---
export { GridShell } from "./GridShell";
export type { GridShellProps, GridShellApi, GridTheme, GridDensity } from "./GridShell";

// --- GridToolbar ---
export { GridToolbar } from "./GridToolbar";
export type { GridToolbarProps, GridToolbarMessages } from "./GridToolbar";

// --- VariantIntegration ---
export { VariantIntegration } from "./VariantIntegration";
export type { VariantIntegrationProps, VariantIntegrationMessages, GridVariantState } from "./VariantIntegration";

// --- DatasourceModeAdapter ---
export { useDatasourceModeAdapter } from "./DatasourceModeAdapter";
export type {
  DataSourceMode,
  CreateServerSideDatasource,
  DatasourceModeAdapterOptions,
  DatasourceModeAdapterResult,
} from "./DatasourceModeAdapter";

// --- EntityGridTemplate (orchestrator) ---
export { EntityGridTemplate } from "./EntityGridTemplate";
export type {
  EntityGridTemplateProps,
  EntityGridTemplateMessages,
  GridExportConfig,
} from "./EntityGridTemplate";

// --- TablePagination ---
export { TablePagination, useAgGridTablePagination } from "./TablePagination";
export type {
  TablePaginationProps,
  TablePaginationLocaleText,
  TablePaginationActionsProps,
  TablePaginationSlots,
  TablePaginationSlotProps,
  UseAgGridTablePaginationOptions,
  UseAgGridTablePaginationResult,
  AgGridTablePaginationApi,
  AgGridTablePaginationSnapshot,
} from "./TablePagination";

// --- ServerPaginationFooter ---
export { ServerPaginationFooter } from "./ServerPaginationFooter";
export type { ServerPaginationFooterProps } from "./ServerPaginationFooter";

// --- Pagination State ---
export { usePaginationState } from "./usePaginationState";
export type {
  UsePaginationStateOptions,
  PaginationStateController,
  PaginationPageRange,
} from "./usePaginationState";

// --- Chart Theme Bridge ---
export { getChartThemeOverrides, getChartColorPalette } from "./chart-theme-bridge";
export type { ChartThemeOverrides } from "./chart-theme-bridge";

// --- Query Params ---
export { buildEntityGridQueryParams } from "./buildEntityGridQueryParams";
export type {
  EntityGridQueryParams,
  MapAdvancedFilter,
  BuildEntityGridQueryParamsOptions,
} from "./buildEntityGridQueryParams";

// --- Column System (declarative column metadata → AG Grid ColDef) ---
export {
  buildColDefs,
  buildFilterConfig,
  buildDetailRenderer,
  buildProcessCellCallback,
  withConditionalFormatting,
  findMatchingRule,
  createTextRenderer,
  createBoldTextRenderer,
  createBadgeRenderer,
  createStatusRenderer,
  createDateRenderer,
  createNumberRenderer,
  createCurrencyRenderer,
  createBooleanRenderer,
  createPercentRenderer,
  createLinkRenderer,
  createEnumRenderer,
  createExportValueGetter,
} from "./column-system";
export type {
  ColumnMeta,
  TextColumnMeta,
  BoldTextColumnMeta,
  BadgeColumnMeta,
  StatusColumnMeta,
  StatusMapEntry,
  DateColumnMeta,
  NumberColumnMeta,
  CurrencyColumnMeta,
  EnumColumnMeta,
  BooleanColumnMeta,
  PercentColumnMeta,
  LinkColumnMeta,
  ActionsColumnMeta,
  ActionItem,
  BaseColumnMeta,
  BadgeVariant,
  ConditionalRule,
  TranslateFn,
  FilterConfig,
  DetailExtraField,
  ColumnDef as ColumnSystemColumnDef,
} from "./column-system";
