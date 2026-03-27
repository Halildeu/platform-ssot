import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type LinkInlineTone = "primary" | "secondary";
export type LinkInlineUnderline = "always" | "hover" | "none";
/**
 * LinkInline renders an accessible inline anchor with tone, underline control,
 * access gating, and optional leading/trailing visuals.
 */
export interface LinkInlineProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children">, AccessControlledProps {
    /** Link content. */
    children: React.ReactNode;
    /** @deprecated Visual tone. Use `variant` as a modern alias. */
    tone?: LinkInlineTone;
    /** Color variant for the link text. @default "primary" */
    variant?: LinkInlineTone;
    /** Underline behavior. @default "hover" */
    underline?: LinkInlineUnderline;
    /** Whether this link represents the current page (sets aria-current). */
    current?: boolean;
    /** Disable interaction and render as an inert span. */
    disabled?: boolean;
    /** Force external link behavior (target="_blank", rel="noopener"). Auto-detected from href. */
    external?: boolean;
    /** Icon or element rendered before the link text. */
    leadingVisual?: React.ReactNode;
    /** Icon or element rendered after the link text. */
    trailingVisual?: React.ReactNode;
    /** Locale text overrides. */
    localeText?: {
        /** Screen reader label for external link indicator. @default "External link" */
        externalScreenReaderLabel?: React.ReactNode;
    };
    /**
     * Render via Slot — merges LinkInline props onto the child element.
     * Useful for composing with router Link components.
     * @example
     * <LinkInline asChild tone="primary">
     *   <NextLink href="/about">About</NextLink>
     * </LinkInline>
     */
    asChild?: boolean;
}
/** Inline text link with tone control, underline behavior, external indicator, and access gating. */
export declare const LinkInline: React.ForwardRefExoticComponent<LinkInlineProps & React.RefAttributes<HTMLElement>>;
export default LinkInline;
