import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type FormFieldOption = {
    label: string;
    value: string;
};
export type FormFieldValidation = {
    pattern?: string;
    min?: number;
    max?: number;
    message?: string;
};
export type FormFieldDependency = {
    field: string;
    value: unknown;
};
export type FormField = {
    key: string;
    type: "text" | "number" | "select" | "date" | "checkbox" | "radio" | "textarea" | "file";
    label: string;
    description?: string;
    required?: boolean;
    placeholder?: string;
    options?: FormFieldOption[];
    dependsOn?: FormFieldDependency;
    validation?: FormFieldValidation;
    defaultValue?: unknown;
    span?: 1 | 2;
};
export type FormLayout = "vertical" | "horizontal" | "inline";
export type FormSize = "sm" | "md" | "lg";
/** Props for the AdaptiveForm component.
 * @example
 * ```tsx
 * <AdaptiveForm />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/adaptive-form)
 */
export interface AdaptiveFormProps extends AccessControlledProps {
    /** Field definitions describing the form schema. */
    fields: FormField[];
    /** Controlled form values keyed by field key. */
    values?: Record<string, unknown>;
    /** Callback fired when any field value changes. */
    onValuesChange?: (values: Record<string, unknown>) => void;
    /** Callback fired on form submission with validated values. */
    onSubmit?: (values: Record<string, unknown>) => void;
    /** Layout direction for form fields. */
    layout?: FormLayout;
    /** Number of grid columns for the form layout. */
    columns?: 1 | 2;
    /** Size variant for input controls. */
    size?: FormSize;
    /** Label for the submit button. */
    submitLabel?: string;
    /** Label for the reset button. */
    resetLabel?: string;
    /** Whether to show the reset button. */
    showReset?: boolean;
    /** Whether to show loading skeleton placeholders. */
    loading?: boolean;
    /** Additional CSS class name. */
    className?: string;
}
/** Intelligent adaptive form that adjusts layout, field visibility, and validation based on user input and context. */
export declare const AdaptiveForm: React.ForwardRefExoticComponent<AdaptiveFormProps & React.RefAttributes<HTMLDivElement>>;
export default AdaptiveForm;
