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

export type ChartSize = "sm" | "md" | "lg";

export type TreemapNode = {
  label: string;
  value?: number;
  children?: TreemapNode[];
  color?: string;
};

export interface TreemapChartProps {
  /** Hierarchical data for the treemap. */
  data: TreemapNode[];
  /** Visual size variant. @default "md" */
  size?: ChartSize;
  /** Override default chart colors. */
  colors?: string[];
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

export const TreemapChart = React.forwardRef<HTMLDivElement, TreemapChartProps>(
  function TreemapChart(
    {
      data,
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

      const palette = colors ?? getChartColorPalette();
      const themeOverrides = getChartThemeOverrides();

      // AG Charts treemap expects a single root node with children
      const rootData = [{ label: "root", children: data }];

      return {
        data: rootData,
        title: title ? { text: title, ...themeOverrides.common?.title } : undefined,
        subtitle: description ? { text: description } : undefined,
        series: [
          {
            type: "treemap" as const,
            labelKey: "label",
            sizeKey: "value",
            childrenKey: "children",
            fills: palette,
            tooltip: {
              renderer: (params: any) => ({
                content: valueFormatter
                  ? `${params.datum.label}: ${valueFormatter(params.datum.value)}`
                  : `${params.datum.label}: ${params.datum.value ?? ""}`,
              }),
            },
          } as any,
        ],
      } as AgChartOptions;
    }, [data, colors, valueFormatter, title, description]);

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
          aria-label={title ?? "Treemap chart — no data"}
          data-testid="treemap-chart-empty"
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
        aria-label={title ?? "Treemap chart"}
        data-testid="treemap-chart"
        {...rest}
      >
        <AgCharts options={options} style={{ height, width: "100%" }} />
      </div>
    );
  },
);

TreemapChart.displayName = "TreemapChart";

export default TreemapChart;
