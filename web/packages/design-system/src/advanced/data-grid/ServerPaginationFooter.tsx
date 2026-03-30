/**
 * ServerPaginationFooter — Custom pagination bar for SSRM grids.
 *
 * Features:
 * - Page size selector with "Tümü" (All) option
 * - Editable page number input (type a page and press Enter)
 * - First / Previous / Next / Last navigation buttons
 * - "X to Y of Z" row info display
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GridApi } from "ag-grid-community";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ServerPaginationFooterProps {
  gridApi: GridApi | null;
  /** Page size options. @default [25, 50, 100, 200] */
  pageSizeOptions?: number[];
  /** Show "Tümü" (all rows) option in page size selector. @default true */
  showAllOption?: boolean;
  /** Label for "all rows" option. @default "Tümü" */
  allLabel?: string;
  /** Content rendered at the start (left) of the footer bar. */
  startSlot?: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG, no external dependency)                         */
/* ------------------------------------------------------------------ */

const ChevronFirst: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 12 2 8 6 4" /><line x1="14" y1="4" x2="14" y2="12" />
  </svg>
);
const ChevronLeft: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="10 12 6 8 10 4" />
  </svg>
);
const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 4 10 8 6 12" />
  </svg>
);
const ChevronLast: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="10 4 14 8 10 12" /><line x1="2" y1="4" x2="2" y2="12" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const ServerPaginationFooter: React.FC<ServerPaginationFooterProps> = ({
  gridApi,
  pageSizeOptions = [25, 50, 100, 200],
  showAllOption = true,
  allLabel = "Tümü",
  startSlot,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [totalRows, setTotalRows] = useState(0);
  const [pageInputValue, setPageInputValue] = useState("1");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state from AG Grid pagination events
  const syncFromGrid = useCallback(() => {
    if (!gridApi) return;
    const page = gridApi.paginationGetCurrentPage?.() ?? 0;
    const total = gridApi.paginationGetTotalPages?.() ?? 0;
    const size = gridApi.paginationGetPageSize?.() ?? 50;
    const rows = gridApi.paginationGetRowCount?.() ?? 0;
    setCurrentPage(page);
    setTotalPages(total);
    setPageSize(size);
    setTotalRows(rows);
    setPageInputValue(String(page + 1));
  }, [gridApi]);

  // Listen to pagination changes
  useEffect(() => {
    if (!gridApi) return;
    syncFromGrid();
    const handler = () => syncFromGrid();
    gridApi.addEventListener("paginationChanged", handler);
    return () => {
      gridApi.removeEventListener("paginationChanged", handler);
    };
  }, [gridApi, syncFromGrid]);

  // Derived
  const startRow = totalRows === 0 ? 0 : currentPage * pageSize + 1;
  const endRow = Math.min((currentPage + 1) * pageSize, totalRows);
  const isFirst = currentPage === 0;
  const isLast = currentPage >= totalPages - 1;
  const isAllMode = totalRows > 0 && pageSize >= totalRows;

  // Handlers
  const goToPage = useCallback(
    (page: number) => {
      if (!gridApi) return;
      const clamped = Math.max(0, Math.min(page, totalPages - 1));
      gridApi.paginationGoToPage(clamped);
    },
    [gridApi, totalPages],
  );

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!gridApi) return;
      const val = e.target.value;
      if (val === "all") {
        // Set page size to total rows to show all
        gridApi.setGridOption("paginationPageSize", totalRows || 10000);
      } else {
        gridApi.setGridOption("paginationPageSize", Number(val));
      }
    },
    [gridApi, totalRows],
  );

  const handlePageInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const parsed = parseInt(pageInputValue, 10);
        if (!isNaN(parsed) && parsed >= 1) {
          goToPage(parsed - 1);
        }
        inputRef.current?.blur();
      } else if (e.key === "Escape") {
        setPageInputValue(String(currentPage + 1));
        inputRef.current?.blur();
      }
    },
    [pageInputValue, goToPage, currentPage],
  );

  const handlePageInputBlur = useCallback(() => {
    const parsed = parseInt(pageInputValue, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      goToPage(parsed - 1);
    } else {
      setPageInputValue(String(currentPage + 1));
    }
  }, [pageInputValue, goToPage, currentPage, totalPages]);

  if (!gridApi) return null;

  const navBtnClass = (disabled: boolean) =>
    [
      "flex h-7 w-7 items-center justify-center rounded transition-colors",
      disabled
        ? "cursor-not-allowed text-text-disabled"
        : "text-text-secondary hover:bg-surface-raised hover:text-text-primary",
    ].join(" ");

  return (
    <div
      className="flex items-center justify-between border-t border-border-subtle bg-surface-default px-4 py-1.5 text-xs text-text-secondary"
      data-component="server-pagination-footer"
    >
      {/* Left: Start slot (e.g. Veri modu) */}
      <div className="flex items-center">
        {startSlot}
      </div>

      {/* Right: Page size + info + navigation grouped together */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>Sayfa boyutu:</span>
          <select
            value={isAllMode ? "all" : pageSize}
            onChange={handlePageSizeChange}
            className="h-7 rounded border border-border-default bg-surface-default px-1.5 text-xs text-text-primary"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
            {showAllOption && (
              <option value="all">{allLabel}</option>
            )}
          </select>
        </div>

        <span>
          {totalRows === 0
            ? "Kayıt yok"
            : `${startRow} – ${endRow} / ${totalRows.toLocaleString("tr-TR")}`}
        </span>

        <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => goToPage(0)}
          className={navBtnClass(isFirst)}
          aria-label="İlk sayfa"
        >
          <ChevronFirst className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={isFirst}
          onClick={() => goToPage(currentPage - 1)}
          className={navBtnClass(isFirst)}
          aria-label="Önceki sayfa"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {/* Editable page input */}
        <div className="flex items-center gap-1 px-1">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={pageInputValue}
            onChange={(e) => setPageInputValue(e.target.value.replace(/\D/g, ""))}
            onKeyDown={handlePageInputKeyDown}
            onBlur={handlePageInputBlur}
            onFocus={(e) => e.target.select()}
            className="h-7 w-10 rounded border border-border-default bg-surface-default text-center text-xs text-text-primary focus:border-action-primary focus:outline-hidden focus:ring-1 focus:ring-accent-focus"
            aria-label="Sayfa numarası"
          />
          <span>/ {totalPages}</span>
        </div>

        <button
          type="button"
          disabled={isLast}
          onClick={() => goToPage(currentPage + 1)}
          className={navBtnClass(isLast)}
          aria-label="Sonraki sayfa"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={() => goToPage(totalPages - 1)}
          className={navBtnClass(isLast)}
          aria-label="Son sayfa"
        >
          <ChevronLast className="h-3.5 w-3.5" />
        </button>
        </div>
      </div>
    </div>
  );
};

ServerPaginationFooter.displayName = "ServerPaginationFooter";
