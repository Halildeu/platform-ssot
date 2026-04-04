/**
 * RadarChart — ECharts-powered radar/polar chart
 * @migration SVG → ECharts (P3)
 */
import React, { useMemo, useCallback } from "react";
import { cn } from "@mfe/design-system";
import { useEChartsRenderer } from "./renderers";
import type { EChartsOption } from "./renderers/echarts-imports";

export type ChartSize = "sm" | "md" | "lg";
export interface RadarIndicator { name: string; max?: number }
export interface RadarSeries { name: string; values: number[]; color?: string }
export interface RadarChartProps {
  indicators: RadarIndicator[]; series: RadarSeries[]; size?: ChartSize;
  showLegend?: boolean; title?: string; description?: string; animate?: boolean;
  className?: string; noDataText?: string;
}

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const palette = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export const RadarChart = React.forwardRef<HTMLDivElement, RadarChartProps>(
  function RadarChart({ indicators, series, size = "md", showLegend = false, title, description, animate = true, className, noDataText = "Veri yok", ...rest }, ref) {
    const h = SIZE_HEIGHT[size];
    const empty = !indicators?.length || !series?.length;
    const option = useMemo((): EChartsOption | null => {
      if (empty) return null;
      return { animation: animate, animationDuration: animate ? 500 : 0,
        title: title ? { text: esc(title), left: "center", textStyle: { fontSize: 16, fontWeight: 600 } } : undefined,
        tooltip: { trigger: "item" }, legend: { show: showLegend || series.length > 1, bottom: 0, textStyle: { fontSize: 12 } },
        radar: { indicator: indicators.map((ind) => ({ name: ind.name, max: ind.max })) },
        series: [{ type: "radar", data: series.map((s, i) => ({ value: s.values, name: s.name, lineStyle: { color: s.color ?? palette[i % palette.length] }, areaStyle: { color: s.color ?? palette[i % palette.length], opacity: 0.15 }, itemStyle: { color: s.color ?? palette[i % palette.length] } })) }],
        aria: { enabled: true, label: { description: description ? esc(description) : title ? `Radar: ${esc(title)}` : "Radar chart" } } } as EChartsOption;
    }, [indicators, series, showLegend, title, description, animate, empty]);
    const { containerRef } = useEChartsRenderer({ option: option ?? ({} as EChartsOption), respectReducedMotion: true });
    const setRefs = useCallback((n: HTMLDivElement | null) => { (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = n; if (typeof ref === "function") ref(n); else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n; }, [ref, containerRef]);
    if (empty) return <div ref={ref} className={cn("inline-flex items-center justify-center text-sm text-[var(--text-secondary)]", className)} style={{ height: h }} role="img" aria-label={title ?? "Radar — no data"} data-testid="radar-chart-empty" {...rest}>{noDataText}</div>;
    return <div ref={setRefs} className={cn("w-full", className)} style={{ height: h, width: "100%" }} role="img" aria-label={title ? `Radar: ${esc(title)}` : "Radar chart"} data-testid="radar-chart" {...rest} />;
  },
);
RadarChart.displayName = "RadarChart";
export default RadarChart;
