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

export interface TimePickerMessages {
  emptyValueLabel?: string;
}

export interface TimePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children">,
    AccessControlledProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  size?: FieldSize;
  onValueChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  messages?: TimePickerMessages;
}

export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(
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
    step,
    ...props
  },
  forwardedRef,
) {
  const accessState = resolveAccessState(access);
  const generatedId = React.useId();
  const inputId = id ?? `time-picker-${generatedId}`;
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
  const emptyValueLabel = messages?.emptyValueLabel ?? "Saat secin";

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
          type="time"
          value={currentValue}
          min={min}
          max={max}
          step={step}
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
          className="shrink-0 rounded-full border border-[var(--border-default)] bg-[var(--surface-canvas)] px-3 py-1 text-xs font-medium tabular-nums"
          title={accessReason}
        >
          {currentValue || emptyValueLabel}
        </Text>
      </div>
    </FieldControlShell>
  );
});

TimePicker.displayName = "TimePicker";

export default TimePicker;
