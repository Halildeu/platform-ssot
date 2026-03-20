import React from 'react';

export type PaginationPageRange = {
  start: number;
  end: number;
};

export type UsePaginationStateOptions = {
  totalItems: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  resetPageOnPageSizeChange?: boolean;
};

export type PaginationStateController = {
  page: number;
  pageSize: number;
  totalPages: number;
  pageRange: PaginationPageRange;
  canGoToPrevPage: boolean;
  canGoToNextPage: boolean;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
};

const normalizePageSize = (pageSize: number | undefined) => {
  const normalized = Math.trunc(Number(pageSize ?? 10));
  return Number.isFinite(normalized) && normalized > 0 ? normalized : 10;
};

export const clampPaginationPage = (page: number, totalPages: number) => {
  const normalizedPage = Math.trunc(Number(page));
  const safePage = Number.isFinite(normalizedPage) ? normalizedPage : 1;
  return Math.min(Math.max(1, safePage), Math.max(1, totalPages));
};

export const getPaginationPageCount = (totalItems: number, pageSize: number) =>
  Math.max(1, Math.ceil(Math.max(0, totalItems) / normalizePageSize(pageSize)));

export const getPaginationPageRange = (
  page: number,
  totalItems: number,
  pageSize: number,
): PaginationPageRange => {
  if (totalItems <= 0) {
    return { start: 0, end: 0 };
  }

  const safePageSize = normalizePageSize(pageSize);
  const totalPages = getPaginationPageCount(totalItems, safePageSize);
  const safePage = clampPaginationPage(page, totalPages);
  const start = (safePage - 1) * safePageSize + 1;
  const end = Math.min(totalItems, safePage * safePageSize);

  return { start, end };
};

export const usePaginationState = ({
  totalItems,
  page,
  defaultPage = 1,
  onPageChange,
  pageSize,
  defaultPageSize = 10,
  onPageSizeChange,
  resetPageOnPageSizeChange = true,
}: UsePaginationStateOptions): PaginationStateController => {
  const isPageControlled = typeof page === 'number';
  const isPageSizeControlled = typeof pageSize === 'number';

  const [internalPageSize, setInternalPageSize] = React.useState(() =>
    normalizePageSize(pageSize ?? defaultPageSize),
  );
  const effectivePageSize = isPageSizeControlled
    ? normalizePageSize(pageSize)
    : internalPageSize;
  const totalPages = React.useMemo(
    () => getPaginationPageCount(totalItems, effectivePageSize),
    [effectivePageSize, totalItems],
  );

  const [internalPage, setInternalPage] = React.useState(() =>
    clampPaginationPage(page ?? defaultPage, totalPages),
  );

  React.useEffect(() => {
    if (!isPageControlled) {
      setInternalPage((previousPage) => clampPaginationPage(previousPage, totalPages));
    }
  }, [isPageControlled, totalPages]);

  const effectivePage = clampPaginationPage(
    isPageControlled ? page ?? defaultPage : internalPage,
    totalPages,
  );

  const setPage = React.useCallback(
    (nextPage: number) => {
      const normalizedPage = clampPaginationPage(nextPage, totalPages);
      if (!isPageControlled) {
        setInternalPage(normalizedPage);
      }
      onPageChange?.(normalizedPage);
    },
    [isPageControlled, onPageChange, totalPages],
  );

  const setPageSize = React.useCallback(
    (nextPageSize: number) => {
      const normalizedPageSize = normalizePageSize(nextPageSize);
      const nextTotalPages = getPaginationPageCount(totalItems, normalizedPageSize);
      const nextPage = resetPageOnPageSizeChange
        ? 1
        : clampPaginationPage(effectivePage, nextTotalPages);

      if (!isPageSizeControlled) {
        setInternalPageSize(normalizedPageSize);
      }
      if (!isPageControlled) {
        setInternalPage(nextPage);
      }

      onPageSizeChange?.(normalizedPageSize);
      if (nextPage !== effectivePage) {
        onPageChange?.(nextPage);
      }
    },
    [
      effectivePage,
      isPageControlled,
      isPageSizeControlled,
      onPageChange,
      onPageSizeChange,
      resetPageOnPageSizeChange,
      totalItems,
    ],
  );

  const goToFirstPage = React.useCallback(() => setPage(1), [setPage]);
  const goToLastPage = React.useCallback(() => setPage(totalPages), [setPage, totalPages]);
  const goToPrevPage = React.useCallback(() => setPage(effectivePage - 1), [effectivePage, setPage]);
  const goToNextPage = React.useCallback(() => setPage(effectivePage + 1), [effectivePage, setPage]);

  const pageRange = React.useMemo(
    () => getPaginationPageRange(effectivePage, totalItems, effectivePageSize),
    [effectivePage, effectivePageSize, totalItems],
  );

  return {
    page: effectivePage,
    pageSize: effectivePageSize,
    totalPages,
    pageRange,
    canGoToPrevPage: effectivePage > 1,
    canGoToNextPage: effectivePage < totalPages,
    setPage,
    setPageSize,
    goToPrevPage,
    goToNextPage,
    goToFirstPage,
    goToLastPage,
  };
};

export default usePaginationState;
