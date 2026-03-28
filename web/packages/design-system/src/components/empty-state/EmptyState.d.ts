import React from "react";
import type { AccessLevel } from "../../internal/access-controller";
export interface EmptyStateProps {
    /** Illustration or icon displayed above the title. */
    icon?: React.ReactNode;
    /** Heading text for the empty state. */
    title?: React.ReactNode;
    /** Descriptive text shown below the title. */
    description?: React.ReactNode;
    /** Primary action element (e.g. Button). */
    action?: React.ReactNode;
    /** Secondary action element displayed beside the primary action. */
    secondaryAction?: React.ReactNode;
    /** Compact variant with reduced padding for inline use. */
    compact?: boolean;
    /** Additional CSS class name for the root element. */
    className?: string;
    /** Access level — controls visibility */
    access?: AccessLevel;
    /** Tooltip/title text explaining access restriction */
    accessReason?: string;
}
/**
 * Placeholder for empty data views with icon, title, description, and action buttons.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<SearchIcon />}
 *   title="No results found"
 *   description="Try adjusting your search or filter criteria."
 *   action={<Button onClick={resetFilters}>Reset Filters</Button>}
 * />
 * ```
 */
export declare const EmptyState: React.ForwardRefExoticComponent<EmptyStateProps & React.RefAttributes<HTMLDivElement>>;
/** Type alias for EmptyState ref. */
export type EmptyStateRef = React.Ref<HTMLElement>;
/** Type alias for EmptyState element. */
export type EmptyStateElement = HTMLElement;
/** Type alias for EmptyState cssproperties. */
export type EmptyStateCSSProperties = React.CSSProperties;
