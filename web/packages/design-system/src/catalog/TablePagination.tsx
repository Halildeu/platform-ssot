import React from 'react';
import { IconButton } from '../primitives/icon-button';
import {
  PaginationSizeChanger,
  type PaginationSizeOption,
} from './PaginationSizeChanger';
import { Text } from '../primitives/text';
import {
  clampPaginationPage,
  usePaginationState,
  type UsePaginationStateOptions,
} from './usePaginationState';
import {
  resolveAccessState,
  type AccessControlledProps,
  type AccessLevel,
} from '../internal/access-controller';

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
  unknownTotalLabel?: (start: number, end: number, page: number, pageSize: number) => React.ReactNode;
  previousButtonLabel?: string;
  nextButtonLabel?: string;
  firstButtonLabel?: string;
  lastButtonLabel?: string;
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
      'flex items-center gap-2 rounded-full border border-border-subtle/70 bg-[var(--surface-card)] px-2 py-1 shadow-[0_12px_24px_-22px_var(--shadow-color,rgba(15,23,42,0.2))] ring-1 ring-border-subtle/20 backdrop-blur-xs',
      className ?? '',
    ]
      .join(' ')
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
  access = 'full',
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
  const isPageControlled = typeof page === 'number';
  const isPageSizeControlled = typeof pageSize === 'number';
  const [unknownInternalPage, setUnknownInternalPage] = React.useState(() =>
    Math.max(1, Math.trunc(Number(page ?? defaultPage ?? 1)) || 1),
  );
  const [unknownInternalPageSize, setUnknownInternalPageSize] = React.useState(() =>
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

  const setUnknownPage = React.useCallback(
    (nextPage: number) => {
      const normalizedPage = Math.max(1, Math.trunc(Number(nextPage)) || 1);
      if (!isPageControlled) {
        setUnknownInternalPage(normalizedPage);
      }
      onPageChange?.(normalizedPage);
    },
    [isPageControlled, onPageChange],
  );

  const setUnknownPageSize = React.useCallback(
    (nextPageSize: number) => {
      const normalizedPageSize = normalizePageSize(nextPageSize);
      const nextPage = resetPageOnPageSizeChange === false ? unknownPage : 1;

      if (!isPageSizeControlled) {
        setUnknownInternalPageSize(normalizedPageSize);
      }
      if (!isPageControlled) {
        setUnknownInternalPage(nextPage);
      }

      onPageSizeChange?.(normalizedPageSize);
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
    pageRange: {
      start: unknownRangeStart,
      end: unknownRangeEnd,
    },
    canGoToPrevPage: unknownPage > 1,
    canGoToNextPage: hasNextPage ?? true,
    goToFirstPage: () => setUnknownPage(1),
    goToLastPage: () => setUnknownPage(unknownPage),
    goToPrevPage: () => setUnknownPage(unknownPage - 1),
    goToNextPage: () => setUnknownPage(unknownPage + 1),
    setPageSize: setUnknownPageSize,
  };
  const pagination = totalItemsKnown ? knownPagination : unknownPagination;

  const rowsPerPageLabel = localeText?.rowsPerPageLabel ?? 'Rows per page:';
  const rangeLabel =
    localeText?.rangeLabel ??
    ((start: number, end: number, count: number) => `${start}-${end} of ${count}`);
  const unknownTotalLabel =
    localeText?.unknownTotalLabel ??
    ((start: number, end: number) => `${start}-${end} of more than ${end}`);
  const previousButtonLabel = localeText?.previousButtonLabel ?? 'Previous page';
  const nextButtonLabel = localeText?.nextButtonLabel ?? 'Next page';
  const firstButtonLabel = localeText?.firstButtonLabel ?? 'First page';
  const lastButtonLabel = localeText?.lastButtonLabel ?? 'Last page';
  const ResolvedActionsComponent = ActionsComponent ?? slots?.actions ?? DefaultTablePaginationActions;

  if (accessState.isHidden) {
    return null;
  }

  return (
    <div
      className={[
        'relative flex flex-wrap items-center justify-end gap-4 overflow-hidden rounded-[28px] border border-border-subtle/80 bg-[var(--surface-card)] p-4 shadow-[0_22px_48px_-34px_var(--shadow-color,rgba(15,23,42,0.28))] ring-1 ring-border-subtle/20 backdrop-blur-xs before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-[var(--surface-card)] before:to-transparent',
        className ?? '',
      ]
        .join(' ')
        .trim()}
      data-component="table-pagination"
      data-surface-appearance="premium"
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

TablePagination.displayName = "TablePagination";

export default TablePagination;
