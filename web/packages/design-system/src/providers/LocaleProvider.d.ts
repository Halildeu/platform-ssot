import React from "react";
export type Direction = "ltr" | "rtl";
export interface LocaleContextValue {
    locale: string;
    direction: Direction;
}
export declare function useLocale(): LocaleContextValue;
/** Props for the LocaleProvider component.
 * @example
 * ```tsx
 * <LocaleProvider />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/locale-provider)
 */
export interface LocaleProviderProps {
    /** BCP 47 locale tag (e.g. "en", "tr", "ar"). @default "en" */
    locale?: string;
    /** Explicit text direction override; auto-detected from locale when omitted. */
    direction?: Direction;
    /** Content to render within the locale context. */
    children: React.ReactNode;
    /** Additional CSS class name for the wrapper element. */
    className?: string;
    /** HTML id for the wrapper element. */
    id?: string;
    /** Inline styles for the wrapper element. */
    style?: React.CSSProperties;
}
/** Provides locale and text-direction context to the component subtree, auto-detecting RTL for Arabic, Hebrew, Farsi, and Urdu locales. */
export declare function LocaleProvider({ locale, direction, children, }: LocaleProviderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace LocaleProvider {
    var displayName: string;
}
