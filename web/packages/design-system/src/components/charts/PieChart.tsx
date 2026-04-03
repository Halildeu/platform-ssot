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
  /** Callback fired when a data point (slice) is clicked. */
  onDataPointClick?: (event: ChartClickEvent) => void;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------
   */

const SIZE_DIM: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ 
 * @example
 * ```tsx
 * <PieChart />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/pie-chart)
 */
export const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  function PieChart(
    {
      data,
      size = "md",
      donut = false,
      showLabels = false,
      showLegend = false,
      showPercentage = false,
      valueFormatter,
      innerLabel,
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
    const dim = SIZE_DIM[size];

    const validData = useMemo(
      () => (data ?? []).filter((d) => d.value > 0),
      [data],
    );

    const options = useMemo((): AgChartOptions => {
      if (validData.length === 0) return { data: [] } as AgChartOptions;

      const palette = getChartColorPalette();
      const themeOverrides = getChartThemeOverrides();

      const coloredData = validData.map((d, i) => ({
        ...d,
        _fill: d.color ?? palette[i % palette.length],
      }));

      return {
        data: coloredData,
        title: title ? { text: title, ...themeOverrides.common?.title } : undefined,
        subtitle: description ? { text: description } : undefined,
        series: [
          {
            type: donut ? "donut" : "pie",
            angleKey: "value",
            legendItemKey: "label",
            sectorLabel: {
              enabled: showLabels || showPercentage,
              formatter: showPercentage
                ? (p: any) => `${Math.round((p.value / p.total) * 100)}%`
                : undefined,
            },
            calloutLabel: {
              enabled: showLabels,
            },
            tooltip: {
              renderer: (params: any) => ({
                content: valueFormatter
                  ? `${params.datum.label}: ${valueFormatter(params.datum.value)}`
                  : `${params.datum.label}: ${params.datum.value}`,
              }),
            },
            ...(donut ? { innerRadiusOffset: -40 } : {}),
            fills: coloredData.map((d) => d._fill),
            cursor: onDataPointClick ? "pointer" : undefined,
          } as any,
        ],
        listeners: onDataPointClick ? {
          seriesNodeClick: (e: any) => {
            onDataPointClick({
              datum: e.datum ?? {},
              seriesId: e.seriesId,
              xKey: undefined,
              yKey: e.angleKey,
              value: e.datum?.[e.angleKey ?? "value"],
              label: e.datum?.label,
            });
          },
        } : undefined,
        legend: { enabled: showLegend },
      } as AgChartOptions;
    }, [validData, donut, showLabels, showLegend, showPercentage, valueFormatter, animate, title, description, onDataPointClick]);

    /* ---- empty state ---- */
    if (validData.length === 0) {
      return (
        <div
          ref={forwardedRef}
          data-access-state={accessState.state}
          className={cn(
            "inline-flex items-center justify-center text-sm text-text-secondary",
            accessState.isDisabled && "opacity-50",
            className,
          )}
          style={{ width: dim, height: dim }}
          title={accessReason}
          data-testid="pie-chart-empty"
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
          "relative w-full",
          accessState.isDisabled && "opacity-50",
          className,
        )}
        title={accessReason}
        data-testid="pie-chart"
        {...rest}
      >
        <AgCharts options={options} style={{ height: dim, width: "100%" }} />
        {donut && innerLabel ? (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            data-testid="pie-chart-inner-label"
          >
            {innerLabel}
          </div>
        ) : null}
      </div>
    );
  },
);

PieChart.displayName = "PieChart";

export default PieChart;

/** Type alias for PieChart ref. */
export type PieChartRef = React.Ref<HTMLElement>;
/** Type alias for PieChart element. */
export type PieChartElement = HTMLElement;
/** Type alias for PieChart cssproperties. */
export type PieChartCSSProperties = React.CSSProperties;
