import React from "react";
import { type AccessControlledProps } from "../../internal/interaction-core";
export type CheckboxSize = "sm" | "md" | "lg";
/** Props for the Checkbox component. */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">, AccessControlledProps {
    label?: React.ReactNode;
    description?: React.ReactNode;
    /** Component size */
    size?: CheckboxSize;
    /** @deprecated Use `size` instead. Will be removed in v3.0.0. */
    checkboxSize?: CheckboxSize;
    /** Initial checked state for uncontrolled mode. Ignored when `checked` is provided. */
    defaultChecked?: boolean;
    /** Indeterminate state */
    indeterminate?: boolean;
    error?: boolean | string | React.ReactNode;
    /** Density controls gap and text size */
    density?: "compact" | "comfortable" | "spacious";
    /** Visual variant — "card" wraps the checkbox in a bordered card container */
    variant?: "default" | "card";
    /** Show a loading indicator on the checkbox; makes it non-interactive */
    loading?: boolean;
}
export type CheckboxDensity = "compact" | "comfortable" | "spacious";
/**
 * Boolean toggle with label, description, indeterminate state, and card variant.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Accept terms and conditions"
 *   checked={accepted}
 *   onChange={(e) => setAccepted(e.target.checked)}
 * />
 * ```
 */
export declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
