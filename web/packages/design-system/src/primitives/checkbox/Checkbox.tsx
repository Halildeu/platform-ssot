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

const checkboxVariants = variants({
  base: [
    "peer h-4 w-4 shrink-0 rounded border border-border-default",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[state=checked]:bg-action-primary data-[state=checked]:border-action-primary data-[state=checked]:text-white",
    "data-[state=indeterminate]:bg-action-primary data-[state=indeterminate]:border-action-primary data-[state=indeterminate]:text-white",
  ],
  variants: {
    size: {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: "sm" | "md" | "lg";
  label?: React.ReactNode;
  description?: string;
  indeterminate?: boolean;
  access?: AccessLevel;
  onCheckedChange?: (checked: boolean) => void;
}

// ---------------------------------------------------------------------------
// Check / Indeterminate icons
// ---------------------------------------------------------------------------

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 8.5l3 3 6-6" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <path d="M4 8h8" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const {
      className,
      size,
      label,
      description,
      indeterminate = false,
      access,
      onCheckedChange,
      onChange,
      checked,
      defaultChecked,
      disabled: disabledProp,
      id: idProp,
      ...rest
    } = props;

    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const inputRef = React.useRef<HTMLInputElement>(null);

    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    const isDisabled = disabledProp || shouldBlockInteraction(accessState.state);

    // Sync indeterminate (not controllable via attribute)
    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    const state = indeterminate ? "indeterminate" : checked ? "checked" : "unchecked";
    const iconClass = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5";

    return (
      <div className="flex items-start gap-2">
        <div className="relative flex items-center justify-center">
          <input
            ref={(node) => {
              (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }}
            type="checkbox"
            id={id}
            className={cn(
              checkboxVariants({ size }),
              "appearance-none cursor-pointer",
              accessStyles(access),
              className,
            )}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={isDisabled}
            onChange={handleChange}
            data-state={state}
            {...stateAttrs({ access, disabled: isDisabled, state, component: "checkbox" })}
            {...rest}
          />
          {/* Visual indicator overlay */}
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-current">
            {indeterminate ? (
              <MinusIcon className={iconClass} />
            ) : (checked ?? defaultChecked) ? (
              <CheckIcon className={iconClass} />
            ) : null}
          </span>
        </div>

        {(label || description) && (
          <div className="flex flex-col gap-0.5 pt-0.5">
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  "text-sm font-medium text-text-primary cursor-pointer leading-none",
                  isDisabled && "cursor-not-allowed opacity-50",
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-xs text-text-secondary">{description}</span>
            )}
          </div>
        )}
      </div>
    );
  },
);

setDisplayName(Checkbox, "Checkbox");

export { Checkbox, checkboxVariants };
