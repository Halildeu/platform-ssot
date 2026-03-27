import React from "react";
export type StackDirection = "row" | "column" | "row-reverse" | "column-reverse";
export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type StackJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type StackGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
/** Props for the Stack component.
 * @example
 * ```tsx
 * <Stack />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/stack)
 */
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Flex direction of the stack. */
    direction?: StackDirection;
    /** Cross-axis alignment of items. */
    align?: StackAlign;
    /** Main-axis justification of items. */
    justify?: StackJustify;
    /** Spacing gap between items. */
    gap?: StackGap;
    /** Whether items wrap to multiple lines. */
    wrap?: boolean;
    /** Render as another element */
    as?: "div" | "section" | "article" | "nav" | "main" | "aside" | "ul" | "ol";
}
/** Flexbox layout primitive with configurable direction, alignment, gap, and polymorphic element. */
export declare const Stack: React.ForwardRefExoticComponent<StackProps & React.RefAttributes<HTMLDivElement>>;
export type HStackProps = Omit<StackProps, "direction">;
export type VStackProps = Omit<StackProps, "direction">;
export declare const HStack: React.ForwardRefExoticComponent<HStackProps & React.RefAttributes<HTMLDivElement>>;
export declare const VStack: React.ForwardRefExoticComponent<VStackProps & React.RefAttributes<HTMLDivElement>>;
