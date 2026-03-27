import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import { type FieldSize } from "../../primitives/_shared/FieldControlPrimitives";
export interface TimePickerMessages {
    emptyValueLabel?: string;
}
/** Props for the TimePicker component.
 * @example
 * ```tsx
 * <TimePicker />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/time-picker)
 */
export interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children">, AccessControlledProps {
    /** Field label displayed above the input. */
    label?: React.ReactNode;
    /** Descriptive text below the label. */
    description?: React.ReactNode;
    /** Help text displayed below the input. */
    hint?: React.ReactNode;
    /** Error message that activates the invalid state. */
    error?: React.ReactNode;
    /** Whether the input is in an invalid state. */
    invalid?: boolean;
    /** Size variant of the field control. */
    size?: FieldSize;
    /** Callback fired when the time value changes. */
    onValueChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    /** Whether the input spans the full container width. */
    fullWidth?: boolean;
    /** Locale-specific message overrides. */
    messages?: TimePickerMessages;
}
/** Native time input wrapped in the field control shell with label, description, and validation. */
export declare const TimePicker: React.ForwardRefExoticComponent<TimePickerProps & React.RefAttributes<HTMLInputElement>>;
export default TimePicker;
