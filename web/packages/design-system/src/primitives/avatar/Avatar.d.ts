import React from "react";
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarShape = "circle" | "square";
/**
 * Avatar displays a user or entity representation as an image, initials, or icon fallback.
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Image URL */
    src?: string;
    /** Alt text for the avatar image. */
    alt?: string;
    /** Fallback initials (1-2 chars) */
    initials?: string;
    /** Avatar dimensions. @default "md" */
    size?: AvatarSize;
    /** Border radius shape. @default "circle" */
    shape?: AvatarShape;
    /** Fallback icon (when no src or initials) */
    icon?: React.ReactNode;
}
/**
 * Circular or square avatar displaying an image, initials fallback, or icon with configurable size.
 *
 * @example
 * ```tsx
 * <Avatar src="/avatars/jane.jpg" alt="Jane Doe" size="lg" />
 * <Avatar initials="JD" size="md" shape="square" />
 * ```
 */
export declare const Avatar: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLSpanElement>>;
