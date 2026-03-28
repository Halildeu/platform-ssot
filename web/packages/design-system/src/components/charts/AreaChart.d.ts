import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import type { ChartSize, ChartSeries, ChartLocaleText } from "./types";
export interface AreaChartProps extends AccessControlledProps {
    /** Series to render as filled areas. */
    series: ChartSeries[];
    /** X-axis labels. */
    labels: string[];
    /** Visual size variant. @default "md" */
    size?: ChartSize;
    /** Stack areas on top of each other. @default false */
    stacked?: boolean;
    /** Show dot markers at data points. @default true */
    showDots?: boolean;
    /** Show grid lines. @default true */
    showGrid?: boolean;
    /** Show legend below the chart. @default false */
    showLegend?: boolean;
    /** Use gradient fills instead of flat color. @default true */
    gradient?: boolean;
    /** Use bezier curves instead of straight lines. @default false */
    curved?: boolean;
    /** Custom value formatter. */
    valueFormatter?: (value: number) => string;
    /** Animate on mount. @default true */
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
export declare const AreaChart: React.ForwardRefExoticComponent<AreaChartProps & React.RefAttributes<HTMLDivElement>>;
export default AreaChart;
/** Type alias for AreaChart ref. */
export type AreaChartRef = React.Ref<HTMLElement>;
/** Type alias for AreaChart element. */
export type AreaChartElement = HTMLElement;
/** Type alias for AreaChart cssproperties. */
export type AreaChartCSSProperties = React.CSSProperties;
