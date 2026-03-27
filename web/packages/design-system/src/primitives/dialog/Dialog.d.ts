import React from "react";
import type { SlotProps } from "../_shared/slot-types";
export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";
export type DialogSlot = "root" | "backdrop" | "panel" | "title" | "description";
/** Props for the Dialog component.
 * @example
 * ```tsx
 * <Dialog />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/dialog)
 */
export interface DialogProps {
    open: boolean;
    onClose: () => void;
    size?: DialogSize;
    /** Show close button */
    closable?: boolean;
    /** Close on backdrop click */
    closeOnBackdrop?: boolean;
    /** Close on Escape key */
    closeOnEscape?: boolean;
    /** Title for header */
    title?: React.ReactNode;
    /** Description below title */
    description?: React.ReactNode;
    /** Footer content (actions) */
    footer?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
    /** Override props (className, style, etc.) on internal slot elements */
    slotProps?: SlotProps<DialogSlot>;
}
/** Accessible modal overlay built on native dialog with configurable size, title, and footer. */
export declare const Dialog: React.ForwardRefExoticComponent<DialogProps & React.RefAttributes<HTMLDialogElement>>;
