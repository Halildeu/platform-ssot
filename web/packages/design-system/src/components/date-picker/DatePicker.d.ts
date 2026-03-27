import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import { type FieldSize } from "../../primitives/_shared/FieldControlPrimitives";
export interface DatePickerMessages {
    emptyValueLabel?: string;
}
/** Props for the DatePicker component. */
export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children">, AccessControlledProps {
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
export declare const DatePicker: React.ForwardRefExoticComponent<DatePickerProps & React.RefAttributes<HTMLInputElement>>;
export default DatePicker;
