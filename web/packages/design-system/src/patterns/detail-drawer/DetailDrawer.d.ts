import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type DetailDrawerSize = "md" | "lg" | "xl" | "full";
export interface DetailDrawerSection {
    key: string;
    title?: React.ReactNode;
    content: React.ReactNode;
}
/** Props for the DetailDrawer component.
 * @example
 * ```tsx
 * <DetailDrawer />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/detail-drawer)
 */
export interface DetailDrawerProps extends AccessControlledProps {
    /** Controlled open state */
    open: boolean;
    /** Close callback */
    onClose: () => void;
    /** Drawer title */
    title: React.ReactNode;
    /** Optional subtitle */
    subtitle?: React.ReactNode;
    /** Optional header actions (e.g. Edit, Delete buttons) */
    actions?: React.ReactNode;
    /** Optional header tags / badges */
    tags?: React.ReactNode;
    /** Sections to render */
    sections?: DetailDrawerSection[];
    /** Or free-form children */
    children?: React.ReactNode;
    /** Footer slot */
    footer?: React.ReactNode;
    /** Width preset */
    size?: DetailDrawerSize;
    /** Close on backdrop click */
    closeOnBackdrop?: boolean;
    className?: string;
}
/** Read-only slide-in detail panel with section layout, header actions, and tags. */
export declare const DetailDrawer: React.ForwardRefExoticComponent<DetailDrawerProps & React.RefAttributes<HTMLDivElement>>;
/** Ref type for DetailDrawer. */
export type DetailDrawerRef = React.Ref<HTMLDivElement>;
