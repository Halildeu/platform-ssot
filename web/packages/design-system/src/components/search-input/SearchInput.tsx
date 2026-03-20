import React, { forwardRef, useCallback } from "react";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/*  SearchInput — Input with search icon, clear button, loading        */
/* ------------------------------------------------------------------ */

export type SearchInputSize = "sm" | "md" | "lg";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Component size */
  size?: SearchInputSize;
  /** @deprecated Use `size` instead. Will be removed in v3.0.0. */
  searchSize?: SearchInputSize;
  /** Show loading spinner */
  loading?: boolean;
  /** Show clear button when value is non-empty */
  clearable?: boolean;
  onClear?: () => void;
  /** Keyboard shortcut hint (e.g. "⌘K") */
  shortcutHint?: string;
  /** Disable the search input */
  disabled?: boolean;
}

const sizeStyles: Record<SearchInputSize, string> = {
  sm: "h-8 text-xs pl-8 pr-3",
  md: "h-9 text-sm pl-9 pr-3",
  lg: "h-11 text-base pl-10 pr-4",
};

const iconSizes: Record<SearchInputSize, string> = {
  sm: "left-2.5 h-3.5 w-3.5",
  md: "left-3 h-4 w-4",
  lg: "left-3.5 h-4.5 w-4.5",
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      size: sizeProp,
      searchSize,
      loading = false,
      clearable = true,
      onClear,
      shortcutHint,
      disabled = false,
      value,
      className,
      ...rest
    },
    ref,
  ) => {
    const size = sizeProp ?? searchSize ?? "md";

    if (process.env.NODE_ENV !== "production" && searchSize !== undefined) {
      console.warn(
        '[DesignSystem] "SearchInput" prop "searchSize" is deprecated. Use "size" instead. "searchSize" will be removed in v3.0.0.',
      );
    }

    const resolvedSize: SearchInputSize = size;
    const hasValue = Boolean(value && String(value).length > 0);

    const handleClear = useCallback(() => {
      onClear?.();
    }, [onClear]);

    return (
      <div className={cn("relative w-full", disabled && "opacity-50 cursor-not-allowed")}>
        {/* Search icon */}
        <svg
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 text-[var(--text-secondary)]",
            iconSizes[resolvedSize],
          )}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M11.5 11.5L14 14M1 7a6 6 0 1012 0A6 6 0 001 7z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        <input
          ref={ref}
          type="search"
          value={value}
          disabled={disabled}
          className={cn(
            "w-full rounded-xl border transition-colors duration-150",
            "bg-[var(--surface-canvas)] text-[var(--text-primary)]",
            "border-[var(--border-subtle)]",
            "placeholder:text-[var(--text-disabled)]",
            "focus:border-[var(--action-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--action-primary)]/20",
            "[&::-webkit-search-cancel-button]:hidden",
            sizeStyles[resolvedSize],
            (hasValue && clearable) || shortcutHint ? "pr-14" : "",
            className,
          )}
          {...rest}
        />

        {/* Right side: loading / clear / shortcut hint */}
        <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {loading && (
            <svg className="h-4 w-4 animate-spin text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {!loading && hasValue && clearable && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded p-0.5 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              aria-label="Clear search"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
          {!loading && !hasValue && shortcutHint && (
            <kbd className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-default)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
              {shortcutHint}
            </kbd>
          )}
        </div>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
