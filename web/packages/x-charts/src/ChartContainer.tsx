import React from "react";
import { cn, Spinner, Text } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChartContainerProps {
  /** Card title displayed in the header. */
  title?: string;
  /** Secondary description below the title. */
  description?: string;
  /** Show a loading spinner instead of children. @default false */
  loading?: boolean;
  /** Error message — replaces children with an error state. */
  error?: string;
  /** Show the empty-data placeholder. @default false */
  empty?: boolean;
  /** Label shown in the empty state. @default "No data available" */
  emptyLabel?: string;
  /** Explicit chart area height (px or CSS string). @default 300 */
  height?: number | string;
  /** Additional class name for the outer wrapper. */
  className?: string;
  /** Action buttons rendered in the header row. */
  actions?: React.ReactNode;
  /** Chart content. */
  children: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ChartContainer({
  title,
  description,
  loading = false,
  error,
  empty = false,
  emptyLabel = "No data available",
  height = 300,
  className,
  actions,
  children,
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-default)]",
        className,
      )}
    >
      {/* ---- header ---- */}
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-3">
          <div>
            {title && (
              <Text as="div" className="text-sm font-semibold text-[var(--text-primary)]">
                {title}
              </Text>
            )}
            {description && (
              <Text className="text-[11px] text-[var(--text-secondary)]">
                {description}
              </Text>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* ---- body ---- */}
      <div className="relative" style={{ height }}>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <svg
              className="h-8 w-8 text-[var(--state-error-text)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <Text className="text-xs text-[var(--text-secondary)]">{error}</Text>
          </div>
        ) : empty ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <svg
              className="h-8 w-8 text-[var(--text-tertiary)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M3 3h18v18H3zM8 12h8M12 8v8" strokeLinecap="round" />
            </svg>
            <Text className="text-xs text-[var(--text-secondary)]">{emptyLabel}</Text>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

ChartContainer.displayName = "ChartContainer";

export default ChartContainer;
