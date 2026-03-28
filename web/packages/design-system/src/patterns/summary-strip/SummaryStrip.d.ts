import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export interface SummaryStripItem {
    key: React.Key;
    label: React.ReactNode;
    value: React.ReactNode;
    note?: React.ReactNode;
    trend?: React.ReactNode;
    icon?: React.ReactNode;
    tone?: "default" | "info" | "success" | "warning";
}
/** Props for the SummaryStrip component.
 * @example
 * ```tsx
 * <SummaryStrip />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/summary-strip)
 */
export interface SummaryStripProps extends AccessControlledProps {
    /** KPI / metric items to display in the strip. */
    items: SummaryStripItem[];
    /** Heading text above the strip. */
    title?: React.ReactNode;
    /** Descriptive text below the heading. */
    description?: React.ReactNode;
    /** Number of grid columns for the metric cards. */
    columns?: 2 | 3 | 4;
    /** Additional CSS class name. */
    className?: string;
}
/**
 * Horizontal KPI / metric strip that displays key summary values in a
 * responsive grid with optional icons, trend indicators and tone accents.
 */
export declare const SummaryStrip: React.ForwardRefExoticComponent<SummaryStripProps & React.RefAttributes<HTMLDivElement>>;
