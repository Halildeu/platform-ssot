import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type FormDrawerSize = "sm" | "md" | "lg" | "xl";
export type FormDrawerPlacement = "right" | "left";
/** Props for the FormDrawer component.
 * @example
 * ```tsx
 * <FormDrawer />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/form-drawer)
 */
export interface FormDrawerProps extends AccessControlledProps {
    /** Controlled open state */
    open: boolean;
    /** Close callback */
    onClose: () => void;
    /** Drawer title */
    title: React.ReactNode;
    /** Optional subtitle */
    subtitle?: React.ReactNode;
    /** Form body content */
    children: React.ReactNode;
    /** Footer slot — typically submit/cancel buttons */
    footer?: React.ReactNode;
    /** Width preset */
    size?: FormDrawerSize;
    /** Slide direction */
    placement?: FormDrawerPlacement;
    /** Close on backdrop click */
    closeOnBackdrop?: boolean;
    /** Close on Escape key */
    closeOnEscape?: boolean;
    /** Show loading overlay */
    loading?: boolean;
    className?: string;
}
/** Slide-in panel for create/edit forms with submit/cancel footer, loading overlay, and escape handling. */
export declare const FormDrawer: React.ForwardRefExoticComponent<FormDrawerProps & React.RefAttributes<HTMLDivElement>>;
/** Ref type for FormDrawer. */
export type FormDrawerRef = React.Ref<HTMLDivElement>;
