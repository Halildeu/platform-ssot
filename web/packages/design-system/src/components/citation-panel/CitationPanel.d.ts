import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type CitationKind = "policy" | "doc" | "code" | "log" | "dataset";
export interface CitationPanelItem {
    id: string;
    title: React.ReactNode;
    excerpt: React.ReactNode;
    source: React.ReactNode;
    locator?: React.ReactNode;
    kind?: CitationKind;
    badges?: React.ReactNode[];
}
/** Props for the CitationPanel component.
 * @example
 * ```tsx
 * <CitationPanel />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/citation-panel)
 */
export interface CitationPanelProps extends AccessControlledProps {
    /** Citation items to display in the panel. */
    items: CitationPanelItem[];
    /** Heading text above the citation list. */
    title?: React.ReactNode;
    /** Descriptive text below the heading. */
    description?: React.ReactNode;
    /** Whether to use a compact layout. */
    compact?: boolean;
    /** ID of the currently selected citation. */
    activeCitationId?: string | null;
    /** Label shown when there are no citations. */
    emptyStateLabel?: React.ReactNode;
    /** Callback fired when a citation is clicked. */
    onOpenCitation?: (id: string, item: CitationPanelItem) => void;
    /** Additional CSS class name. */
    className?: string;
}
/** Panel displaying a list of source citations with excerpt, kind badge, and selection support. */
export declare const CitationPanel: React.ForwardRefExoticComponent<CitationPanelProps & React.RefAttributes<HTMLElement>>;
export default CitationPanel;
