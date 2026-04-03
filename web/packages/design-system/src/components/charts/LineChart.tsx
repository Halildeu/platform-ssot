/* eslint-disable @typescript-eslint/no-explicit-any -- AG Charts API uses any extensively */
import React, { useMemo } from "react";
import { AgCharts as AgChartsBase } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";

// React 18/19 types compatibility shim
const AgCharts = AgChartsBase as unknown as React.FC<{ options: AgChartOptions; style?: React.CSSProperties; className?: string }>;
import { cn } from "../../utils/cn";
import {
  resolveAccessState, _accessStyles,
  type AccessControlledProps,
} from "../../internal/access-controller";
import { getChartThemeOverrides, getChartColorPalette } from "../../advanced/data-grid/chart-theme-bridge";
import type { ChartSize, ChartSeries, ChartLocaleText, ChartClickEvent } from "./types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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
  /** Callback fired when a data point (marker) is clicked. */
  onDataPointClick?: (event: ChartClickEvent) => void;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------
   */

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------
 * @example
 * ```tsx
 * <LineChart />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/line-chart)
 */
export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  function LineChart(
    {
      series: seriesData,
      labels,
      size = "md",
      showDots = true,
      showGrid = true,
      showLegend = false,
      showArea = false,
      curved = false,
      valueFormatter,
      animate = true,
      title,
      description,
      localeText,
      className,
      onDataPointClick,
      access = "full",
      accessReason,
      ...rest
    },
    forwardedRef,
  ) {
    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    const noDataText = localeText?.noData ?? "Veri yok";
    const height = SIZE_HEIGHT[size];

    const isEmpty = !seriesData || seriesData.length === 0 || !labels || labels.length === 0;

    const options = useMemo((): AgChartOptions => {
      if (isEmpty) return { data: [] } as AgChartOptions;

      const palette = getChartColorPalette();
      const themeOverrides = getChartThemeOverrides();

      // Transform series data into row-based format for AG Charts
      const chartData = labels.map((label, i) => {
        const row: Record<string, any> = { label };
        seriesData.forEach((s) => {
          row[s.name] = s.data[i] ?? 0;
        });
        return row;
      });

      const clickListener = onDataPointClick ? {
        seriesNodeClick: (e: any) => {
          onDataPointClick({
            datum: e.datum ?? {},
            seriesId: e.seriesId,
            xKey: e.xKey,
            yKey: e.yKey,
            value: e.datum?.[e.yKey],
            label: e.datum?.[e.xKey],
          });
        },
      } : undefined;

      const agSeries: AgChartOptions["series"] = seriesData.map((s, i) => ({
        type: showArea ? ("area" as const) : ("line" as const),
        xKey: "label",
        yKey: s.name,
        yName: s.name,
        fill: showArea ? (s.color ?? palette[i % palette.length]) : undefined,
        fillOpacity: showArea ? 0.18 : undefined,
        stroke: s.color ?? palette[i % palette.length],
        marker: { enabled: showDots, size: 6 },
        cursor: onDataPointClick ? "pointer" : undefined,
        interpolation: curved ? { type: "smooth" as const } : undefined,
        listeners: clickListener,
      }));

      return {
        data: chartData,
        title: title ? { text: title, ...themeOverrides.common?.title } : undefined,
        subtitle: description ? { text: description } : undefined,
        series: agSeries,
        axes: [
          {
            type: "category",
            position: "bottom",
            label: { ...themeOverrides.common?.axes?.category?.label },
          },
          {
            type: "number",
            position: "left",
            label: {
              ...themeOverrides.common?.axes?.number?.label,
              formatter: valueFormatter ? (p: any) => valueFormatter(p.value) : undefined,
            },
            gridLine: { enabled: showGrid },
          },
        ],
        legend: { enabled: showLegend || seriesData.length > 1 },
      } as AgChartOptions;
    }, [seriesData, labels, showDots, showGrid, showLegend, showArea, curved, valueFormatter, animate, title, description, isEmpty, onDataPointClick]);

    if (isEmpty) {
      return (
        <div
          ref={forwardedRef}
          data-access-state={accessState.state}
          className={cn(
            "inline-flex items-center justify-center text-sm text-text-secondary",
            accessState.isDisabled && "opacity-50",
            className,
          )}
          style={{ height }}
          title={accessReason}
          data-testid="line-chart-empty"
          {...rest}
        >
          {noDataText}
        </div>
      );
    }

    return (
      <div
        ref={forwardedRef}
        className={cn(
          "w-full",
          accessState.isDisabled && "opacity-50",
          className,
        )}
        title={accessReason}
        data-testid="line-chart"
        {...rest}
      >
        <AgCharts options={options} style={{ height, width: "100%" }} />
      </div>
    );
  },
);

LineChart.displayName = "LineChart";

export default LineChart;

/** Type alias for LineChart ref. */
export type LineChartRef = React.Ref<HTMLElement>;
/** Type alias for LineChart element. */
export type LineChartElement = HTMLElement;
/** Type alias for LineChart cssproperties. */
export type LineChartCSSProperties = React.CSSProperties;
