import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
/** Props for the FilterBar component.
 * @example
 * ```tsx
 * <FilterBar />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/filter-bar)
 */
export interface FilterBarProps extends AccessControlledProps {
    /** Primary filter controls (always visible) */
    children: React.ReactNode;
    /** Secondary/advanced filters (collapsible) */
    moreFilters?: React.ReactNode;
    /** Right-side actions (e.g. Reset, Apply) */
    actions?: React.ReactNode;
    /** Search slot (leftmost) */
    search?: React.ReactNode;
    /** Active filter count for badge */
    activeCount?: number;
    /** Toggle label for more filters */
    moreLabel?: string;
    /** Compact mode — less padding */
    compact?: boolean;
    className?: string;
}
/** Horizontal filter strip with primary controls, collapsible advanced filters, and action buttons. */
export declare const FilterBar: React.ForwardRefExoticComponent<FilterBarProps & React.RefAttributes<HTMLDivElement>>;
/** Type alias for FilterBar ref. */
export type FilterBarRef = React.Ref<HTMLElement>;
/** Type alias for FilterBar element. */
export type FilterBarElement = HTMLElement;
/** Type alias for FilterBar cssproperties. */
export type FilterBarCSSProperties = React.CSSProperties;
