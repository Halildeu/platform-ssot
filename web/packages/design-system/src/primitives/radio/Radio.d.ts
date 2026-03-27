import React from "react";
import { type AccessControlledProps } from "../../internal/interaction-core";
export type RadioSize = "sm" | "md" | "lg";
/** Props for the Radio component. */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">, AccessControlledProps {
    label?: string;
    description?: string;
    /** Component size */
    size?: RadioSize;
    /** @deprecated Use `size` instead. Will be removed in v3.0.0. */
    radioSize?: RadioSize;
    /** Density controls gap and text size */
    density?: "compact" | "comfortable" | "spacious";
    error?: boolean | string | React.ReactNode;
    /** Show a loading indicator on the radio; makes it non-interactive */
    loading?: boolean;
}
export type RadioDensity = "compact" | "comfortable" | "spacious";
/**
 * Single-select radio option with label, description, density control, and loading state.
 *
 * @example
 * ```tsx
 * <RadioGroup name="plan" value={plan} onChange={setPlan}>
 *   <Radio value="free" label="Free" description="Up to 5 users" />
 *   <Radio value="pro" label="Pro" description="Unlimited users" />
 * </RadioGroup>
 * ```
 */
export declare const Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>>;
export interface RadioGroupProps {
    name: string;
    value?: string;
    /** Initial selected value for uncontrolled mode. Ignored when `value` is provided. */
    defaultValue?: string;
    onChange?: (value: string) => void;
    /** Layout direction */
    direction?: "horizontal" | "vertical";
    className?: string;
    children: React.ReactNode;
}
export declare const RadioGroup: React.FC<RadioGroupProps>;
