import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
/** A single key-value item rendered inside the Descriptions grid.
 * @example
 * ```tsx
 * <Descriptions />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/descriptions)
 */
export interface DescriptionsItem {
    /** Unique identifier for the item. */
    key: string;
    /** Label displayed above the value. */
    label: React.ReactNode;
    /** Primary value content. */
    value?: React.ReactNode;
    /** Secondary helper text shown below the value. */
    helper?: React.ReactNode;
    /** Semantic tone applied as a left border accent. */
    tone?: "default" | "info" | "success" | "warning" | "danger";
    /** Number of grid columns this item spans. */
    span?: 1 | 2 | 3;
}
/**
 * Descriptions displays structured key-value metadata in a responsive grid layout.
 */
export interface DescriptionsProps extends AccessControlledProps {
    /** Array of key-value items to render. */
    items: DescriptionsItem[];
    /** Optional heading above the grid. */
    title?: React.ReactNode;
    /** Optional subtitle below the heading. */
    description?: React.ReactNode;
    /** Number of grid columns. @default 2 */
    columns?: 1 | 2 | 3;
    /** Vertical density of the grid cells. @default "comfortable" */
    density?: "comfortable" | "compact";
    /** Whether to render cell borders. @default false */
    bordered?: boolean;
    /** Custom label shown when items array is empty. */
    emptyStateLabel?: React.ReactNode;
    /** Locale-specific text overrides. */
    localeText?: {
        emptyFallbackDescription?: React.ReactNode;
    };
    /** Stretch grid to full container width. @default false */
    fullWidth?: boolean;
    /** Additional CSS class name. */
    className?: string;
}
export declare const Descriptions: React.ForwardRefExoticComponent<DescriptionsProps & React.RefAttributes<HTMLDivElement>>;
