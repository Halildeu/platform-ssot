import React from "react";
export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
    /** Single child element to merge parent props onto. */
    children: React.ReactNode;
    /** CSS class name merged with the child's existing className via `cn()`. */
    className?: string;
    /** Inline styles shallow-merged with the child's style (child wins on conflict). */
    style?: React.CSSProperties;
    /** ARIA role forwarded to the child element. */
    role?: React.AriaRole;
    /** HTML id forwarded to the child element. */
    id?: string;
    /** Tab index forwarded to the child element. */
    tabIndex?: number;
    /** Data-testid attribute forwarded to the child element. */
    "data-testid"?: string;
}
/**
 * Slot renders its single child element, merging parent props onto it.
 *
 * - `className` values are merged via `cn()`
 * - `style` objects are shallow-merged (child wins on conflicts)
 * - Event handlers are composed (parent fires first)
 * - Refs are composed via callback ref
 * - All other props are spread (child props win on conflicts)
 */
export declare const Slot: React.ForwardRefExoticComponent<SlotProps & React.RefAttributes<HTMLElement>>;
/** Type alias for Slot ref. */
export type SlotRef = React.Ref<HTMLElement>;
/** Type alias for Slot element. */
export type SlotElement = HTMLElement;
/** Type alias for Slot cssproperties. */
export type SlotCSSProperties = React.CSSProperties;
