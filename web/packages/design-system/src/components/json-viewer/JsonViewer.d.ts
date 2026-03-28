import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
/** Props for the JsonViewer component.
 * @example
 * ```tsx
 * <JsonViewer />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/json-viewer)
 */
export interface JsonViewerProps extends AccessControlledProps {
    /** JSON data to display in the tree. */
    value: unknown;
    /** Heading text above the viewer. */
    title?: React.ReactNode;
    /** Descriptive text below the heading. */
    description?: React.ReactNode;
    /** Label for the root tree node. */
    rootLabel?: string;
    /** Number of tree levels expanded by default. */
    defaultExpandedDepth?: number;
    /** Maximum height of the scrollable viewer area. */
    maxHeight?: number | string;
    /** Whether the viewer spans full container width. */
    fullWidth?: boolean;
    /** Whether to show type badges on each node. */
    showTypes?: boolean;
    /** Label shown when no data is available. */
    emptyStateLabel?: React.ReactNode;
    /** Locale-specific label overrides. */
    localeText?: {
        emptyStateLabel?: React.ReactNode;
        emptyFallbackDescription?: React.ReactNode;
        emptyNodeDescription?: React.ReactNode;
        arraySummary?: (count: number) => React.ReactNode;
        objectSummary?: (count: number) => React.ReactNode;
        nullTypeLabel?: string;
        arrayTypeLabel?: string;
        objectTypeLabel?: string;
        booleanTypeLabel?: string;
        numberTypeLabel?: string;
    };
}
/** Interactive collapsible JSON tree viewer with type badges and configurable expand depth. */
export declare const JsonViewer: React.ForwardRefExoticComponent<JsonViewerProps & React.RefAttributes<HTMLElement>>;
export default JsonViewer;
/** Type alias for JsonViewer ref. */
export type JsonViewerRef = React.Ref<HTMLElement>;
/** Type alias for JsonViewer element. */
export type JsonViewerElement = HTMLElement;
/** Type alias for JsonViewer cssproperties. */
export type JsonViewerCSSProperties = React.CSSProperties;
