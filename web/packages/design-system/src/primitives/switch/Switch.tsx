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

const switchTrackVariants = variants({
  base: [
    "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent",
    "transition-colors duration-200 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  variants: {
    size: {
      sm: "h-5 w-9",
      md: "h-6 w-11",
      lg: "h-7 w-[52px]",
    },
    checked: {
      true: "bg-action-primary",
      false: "bg-gray-200 dark:bg-gray-700",
    },
  },
  defaultVariants: {
    size: "md",
    checked: false,
  },
});

const thumbSizeMap: Record<string, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const thumbTranslateMap: Record<string, string> = {
  sm: "translate-x-4",
  md: "translate-x-5",
  lg: "translate-x-[26px]",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value"> {
  size?: "sm" | "md" | "lg";
  label?: React.ReactNode;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  access?: AccessLevel;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch(props, ref) {
    const {
      className,
      size = "md",
      label,
      description,
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      access,
      disabled: disabledProp,
      id: idProp,
      ...rest
    } = props;

    const generatedId = React.useId();
    const id = idProp ?? generatedId;

    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isControlled = checkedProp !== undefined;
    const isChecked = isControlled ? checkedProp : internalChecked;

    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    const isDisabled = disabledProp || shouldBlockInteraction(accessState.state);

    const toggle = () => {
      if (isDisabled) return;
      const next = !isChecked;
      if (!isControlled) setInternalChecked(next);
      onCheckedChange?.(next);
    };

    return (
      <div className="flex items-center gap-3">
        <button
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={isChecked}
          disabled={isDisabled}
          onClick={toggle}
          className={cn(
            switchTrackVariants({ size, checked: isChecked }),
            accessStyles(access),
            className,
          )}
          {...stateAttrs({
            access,
            disabled: isDisabled,
            state: isChecked ? "checked" : "unchecked",
            component: "switch",
          })}
          {...rest}
        >
          <span
            className={cn(
              "pointer-events-none inline-block rounded-full bg-white shadow-sm ring-0",
              "transition-transform duration-200 ease-in-out",
              thumbSizeMap[size],
              isChecked ? thumbTranslateMap[size] : "translate-x-0",
            )}
            aria-hidden
          />
        </button>

        {(label || description) && (
          <div className="flex flex-col gap-0.5">
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

setDisplayName(Switch, "Switch");

export { Switch, switchTrackVariants };
