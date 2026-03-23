/**
 * TablePagination — real implementation promoted from catalog.
 * useAgGridTablePagination — real AG Grid v34 pagination sync hook.
 *
 * Single source of truth for grid pagination in @mfe/design-system.
 */
import React, { useState, useCallback, useRef, useEffect } from "react";
import { IconButton } from "../../primitives/icon-button";
import { Text } from "../../primitives/text";
import { PaginationSizeChanger, type PaginationSizeOption } from "./PaginationSizeChanger";
import {
  clampPaginationPage,
  usePaginationState,
  type UsePaginationStateOptions,
} from "./usePaginationState";
import {
  resolveAccessState,
  type AccessControlledProps,
  type AccessLevel,
} from "../../internal/access-controller";

/* ------------------------------------------------------------------ */
/*  TablePagination types                                              */
/* ------------------------------------------------------------------ */

export type TablePaginationLocaleText = {
  rowsPerPageLabel?: React.ReactNode;
  rangeLabel?: (
    start: number,
    end: number,
    totalItems: number,
    context?: {
      page: number;
      pageSize: number;
      totalItemsKnown: boolean;
    },
  ) => React.ReactNode;
  unknownTotalLabel?: (
    start: number,
    end: number,
    page: number,
    pageSize: number,
  ) => React.ReactNode;
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

export type TablePaginationProps = AccessControlledProps &
  UsePaginationStateOptions & {
    pageSizeOptions?: PaginationSizeOption[];
    className?: string;
    showFirstLastButtons?: boolean;
    totalItemsKnown?: boolean;
    hasNextPage?: boolean;
    localeText?: TablePaginationLocaleText;
    ActionsComponent?: React.ComponentType<TablePaginationActionsProps>;
    slots?: TablePaginationSlots;
    slotProps?: TablePaginationSlotProps;
  };

/* ------------------------------------------------------------------ */
/*  Default actions                                                    */
/* ------------------------------------------------------------------ */

const normalizePageSize = (value: number | undefined) => {
  const normalized = Math.trunc(Number(value ?? 10));
  return Number.isFinite(normalized) && normalized > 0 ? normalized : 10;
};

const DefaultTablePaginationActions: React.FC<TablePaginationActionsProps> = ({
  canGoToPrevPage,
  canGoToNextPage,
  showFirstLastButtons,
  totalItemsKnown,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
  firstButtonLabel,
  previousButtonLabel,
  nextButtonLabel,
  lastButtonLabel,
  access,
  accessReason,
  className,
}) => (
  <div
    className={[
      "flex items-center gap-2 rounded-full border border-border-subtle/70 bg-[var(--surface-card,var(--surface-default))] px-2 py-1 shadow-[0_12px_24px_-22px_var(--shadow-color,rgba(15,23,42,0.2))] ring-1 ring-border-subtle/20 backdrop-blur-xs",
      className ?? "",
    ]
      .join(" ")
      .trim()}
    data-slot="pagination-actions"
  >
    {showFirstLastButtons ? (
      <IconButton
        icon={<span aria-hidden="true">«</span>}
        label={firstButtonLabel}
        size="sm"
        variant="ghost"
        onClick={() => onFirstPage()}
        disabled={!canGoToPrevPage}
        access={access}
        accessReason={accessReason}
      />
    ) : null}
    <IconButton
      icon={<span aria-hidden="true">‹</span>}
      label={previousButtonLabel}
      size="sm"
      variant="ghost"
      onClick={() => onPrevPage()}
      disabled={!canGoToPrevPage}
      access={access}
      accessReason={accessReason}
    />
    <IconButton
      icon={<span aria-hidden="true">›</span>}
      label={nextButtonLabel}
      size="sm"
      variant="ghost"
      onClick={() => onNextPage()}
      disabled={!canGoToNextPage}
      access={access}
      accessReason={accessReason}
    />
    {showFirstLastButtons ? (
      <IconButton
        icon={<span aria-hidden="true">»</span>}
        label={lastButtonLabel}
        size="sm"
        variant="ghost"
        onClick={() => onLastPage()}
        disabled={!totalItemsKnown || !canGoToNextPage}
        access={access}
        accessReason={accessReason}
      />
    ) : null}
  </div>
);

/* ------------------------------------------------------------------ */
/*  TablePagination component                                          */
/* ------------------------------------------------------------------ */

/** Pagination controls with page navigation, page-size selector, and item range display. */
export const TablePagination: React.FC<TablePaginationProps> = ({
  totalItems,
  page,
  defaultPage,
  onPageChange,
  pageSize,
  defaultPageSize,
  onPageSizeChange,
  resetPageOnPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
  showFirstLastButtons = false,
  totalItemsKnown = true,
  hasNextPage,
  localeText,
  ActionsComponent,
  slots,
  slotProps,
  access = "full",
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  const knownPagination = usePaginationState({
    totalItems,
    page,
    defaultPage,
    onPageChange,
    pageSize,
    defaultPageSize,
    onPageSizeChange,
    resetPageOnPageSizeChange,
  });

  // Unknown-total mode (cursor/infinite pagination)
  const isPageControlled = typeof page === "number";
  const isPageSizeControlled = typeof pageSize === "number";
  const [unknownInternalPage, setUnknownInternalPage] = useState(() =>
    Math.max(1, Math.trunc(Number(page ?? defaultPage ?? 1)) || 1),
  );
  const [unknownInternalPageSize, setUnknownInternalPageSize] = useState(() =>
    normalizePageSize(pageSize ?? defaultPageSize),
  );
  const unknownPageSize = isPageSizeControlled ? normalizePageSize(pageSize) : unknownInternalPageSize;
  const unknownPage = Math.max(
    1,
    Math.trunc(Number(isPageControlled ? page ?? defaultPage ?? 1 : unknownInternalPage)) || 1,
  );
  const unknownRangeStart = totalItems <= 0 ? 0 : (unknownPage - 1) * unknownPageSize + 1;
  const unknownRangeEnd =
    totalItems <= 0
      ? 0
      : Math.max(
          unknownRangeStart,
          Math.min(Math.max(totalItems, unknownRangeStart), unknownPage * unknownPageSize),
        );

  const setUnknownPage = useCallback(
    (nextPage: number) => {
      const normalizedPage = Math.max(1, Math.trunc(Number(nextPage)) || 1);
      if (!isPageControlled) {
        setUnknownInternalPage(normalizedPage);
      }
      onPageChange?.(normalizedPage);
    },
    [isPageControlled, onPageChange],
  );

  const setUnknownPageSize = useCallback(
    (nextPageSize: number) => {
      const normalizedPS = normalizePageSize(nextPageSize);
      const nextPage = resetPageOnPageSizeChange === false ? unknownPage : 1;

      if (!isPageSizeControlled) {
        setUnknownInternalPageSize(normalizedPS);
      }
      if (!isPageControlled) {
        setUnknownInternalPage(nextPage);
      }

      onPageSizeChange?.(normalizedPS);
      if (nextPage !== unknownPage) {
        onPageChange?.(nextPage);
      }
    },
    [
      isPageControlled,
      isPageSizeControlled,
      onPageChange,
      onPageSizeChange,
      resetPageOnPageSizeChange,
      unknownPage,
    ],
  );

  const unknownPagination = {
    page: clampPaginationPage(unknownPage, Number.MAX_SAFE_INTEGER),
    pageSize: unknownPageSize,
    pageRange: { start: unknownRangeStart, end: unknownRangeEnd },
    canGoToPrevPage: unknownPage > 1,
    canGoToNextPage: hasNextPage ?? true,
    goToFirstPage: () => setUnknownPage(1),
    goToLastPage: () => setUnknownPage(unknownPage),
    goToPrevPage: () => setUnknownPage(unknownPage - 1),
    goToNextPage: () => setUnknownPage(unknownPage + 1),
    setPageSize: setUnknownPageSize,
  };
  const pagination = totalItemsKnown ? knownPagination : unknownPagination;

  const rowsPerPageLabel = localeText?.rowsPerPageLabel ?? "Rows per page:";
  const rangeLabel =
    localeText?.rangeLabel ??
    ((start: number, end: number, count: number) => `${start}-${end} of ${count}`);
  const unknownTotalLabel =
    localeText?.unknownTotalLabel ??
    ((start: number, end: number) => `${start}-${end} of more than ${end}`);
  const previousButtonLabel = localeText?.previousButtonLabel ?? "Previous page";
  const nextButtonLabel = localeText?.nextButtonLabel ?? "Next page";
  const firstButtonLabel = localeText?.firstButtonLabel ?? "First page";
  const lastButtonLabel = localeText?.lastButtonLabel ?? "Last page";
  const ResolvedActionsComponent = ActionsComponent ?? slots?.actions ?? DefaultTablePaginationActions;

  if (accessState.isHidden) {
    return null;
  }

  return (
    <div
      className={[
        "relative flex flex-wrap items-center justify-end gap-4 overflow-hidden rounded-[28px] border border-border-subtle/80 bg-[var(--surface-card)] p-4 shadow-[0_22px_48px_-34px_var(--shadow-color,rgba(15,23,42,0.28))] ring-1 ring-border-subtle/20 backdrop-blur-xs before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-[var(--surface-card)] before:to-transparent",
        className ?? "",
      ]
        .join(" ")
        .trim()}
      data-component="table-pagination"
      data-access-state={accessState.state}
      title={accessReason}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Text variant="secondary">{rowsPerPageLabel}</Text>
        <PaginationSizeChanger
          value={pagination.pageSize}
          onValueChange={pagination.setPageSize}
          options={pageSizeOptions}
          access={accessState.state}
          accessReason={accessReason}
          className="min-w-[132px]"
        />
      </div>

      <Text className="min-w-[160px] rounded-full border border-border-subtle/70 bg-[var(--surface-card)] px-3 py-2 text-center text-text-primary shadow-[0_12px_24px_-22px_var(--shadow-color,rgba(15,23,42,0.2))] ring-1 ring-border-subtle/20 backdrop-blur-xs">
        {totalItemsKnown
          ? rangeLabel(pagination.pageRange.start, pagination.pageRange.end, totalItems, {
              page: pagination.page,
              pageSize: pagination.pageSize,
              totalItemsKnown,
            })
          : unknownTotalLabel(
              pagination.pageRange.start,
              pagination.pageRange.end,
              pagination.page,
              pagination.pageSize,
            )}
      </Text>

      <ResolvedActionsComponent
        page={pagination.page}
        pageSize={pagination.pageSize}
        canGoToPrevPage={pagination.canGoToPrevPage}
        canGoToNextPage={pagination.canGoToNextPage}
        showFirstLastButtons={showFirstLastButtons}
        totalItemsKnown={totalItemsKnown}
        onFirstPage={pagination.goToFirstPage}
        onPrevPage={pagination.goToPrevPage}
        onNextPage={pagination.goToNextPage}
        onLastPage={pagination.goToLastPage}
        firstButtonLabel={firstButtonLabel}
        previousButtonLabel={previousButtonLabel}
        nextButtonLabel={nextButtonLabel}
        lastButtonLabel={lastButtonLabel}
        access={accessState.state}
        accessReason={accessReason}
        className={slotProps?.actions?.className}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  useAgGridTablePagination — real AG Grid v34 pagination sync        */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  resolveTotalItems?: (
    api: AgGridTablePaginationApi<RowData> | null,
    context: { pageSize: number; fallbackTotalItems: number },
  ) => number;
  syncPageSizeToGrid?: (
    api: AgGridTablePaginationApi<RowData>,
    pageSize: number,
  ) => void;
};

export type UseAgGridTablePaginationResult<RowData = unknown> = {
  gridApi: AgGridTablePaginationApi<RowData> | null;
  gridApiRef: React.MutableRefObject<AgGridTablePaginationApi<RowData> | null>;
  pageSize: number;
  pageSizeRef: React.MutableRefObject<number>;
  paginationSnapshot: AgGridTablePaginationSnapshot;
  registerGridApi: (api: AgGridTablePaginationApi<RowData> | null) => void;
  refreshPaginationSnapshot: (
    api?: AgGridTablePaginationApi<RowData> | null,
  ) => void;
  handlePageChange: (nextPage: number) => void;
  handlePageSizeChange: (nextPageSize: number) => void;
};

const DEFAULT_SNAPSHOT: AgGridTablePaginationSnapshot = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
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
export const useAgGridTablePagination = <RowData = unknown>(
  options?: UseAgGridTablePaginationOptions<RowData>,
): UseAgGridTablePaginationResult<RowData> => {
  const initialPageSize = options?.initialPageSize ?? 10;
  const fallbackTotalItems = options?.totalItems ?? 0;

  const [gridApi, setGridApi] = useState<AgGridTablePaginationApi<RowData> | null>(null);
  const gridApiRef = useRef<AgGridTablePaginationApi<RowData> | null>(null);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const pageSizeRef = useRef(initialPageSize);
  const [snapshot, setSnapshot] = useState<AgGridTablePaginationSnapshot>({
    ...DEFAULT_SNAPSHOT,
    pageSize: initialPageSize,
    totalItems: fallbackTotalItems,
  });

  const resolveTotalItemsFn = options?.resolveTotalItems;
  const syncPageSizeToGridFn = options?.syncPageSizeToGrid;

  const refreshPaginationSnapshot = useCallback(
    (overrideApi?: AgGridTablePaginationApi<RowData> | null) => {
      const api = overrideApi ?? gridApiRef.current;
      if (!api) return;

      const currentPageSize = pageSizeRef.current;

      // v34: paginationGetCurrentPage() is 0-indexed
      const gridPage = (api.paginationGetCurrentPage?.() ?? 0) + 1;
      const gridTotalPages = api.paginationGetTotalPages?.() ?? 1;

      let totalItems: number;
      if (resolveTotalItemsFn) {
        totalItems = resolveTotalItemsFn(api, {
          pageSize: currentPageSize,
          fallbackTotalItems,
        });
      } else {
        totalItems = api.paginationGetRowCount?.() ?? fallbackTotalItems;
      }

      setSnapshot({
        page: Math.max(1, gridPage),
        pageSize: currentPageSize,
        totalItems: Math.max(0, totalItems),
        totalPages: Math.max(1, gridTotalPages),
      });
    },
    [fallbackTotalItems, resolveTotalItemsFn],
  );

  const registerGridApi = useCallback(
    (api: AgGridTablePaginationApi<RowData> | null) => {
      gridApiRef.current = api;
      setGridApi(api);
      if (api) {
        refreshPaginationSnapshot(api);
      }
    },
    [refreshPaginationSnapshot],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      const api = gridApiRef.current;
      if (!api) return;
      // v34: paginationGoToPage expects 0-indexed
      api.paginationGoToPage?.(Math.max(0, nextPage - 1));
    },
    [],
  );

  const handlePageSizeChange = useCallback(
    (nextPageSize: number) => {
      const normalizedSize = Math.max(1, Math.trunc(nextPageSize));
      pageSizeRef.current = normalizedSize;
      setPageSize(normalizedSize);

      const api = gridApiRef.current;
      if (!api) return;

      if (syncPageSizeToGridFn) {
        syncPageSizeToGridFn(api, normalizedSize);
      } else {
        // v34: setGridOption replaces old paginationSetPageSize
        api.setGridOption?.("paginationPageSize", normalizedSize);
      }
    },
    [syncPageSizeToGridFn],
  );

  // Keep pageSize ref in sync
  useEffect(() => {
    pageSizeRef.current = pageSize;
  }, [pageSize]);

  return {
    gridApi,
    gridApiRef,
    pageSize,
    pageSizeRef,
    paginationSnapshot: snapshot,
    registerGridApi,
    refreshPaginationSnapshot,
    handlePageChange,
    handlePageSizeChange,
  };
};

export default TablePagination;
