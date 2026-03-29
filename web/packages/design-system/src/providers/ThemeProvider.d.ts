import React from "react";
import type { ThemeAxes, ThemeAppearance, ThemeDensity } from "../theme/core/semantic-theme";
/** Value exposed by the theme context to consumers.
 * @example
 * ```tsx
 * <ThemeProvider />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/theme-provider)
 */
export interface ThemeContextValue {
    /** Current resolved theme axes. */
    axes: ThemeAxes;
    /** Merge a partial patch into the current theme axes. */
    update: (patch: Partial<ThemeAxes>) => void;
    /** Switch the appearance mode (e.g. light, dark, high-contrast). */
    setAppearance: (v: ThemeAppearance) => void;
    /** Switch the density level (e.g. compact, comfortable). */
    setDensity: (v: ThemeDensity) => void;
}
export declare function useTheme(): ThemeContextValue;
/** Props for {@link ThemeProvider}. */
export interface ThemeProviderProps {
    /** Override default axes (merged with stored and default values). */
    defaultAxes?: Partial<ThemeAxes>;
    /** Application content to wrap with the theme context. */
    children: React.ReactNode;
}
/** Theme context provider with persistent axis storage and CSS variable injection. */
export declare function ThemeProvider({ defaultAxes, children }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace ThemeProvider {
    // eslint-disable-next-line no-var
    var displayName: string;
}
