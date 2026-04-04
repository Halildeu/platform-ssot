/**
 * AreaChart — ECharts-powered area chart with Design Lab integration
 *
 * @migration AG Charts → ECharts (P1, chart-viz-engine-selection D-001)
 */
import React, { useMemo, useRef, useEffect, useCallback } from "react";
import * as echarts from "echarts/core";
import { LineChart as EChartsLine } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import {
  TitleComponent, TooltipComponent, LegendComponent,
  GridComponent, AriaComponent,
} from "echarts/components";
import type { ECharts as EChartsInstance } from "echarts/core";
import { cn } from "../../utils/cn";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";
import type { ChartSize, ChartSeries, ChartLocaleText } from "./types";

let _registered = false;
function ensureRegistered() {
  if (_registered) return;
  echarts.use([CanvasRenderer, EChartsLine, TitleComponent, TooltipComponent, LegendComponent, GridComponent, AriaComponent]);
  _registered = true;
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AreaChartProps extends AccessControlledProps {
  series: ChartSeries[];
  labels: string[];
  size?: ChartSize;
  stacked?: boolean;
  showDots?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  gradient?: boolean;
  curved?: boolean;
  valueFormatter?: (value: number) => string;
  animate?: boolean;
  title?: string;
  description?: string;
  localeText?: ChartLocaleText;
  className?: string;
}

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };

const getCSSVar = (v: string, fb: string): string => {
  if (typeof document === "undefined") return fb;
  return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || fb;
};

const escapeHtml = (t: string): string =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getDefaultPalette = (): string[] => [
  getCSSVar("--action-primary", "#3b82f6"), getCSSVar("--state-success-text", "#22c55e"),
  getCSSVar("--state-warning-text", "#f59e0b"), getCSSVar("--state-error-text", "#ef4444"),
  getCSSVar("--state-info-text", "#06b6d4"), getCSSVar("--action-secondary", "#8b5cf6"),
  "#ec4899", "#14b8a6", "#f97316", "#6366f1",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  function AreaChart(
    {
      series: seriesData, labels, size = "md", stacked = false, showDots = true,
      showGrid = true, showLegend = false, gradient = true, curved = false,
      valueFormatter, animate = true, title, description, localeText, className,
      access = "full", accessReason, ...rest
    },
    forwardedRef,
  ) {
    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    const noDataText = localeText?.noData ?? "Veri yok";
    const height = SIZE_HEIGHT[size];
    const isEmpty = !seriesData || seriesData.length === 0 || !labels || labels.length === 0;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<EChartsInstance | null>(null);

    ensureRegistered();

    const option = useMemo(() => {
      if (isEmpty) return null;

      const palette = getDefaultPalette();
      const fontFamily = getCSSVar("--font-family-sans", "Inter, system-ui, sans-serif");
      const textPrimary = getCSSVar("--text-primary", "#1a1a2e");
      const textSecondary = getCSSVar("--text-secondary", "#6b7280");
      const borderDefault = getCSSVar("--border-default", "#e5e7eb");
      const bgMuted = getCSSVar("--bg-muted", "#f9fafb");
      const shouldAnimate = animate && !prefersReducedMotion();

      const seriesList = seriesData.map((s, i) => ({
        type: "line" as const,
        name: s.name,
        data: s.data,
        smooth: curved,
        symbol: showDots ? "circle" : "none",
        symbolSize: 5,
        stack: stacked ? "total" : undefined,
        lineStyle: { width: 2, color: s.color ?? palette[i % palette.length] },
        itemStyle: { color: s.color ?? palette[i % palette.length] },
        areaStyle: { opacity: gradient ? 0.3 : 0.6 },
      }));

      return {
        animation: shouldAnimate, animationDuration: shouldAnimate ? 500 : 0, animationEasing: "cubicOut",
        title: title ? {
          text: escapeHtml(title), subtext: description ? escapeHtml(description) : undefined,
          left: "center",
          textStyle: { fontFamily, color: textPrimary, fontSize: 16, fontWeight: 600 },
          subtextStyle: { fontFamily, color: textSecondary, fontSize: 13 },
        } : undefined,
        tooltip: { trigger: "axis" as const, confine: true, textStyle: { fontFamily, fontSize: 13 } },
        legend: {
          show: showLegend || seriesData.length > 1, bottom: 0,
          textStyle: { fontFamily, color: textPrimary, fontSize: 12 }, icon: "roundRect", itemWidth: 12, itemHeight: 12,
        },
        grid: { top: title ? 60 : 24, right: 16, bottom: showLegend || seriesData.length > 1 ? 48 : 24, left: 16, containLabel: true },
        xAxis: {
          type: "category" as const, data: labels,
          axisLine: { lineStyle: { color: borderDefault } }, axisTick: { lineStyle: { color: borderDefault } },
          axisLabel: { color: textSecondary, fontFamily, fontSize: 11 },
        },
        yAxis: {
          type: "value" as const, axisLine: { show: false }, axisTick: { show: false },
          axisLabel: { color: textSecondary, fontFamily, fontSize: 11, formatter: valueFormatter ? (v: number) => valueFormatter(v) : undefined },
          splitLine: { show: showGrid, lineStyle: { color: bgMuted, type: "dashed" as const } },
        },
        series: seriesList,
        aria: { enabled: true, label: { description: description ? escapeHtml(description) : title ? `Area chart: ${escapeHtml(title)}` : "Area chart" } },
      };
    }, [seriesData, labels, stacked, showDots, showGrid, showLegend, gradient, curved, valueFormatter, animate, title, description, isEmpty]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const instance = echarts.init(container, undefined, { renderer: "canvas", useDirtyRect: true });
      chartRef.current = instance;
      const observer = new ResizeObserver(() => instance.resize({ animation: { duration: 200 } }));
      observer.observe(container);
      return () => { observer.disconnect(); instance.dispose(); chartRef.current = null; };
    }, []);

    useEffect(() => {
      if (chartRef.current && option) chartRef.current.setOption(option, { notMerge: true });
    }, [option]);

    const setRefs = useCallback((node: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }, [forwardedRef]);

    if (isEmpty) {
      return (
        <div ref={setRefs} data-access-state={accessState.state}
          className={cn("inline-flex items-center justify-center text-sm text-text-secondary", accessState.isDisabled && "opacity-50", className)}
          style={{ height }} title={accessReason} data-testid="area-chart-empty" {...rest}>
          {noDataText}
        </div>
      );
    }

    return (
      <div ref={setRefs}
        className={cn("w-full", accessState.isDisabled && "opacity-50", className)}
        style={{ height, width: "100%" }} title={accessReason} data-testid="area-chart"
        data-access-state={accessState.state} role="img"
        aria-label={description ? escapeHtml(description) : title ? `Area chart: ${escapeHtml(title)}` : "Area chart"}
        {...rest} />
    );
  },
);

AreaChart.displayName = "AreaChart";
export default AreaChart;
export type AreaChartRef = React.Ref<HTMLElement>;
export type AreaChartElement = HTMLElement;
export type AreaChartCSSProperties = React.CSSProperties;
