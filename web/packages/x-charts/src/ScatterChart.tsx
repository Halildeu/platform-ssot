import React, { useMemo } from "react";
import { AgCharts as AgChartsBase } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";

// React 18/19 types compatibility shim
const AgCharts = AgChartsBase as unknown as React.FC<{ options: AgChartOptions; style?: React.CSSProperties; className?: string }>;
import { cn } from "@mfe/design-system";
import { getChartThemeOverrides, getChartColorPalette } from "@mfe/design-system/advanced";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ScatterDataPoint = {
  x: number;
  y: number;
  size?: number;
  label?: string;
  color?: string;
};

export type ChartSize = "sm" | "md" | "lg";

export interface ScatterChartProps {
  /** Data points for the scatter plot. */
  data: ScatterDataPoint[];
  /** Visual size variant. @default "md" */
  size?: ChartSize;
  /** Show grid lines. @default true */
  showGrid?: boolean;
  /** Show legend below the chart. @default false */
  showLegend?: boolean;
  /** Chart title. */
  title?: string;
  /** Accessible description. */
  description?: string;
  /** Override default chart colors. */
  colors?: string[];
  /** Custom value formatter for axis labels. */
  valueFormatter?: (value: number) => string;
  /** Animate on mount. @default true */
  animate?: boolean;
  /** Additional class name. */
  className?: string;
  /** X-axis label. */
  xLabel?: string;
  /** Y-axis label. */
  yLabel?: string;
  /** Enable bubble mode — sizes markers by the `size` field. @default false */
  bubble?: boolean;
  /** Text shown when data is empty. @default "Veri yok" */
  noDataText?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const ScatterChart = React.forwardRef<HTMLDivElement, ScatterChartProps>(
  function ScatterChart(
    {
      data,
      size = "md",
      showGrid = true,
      showLegend = false,
      title,
      description,
      colors,
      valueFormatter,
      animate = true,
      className,
      xLabel,
      yLabel,
      bubble = false,
      noDataText = "Veri yok",
      ...rest
    },
    forwardedRef,
  ) {
    const height = SIZE_HEIGHT[size];

    const options = useMemo((): AgChartOptions => {
      if (!data || data.length === 0) return { data: [] } as AgChartOptions;

      const palette = colors ?? getChartColorPalette();
      const themeOverrides = getChartThemeOverrides();

      const chartData = data.map((d, i) => ({
        ...d,
        _fill: d.color ?? palette[i % palette.length],
      }));

      return {
        data: chartData,
        title: title ? { text: title, ...themeOverrides.common?.title } : undefined,
        subtitle: description ? { text: description } : undefined,
        series: [
          {
            type: "scatter" as const,
            xKey: "x",
            yKey: "y",
            ...(bubble ? { sizeKey: "size", sizeName: "Size" } : {}),
            labelKey: "label",
            marker: {
              fill: palette[0],
              stroke: palette[0],
            },
            tooltip: {
              renderer: (params: any) => ({
                content: valueFormatter
                  ? `(${valueFormatter(params.datum.x)}, ${valueFormatter(params.datum.y)})`
                  : `(${params.datum.x}, ${params.datum.y})${params.datum.label ? ` — ${params.datum.label}` : ""}`,
              }),
            },
          } as any,
        ],
        axes: [
          {
            type: "number",
            position: "bottom",
            title: xLabel ? { text: xLabel } : undefined,
            label: {
              ...themeOverrides.common?.axes?.number?.label,
              formatter: valueFormatter ? (p: any) => valueFormatter(p.value) : undefined,
            },
            gridLine: { enabled: showGrid },
          },
          {
            type: "number",
            position: "left",
            title: yLabel ? { text: yLabel } : undefined,
            label: {
              ...themeOverrides.common?.axes?.number?.label,
              formatter: valueFormatter ? (p: any) => valueFormatter(p.value) : undefined,
            },
            gridLine: { enabled: showGrid },
          },
        ],
        legend: { enabled: showLegend },
      } as AgChartOptions;
    }, [data, showGrid, showLegend, valueFormatter, animate, colors, title, description, xLabel, yLabel, bubble]);

    /* ---- empty state ---- */
    if (!data || data.length === 0) {
      return (
        <div
          ref={forwardedRef}
          className={cn(
            "inline-flex items-center justify-center text-sm text-[var(--text-secondary)]",
            className,
          )}
          style={{ height }}
          role="img"
          aria-label={title ?? "Scatter chart — no data"}
          data-testid="scatter-chart-empty"
          {...rest}
        >
          {noDataText}
        </div>
      );
    }

    return (
      <div
        ref={forwardedRef}
        className={cn("w-full", className)}
        role="img"
        aria-label={title ?? "Scatter chart"}
        data-testid="scatter-chart"
        {...rest}
      >
        <AgCharts options={options} style={{ height, width: "100%" }} />
      </div>
    );
  },
);

ScatterChart.displayName = "ScatterChart";

export default ScatterChart;
