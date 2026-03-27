import React from "react";
export type FieldSize = "sm" | "md" | "lg";
export type FieldTone = "default" | "invalid" | "readonly" | "disabled";
export type FieldDensity = "compact" | "comfortable";
export declare const getFieldTone: ({ invalid, disabled, readonly, }: {
    invalid?: boolean;
    disabled?: boolean;
    readonly?: boolean;
}) => FieldTone;
export declare const buildDescribedBy: (...ids: Array<string | undefined>) => string | undefined;
export declare const getFieldFrameClass: (size: FieldSize, tone: FieldTone, fullWidth: boolean, className?: string, density?: FieldDensity) => string;
export declare const getFieldInputClass: (size: FieldSize, className?: string, density?: FieldDensity) => string;
export declare const getFieldSlotClass: (size: FieldSize, density?: FieldDensity) => string;
export interface FieldControlShellProps {
    /** ID of the associated input element for label association. */
    inputId: string;
    /** Field label displayed above the input. */
    label?: React.ReactNode;
    /** Descriptive text below the label. */
    description?: React.ReactNode;
    /** Help text displayed below the input. */
    hint?: React.ReactNode;
    /** Error message displayed below the input. */
    error?: React.ReactNode;
    /** Character count label displayed beside the input. */
    countLabel?: string;
    /** Whether to show the required indicator. */
    required?: boolean;
    /** Whether the shell spans the full container width. */
    fullWidth?: boolean;
    /** Field input element(s) to wrap. */
    children: React.ReactNode;
}
/** Field control shell providing label, hint text, error message, and required indicator layout for form fields.
   * @example
   * ```tsx
   * <FieldControlPrimitives />
   * ```
   * @since 1.0.0
   * @see [Docs](https://design.mfe.dev/components/field-control-primitives)
   */
export declare const FieldControlShell: React.ForwardRefExoticComponent<FieldControlShellProps & React.RefAttributes<HTMLDivElement>>;
/** Re-export props type for FieldControlShell. */
export type { FieldControlShellProps as FieldControlPrimitivesProps };
