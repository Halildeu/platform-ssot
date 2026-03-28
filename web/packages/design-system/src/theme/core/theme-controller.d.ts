import { type ThemeAppearance, type ThemeDensity, type ThemeRadius, type ThemeElevation, type ThemeMotion, type ThemeContrastRatio, type ThemeSurfaceTone, type TableSurfaceTone, type ThemeAxes } from "./semantic-theme";
type ThemeListener = (axes: ThemeAxes) => void;
/** Returns a snapshot of the current theme axes. */
export declare const getThemeAxes: () => ThemeAxes;
/**
 * Applies a partial patch to the current theme axes.
 * Numeric overlay values are automatically clamped to valid ranges.
 * Persists to localStorage, applies DOM attributes, and notifies listeners.
 */
export declare const updateThemeAxes: (patch: Partial<ThemeAxes>) => ThemeAxes;
/**
 * Registers a listener for theme changes.
 * The listener is immediately called with current axes.
 * Returns an unsubscribe function.
 */
export declare const subscribeThemeAxes: (listener: ThemeListener) => (() => void);
export declare const setAppearance: (appearance: ThemeAppearance) => ThemeAxes;
export declare const setDensity: (density: ThemeDensity) => ThemeAxes;
export declare const setRadius: (radius: ThemeRadius) => ThemeAxes;
export declare const setElevation: (elevation: ThemeElevation) => ThemeAxes;
export declare const setMotion: (motion: ThemeMotion) => ThemeAxes;
export declare const setContrastRatio: (contrastRatio: ThemeContrastRatio) => ThemeAxes;
export declare const setTableSurfaceTone: (tableSurfaceTone: TableSurfaceTone) => ThemeAxes;
export declare const setSurfaceTone: (surfaceTone: ThemeSurfaceTone) => ThemeAxes;
export declare const setOverlayIntensity: (overlayIntensity: number) => ThemeAxes;
export declare const setOverlayOpacity: (overlayOpacity: number) => ThemeAxes;
export declare const THEME_APPEARANCE_OPTIONS: ThemeAppearance[];
export declare const THEME_DENSITY_OPTIONS: ThemeDensity[];
export declare const THEME_RADIUS_OPTIONS: ThemeRadius[];
export declare const THEME_ELEVATION_OPTIONS: ThemeElevation[];
export declare const THEME_MOTION_OPTIONS: ThemeMotion[];
export declare const THEME_CONTRAST_RATIO_OPTIONS: ThemeContrastRatio[];
export {};
