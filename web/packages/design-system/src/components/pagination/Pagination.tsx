"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { setDisplayName } from "../../system/compose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showEdges?: boolean;
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Page range algorithm
// ---------------------------------------------------------------------------

function getPageRange(page: number, total: number, siblings: number): (number | "ellipsis")[] {
  const totalNumbers = siblings * 2 + 5; // siblings each side + first + last + page + 2 ellipsis

  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(page - siblings, 2);
  const rightSibling = Math.min(page + siblings, total - 1);

  const showLeftEllipsis = leftSibling > 3;
  const showRightEllipsis = rightSibling < total - 2;

  const items: (number | "ellipsis")[] = [1];

  if (showLeftEllipsis) {
    items.push("ellipsis");
  } else {
    for (let i = 2; i < leftSibling; i++) items.push(i);
  }

  for (let i = leftSibling; i <= rightSibling; i++) items.push(i);

  if (showRightEllipsis) {
    items.push("ellipsis");
  } else {
    for (let i = rightSibling + 1; i < total; i++) items.push(i);
  }

  items.push(total);

  return items;
}

// ---------------------------------------------------------------------------
// Chevron icons
// ---------------------------------------------------------------------------

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M10 4l-4 4 4 4" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Shared button classes
// ---------------------------------------------------------------------------

const pageButtonBase = [
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  "h-9 min-w-9 px-2",
  "transition-colors duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-1",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ");

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  function Pagination(props, ref) {
    const {
      className,
      page,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showEdges = true,
      disabled = false,
      ...rest
    } = props;

    if (totalPages <= 1) return null;

    const pages = getPageRange(page, totalPages, siblingCount);

    return (
      <nav ref={ref} aria-label="Pagination" className={cn("flex items-center gap-1", className)} {...rest}>
        {/* Previous */}
        <button
          type="button"
          className={cn(pageButtonBase, "text-text-secondary hover:bg-surface-muted")}
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Pages */}
        {pages.map((item, i) =>
          item === "ellipsis" ? (
            <span key={`e-${i}`} className="px-1 text-text-disabled select-none">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={cn(
                pageButtonBase,
                item === page
                  ? "bg-action-primary text-text-inverse shadow-sm"
                  : "text-text-secondary hover:bg-surface-muted",
              )}
              disabled={disabled}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}

        {/* Next */}
        <button
          type="button"
          className={cn(pageButtonBase, "text-text-secondary hover:bg-surface-muted")}
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    );
  },
);

setDisplayName(Pagination, "Pagination");

export { Pagination };
