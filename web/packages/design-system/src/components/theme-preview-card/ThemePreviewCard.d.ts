import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export interface ThemePreviewCardProps extends AccessControlledProps {
    /** Whether this theme card is currently selected. */
    selected?: boolean;
    /** Additional CSS class name. */
    className?: string;
    /** Locale-specific label overrides for the preview card. */
    localeText?: {
        /** Title text shown in the swatch. */
        titleText?: React.ReactNode;
        /** Secondary descriptive text. */
        secondaryText?: React.ReactNode;
        /** Label for the save action button. */
        saveLabel?: React.ReactNode;
        /** Accessible label for the selected indicator. */
        selectedLabel?: React.ReactNode;
    };
}
/**
 * Miniature theme swatch card that renders a compact preview of a theme's
 * visual style, used in theme selection galleries and comparison views.
   * @example
   * ```tsx
   * <ThemePreviewCard />
   * ```
   * @since 1.0.0
   * @see [Docs](https://design.mfe.dev/components/theme-preview-card)
  
 */
export declare const ThemePreviewCard: React.ForwardRefExoticComponent<ThemePreviewCardProps & React.RefAttributes<HTMLDivElement>>;
export default ThemePreviewCard;
/** Type alias for ThemePreviewCard ref. */
export type ThemePreviewCardRef = React.Ref<HTMLElement>;
/** Type alias for ThemePreviewCard element. */
export type ThemePreviewCardElement = HTMLElement;
/** Type alias for ThemePreviewCard cssproperties. */
export type ThemePreviewCardCSSProperties = React.CSSProperties;
