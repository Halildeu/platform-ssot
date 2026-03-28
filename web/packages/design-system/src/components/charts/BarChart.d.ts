import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import type { ChartSize, ChartDataPoint, ChartLocaleText } from "./types";
export interface BarChartProps extends AccessControlledProps {
    /** Data points to render as bars. */
    data: ChartDataPoint[];
    /** Bar orientation. @default "vertical" */
    orientation?: "vertical" | "horizontal";
    /** Visual size variant. @default "md" */
    size?: ChartSize;
    /** Show value labels on bars. @default false */
    showValues?: boolean;
    /** Show grid lines. @default true */
    showGrid?: boolean;
    /** Show legend below the chart. @default false */
    showLegend?: boolean;
    /** Custom value formatter. */
    valueFormatter?: (value: number) => string;
    /** Animate bars on mount. @default true */
    animate?: boolean;
    /** Override default chart colors. */
    colors?: string[];
    /** Chart title. */
    title?: string;
    /** Accessible description. */
    description?: string;
    /** Locale overrides. */
    localeText?: ChartLocaleText;
    /** Additional class name. */
    className?: string;
    /** Multi-series: second value field for grouped bars. */
    series?: {
        field: string;
        name: string;
        color?: string;
    }[];
}
export declare const BarChart: React.ForwardRefExoticComponent<BarChartProps & React.RefAttributes<HTMLDivElement>>;
export default BarChart;
/** Type alias for BarChart ref. */
export type BarChartRef = React.Ref<HTMLElement>;
/** Type alias for BarChart element. */
export type BarChartElement = HTMLElement;
/** Type alias for BarChart cssproperties. */
export type BarChartCSSProperties = React.CSSProperties;
