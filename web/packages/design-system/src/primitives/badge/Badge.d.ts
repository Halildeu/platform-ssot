import React from "react";
export type BadgeVariant = "default" | "primary" | "success" | "warning" | "error" | "danger" | "info" | "muted";
export type BadgeSize = "sm" | "md" | "lg";
/**
 * Badge renders a small status or count indicator with semantic color variants.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Visual color variant. @default "default" */
    variant?: BadgeVariant;
    /** @deprecated Use `variant` instead. Will be removed in v3.0.0. */
    tone?: BadgeVariant;
    /** Badge size controlling padding and font size. @default "md" */
    size?: BadgeSize;
    /** Render as a dot (no children) */
    dot?: boolean;
    /**
     * Render via Slot — merges Badge props onto the child element.
     * @example <Badge asChild><a href="/status">Active</a></Badge>
     */
    asChild?: boolean;
}
/**
 * Small status or count indicator with semantic color variants and optional dot mode.
 *
 * @example
 * ```tsx
 * <Badge variant="success" size="md">Active</Badge>
 * <Badge variant="error" dot />
 * ```
 */
export declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLSpanElement>>;
