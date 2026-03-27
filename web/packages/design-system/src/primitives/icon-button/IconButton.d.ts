import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type IconButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type IconButtonSize = "xs" | "sm" | "md" | "lg";
/**
 * IconButton renders a square button optimized for icon-only content
 * with accessible labeling and multiple visual variants.
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, AccessControlledProps {
    /** Icon element rendered inside the button. */
    icon: React.ReactNode;
    /** Accessible label (required since there's no visible text). */
    label: string;
    /** Visual style variant. @default "ghost" */
    variant?: IconButtonVariant;
    /** Button dimensions. @default "md" */
    size?: IconButtonSize;
    /** Show a spinner instead of the icon. @default false */
    loading?: boolean;
    /** Use fully rounded (pill) border radius. @default false */
    rounded?: boolean;
    /**
     * Render via Slot — merges IconButton props onto the child element.
     * @example <IconButton asChild icon={<X />} label="Close"><a href="/close" /></IconButton>
     */
    asChild?: boolean;
}
/** Square icon-only button with accessible labeling, loading state, and multiple visual variants. */
export declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLElement>>;
