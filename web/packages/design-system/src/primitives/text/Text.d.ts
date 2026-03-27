import React from "react";
type TextElement = "p" | "span" | "div" | "label" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "strong" | "em" | "small" | "blockquote" | "code" | "pre" | "kbd";
export type TextVariant = "default" | "secondary" | "muted" | "success" | "warning" | "error" | "info";
export type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
export type TextWeight = "normal" | "medium" | "semibold" | "bold";
/** Props for the Text component. */
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
    /** HTML element to render */
    as?: TextElement | (string & {});
    variant?: TextVariant;
    size?: TextSize;
    weight?: TextWeight;
    /** Truncate with ellipsis */
    truncate?: boolean;
    /** Limit visible lines (uses line-clamp) */
    lineClamp?: 1 | 2 | 3 | 4 | 5;
    /** Monospace font */
    mono?: boolean;
    /**
     * Render via Slot — merges Text props onto the child element.
     * Modern alternative to `as` for polymorphism.
     * @example <Text asChild size="lg" weight="bold"><a href="/">Home</a></Text>
     */
    asChild?: boolean;
}
/**
 * Typography primitive with variant, size, weight, truncation, and polymorphic element support.
 *
 * @example
 * ```tsx
 * <Text as="h2" size="xl" weight="bold">Dashboard</Text>
 * <Text variant="secondary" size="sm" truncate>Long text...</Text>
 * ```
 */
export declare const Text: React.ForwardRefExoticComponent<TextProps & React.RefAttributes<HTMLElement>>;
export {};
