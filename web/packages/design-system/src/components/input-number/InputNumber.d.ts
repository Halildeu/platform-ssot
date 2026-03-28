import React from "react";
import { type FieldSize } from "../../primitives/_shared/FieldControlPrimitives";
import { type AccessControlledProps } from "../../internal/access-controller";
/** Props for the InputNumber component.
 * @example
 * ```tsx
 * <InputNumber />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/input-number)
 */
export interface InputNumberProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "value" | "defaultValue" | "type" | "prefix">, AccessControlledProps {
    /** Controlled numeric value. */
    value?: number | null;
    /** Initial value for uncontrolled mode. */
    defaultValue?: number | null;
    /** Callback fired when the numeric value changes. */
    onChange?: (value: number | null) => void;
    /** Minimum allowed value. */
    min?: number;
    /** Maximum allowed value. */
    max?: number;
    /** Increment/decrement step amount. */
    step?: number;
    /** Number of decimal places to display */
    precision?: number;
    /** Content rendered before the input. */
    prefix?: React.ReactNode;
    /** Content rendered after the input. */
    suffix?: React.ReactNode;
    /** Size variant of the field control. */
    size?: FieldSize;
    /** Whether the input is disabled. */
    disabled?: boolean;
    /** Whether the input is read-only. */
    readOnly?: boolean;
    /** Whether the input is in an invalid state. */
    invalid?: boolean;
    /** Error message that activates the invalid state. */
    error?: React.ReactNode;
    /** Field label displayed above the input. */
    label?: React.ReactNode;
    /** Descriptive text below the label. */
    description?: React.ReactNode;
    /** Help text displayed below the input. */
    hint?: React.ReactNode;
    /** Whether the field is required. */
    required?: boolean;
    /** Whether the input spans the full container width. */
    fullWidth?: boolean;
    /** Placeholder text shown when empty. */
    placeholder?: string;
    /** Additional CSS class name. */
    className?: string;
}
/** Numeric input with increment/decrement buttons, min/max clamping, step, and decimal precision. */
export declare const InputNumber: React.ForwardRefExoticComponent<InputNumberProps & React.RefAttributes<HTMLInputElement>>;
/** Type alias for InputNumber ref. */
export type InputNumberRef = React.Ref<HTMLElement>;
/** Type alias for InputNumber element. */
export type InputNumberElement = HTMLElement;
/** Type alias for InputNumber cssproperties. */
export type InputNumberCSSProperties = React.CSSProperties;
