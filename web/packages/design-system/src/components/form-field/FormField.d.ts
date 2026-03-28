import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export interface FormFieldProps extends AccessControlledProps {
    /** Field label */
    label?: React.ReactNode;
    /** Help text below the input */
    help?: React.ReactNode;
    /** Error message — also sets error state on input */
    error?: React.ReactNode;
    /** Mark as required */
    required?: boolean;
    /** Mark as optional (mutually exclusive with required) */
    optional?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Horizontal layout */
    horizontal?: boolean;
    /** Custom ID for the input */
    htmlFor?: string;
    className?: string;
    children: React.ReactNode;
}
/**
 * Composed form control wrapper with label, help text, error message, and required/optional indicators.
 *
 * @example
 * ```tsx
 * <FormField label="Username" error={errors.username} required>
 *   <Input value={username} onChange={handleChange} />
 * </FormField>
 * ```
 */
export declare const FormField: React.ForwardRefExoticComponent<FormFieldProps & React.RefAttributes<HTMLDivElement>>;
/** Type alias for FormField ref. */
export type FormFieldRef = React.Ref<HTMLElement>;
/** Type alias for FormField element. */
export type FormFieldElement = HTMLElement;
/** Type alias for FormField cssproperties. */
export type FormFieldCSSProperties = React.CSSProperties;
