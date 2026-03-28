import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type AnchorTocDensity = "comfortable" | "compact";
export interface AnchorTocItem {
    id: string;
    label: React.ReactNode;
    level?: 1 | 2 | 3;
    meta?: React.ReactNode;
    disabled?: boolean;
}
/** Props for the AnchorToc component.
 * @example
 * ```tsx
 * <AnchorToc />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/anchor-toc)
 */
export interface AnchorTocProps extends AccessControlledProps {
    /** Ordered list of table-of-contents entries. */
    items: AnchorTocItem[];
    /** Controlled active item ID. */
    value?: string;
    /** Initial active item ID for uncontrolled mode. */
    defaultValue?: string;
    /** Callback fired when the active item changes. */
    onValueChange?: (value: string) => void;
    /** Heading text above the navigation list. */
    title?: React.ReactNode;
    /** Spacing density variant. */
    density?: AnchorTocDensity;
    /** Whether the TOC sticks to the viewport on scroll. */
    sticky?: boolean;
    /** Whether to synchronize active item with the URL hash. */
    syncWithHash?: boolean;
    /** Additional CSS class name. */
    className?: string;
    /** Locale-specific label overrides. */
    localeText?: {
        title?: React.ReactNode;
        navigationLabel?: string;
    };
}
/** On-page table of contents that syncs with URL hash for anchor-based section navigation. */
export declare const AnchorToc: React.ForwardRefExoticComponent<AnchorTocProps & React.RefAttributes<HTMLElement>>;
export default AnchorToc;
