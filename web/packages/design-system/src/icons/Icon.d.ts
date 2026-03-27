import React from "react";
export type IconName = string;
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
    /** Icon size in pixels (applies to both width and height) */
    size?: number;
    /** Additional CSS class names */
    className?: string;
    /** Accessible label — if omitted, icon is decorative (aria-hidden) */
    label?: string;
    /** Stroke width for line icons */
    strokeWidth?: number;
}
/**
 * Base Icon wrapper — standardizes SVG props, accessibility, and sizing.
 * Individual icon components use this as their root element.
 */
export declare const Icon: React.ForwardRefExoticComponent<IconProps & {
    children: React.ReactNode;
} & React.RefAttributes<SVGSVGElement>>;
/**
 * Factory to create individual icon components with consistent API.
 */
export declare function createIcon(name: string, paths: React.ReactNode): React.FC<IconProps>;
