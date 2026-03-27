import React from "react";
export type DrawerPlacement = "left" | "right" | "top" | "bottom";
export type DrawerSize = "sm" | "md" | "lg" | "full";
/** Props for the Drawer component.
 * @example
 * ```tsx
 * <Drawer />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/drawer)
 */
export interface DrawerProps {
    /** Controlled open state */
    open: boolean;
    /** Close callback */
    onClose: () => void;
    /** Which edge the drawer slides in from */
    placement?: DrawerPlacement;
    /** Width/height preset */
    size?: DrawerSize;
    /** Drawer title */
    title?: React.ReactNode;
    /** Description below title */
    description?: React.ReactNode;
    /** Main content */
    children: React.ReactNode;
    /** Footer content (actions) */
    footer?: React.ReactNode;
    /** Close when clicking the overlay backdrop */
    closeOnOverlayClick?: boolean;
    /** Close when pressing Escape */
    closeOnEscape?: boolean;
    /** Show the backdrop overlay */
    showOverlay?: boolean;
    /** Additional class name on the panel */
    className?: string;
}
/** Slide-in side panel from any edge with overlay backdrop, scroll lock, and focus management. */
export declare const Drawer: React.ForwardRefExoticComponent<DrawerProps & React.RefAttributes<HTMLDivElement>>;
