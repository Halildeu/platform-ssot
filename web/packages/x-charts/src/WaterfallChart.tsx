import React, { useMemo } from "react";
import { AgCharts as AgChartsBase } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";

// React 18/19 types compatibility shim
const AgCharts = AgChartsBase as unknown as React.FC<{ options: AgChartOptions; style?: React.CSSProperties; className?: string }>;
import { cn } from "@mfe/design-system";
import { getChartThemeOverrides, getChartColorPalette } from "./chart-theme-bridge";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ChartSize = "sm" | "md" | "lg";

export type WaterfallDataPoint = {
  /** Category label shown on the X axis. */
  label: string;
  /** Numeric value (positive for increases, negative for decreases). */
  value: number;
  /** Semantic type. "total" renders as a cumulative bar from zero. */
  type: "increase" | "decrease" | "total";
};

export interface WaterfallChartProps {
  /** Waterfall data points. */
  data: WaterfallDataPoint[];
  /** Visual size variant. @default "md" */
  size?: ChartSize;
  /** Override colours in order: [increase, decrease, total]. */
  colors?: [string, string, string];
  /** Custom value formatter for axis / labels. */
  valueFormatter?: (value: number) => string;
  /** Show value labels on bars. @default false */
  showValues?: boolean;
  /** Show grid lines. @default true */
  showGrid?: boolean;
  /** Chart title. */
  title?: string;
  /** Accessible description. */
  description?: string;
  /** Additional class name. */
  className?: string;
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

export const WaterfallChart = React.forwardRef<HTMLDivElement, WaterfallChartProps>(
  function WaterfallChart(
    {
      data,
      size = "md",
      colors,
      valueFormatter,
      showValues = false,
      showGrid = true,
      title,
      description,
      className,
      noDataText = "Veri yok",
      ...rest
    },
    forwardedRef,
  ) {
    const height = SIZE_HEIGHT[size];

    const options = useMemo((): AgChartOptions => {
      if (!data || data.length === 0) return { data: [] } as AgChartOptions;

      const palette = colors ?? [
        "var(--state-success-text))", // increase
        "var(--state-error-text))",   // decrease
        "var(--action-primary))",     // total
      ];
      const themeOverrides = getChartThemeOverrides();

      return {
        data,
        title: title ? { text: title, ...themeOverrides.common?.title } : undefined,
        subtitle: description ? { text: description } : undefined,
        series: [
          {
            type: "waterfall" as const,
            xKey: "label",
            yKey: "value",
            item: {
              positive: {
                fill: palette[0],
                stroke: palette[0],
                name: "Increase",
              },
              negative: {
                fill: palette[1],
                stroke: palette[1],
                name: "Decrease",
              },
              total: {
                fill: palette[2],
                stroke: palette[2],
                name: "Total",
              },
            },
            label: showValues
              ? {
                  formatter: (p: any) =>
                    valueFormatter ? valueFormatter(p.value) : String(p.value),
                }
              : undefined,
            tooltip: {
              renderer: (params: any) => ({
                content: valueFormatter
                  ? `${params.datum.label}: ${valueFormatter(params.datum.value)}`
                  : `${params.datum.label}: ${params.datum.value}`,
              }),
            },
          } as any,
        ],
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
      } as AgChartOptions;
    }, [data, colors, valueFormatter, showValues, showGrid, title, description]);

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
          aria-label={title ?? "Waterfall chart — no data"}
          data-testid="waterfall-chart-empty"
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
        aria-label={title ?? "Waterfall chart"}
        data-testid="waterfall-chart"
        {...rest}
      >
        <AgCharts options={options} style={{ height, width: "100%" }} />
      </div>
    );
  },
);

WaterfallChart.displayName = "WaterfallChart";

export default WaterfallChart;
