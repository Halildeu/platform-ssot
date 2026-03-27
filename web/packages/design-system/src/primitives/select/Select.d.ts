import React from "react";
import { type AccessControlledProps } from "../../internal/interaction-core";
import type { SlotProps } from "../_shared/slot-types";
export type SelectSize = "sm" | "md" | "lg";
export type SelectDensity = "compact" | "comfortable" | "spacious";
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export type SelectSlot = "root" | "trigger" | "listbox" | "option";
/** Props for the Select component. */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">, AccessControlledProps {
    /** Component size */
    size?: SelectSize;
    /** @deprecated Use `size` instead. Will be removed in v3.0.0. */
    selectSize?: SelectSize;
    options: SelectOption[];
    /** Initial selected value for uncontrolled mode. Ignored when `value` is provided. */
    defaultValue?: string;
    /** Placeholder (first disabled option) */
    placeholder?: string;
    error?: boolean | string | React.ReactNode;
    fullWidth?: boolean;
    /** Show a loading spinner replacing the chevron and disable the select */
    loading?: boolean;
    /** Density controls vertical padding and text size */
    density?: SelectDensity;
    /** Override props (className, style, etc.) on internal slot elements */
    slotProps?: SlotProps<SelectSlot>;
}
/**
 * Native select dropdown with consistent styling, placeholder, loading state, and access control.
 *
 * @example
 * ```tsx
 * <Select
 *   options={[{ value: 'tr', label: 'Turkey' }, { value: 'us', label: 'USA' }]}
 *   placeholder="Select a country"
 *   onChange={handleChange}
 * />
 * ```
 */
export declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;
