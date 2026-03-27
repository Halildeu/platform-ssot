import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
/** Describes a single theme preset entry within the gallery.
 * @example
 * ```tsx
 * <ThemePresetGallery />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/theme-preset-gallery)
 */
export interface ThemePresetGalleryItem {
    /** Unique identifier for this preset. */
    presetId: string;
    /** Display name for the preset. */
    label: React.ReactNode;
    /** Theme mode descriptor (e.g. "light", "dark"). */
    themeMode?: React.ReactNode;
    /** Visual appearance descriptor. */
    appearance?: React.ReactNode;
    /** Density descriptor (e.g. "comfortable", "compact"). */
    density?: React.ReactNode;
    /** Design intent or purpose of this preset. */
    intent?: React.ReactNode;
    /** Whether this preset uses high-contrast colors. */
    isHighContrast?: boolean;
    /** Whether this is the default/recommended preset. */
    isDefaultMode?: boolean;
    /** Additional badge elements rendered on the preset card. */
    badges?: React.ReactNode[];
}
/**
 * ThemePresetGallery displays a selectable grid of theme preset cards
 * with preview thumbnails and metadata comparison.
 */
export interface ThemePresetGalleryProps extends AccessControlledProps {
    /** Array of theme presets to display. */
    presets: ThemePresetGalleryItem[];
    /** Gallery heading. */
    title?: React.ReactNode;
    /** Explanatory text below the heading. */
    description?: React.ReactNode;
    /** Comparison axis labels shown as badges above the grid. */
    compareAxes?: React.ReactNode[];
    /** Controlled selected preset ID. */
    selectedPresetId?: string | null;
    /** Initial selected preset for uncontrolled mode. */
    defaultSelectedPresetId?: string | null;
    /** Callback fired when a preset is selected. */
    onSelectPreset?: (presetId: string, preset: ThemePresetGalleryItem) => void;
    /** Additional CSS class name. */
    className?: string;
}
export declare const ThemePresetGallery: React.ForwardRefExoticComponent<ThemePresetGalleryProps & React.RefAttributes<HTMLElement>>;
export default ThemePresetGallery;
