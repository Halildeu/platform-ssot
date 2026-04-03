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

const radioVariants = variants({
  base: [
    "peer h-4 w-4 shrink-0 rounded-full border border-border-default appearance-none cursor-pointer",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "checked:border-action-primary checked:bg-action-primary",
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

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: "sm" | "md" | "lg";
  label?: React.ReactNode;
  description?: string;
  access?: AccessLevel;
}

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  access?: AccessLevel;
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// RadioGroup Context
// ---------------------------------------------------------------------------

interface RadioGroupCtx {
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupCtx | null>(null);

// ---------------------------------------------------------------------------
// Radio Component
// ---------------------------------------------------------------------------

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio(props, ref) {
    const {
      className,
      size,
      label,
      description,
      access,
      disabled: disabledProp,
      id: idProp,
      value,
      onChange,
      checked,
      ...rest
    } = props;

    const group = React.useContext(RadioGroupContext);
    const generatedId = React.useId();
    const id = idProp ?? generatedId;

    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    const isDisabled = disabledProp || group?.disabled || shouldBlockInteraction(accessState.state);
    const isChecked = group ? group.value === value : checked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      if (group?.onValueChange && value != null) {
        group.onValueChange(String(value));
      }
    };

    const dotSize = size === "sm" ? "h-1.5 w-1.5" : size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2";

    return (
      <div className="flex items-start gap-2">
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="radio"
            id={id}
            name={group?.name}
            value={value}
            checked={isChecked}
            disabled={isDisabled}
            onChange={handleChange}
            className={cn(radioVariants({ size }), accessStyles(access), className)}
            {...stateAttrs({ access, disabled: isDisabled, component: "radio" })}
            {...rest}
          />
          {/* Inner dot */}
          {isChecked && (
            <span className={cn("pointer-events-none absolute rounded-full bg-white", dotSize)} aria-hidden />
          )}
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

setDisplayName(Radio, "Radio");

// ---------------------------------------------------------------------------
// RadioGroup Component
// ---------------------------------------------------------------------------

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(props, ref) {
    const {
      className,
      name,
      value: valueProp,
      defaultValue,
      onValueChange,
      orientation = "vertical",
      disabled,
      access,
      children,
      ...rest
    } = props;

    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;

    const handleValueChange = (v: string) => {
      if (!isControlled) setInternalValue(v);
      onValueChange?.(v);
    };

    return (
      <RadioGroupContext.Provider value={{ name, value, onValueChange: handleValueChange, disabled }}>
        <div
          ref={ref}
          role="radiogroup"
          className={cn(
            "flex",
            orientation === "vertical" ? "flex-col gap-3" : "flex-row flex-wrap gap-4",
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);

setDisplayName(RadioGroup, "RadioGroup");

export { Radio, RadioGroup, radioVariants };
