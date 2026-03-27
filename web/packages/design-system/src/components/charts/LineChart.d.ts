import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import type { ChartSize, ChartSeries, ChartLocaleText } from "./types";
export interface LineChartProps extends AccessControlledProps {
    /** Series to render as lines. */
    series: ChartSeries[];
    /** X-axis labels. */
    labels: string[];
    /** Visual size variant. @default "md" */
    size?: ChartSize;
    /** Show dot markers at data points. @default true */
    showDots?: boolean;
    /** Show grid lines. @default true */
    showGrid?: boolean;
    /** Show legend below the chart. @default false */
    showLegend?: boolean;
    /** Fill area under the lines. @default false */
    showArea?: boolean;
    /** Use bezier curves instead of straight lines. @default false */
    curved?: boolean;
    /** Custom value formatter. */
    valueFormatter?: (value: number) => string;
    /** Animate line drawing on mount. @default true */
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
export declare const LineChart: React.ForwardRefExoticComponent<LineChartProps & React.RefAttributes<HTMLDivElement>>;
export default LineChart;
/** Type alias for LineChart ref. */
export type LineChartRef = React.Ref<HTMLElement>;
/** Type alias for LineChart element. */
export type LineChartElement = HTMLElement;
/** Type alias for LineChart cssproperties. */
export type LineChartCSSProperties = React.CSSProperties;
