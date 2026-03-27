import React from "react";
export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerMode = "inline" | "block";
/**
 * Spinner renders an animated loading indicator with optional visible label.
 */
export interface SpinnerProps {
    /** Spinner dimensions. @default "md" */
    size?: SpinnerSize;
    /** Additional CSS class name. */
    className?: string;
    /** Accessible label for screen readers. @default "Loading" */
    label?: string;
    /** Display mode: inline (default) or block (centered with visible label). @default "inline" */
    mode?: SpinnerMode;
}
/**
 * Animated circular loading indicator with configurable size and optional visible label.
 *
 * @example
 * ```tsx
 * <Spinner size="md" label="Loading data..." />
 * <Spinner size="sm" mode="block" />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/spinner)
 */
export declare const Spinner: React.ForwardRefExoticComponent<SpinnerProps & React.RefAttributes<HTMLDivElement>>;
