import React from "react";
import type { ThemeAxes } from "../theme/core/semantic-theme";
import type { Direction } from "./LocaleProvider";
/** Props for {@link DesignSystemProvider}.
 * @example
 * ```tsx
 * <DesignSystemProvider />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/design-system-provider)
 */
export interface DesignSystemProviderProps {
    /** Override default theme axes. */
    defaultTheme?: Partial<ThemeAxes>;
    /** Locale code (e.g. "en", "tr", "ar"). */
    locale?: string;
    /** Override auto-detected text direction. */
    direction?: Direction;
    /** Application content to wrap with design system providers. */
    children: React.ReactNode;
}
/** Root provider composing theme, locale, and direction for the entire design system. */
export declare function DesignSystemProvider({ defaultTheme, locale, direction, children, }: DesignSystemProviderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace DesignSystemProvider {
    var displayName: string;
}
/** Type alias for DesignSystemProvider ref. */
export type DesignSystemProviderRef = React.Ref<HTMLElement>;
/** Type alias for DesignSystemProvider element. */
export type DesignSystemProviderElement = HTMLElement;
/** Type alias for DesignSystemProvider cssproperties. */
export type DesignSystemProviderCSSProperties = React.CSSProperties;
