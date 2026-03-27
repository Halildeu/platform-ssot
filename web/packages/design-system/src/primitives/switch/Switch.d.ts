import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type SwitchSize = "sm" | "md" | "lg";
export type SwitchVariant = "default" | "destructive";
export type SwitchDensity = "compact" | "comfortable" | "spacious";
/** Props for the Switch component. */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">, AccessControlledProps {
    /** Label text */
    label?: string;
    /** Description below label */
    description?: string;
    /** Component size */
    size?: SwitchSize;
    /** @deprecated Use `size` instead. Will be removed in v3.0.0. */
    switchSize?: SwitchSize;
    /** Visual variant — "destructive" uses error color when checked */
    variant?: SwitchVariant;
    /** Density controls scale of the switch */
    density?: SwitchDensity;
    /** Initial checked state for uncontrolled mode. Ignored when `checked` is provided. */
    defaultChecked?: boolean;
    /** Checked state (controlled) */
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    /** Error state — sets aria-invalid when truthy */
    error?: boolean | string | React.ReactNode;
    /** Show a loading indicator on the thumb; makes the switch non-interactive */
    loading?: boolean;
}
/**
 * Toggle switch control with label, description, destructive variant, and loading state.
 *
 * @example
 * ```tsx
 * <Switch
 *   label="Enable notifications"
 *   checked={enabled}
 *   onCheckedChange={setEnabled}
 * />
 * ```
 */
export declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLInputElement>>;
