/**
 * LineChart — ECharts-powered line chart with Design Lab integration
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
import type { ChartSize, ChartSeries, ChartLocaleText, ChartClickEvent } from "./types";

let _registered = false;
function ensureRegistered() {
  if (_registered) return;
  echarts.use([CanvasRenderer, EChartsLine, TitleComponent, TooltipComponent, LegendComponent, GridComponent, AriaComponent]);
  _registered = true;
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface LineChartProps extends AccessControlledProps {
  series: ChartSeries[];
  labels: string[];
  size?: ChartSize;
  showDots?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  showArea?: boolean;
  curved?: boolean;
  valueFormatter?: (value: number) => string;
  animate?: boolean;
  title?: string;
  description?: string;
  localeText?: ChartLocaleText;
  className?: string;
  onDataPointClick?: (event: ChartClickEvent) => void;
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
  getCSSVar("--action-primary", "#3b82f6"),
  getCSSVar("--state-success-text", "#22c55e"),
  getCSSVar("--state-warning-text", "#f59e0b"),
  getCSSVar("--state-error-text", "#ef4444"),
  getCSSVar("--state-info-text", "#06b6d4"),
  getCSSVar("--action-secondary", "#8b5cf6"),
  "#ec4899", "#14b8a6", "#f97316", "#6366f1",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  function LineChart(
    {
      series: seriesData, labels, size = "md", showDots = true, showGrid = true,
      showLegend = false, showArea = false, curved = false, valueFormatter,
      animate = true, title, description, localeText, className,
      onDataPointClick, access = "full", accessReason, ...rest
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
        symbolSize: 6,
        lineStyle: { width: 2, color: s.color ?? palette[i % palette.length] },
        itemStyle: { color: s.color ?? palette[i % palette.length] },
        areaStyle: showArea ? { opacity: 0.18 } : undefined,
        cursor: onDataPointClick ? "pointer" : "default",
      }));

      return {
        animation: shouldAnimate,
        animationDuration: shouldAnimate ? 500 : 0,
        animationEasing: "cubicOut",
        title: title ? {
          text: escapeHtml(title),
          subtext: description ? escapeHtml(description) : undefined,
          left: "center",
          textStyle: { fontFamily, color: textPrimary, fontSize: 16, fontWeight: 600 },
          subtextStyle: { fontFamily, color: textSecondary, fontSize: 13 },
        } : undefined,
        tooltip: { trigger: "axis" as const, confine: true, textStyle: { fontFamily, fontSize: 13 } },
        legend: {
          show: showLegend || seriesData.length > 1,
          bottom: 0,
          textStyle: { fontFamily, color: textPrimary, fontSize: 12 },
          icon: "roundRect", itemWidth: 12, itemHeight: 12,
        },
        grid: { top: title ? 60 : 24, right: 16, bottom: showLegend || seriesData.length > 1 ? 48 : 24, left: 16, containLabel: true },
        xAxis: {
          type: "category" as const,
          data: labels,
          axisLine: { lineStyle: { color: borderDefault } },
          axisTick: { lineStyle: { color: borderDefault } },
          axisLabel: { color: textSecondary, fontFamily, fontSize: 11 },
        },
        yAxis: {
          type: "value" as const,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: textSecondary, fontFamily, fontSize: 11, formatter: valueFormatter ? (v: number) => valueFormatter(v) : undefined },
          splitLine: { show: showGrid, lineStyle: { color: bgMuted, type: "dashed" as const } },
        },
        series: seriesList,
        aria: { enabled: true, label: { description: description ? escapeHtml(description) : title ? `Line chart: ${escapeHtml(title)}` : "Line chart" } },
      };
    }, [seriesData, labels, showDots, showGrid, showLegend, showArea, curved, valueFormatter, animate, title, description, isEmpty, onDataPointClick]);

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

    useEffect(() => {
      const inst = chartRef.current;
      if (!inst || !onDataPointClick) return;
      const handler = (p: Record<string, unknown>) => {
        onDataPointClick({ datum: (p.data as Record<string, unknown>) ?? {}, seriesId: p.seriesName as string, xKey: "label", yKey: "value", value: p.value as number, label: p.name as string });
      };
      inst.on("click", handler);
      return () => { inst.off("click", handler); };
    }, [onDataPointClick]);

    const setRefs = useCallback((node: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }, [forwardedRef]);

    if (isEmpty) {
      return (
        <div ref={setRefs} data-access-state={accessState.state}
          className={cn("inline-flex items-center justify-center text-sm text-text-secondary", accessState.isDisabled && "opacity-50", className)}
          style={{ height }} title={accessReason} data-testid="line-chart-empty" {...rest}>
          {noDataText}
        </div>
      );
    }

    return (
      <div ref={setRefs}
        className={cn("w-full", accessState.isDisabled && "opacity-50", className)}
        style={{ height, width: "100%" }} title={accessReason} data-testid="line-chart"
        data-access-state={accessState.state} role="img"
        aria-label={description ? escapeHtml(description) : title ? `Line chart: ${escapeHtml(title)}` : "Line chart"}
        {...rest} />
    );
  },
);

LineChart.displayName = "LineChart";
export default LineChart;
export type LineChartRef = React.Ref<HTMLElement>;
export type LineChartElement = HTMLElement;
export type LineChartCSSProperties = React.CSSProperties;
