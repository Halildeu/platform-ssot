"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { variants } from "../../system/variants";
import { setDisplayName } from "../../system/compose";
import {
  resolveAccessState,
  shouldBlockInteraction,
  accessStyles,
  type AccessLevel,
} from "../../internal/access-controller";
import { stateAttrs } from "../../internal/interaction-core/state-attributes";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const selectVariants = variants({
  base: [
    "flex w-full appearance-none rounded-md border bg-transparent text-sm",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-1",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  variants: {
    size: {
      sm: "h-8 text-xs px-2.5 pr-8",
      md: "h-9 text-sm px-3 pr-9",
      lg: "h-10 text-base px-3.5 pr-10",
    },
    tone: {
      default: "border-border-default hover:border-border-strong",
      error: "border-red-500 focus-visible:ring-red-500",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: "sm" | "md" | "lg";
  tone?: "default" | "error";
  label?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  loading?: boolean;
  access?: AccessLevel;
  onValueChange?: (value: string) => void;
}

// ---------------------------------------------------------------------------
// Chevron icon
// ---------------------------------------------------------------------------

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(props, ref) {
    const {
      className,
      size,
      tone: toneProp,
      label,
      description,
      error,
      placeholder,
      loading = false,
      access,
      onValueChange,
      onChange,
      disabled: disabledProp,
      id: idProp,
      children,
      ...rest
    } = props;

    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const descId = `${id}-desc`;
    const errId = `${id}-err`;

    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    const isDisabled = disabledProp || loading || shouldBlockInteraction(accessState.state);
    const tone = error ? "error" : toneProp;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(selectVariants({ size, tone }), accessStyles(access), className)}
            disabled={isDisabled}
            onChange={handleChange}
            aria-invalid={tone === "error" || undefined}
            aria-describedby={
              [error && errId, description && descId].filter(Boolean).join(" ") || undefined
            }
            {...stateAttrs({ access, loading, disabled: isDisabled, error: !!error, component: "select" })}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>

          {/* Chevron / Spinner */}
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary">
            {loading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <ChevronIcon className="h-4 w-4" />
            )}
          </span>
        </div>

        {error && (
          <p id={errId} className="text-xs text-red-500" role="alert">{error}</p>
        )}
        {description && !error && (
          <p id={descId} className="text-xs text-text-secondary">{description}</p>
        )}
      </div>
    );
  },
);

setDisplayName(Select, "Select");

export { Select, selectVariants };
