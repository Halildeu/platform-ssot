/**
 * PieChart — ECharts-powered pie/donut chart with Design Lab integration
 *
 * @migration AG Charts → ECharts (P1, chart-viz-engine-selection D-001)
 */
import React, { useMemo, useRef, useEffect, useCallback } from "react";
import * as echarts from "echarts/core";
import { PieChart as EChartsPie } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import {
  TitleComponent, TooltipComponent, LegendComponent, AriaComponent,
} from "echarts/components";
import type { ECharts as EChartsInstance } from "echarts/core";
import { cn } from "../../utils/cn";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";
import type { ChartSize, ChartDataPoint, ChartLocaleText, ChartClickEvent } from "./types";

let _registered = false;
function ensureRegistered() {
  if (_registered) return;
  echarts.use([CanvasRenderer, EChartsPie, TitleComponent, TooltipComponent, LegendComponent, AriaComponent]);
  _registered = true;
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PieChartProps extends AccessControlledProps {
  data: ChartDataPoint[];
  size?: ChartSize;
  donut?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  showPercentage?: boolean;
  valueFormatter?: (value: number) => string;
  innerLabel?: React.ReactNode;
  animate?: boolean;
  title?: string;
  description?: string;
  localeText?: ChartLocaleText;
  className?: string;
  onDataPointClick?: (event: ChartClickEvent) => void;
}

const SIZE_DIM: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };

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

export const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  function PieChart(
    {
      data, size = "md", donut = false, showLabels = false, showLegend = false,
      showPercentage = false, valueFormatter, innerLabel, animate = true,
      title, description, localeText, className, onDataPointClick,
      access = "full", accessReason, ...rest
    },
    forwardedRef,
  ) {
    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    const noDataText = localeText?.noData ?? "Veri yok";
    const dim = SIZE_DIM[size];

    const validData = useMemo(() => (data ?? []).filter((d) => d.value > 0), [data]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<EChartsInstance | null>(null);

    ensureRegistered();

    const option = useMemo(() => {
      if (validData.length === 0) return null;

      const palette = getDefaultPalette();
      const fontFamily = getCSSVar("--font-family-sans", "Inter, system-ui, sans-serif");
      const textPrimary = getCSSVar("--text-primary", "#1a1a2e");
      const textSecondary = getCSSVar("--text-secondary", "#6b7280");
      const bgSurface = getCSSVar("--bg-surface", "#ffffff");
      const shouldAnimate = animate && !prefersReducedMotion();

      const pieData = validData.map((d, i) => ({
        name: escapeHtml(d.label),
        value: d.value,
        itemStyle: { color: d.color ?? palette[i % palette.length] },
      }));

      const total = validData.reduce((sum, d) => sum + d.value, 0);

      return {
        animation: shouldAnimate, animationDuration: shouldAnimate ? 500 : 0, animationEasing: "cubicOut",
        title: title ? {
          text: escapeHtml(title), subtext: description ? escapeHtml(description) : undefined,
          left: "center",
          textStyle: { fontFamily, color: textPrimary, fontSize: 16, fontWeight: 600 },
          subtextStyle: { fontFamily, color: textSecondary, fontSize: 13 },
        } : undefined,
        tooltip: {
          trigger: "item" as const, confine: true,
          textStyle: { fontFamily, fontSize: 13 },
          formatter: valueFormatter
            ? (p: { name: string; value: number; percent: number }) => `${p.name}: ${valueFormatter(p.value)} (${p.percent}%)`
            : undefined,
        },
        legend: {
          show: showLegend, bottom: 0,
          textStyle: { fontFamily, color: textPrimary, fontSize: 12 }, icon: "roundRect", itemWidth: 12, itemHeight: 12,
        },
        series: [{
          type: "pie" as const,
          radius: donut ? ["40%", "70%"] : ["0%", "70%"],
          center: ["50%", title ? "55%" : "50%"],
          data: pieData,
          itemStyle: { borderColor: bgSurface, borderWidth: 2, borderRadius: 4 },
          label: {
            show: showLabels || showPercentage,
            fontFamily, fontSize: 12, color: textPrimary,
            formatter: showPercentage
              ? (p: { name: string; percent: number }) => `${p.name} ${Math.round(p.percent)}%`
              : undefined,
          },
          labelLine: { show: showLabels || showPercentage },
          cursor: onDataPointClick ? "pointer" : "default",
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0,0,0,0.15)" } },
        }],
        aria: { enabled: true, label: { description: description ? escapeHtml(description) : title ? `Pie chart: ${escapeHtml(title)}` : "Pie chart" } },
      };
    }, [validData, donut, showLabels, showLegend, showPercentage, valueFormatter, animate, title, description, onDataPointClick]);

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
        onDataPointClick({ datum: (p.data as Record<string, unknown>) ?? {}, seriesId: p.seriesName as string, yKey: "value", value: p.value as number, label: p.name as string });
      };
      inst.on("click", handler);
      return () => { inst.off("click", handler); };
    }, [onDataPointClick]);

    const setRefs = useCallback((node: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }, [forwardedRef]);

    if (validData.length === 0) {
      return (
        <div ref={setRefs} data-access-state={accessState.state}
          className={cn("inline-flex items-center justify-center text-sm text-text-secondary", accessState.isDisabled && "opacity-50", className)}
          style={{ width: dim, height: dim }} title={accessReason} data-testid="pie-chart-empty" {...rest}>
          {noDataText}
        </div>
      );
    }

    return (
      <div ref={setRefs}
        className={cn("relative w-full", accessState.isDisabled && "opacity-50", className)}
        title={accessReason} data-testid="pie-chart" data-access-state={accessState.state}
        role="img" aria-label={description ? escapeHtml(description) : title ? `Pie chart: ${escapeHtml(title)}` : "Pie chart"}
        {...rest}
      >
        <div style={{ height: dim, width: "100%" }} ref={(el) => {
          if (el && !containerRef.current) {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }
        }} />
        {donut && innerLabel ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" data-testid="pie-chart-inner-label">
            {innerLabel}
          </div>
        ) : null}
      </div>
    );
  },
);

PieChart.displayName = "PieChart";
export default PieChart;
export type PieChartRef = React.Ref<HTMLElement>;
export type PieChartElement = HTMLElement;
export type PieChartCSSProperties = React.CSSProperties;
