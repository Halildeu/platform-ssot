import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
/**
 * Watermark renders a repeating text or image watermark overlay on top of its children.
 * @example
 * ```tsx
 * <Watermark />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/watermark)

 */
export interface WatermarkProps extends AccessControlledProps {
    /** Text content for the watermark; pass an array for multi-line. */
    content?: string | string[];
    /** Image URL to use as watermark instead of text. */
    image?: string;
    /** Rotation angle in degrees. @default -22 */
    rotate?: number;
    /** Horizontal and vertical gap between watermark tiles in pixels. @default [100,100] */
    gap?: [number, number];
    /** X/Y offset of the watermark within each tile. */
    offset?: [number, number];
    /** Font size in pixels for text watermarks. @default 14 */
    fontSize?: number;
    /** CSS color value for text watermarks. */
    fontColor?: string;
    /** Opacity of the watermark layer (0-1). @default 0.15 */
    opacity?: number;
    /** CSS z-index of the watermark overlay. @default 9 */
    zIndex?: number;
    /** Content to render beneath the watermark. */
    children?: React.ReactNode;
    /** Additional CSS class name. */
    className?: string;
}
export declare const Watermark: React.ForwardRefExoticComponent<WatermarkProps & React.RefAttributes<HTMLDivElement>>;
export default Watermark;
/** Type alias for Watermark ref. */
export type WatermarkRef = React.Ref<HTMLElement>;
/** Type alias for Watermark element. */
export type WatermarkElement = HTMLElement;
/** Type alias for Watermark cssproperties. */
export type WatermarkCSSProperties = React.CSSProperties;
