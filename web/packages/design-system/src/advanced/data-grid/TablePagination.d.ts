/**
 * TablePagination — real implementation promoted from catalog.
 * useAgGridTablePagination — real AG Grid v34 pagination sync hook.
 *
 * Single source of truth for grid pagination in @mfe/design-system.
 */
import React from "react";
import { type PaginationSizeOption } from "./PaginationSizeChanger";
import { type UsePaginationStateOptions } from "./usePaginationState";
import { type AccessControlledProps, type AccessLevel } from "../../internal/access-controller";
export type TablePaginationLocaleText = {
    rowsPerPageLabel?: React.ReactNode;
    rangeLabel?: (start: number, end: number, totalItems: number, context?: {
        page: number;
        pageSize: number;
        totalItemsKnown: boolean;
    }) => React.ReactNode;
    unknownTotalLabel?: (start: number, end: number, page: number, pageSize: number) => React.ReactNode;
    previousButtonLabel?: string;
    nextButtonLabel?: string;
    firstButtonLabel?: string;
    lastButtonLabel?: string;
};
export type TablePaginationActionsProps = {
    page: number;
    pageSize: number;
    canGoToPrevPage: boolean;
    canGoToNextPage: boolean;
    showFirstLastButtons: boolean;
    totalItemsKnown: boolean;
    onFirstPage: () => void;
    onPrevPage: () => void;
    onNextPage: () => void;
    onLastPage: () => void;
    firstButtonLabel: string;
    previousButtonLabel: string;
    nextButtonLabel: string;
    lastButtonLabel: string;
    access: AccessLevel;
    accessReason?: string;
    className?: string;
};
export type TablePaginationSlots = {
    actions?: React.ComponentType<TablePaginationActionsProps>;
};
export type TablePaginationSlotProps = {
    actions?: {
        className?: string;
    };
};
export interface TablePaginationProps extends AccessControlledProps, UsePaginationStateOptions {
    /** Available page size options shown in the size selector. */
    pageSizeOptions?: PaginationSizeOption[];
    /** Additional CSS class name for the root element. */
    className?: string;
    /** Whether to show first/last page navigation buttons. */
    showFirstLastButtons?: boolean;
    /** Whether the total item count is known; when false, uses cursor pagination. */
    totalItemsKnown?: boolean;
    /** Whether there is a next page available (cursor pagination mode). */
    hasNextPage?: boolean;
    /** Locale-specific labels for range display and button aria-labels. */
    localeText?: TablePaginationLocaleText;
    /** @deprecated Use `slots.actions` instead. Custom actions component override. */
    ActionsComponent?: React.ComponentType<TablePaginationActionsProps>;
    /** Named slot overrides for sub-components. */
    slots?: TablePaginationSlots;
    /** Props forwarded to slot sub-components. */
    slotProps?: TablePaginationSlotProps;
}
/** Pagination controls with page navigation, page-size selector, and item range display.
 * @example
 * ```tsx
 * <TablePagination />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/table-pagination)
 */
export declare const TablePagination: React.ForwardRefExoticComponent<TablePaginationProps & React.RefAttributes<HTMLDivElement>>;
export type AgGridTablePaginationApi<_RowData = any> = {
    paginationGetCurrentPage?: () => number;
    paginationGetTotalPages?: () => number;
    paginationGetRowCount?: () => number;
    paginationGoToPage?: (page: number) => void;
    paginationGoToFirstPage?: () => void;
    setGridOption?: (key: string, value: unknown) => void;
    getDisplayedRowCount?: () => number;
} & Record<string, unknown>;
export type AgGridTablePaginationSnapshot = {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
};
export type UseAgGridTablePaginationOptions<RowData = unknown> = {
    initialPageSize?: number;
    totalItems?: number;
    resolveTotalItems?: (api: AgGridTablePaginationApi<RowData> | null, context: {
        pageSize: number;
        fallbackTotalItems: number;
    }) => number;
    syncPageSizeToGrid?: (api: AgGridTablePaginationApi<RowData>, pageSize: number) => void;
};
export type UseAgGridTablePaginationResult<RowData = unknown> = {
    gridApi: AgGridTablePaginationApi<RowData> | null;
    gridApiRef: React.MutableRefObject<AgGridTablePaginationApi<RowData> | null>;
    pageSize: number;
    pageSizeRef: React.MutableRefObject<number>;
    paginationSnapshot: AgGridTablePaginationSnapshot;
    registerGridApi: (api: AgGridTablePaginationApi<RowData> | null) => void;
    refreshPaginationSnapshot: (api?: AgGridTablePaginationApi<RowData> | null) => void;
    handlePageChange: (nextPage: number) => void;
    handlePageSizeChange: (nextPageSize: number) => void;
};
/**
 * Real AG Grid v34 pagination sync hook.
 *
 * Connects TablePagination state to the AG Grid API:
 * - `registerGridApi` should be called from `onGridReady`
 * - `refreshPaginationSnapshot` should be called from `onPaginationChanged`
 * - `handlePageChange` / `handlePageSizeChange` are forwarded to grid API
 *
 * v34 API notes:
 * - `paginationGetCurrentPage()` returns 0-indexed page
 * - `paginationGoToPage(index)` expects 0-indexed page
 * - `setGridOption('paginationPageSize', size)` replaces old paginationSetPageSize
 */
export declare const useAgGridTablePagination: <RowData = unknown>(options?: UseAgGridTablePaginationOptions<RowData>) => UseAgGridTablePaginationResult<RowData>;
export default TablePagination;
