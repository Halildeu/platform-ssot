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
export declare const clampPaginationPage: (page: number, totalPages: number) => number;
export declare const getPaginationPageCount: (totalItems: number, pageSize: number) => number;
export declare const getPaginationPageRange: (page: number, totalItems: number, pageSize: number) => PaginationPageRange;
export declare const usePaginationState: ({ totalItems, page, defaultPage, onPageChange, pageSize, defaultPageSize, onPageSizeChange, resetPageOnPageSizeChange, }: UsePaginationStateOptions) => PaginationStateController;
export default usePaginationState;
