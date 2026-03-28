import React, { useMemo } from "react";
import { AgCharts as AgChartsBase } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";

// React 18/19 types compatibility shim
const AgCharts = AgChartsBase as unknown as React.FC<{ options: AgChartOptions; style?: React.CSSProperties; className?: string }>;
import { cn } from "@mfe/design-system";
import { getChartThemeOverrides } from "./chart-theme-bridge";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ChartSize = "sm" | "md" | "lg";

export type HeatmapDataPoint = {
  x: string;
  y: string;
  value: number;
};

export interface HeatmapChartProps {
  /** Grid cells — each entry maps an (x, y) label pair to a numeric value. */
  data: HeatmapDataPoint[];
  /** Labels for the X axis. */
  xLabels?: string[];
  /** Labels for the Y axis. */
  yLabels?: string[];
  /** Visual size variant. @default "md" */
  size?: ChartSize;
  /** Gradient colors [low, high]. Uses design-token defaults when omitted. */
  colors?: [string, string];
  /** Custom value formatter for tooltips. */
  valueFormatter?: (value: number) => string;
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

export const HeatmapChart = React.forwardRef<HTMLDivElement, HeatmapChartProps>(
  function HeatmapChart(
    {
      data,
      xLabels,
      yLabels,
      size = "md",
      colors,
      valueFormatter,
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

      const themeOverrides = getChartThemeOverrides();

      return {
        data,
        title: title ? { text: title, ...themeOverrides.common?.title } : undefined,
        subtitle: description ? { text: description } : undefined,
        series: [
          {
            type: "heatmap" as const,
            xKey: "x",
            yKey: "y",
            colorKey: "value",
            colorName: "Value",
            tooltip: {
              renderer: (params: any) => ({
                content: valueFormatter
                  ? `${params.datum.x} / ${params.datum.y}: ${valueFormatter(params.datum.value)}`
                  : `${params.datum.x} / ${params.datum.y}: ${params.datum.value}`,
              }),
            },
            ...(colors
              ? { colorRange: colors }
              : {
                  colorRange: [
                    "var(--surface-subtle, #f1f5f9)",
                    "var(--action-primary, #3b82f6)",
                  ],
                }),
          } as any,
        ],
        axes: [
          {
            type: "category",
            position: "bottom",
            label: { ...themeOverrides.common?.axes?.category?.label },
          },
          {
            type: "category",
            position: "left",
            label: { ...themeOverrides.common?.axes?.category?.label },
          },
        ],
      } as AgChartOptions;
    }, [data, colors, valueFormatter, title, description, xLabels, yLabels]);

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
          aria-label={title ?? "Heatmap chart — no data"}
          data-testid="heatmap-chart-empty"
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
        aria-label={title ?? "Heatmap chart"}
        data-testid="heatmap-chart"
        {...rest}
      >
        <AgCharts options={options} style={{ height, width: "100%" }} />
      </div>
    );
  },
);

HeatmapChart.displayName = "HeatmapChart";

export default HeatmapChart;
