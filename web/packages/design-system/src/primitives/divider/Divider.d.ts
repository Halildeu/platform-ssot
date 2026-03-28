import React from "react";
/**
 * Divider renders a horizontal or vertical visual separator with optional center label.
 */
export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
    /** Orientation of the divider line. @default "horizontal" */
    orientation?: "horizontal" | "vertical";
    /** Label text displayed centered within the divider line. */
    label?: string;
    /** Margin spacing around the divider. @default "md" */
    spacing?: "none" | "sm" | "md" | "lg";
    /** Additional CSS class name for the divider element. */
    className?: string;
    /** ARIA role override for the separator element. */
    role?: React.AriaRole;
    /** Data attribute for test automation. */
    "data-testid"?: string;
}
/**
 * Horizontal or vertical line separator with optional center label for content sectioning.
 *
 * @example
 * ```tsx
 * <Divider spacing="md" />
 * <Divider label="OR" />
 * <Divider orientation="vertical" />
 * ```
 */
export declare const Divider: React.ForwardRefExoticComponent<DividerProps & React.RefAttributes<HTMLElement>>;
/** Type alias for Divider ref. */
export type DividerRef = React.Ref<HTMLElement>;
/** Type alias for Divider element. */
export type DividerElement = HTMLElement;
/** Type alias for Divider cssproperties. */
export type DividerCSSProperties = React.CSSProperties;
