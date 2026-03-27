export type ThemeAppearance = "light" | "dark" | "high-contrast";
export type ThemeDensity = "comfortable" | "compact";
export type ThemeRadius = "rounded" | "sharp";
export type ThemeElevation = "raised" | "flat";
export type ThemeMotion = "standard" | "reduced";
export type ThemeContrastRatio = "standard" | "aa" | "aaa";
export type ThemeAccent = string;
export type ThemeSurfaceTone = string;
export type TableSurfaceTone = "soft" | "normal" | "strong";
export type ThemeAxes = {
    appearance: ThemeAppearance;
    density: ThemeDensity;
    radius: ThemeRadius;
    elevation: ThemeElevation;
    motion: ThemeMotion;
    contrastRatio: ThemeContrastRatio;
    tableSurfaceTone: TableSurfaceTone;
    surfaceTone: ThemeSurfaceTone;
    accent: ThemeAccent;
    overlayIntensity: number;
    overlayOpacity: number;
};
export declare const DEFAULT_THEME_AXES: ThemeAxes;
/** Data-attribute names used on <html> for CSS theme resolution */
export declare const THEME_ATTRIBUTE_MAP: Record<keyof ThemeAxes, string>;
