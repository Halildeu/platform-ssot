import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type TrendDirection = "up" | "down" | "stable";
export type WidgetTrend = {
    direction: TrendDirection;
    percentage: number;
};
export type WidgetType = "kpi" | "chart" | "table" | "list" | "timeline" | "progress" | "custom";
export type WidgetTone = "default" | "info" | "success" | "warning" | "danger";
export type WidgetSize = "sm" | "md" | "lg" | "xl";
export type DashboardWidget = {
    key: string;
    title: string;
    type: WidgetType;
    value?: string | number;
    trend?: WidgetTrend;
    size?: WidgetSize;
    tone?: WidgetTone;
    content?: React.ReactNode;
    pinned?: boolean;
    refreshInterval?: number;
    onRefresh?: () => void;
    lastUpdated?: string;
};
export type DashboardDensity = "comfortable" | "compact";
/** Props for the SmartDashboard component.
 * @example
 * ```tsx
 * <SmartDashboard />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/smart-dashboard)
 */
export interface SmartDashboardProps extends AccessControlledProps {
    /** Widget definitions to display in the dashboard grid. */
    widgets: DashboardWidget[];
    /** Heading text for the dashboard. */
    title?: string;
    /** Descriptive text below the heading. */
    description?: string;
    /** Personalized greeting message shown in a banner. */
    greeting?: string;
    /** Callback fired when widget order changes. */
    onWidgetReorder?: (keys: string[]) => void;
    /** Callback fired when a widget is pinned or unpinned. */
    onWidgetPin?: (key: string, pinned: boolean) => void;
    /** Callback to refresh all widgets at once. */
    refreshAll?: () => void;
    /** Currently selected time range value. */
    timeRange?: string;
    /** Callback fired when the time range selector changes. */
    onTimeRangeChange?: (range: string) => void;
    /** Number of grid columns for the widget layout. */
    columns?: 2 | 3 | 4;
    /** Spacing density variant. */
    density?: DashboardDensity;
    /** Additional CSS class name. */
    className?: string;
}
/** Auto-organizing dashboard with KPI cards, trend indicators, pin/tone priority sorting, and responsive grid layout. */
export declare const SmartDashboard: React.ForwardRefExoticComponent<SmartDashboardProps & React.RefAttributes<HTMLElement>>;
export default SmartDashboard;
