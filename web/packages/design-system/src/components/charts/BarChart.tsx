/**
 * BarChart — ECharts-powered bar chart with Design Lab integration
 *
 * Backwards-compatible with the AG Charts API surface.
 * Supports both legacy props API and new ChartSpec-driven API.
 *
 * @migration AG Charts → ECharts (P1, chart-viz-engine-selection D-001)
 */
import React, { useMemo, useRef, useEffect, useCallback } from "react";
import { cn } from "../../utils/cn";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";
import type { ChartSize, ChartDataPoint, ChartLocaleText, ChartClickEvent } from "./types";

/* ------------------------------------------------------------------ */
/*  ECharts Modular Imports (tree-shaking)                             */
/* ------------------------------------------------------------------ */
import * as echarts from "echarts/core";
import { BarChart as EChartsBar } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  AriaComponent,
} from "echarts/components";
import type { ECharts as EChartsInstance, ComposeOption } from "echarts/core";
import type { BarSeriesOption } from "echarts/charts";
import type {
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  GridComponentOption,
  DatasetComponentOption,
  AriaComponentOption,
} from "echarts/components";

// Register once
let _registered = false;
function ensureRegistered() {
  if (_registered) return;
  echarts.use([
    CanvasRenderer,
    EChartsBar,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DatasetComponent,
    AriaComponent,
  ]);
  _registered = true;
}

type ECOption = ComposeOption<
  | BarSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | AriaComponentOption
>;

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
/* ------------------------------------------------------------------ */

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };

/* ------------------------------------------------------------------ */
/*  CSS Variable Reader                                                */
/* ------------------------------------------------------------------ */

const getCSSVar = (varName: string, fallback: string): string => {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return value || fallback;
};

const getDefaultPalette = (): string[] => [
  getCSSVar("--action-primary", "#3b82f6"),
  getCSSVar("--state-success-text", "#22c55e"),
  getCSSVar("--state-warning-text", "#f59e0b"),
  getCSSVar("--state-error-text", "#ef4444"),
  getCSSVar("--state-info-text", "#06b6d4"),
  getCSSVar("--action-secondary", "#8b5cf6"),
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* ------------------------------------------------------------------ */
/*  Reduced motion                                                     */
/* ------------------------------------------------------------------ */

const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Bar chart component powered by ECharts.
 *
 * @example
 * ```tsx
 * <BarChart
 *   data={[{ label: "A", value: 10 }, { label: "B", value: 20 }]}
 *   title="Sales"
 *   showLegend
 * />
 * ```
 * @since 1.0.0
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

    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<EChartsInstance | null>(null);

    // Ensure ECharts modules registered
    ensureRegistered();

    // Build ECharts option from props
    const option = useMemo((): ECOption | null => {
      if (!data || data.length === 0) return null;

      const palette = colors ?? getDefaultPalette();
      const isHorizontal = orientation === "horizontal";
      const hasMultiSeries = seriesDef && seriesDef.length > 0;
      const reducedMotion = prefersReducedMotion();
      const shouldAnimate = animate && !reducedMotion;

      const fontFamily = getCSSVar(
        "--font-family-sans",
        "Inter, system-ui, sans-serif",
      );
      const textPrimary = getCSSVar("--text-primary", "#1a1a2e");
      const textSecondary = getCSSVar("--text-secondary", "#6b7280");
      const borderDefault = getCSSVar("--border-default", "#e5e7eb");
      const bgMuted = getCSSVar("--bg-muted", "#f9fafb");

      // Category axis data
      const categories = data.map((d) => d.label);

      // Build series
      const seriesList: BarSeriesOption[] = hasMultiSeries
        ? seriesDef!.map((s, i) => ({
            type: "bar" as const,
            name: s.name,
            data: data.map((d) => (d as Record<string, unknown>)[s.field] as number),
            itemStyle: {
              color: s.color ?? palette[i % palette.length],
              borderRadius: isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
            },
            barMaxWidth: 40,
            label: showValues
              ? {
                  show: true,
                  position: "top" as const,
                  formatter: valueFormatter
                    ? (p: { value: number }) => valueFormatter(p.value)
                    : undefined,
                  fontSize: 11,
                  fontFamily,
                }
              : undefined,
            cursor: onDataPointClick ? "pointer" : "default",
          }))
        : [
            {
              type: "bar" as const,
              data: data.map((d, i) => ({
                value: d.value,
                itemStyle: {
                  color: d.color ?? palette[i % palette.length],
                  borderRadius: isHorizontal
                    ? [0, 4, 4, 0]
                    : [4, 4, 0, 0],
                },
              })),
              barMaxWidth: 40,
              label: showValues
                ? {
                    show: true,
                    position: "top" as const,
                    formatter: valueFormatter
                      ? (p: { value: number }) => valueFormatter(p.value)
                      : undefined,
                    fontSize: 11,
                    fontFamily,
                  }
                : undefined,
              cursor: onDataPointClick ? "pointer" : "default",
            },
          ];

      // X/Y axes
      const categoryAxis = {
        type: "category" as const,
        data: categories,
        axisLine: { lineStyle: { color: borderDefault } },
        axisTick: { lineStyle: { color: borderDefault } },
        axisLabel: { color: textSecondary, fontFamily, fontSize: 11 },
      };

      const valueAxis = {
        type: "value" as const,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: textSecondary,
          fontFamily,
          fontSize: 11,
          formatter: valueFormatter
            ? (v: number) => valueFormatter(v)
            : undefined,
        },
        splitLine: {
          show: showGrid,
          lineStyle: { color: bgMuted, type: "dashed" as const },
        },
      };

      const opt: ECOption = {
        animation: shouldAnimate,
        animationDuration: shouldAnimate ? 500 : 0,
        animationEasing: "cubicOut",
        title: title
          ? {
              text: escapeHtml(title),
              subtext: description ? escapeHtml(description) : undefined,
              left: "center",
              textStyle: { fontFamily, color: textPrimary, fontSize: 16, fontWeight: 600 },
              subtextStyle: { fontFamily, color: textSecondary, fontSize: 13 },
            }
          : undefined,
        tooltip: {
          trigger: "axis",
          confine: true,
          axisPointer: { type: "shadow" },
          textStyle: { fontFamily, fontSize: 13 },
        },
        legend: {
          show: showLegend || !!hasMultiSeries,
          bottom: 0,
          textStyle: { fontFamily, color: textPrimary, fontSize: 12 },
          icon: "roundRect",
          itemWidth: 12,
          itemHeight: 12,
        },
        grid: {
          top: title ? 60 : 24,
          right: 16,
          bottom: showLegend || hasMultiSeries ? 48 : 24,
          left: 16,
          containLabel: true,
        },
        xAxis: isHorizontal ? valueAxis : categoryAxis,
        yAxis: isHorizontal ? categoryAxis : valueAxis,
        series: seriesList,
        aria: {
          enabled: true,
          label: {
            description: description
              ? escapeHtml(description)
              : title
                ? `Bar chart: ${escapeHtml(title)}`
                : "Bar chart",
          },
        },
      };

      return opt;
    }, [
      data,
      orientation,
      showValues,
      showGrid,
      showLegend,
      valueFormatter,
      animate,
      colors,
      title,
      description,
      seriesDef,
      onDataPointClick,
    ]);

    // Init / dispose ECharts instance
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const instance = echarts.init(container, undefined, {
        renderer: "canvas",
        useDirtyRect: true,
      });
      chartRef.current = instance;

      // ResizeObserver
      const observer = new ResizeObserver(() => {
        instance.resize({ animation: { duration: 200 } });
      });
      observer.observe(container);

      return () => {
        observer.disconnect();
        instance.dispose();
        chartRef.current = null;
      };
    }, []);

    // Update option
    useEffect(() => {
      const instance = chartRef.current;
      if (!instance || !option) return;
      instance.setOption(option, { notMerge: true });
    }, [option]);

    // Click handler
    useEffect(() => {
      const instance = chartRef.current;
      if (!instance || !onDataPointClick) return;

      const handler = (params: Record<string, unknown>) => {
        onDataPointClick({
          datum: (params.data as Record<string, unknown>) ?? {},
          seriesId: params.seriesName as string,
          xKey: "label",
          yKey: "value",
          value: params.value as number,
          label: params.name as string,
        });
      };

      instance.on("click", handler);
      return () => {
        instance.off("click", handler);
      };
    }, [onDataPointClick]);

    // Attach forwardedRef
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef)
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
      },
      [forwardedRef],
    );

    /* ---- empty state ---- */
    if (!data || data.length === 0) {
      return (
        <div
          ref={setRefs}
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
        ref={setRefs}
        className={cn(
          "w-full",
          accessState.isDisabled && "opacity-50",
          className,
        )}
        style={{ height, width: "100%" }}
        title={accessReason}
        data-testid="bar-chart"
        data-access-state={accessState.state}
        role="img"
        aria-label={
          description
            ? escapeHtml(description)
            : title
              ? `Bar chart: ${escapeHtml(title)}`
              : "Bar chart"
        }
        {...rest}
      />
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
