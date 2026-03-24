import React from "react";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";
import {
  buildDescribedBy,
  FieldControlShell,
  getFieldFrameClass,
  getFieldInputClass,
  getFieldTone,
  type FieldSize,
} from "../../primitives/_shared/FieldControlPrimitives";
import { Text } from "../../primitives/text/Text";

export interface DatePickerMessages {
  emptyValueLabel?: string;
}

/** Props for the DatePicker component. */
export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children">,
    AccessControlledProps {
  /** Field label displayed above the input. */
  label?: React.ReactNode;
  /** Descriptive text below the label. */
  description?: React.ReactNode;
  /** Help text displayed below the input. */
  hint?: React.ReactNode;
  /** Error message that activates the invalid state. */
  error?: React.ReactNode;
  /** @deprecated Use `error` instead. Whether the input is in an invalid state. */
  invalid?: boolean;
  /** Size variant of the field control. */
  size?: FieldSize;
  /** Callback fired when the date value changes. */
  onValueChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Whether the input spans the full container width. */
  fullWidth?: boolean;
  /** Locale-specific message overrides. */
  messages?: DatePickerMessages;
}

/**
 * Native date input wrapped in the field control shell with label, description, and validation.
 *
 * @example
 * ```tsx
 * <DatePicker
 *   label="Start date"
 *   value={startDate}
 *   onChange={handleChange}
 *   error={errors.startDate}
 * />
 * ```
 */
export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
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
    messages,
    access = "full",
    accessReason,
    value,
    defaultValue,
    min,
    max,
    ...props
  },
  forwardedRef,
) {
  if (process.env.NODE_ENV !== "production" && invalid !== undefined && invalid !== false) {
    console.warn(
      '[DesignSystem] "DatePicker" prop "invalid" is deprecated. Use "error" instead. "invalid" will be removed in v3.0.0.',
    );
  }

  const accessState = resolveAccessState(access);
  const generatedId = React.useId();
  const inputId = id ?? `date-picker-${generatedId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = buildDescribedBy(descriptionId, error ? errorId : hintId);
  const isReadonly = accessState.isReadonly;
  const isDisabled = disabled || accessState.isDisabled;
  const tone = getFieldTone({ invalid: invalid || Boolean(error), disabled: isDisabled, readonly: isReadonly });
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(() => `${defaultValue ?? ""}`);
  const currentValue = isControlled ? `${value ?? ""}` : internalValue;
  const emptyValueLabel = messages?.emptyValueLabel ?? "Tarih secin";

  React.useEffect(() => {
    if (!isControlled) return;
    setInternalValue(`${value ?? ""}`);
  }, [isControlled, value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadonly) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const nextValue = event.target.value;
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
      <div className={getFieldFrameClass(size, tone, fullWidth, className)}>
        <input
          {...props}
          ref={forwardedRef}
          id={inputId}
          type="date"
          value={currentValue}
          min={min}
          max={max}
          disabled={isDisabled}
          required={required}
          aria-invalid={invalid || Boolean(error) || undefined}
          aria-readonly={isReadonly || undefined}
          aria-disabled={isDisabled || isReadonly || undefined}
          aria-describedby={describedBy}
          className={getFieldInputClass(size)}
          onChange={handleChange}
        />
        <Text
          as="span"
          variant={currentValue ? "muted" : "secondary"}
          className="shrink-0 rounded-full border border-border-default bg-[var(--surface-canvas)] px-3 py-1 text-xs font-medium tabular-nums"
          title={accessReason}
        >
          {currentValue || emptyValueLabel}
        </Text>
      </div>
    </FieldControlShell>
  );
});

DatePicker.displayName = "DatePicker";

export default DatePicker;
