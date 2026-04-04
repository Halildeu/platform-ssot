/**
 * HeatmapChart — ECharts-powered heatmap grid
 * @migration AG Charts → ECharts (P3)
 */
import React, { useMemo, useCallback } from "react";
import { cn } from "@mfe/design-system";
import { useEChartsRenderer } from "./renderers";
import type { EChartsOption } from "./renderers/echarts-imports";

export type ChartSize = "sm" | "md" | "lg";
export type HeatmapDataPoint = { x: string; y: string; value: number };
export interface HeatmapChartProps { data: HeatmapDataPoint[]; xLabels?: string[]; yLabels?: string[]; size?: ChartSize; title?: string; description?: string; valueFormatter?: (v: number) => string; animate?: boolean; className?: string; noDataText?: string; minColor?: string; maxColor?: string }

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const HeatmapChart = React.forwardRef<HTMLDivElement, HeatmapChartProps>(
  function HeatmapChart({ data, xLabels, yLabels, size = "md", title, description, valueFormatter, animate = true, className, noDataText = "Veri yok", minColor, maxColor, ...rest }, ref) {
    const h = SIZE_HEIGHT[size];
    const empty = !data?.length;
    const option = useMemo((): EChartsOption | null => {
      if (empty) return null;
      const xl = xLabels ?? [...new Set(data.map((d) => d.x))];
      const yl = yLabels ?? [...new Set(data.map((d) => d.y))];
      const vals = data.map((d) => d.value);
      const ecData = data.map((d) => [xl.indexOf(d.x), yl.indexOf(d.y), d.value]);
      return { animation: animate, title: title ? { text: esc(title), left: "center", textStyle: { fontSize: 16, fontWeight: 600 } } : undefined,
        tooltip: { trigger: "item" }, grid: { top: title ? 50 : 16, right: 60, bottom: 40, left: 60, containLabel: true },
        xAxis: { type: "category", data: xl, splitArea: { show: true } }, yAxis: { type: "category", data: yl, splitArea: { show: true } },
        visualMap: { min: Math.min(...vals), max: Math.max(...vals), calculable: true, orient: "vertical", right: 0, top: "center", inRange: { color: [minColor ?? "#f0f9ff", maxColor ?? "#3b82f6"] } },
        series: [{ type: "heatmap", data: ecData, label: { show: true, fontSize: 10 } }],
        aria: { enabled: true, label: { description: description ? esc(description) : "Heatmap chart" } } } as EChartsOption;
    }, [data, xLabels, yLabels, animate, title, description, valueFormatter, minColor, maxColor, empty]);
    const { containerRef } = useEChartsRenderer({ option: option ?? ({} as EChartsOption), respectReducedMotion: true });
    const setRefs = useCallback((n: HTMLDivElement | null) => { (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = n; if (typeof ref === "function") ref(n); else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n; }, [ref, containerRef]);
    if (empty) return <div ref={ref} className={cn("inline-flex items-center justify-center text-sm text-[var(--text-secondary)]", className)} style={{ height: h }} role="img" aria-label="Heatmap — no data" data-testid="heatmap-chart-empty" {...rest}>{noDataText}</div>;
    return <div ref={setRefs} className={cn("w-full", className)} style={{ height: h, width: "100%" }} role="img" aria-label={title ? `Heatmap: ${esc(title)}` : "Heatmap chart"} data-testid="heatmap-chart" {...rest} />;
  },
);
HeatmapChart.displayName = "HeatmapChart";
export default HeatmapChart;
