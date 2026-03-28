import React from "react";
import type { SlotProps } from "../_shared/slot-types";
export type OverlayCloseReason = "close-button" | "overlay" | "escape";
export interface ModalClasses {
    overlay?: string;
    panel?: string;
    header?: string;
    title?: string;
    body?: string;
    footer?: string;
    closeButton?: string;
}
export type ModalSlot = "root" | "overlay" | "content" | "header" | "body" | "footer";
/** Props for the Modal component.
 * @example
 * ```tsx
 * <Modal />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/modal)
 */
export interface ModalProps {
    /** Whether the modal is open and visible. */
    open: boolean;
    /** Content rendered inside the modal body. */
    children: React.ReactNode;
    /** Title displayed in the modal header. */
    title?: React.ReactNode;
    /** Callback fired when the modal requests to close, with the close reason. */
    onClose?: (reason?: OverlayCloseReason) => void;
    /** Content rendered in the modal footer area. */
    footer?: React.ReactNode;
    /** Additional CSS class name for the dialog element. */
    className?: string;
    /** Size preset controlling the maximum width. @default "md" */
    size?: "sm" | "md" | "lg";
    /** Custom maximum width as a number (px) or CSS string. */
    maxWidth?: number | string;
    /** Whether the modal spans the full available width. */
    fullWidth?: boolean;
    /** @deprecated Use `variant` instead. Visual surface style. */
    surface?: "base" | "confirm" | "destructive" | "audit";
    /** Visual surface variant controlling header styling. */
    variant?: "base" | "confirm" | "destructive" | "audit";
    /** Whether clicking the overlay backdrop closes the modal. @default true */
    closeOnOverlayClick?: boolean;
    /** Whether pressing Escape closes the modal. @default true */
    closeOnEscape?: boolean;
    /** Whether to keep the modal in the DOM when closed. */
    keepMounted?: boolean;
    /** Whether to destroy modal content when hidden. */
    destroyOnHidden?: boolean;
    /** Custom DOM element to render the portal into. */
    portalTarget?: HTMLElement | null;
    /** Whether to disable portal rendering and render inline. */
    disablePortal?: boolean;
    /** Custom CSS class overrides for internal elements. */
    classes?: ModalClasses;
    /** Override props (className, style, etc.) on internal slot elements. */
    slotProps?: SlotProps<ModalSlot>;
}
/** Rich modal overlay with surface variants, portal support, scroll lock, and focus management. */
export declare const Modal: React.ForwardRefExoticComponent<ModalProps & React.RefAttributes<HTMLDialogElement>>;
