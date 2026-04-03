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

const inputVariants = variants({
  base: [
    "flex w-full rounded-md border bg-transparent text-sm",
    "transition-colors duration-150",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "placeholder:text-text-disabled",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-1",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  variants: {
    size: {
      sm: "h-8 text-xs px-2.5",
      md: "h-9 text-sm px-3",
      lg: "h-10 text-base px-3.5",
    },
    tone: {
      default: "border-border-default hover:border-border-strong",
      error: "border-red-500 focus-visible:ring-red-500",
      success: "border-green-500 focus-visible:ring-green-500",
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

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  tone?: "default" | "error" | "success";
  label?: string;
  description?: string;
  error?: string;
  leadingVisual?: React.ReactNode;
  trailingVisual?: React.ReactNode;
  showCount?: boolean;
  loading?: boolean;
  access?: AccessLevel;
  onValueChange?: (value: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const {
      className,
      size,
      tone: toneProp,
      label,
      description,
      error,
      leadingVisual,
      trailingVisual,
      showCount = false,
      loading = false,
      access,
      onValueChange,
      onChange,
      maxLength,
      value,
      defaultValue,
      disabled: disabledProp,
      readOnly: readOnlyProp,
      id: idProp,
      ...rest
    } = props;

    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const descId = `${id}-desc`;
    const errId = `${id}-err`;

    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    const isDisabled = disabledProp || shouldBlockInteraction(accessState.state);
    const isReadOnly = readOnlyProp || accessState.isReadonly;
    const tone = error ? "error" : toneProp;

    const [charCount, setCharCount] = React.useState(() =>
      String(value ?? defaultValue ?? "").length,
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (showCount) setCharCount(e.target.value.length);
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    const hasLeading = !!leadingVisual;
    const hasTrailing = !!trailingVisual || loading;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {hasLeading && (
            <span className="absolute left-3 flex items-center text-text-secondary pointer-events-none [&>svg]:h-4 [&>svg]:w-4">
              {leadingVisual}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            className={cn(
              inputVariants({ size, tone }),
              hasLeading && "pl-9",
              hasTrailing && "pr-9",
              accessStyles(access),
              className,
            )}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            disabled={isDisabled}
            readOnly={isReadOnly}
            maxLength={maxLength}
            aria-invalid={tone === "error" || undefined}
            aria-describedby={
              [error && errId, description && descId].filter(Boolean).join(" ") || undefined
            }
            {...stateAttrs({ access, loading, disabled: isDisabled, readonly: isReadOnly, error: !!error, component: "input" })}
            {...rest}
          />

          {hasTrailing && (
            <span className="absolute right-3 flex items-center text-text-secondary [&>svg]:h-4 [&>svg]:w-4">
              {loading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : trailingVisual}
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            {error && (
              <p id={errId} className="text-xs text-red-500" role="alert">{error}</p>
            )}
            {description && !error && (
              <p id={descId} className="text-xs text-text-secondary">{description}</p>
            )}
          </div>
          {showCount && maxLength != null && (
            <span className="text-xs text-text-secondary tabular-nums shrink-0">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

setDisplayName(Input, "Input");

export { Input, inputVariants };
