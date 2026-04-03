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

const textareaVariants = variants({
  base: [
    "flex w-full rounded-md border bg-transparent px-3 py-2 text-sm",
    "transition-colors duration-150",
    "placeholder:text-text-disabled",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-1",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "resize-y min-h-[80px]",
  ],
  variants: {
    tone: {
      default: "border-border-default hover:border-border-strong",
      error: "border-red-500 focus-visible:ring-red-500",
      success: "border-green-500 focus-visible:ring-green-500",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  tone?: "default" | "error" | "success";
  label?: string;
  description?: string;
  error?: string;
  showCount?: boolean;
  access?: AccessLevel;
  onValueChange?: (value: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    const {
      className,
      tone: toneProp,
      label,
      description,
      error,
      showCount = false,
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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCount) setCharCount(e.target.value.length);
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

        <textarea
          ref={ref}
          id={id}
          className={cn(textareaVariants({ tone }), accessStyles(access), className)}
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
          {...stateAttrs({ access, disabled: isDisabled, readonly: isReadOnly, error: !!error, component: "textarea" })}
          {...rest}
        />

        <div className="flex items-start justify-between gap-2">
          <div>
            {error && <p id={errId} className="text-xs text-red-500" role="alert">{error}</p>}
            {description && !error && <p id={descId} className="text-xs text-text-secondary">{description}</p>}
          </div>
          {showCount && maxLength != null && (
            <span className="text-xs text-text-secondary tabular-nums shrink-0">{charCount}/{maxLength}</span>
          )}
        </div>
      </div>
    );
  },
);

setDisplayName(Textarea, "Textarea");

export { Textarea, textareaVariants };
