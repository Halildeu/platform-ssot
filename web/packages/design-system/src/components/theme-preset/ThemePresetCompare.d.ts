import React from "react";
import { type ThemePresetGalleryItem } from "./ThemePresetGallery";
import { type AccessControlledProps } from "../../internal/access-controller";
export interface ThemePresetCompareProps extends AccessControlledProps {
    /** Left-side preset to compare. */
    leftPreset?: ThemePresetGalleryItem | null;
    /** Right-side preset to compare. */
    rightPreset?: ThemePresetGalleryItem | null;
    /** Heading displayed above the comparison. */
    title?: React.ReactNode;
    /** Descriptive text below the heading. */
    description?: React.ReactNode;
    /** Theme axes to include in the comparison matrix. */
    axes?: string[];
    /** Additional CSS class name. */
    className?: string;
}
/**
 * Side-by-side comparison view for two theme presets, displaying a matrix
 * of appearance, density, contrast and intent axes with preview cards.
   * @example
   * ```tsx
   * <ThemePresetCompare />
   * ```
   * @since 1.0.0
   * @see [Docs](https://design.mfe.dev/components/theme-preset-compare)
  
 */
export declare const ThemePresetCompare: React.ForwardRefExoticComponent<ThemePresetCompareProps & React.RefAttributes<HTMLElement>>;
export default ThemePresetCompare;
/** Type alias for ThemePresetCompare ref. */
export type ThemePresetCompareRef = React.Ref<HTMLElement>;
/** Type alias for ThemePresetCompare element. */
export type ThemePresetCompareElement = HTMLElement;
/** Type alias for ThemePresetCompare cssproperties. */
export type ThemePresetCompareCSSProperties = React.CSSProperties;
