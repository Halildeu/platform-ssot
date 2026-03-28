import React from "react";
/**
 * Skeleton renders placeholder loading shapes with a pulse animation.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Width — CSS value or "full" */
    width?: string | number;
    /** Height — CSS value */
    height?: string | number;
    /** Circle shape */
    circle?: boolean;
    /** Number of lines (renders stacked skeletons) */
    lines?: number;
    /** Enable/disable pulse animation (defaults to true) */
    animated?: boolean;
}
/**
 * Placeholder loading shape with pulse animation, supporting rectangles, circles, and multi-line stacks.
 *
 * @example
 * ```tsx
 * <Skeleton width="100%" height={16} />
 * <Skeleton circle height={40} />
 * <Skeleton lines={3} />
 * ```
 */
export declare const Skeleton: React.ForwardRefExoticComponent<SkeletonProps & React.RefAttributes<HTMLDivElement>>;
/** Type alias for Skeleton ref. */
export type SkeletonRef = React.Ref<HTMLElement>;
/** Type alias for Skeleton element. */
export type SkeletonElement = HTMLElement;
/** Type alias for Skeleton cssproperties. */
export type SkeletonCSSProperties = React.CSSProperties;
