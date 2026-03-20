import React from "react";
import { cn } from "../../utils/cn";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";
import {
  buildDescribedBy,
  FieldControlShell,
  getFieldFrameClass,
  getFieldTone,
  type FieldSize,
} from "../../primitives/_shared/FieldControlPrimitives";
import { Text } from "../../primitives/text/Text";

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children">,
    AccessControlledProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  size?: FieldSize;
  onValueChange?: (value: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  minLabel?: React.ReactNode;
  maxLabel?: React.ReactNode;
  valueFormatter?: (value: number) => React.ReactNode;
}

const toNumericValue = (value: string | number | readonly string[] | undefined, fallback: number) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : fallback;
};

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    id,
    label,
    description,
    hint,
    error,
    invalid = false,
    size = "md",
    onChange,
    onValueChange,
    disabled = false,
    required = false,
    className,
    fullWidth = true,
    access = "full",
    accessReason,
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue,
    minLabel,
    maxLabel,
    valueFormatter,
    ...props
  },
  forwardedRef,
) {
  if (process.env.NODE_ENV !== "production" && invalid !== undefined && invalid !== false) {
    console.warn(
      '[DesignSystem] "Slider" prop "invalid" is deprecated. Use "error" instead. "invalid" will be removed in v3.0.0.',
    );
  }

  const accessState = resolveAccessState(access);
  const generatedId = React.useId();
  const inputId = id ?? `slider-${generatedId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = buildDescribedBy(descriptionId, error ? errorId : hintId);
  const isReadonly = accessState.isReadonly;
  const isDisabled = disabled || accessState.isDisabled;
  const tone = getFieldTone({ invalid: invalid || Boolean(error), disabled: isDisabled, readonly: isReadonly });
  const isControlled = value !== undefined;
  const resolvedMin = Number(min);
  const resolvedMax = Number(max);
  const [internalValue, setInternalValue] = React.useState(() => toNumericValue(defaultValue, resolvedMin));
  const currentValue = isControlled ? toNumericValue(value, resolvedMin) : internalValue;

  React.useEffect(() => {
    if (!isControlled) return;
    setInternalValue(toNumericValue(value, resolvedMin));
  }, [isControlled, resolvedMin, value]);

  const formattedValue = valueFormatter ? valueFormatter(currentValue) : `${currentValue}`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadonly) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const nextValue = Number(event.target.value);
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(event);
    onValueChange?.(nextValue, event);
  };

  if (accessState.isHidden) {
    return null;
  }

  return (
    <FieldControlShell
      inputId={inputId}
      label={label}
      description={description}
      hint={hint}
      error={error}
      required={required}
      fullWidth={fullWidth}
    >
      <div className="space-y-3">
        <div className={getFieldFrameClass(size, tone, fullWidth, className)}>
          <input
            {...props}
            ref={forwardedRef}
            id={inputId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            disabled={isDisabled}
            required={required}
            aria-invalid={invalid || Boolean(error) || undefined}
            aria-readonly={isReadonly || undefined}
            aria-disabled={isDisabled || isReadonly || undefined}
            aria-describedby={describedBy}
            title={accessReason}
            className={cn(
              "min-w-0 flex-1 accent-[var(--accent-primary)] bg-transparent",
              isReadonly ? "cursor-default" : isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
            )}
            onChange={handleChange}
          />
          <Text
            as="span"
            className="shrink-0 rounded-full border border-[var(--border-default)] bg-[var(--surface-canvas)] px-3 py-1 text-xs font-semibold tabular-nums text-[var(--text-primary)]"
          >
            {formattedValue}
          </Text>
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
          <span>{minLabel ?? resolvedMin}</span>
          <span>{maxLabel ?? resolvedMax}</span>
        </div>
      </div>
    </FieldControlShell>
  );
});

Slider.displayName = "Slider";

export default Slider;
