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
import type { ChartSize, ChartDataPoint, ChartLocaleText, ChartClickEvent } from "./types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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
  series?: { field: string; name: string; color?: string }[];
  /** Callback fired when a data point (bar) is clicked. */
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
 * <BarChart />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/bar-chart)
 */
export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  function BarChart(
    {
      data,
      orientation = "vertical",
      size = "md",
      showValues = false,
      showGrid = true,
      showLegend = false,
      valueFormatter,
      animate = true,
      colors,
      title,
      description,
      localeText,
      className,
      series: seriesDef,
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

    const options = useMemo((): AgChartOptions => {
      if (!data || data.length === 0) return { data: [] } as AgChartOptions;

      const palette = colors ?? getChartColorPalette();
      const themeOverrides = getChartThemeOverrides();
      const _isHorizontal = orientation === "horizontal";

      // Multi-series support (value, value2, etc.)
      const hasMultiSeries = seriesDef && seriesDef.length > 0;

      // Assign per-item fill colors for single-series
      const chartData = hasMultiSeries
        ? data
        : data.map((d, i) => ({
            ...d,
            _fill: d.color ?? palette[i % palette.length],
          }));

      const clickListener = onDataPointClick ? {
        nodeClick: (e: any) => {
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

      const barSeries: any[] = hasMultiSeries
        ? seriesDef!.map((s, i) => ({
            type: "bar" as const,
            direction: _isHorizontal ? "horizontal" : "vertical",
            xKey: "label",
            yKey: s.field,
            yName: s.name,
            fill: s.color ?? palette[i % palette.length],
            cursor: onDataPointClick ? "pointer" : undefined,
            listeners: clickListener,
            label: showValues ? { formatter: (p: any) => valueFormatter ? valueFormatter(p.value) : String(p.value) } : undefined,
          }))
        : [
            {
              type: "bar" as const,
              direction: _isHorizontal ? "horizontal" : "vertical",
              xKey: "label",
              yKey: "value",
              fill: palette[0],
              itemStyler: (params: any) => ({
                fill: chartData[params.itemId % chartData.length]?._fill ?? palette[params.itemId % palette.length],
              }),
              cursor: onDataPointClick ? "pointer" : undefined,
              listeners: clickListener,
              label: showValues ? { formatter: (p: any) => valueFormatter ? valueFormatter(p.value) : String(p.value) } : undefined,
            },
          ];

      return {
        data: chartData,
        title: title ? { text: title, ...themeOverrides.common?.title } : undefined,
        subtitle: description ? { text: description } : undefined,
        series: barSeries as AgChartOptions["series"],
        legend: { enabled: showLegend || (hasMultiSeries ?? false) },
        theme: {
          overrides: {
            bar: {
              axes: {
                number: {
                  gridLine: { enabled: showGrid },
                  ...(valueFormatter ? { label: { formatter: (p: any) => valueFormatter(p.value) } } : {}),
                },
              },
            },
          },
        },
      } as AgChartOptions;
    }, [data, orientation, showValues, showGrid, showLegend, valueFormatter, animate, colors, title, description, seriesDef, onDataPointClick]);

    /* ---- empty state ---- */
    if (!data || data.length === 0) {
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
          data-testid="bar-chart-empty"
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
        data-testid="bar-chart"
        {...rest}
      >
        <AgCharts options={options} style={{ height, width: "100%" }} />
      </div>
    );
  },
);

BarChart.displayName = "BarChart";

export default BarChart;

/** Type alias for BarChart ref. */
export type BarChartRef = React.Ref<HTMLElement>;
/** Type alias for BarChart element. */
export type BarChartElement = HTMLElement;
/** Type alias for BarChart cssproperties. */
export type BarChartCSSProperties = React.CSSProperties;
