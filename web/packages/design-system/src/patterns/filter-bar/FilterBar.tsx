"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { setDisplayName } from "../../system/compose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Search input slot */
  search?: React.ReactNode;
  /** Primary filter elements (always visible) */
  primary?: React.ReactNode;
  /** Secondary filter elements (collapsed under "More") */
  secondary?: React.ReactNode;
  /** Actions slot (right side) */
  actions?: React.ReactNode;
  /** Number of active filters */
  activeCount?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function FilterBar(props: FilterBarProps) {
  const {
    className,
    search,
    primary,
    secondary,
    actions,
    activeCount,
    ...rest
  } = props;

  const [showMore, setShowMore] = React.useState(false);
  const hasSecondary = !!secondary;

  return (
    <div className={cn("flex flex-col gap-3", className)} {...rest}>
      {/* Main row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        {search && <div className="w-64 shrink-0">{search}</div>}

        {/* Primary filters */}
        {primary && (
          <div className="flex items-center gap-2 flex-wrap">{primary}</div>
        )}

        {/* More toggle */}
        {hasSecondary && (
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
              "border border-border-default text-text-secondary",
              "hover:bg-surface-muted transition-colors",
              showMore && "bg-surface-muted",
            )}
            onClick={() => setShowMore(!showMore)}
          >
            More
            {activeCount != null && activeCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-action-primary text-text-inverse text-xs font-medium px-1">
                {activeCount}
              </span>
            )}
            <svg
              className={cn("h-3.5 w-3.5 transition-transform duration-200", showMore && "rotate-180")}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>

      {/* Secondary row (collapsible) */}
      {hasSecondary && showMore && (
        <div className="flex items-center gap-2 flex-wrap pl-0 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          {secondary}
        </div>
      )}
    </div>
  );
}

setDisplayName(FilterBar, "FilterBar");

export { FilterBar };
