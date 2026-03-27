import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import type { ChartSize, ChartDataPoint, ChartLocaleText } from "./types";
export interface PieChartProps extends AccessControlledProps {
    /** Data points to render as slices. */
    data: ChartDataPoint[];
    /** Visual size variant. @default "md" */
    size?: ChartSize;
    /** Donut mode (ring instead of filled). @default false */
    donut?: boolean;
    /** Show labels beside slices. @default false */
    showLabels?: boolean;
    /** Show legend below the chart. @default false */
    showLegend?: boolean;
    /** Show percentage on slices. @default false */
    showPercentage?: boolean;
    /** Custom value formatter. */
    valueFormatter?: (value: number) => string;
    /** Center content for donut mode. */
    innerLabel?: React.ReactNode;
    /** Animate slices on mount. @default true */
    animate?: boolean;
    /** Chart title. */
    title?: string;
    /** Accessible description. */
    description?: string;
    /** Locale overrides. */
    localeText?: ChartLocaleText;
    /** Additional class name. */
    className?: string;
}
export declare const PieChart: React.ForwardRefExoticComponent<PieChartProps & React.RefAttributes<HTMLDivElement>>;
export default PieChart;
/** Type alias for PieChart ref. */
export type PieChartRef = React.Ref<HTMLElement>;
/** Type alias for PieChart element. */
export type PieChartElement = HTMLElement;
/** Type alias for PieChart cssproperties. */
export type PieChartCSSProperties = React.CSSProperties;
