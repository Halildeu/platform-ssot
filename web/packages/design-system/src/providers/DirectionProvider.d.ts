import React from "react";
import type { Direction } from "./LocaleProvider";
/** Props for the DirectionProvider component.
 * @example
 * ```tsx
 * <DirectionProvider />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/direction-provider)
 */
export interface DirectionProviderProps {
    /** Text direction to apply to the subtree. */
    direction: Direction;
    /** Content to render within the directional context. */
    children: React.ReactNode;
    /** Additional CSS class name for the wrapper element. */
    className?: string;
    /** HTML id for the wrapper element. */
    id?: string;
    /** Inline styles for the wrapper element. */
    style?: React.CSSProperties;
    /** Data attribute for test automation. */
    "data-testid"?: string;
}
/** Provides an explicit LTR/RTL direction override for a subtree, wrapping children in a directional container. */
export declare function DirectionProvider({ direction, children, className, id, style, ...rest }: DirectionProviderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace DirectionProvider {
    // eslint-disable-next-line no-var
    var displayName: string;
}
/** Type alias for DirectionProvider ref. */
export type DirectionProviderRef = React.Ref<HTMLElement>;
/** Type alias for DirectionProvider element. */
export type DirectionProviderElement = HTMLElement;
/** Type alias for DirectionProvider cssproperties. */
export type DirectionProviderCSSProperties = React.CSSProperties;
