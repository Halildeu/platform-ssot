import React from "react";
import type { AccessLevel } from "../../internal/access-controller";
export type TagVariant = "default" | "primary" | "success" | "warning" | "error" | "info" | "danger";
export type TagSize = "sm" | "md" | "lg";
/** Props for the Tag component. */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: TagVariant;
    /** @deprecated Use `variant` instead. Will be removed in v3.0.0. */
    tone?: TagVariant;
    size?: TagSize;
    /** Show close button */
    closable?: boolean;
    /** Close callback */
    onClose?: () => void;
    /** Icon before text */
    icon?: React.ReactNode;
    /** Access level — controls visibility/disabled state */
    access?: AccessLevel;
    /** Tooltip/title text explaining access restriction */
    accessReason?: string;
    /**
     * Render via Slot — merges Tag props onto the child element.
     * @example <Tag asChild><a href="/filter/active">Active</a></Tag>
     */
    asChild?: boolean;
}
/**
 * Removable label chip with semantic color variants, optional icon, and close button.
 *
 * @example
 * ```tsx
 * <Tag variant="primary" closable onClose={() => removeTag(id)}>
 *   React
 * </Tag>
 * ```
 */
export declare const Tag: React.ForwardRefExoticComponent<TagProps & React.RefAttributes<HTMLSpanElement>>;
