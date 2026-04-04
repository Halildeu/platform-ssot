/**
 * WaterfallChart — ECharts-powered waterfall (stacked bar)
 * @migration AG Charts → ECharts (P3)
 */
import React, { useMemo, useCallback } from "react";
import { cn } from "@mfe/design-system";
import { useEChartsRenderer } from "./renderers";
import type { EChartsOption } from "./renderers/echarts-imports";

export type ChartSize = "sm" | "md" | "lg";
export type WaterfallDataPoint = { label: string; value: number; type?: "increase" | "decrease" | "total" };
export interface WaterfallChartProps { data: WaterfallDataPoint[]; size?: ChartSize; title?: string; description?: string; valueFormatter?: (v: number) => string; animate?: boolean; className?: string; noDataText?: string; increaseColor?: string; decreaseColor?: string; totalColor?: string }

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const WaterfallChart = React.forwardRef<HTMLDivElement, WaterfallChartProps>(
  function WaterfallChart({ data, size = "md", title, description, valueFormatter, animate = true, className, noDataText = "Veri yok", increaseColor = "#22c55e", decreaseColor = "#ef4444", totalColor = "#3b82f6", ...rest }, ref) {
    const h = SIZE_HEIGHT[size];
    const empty = !data?.length;
    const option = useMemo((): EChartsOption | null => {
      if (empty) return null;
      const cats: string[] = []; const base: number[] = []; const vals: Record<string, unknown>[] = [];
      let run = 0;
      for (const d of data) { cats.push(d.label); if (d.type === "total") { base.push(0); vals.push({ value: run, itemStyle: { color: totalColor } }); } else { const inc = d.value >= 0; base.push(inc ? run : run + d.value); vals.push({ value: Math.abs(d.value), itemStyle: { color: inc ? increaseColor : decreaseColor } }); run += d.value; } }
      return { animation: animate, title: title ? { text: esc(title), left: "center", textStyle: { fontSize: 16, fontWeight: 600 } } : undefined,
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } }, grid: { top: title ? 50 : 24, right: 16, bottom: 24, left: 16, containLabel: true },
        xAxis: { type: "category", data: cats }, yAxis: { type: "value" },
        series: [{ type: "bar", stack: "w", data: base, itemStyle: { color: "transparent" }, emphasis: { itemStyle: { color: "transparent" } } }, { type: "bar", stack: "w", data: vals, label: { show: true, position: "top", fontSize: 11 } }],
        aria: { enabled: true, label: { description: description ? esc(description) : "Waterfall chart" } } } as EChartsOption;
    }, [data, animate, title, description, increaseColor, decreaseColor, totalColor, empty]);
    const { containerRef } = useEChartsRenderer({ option: option ?? ({} as EChartsOption), respectReducedMotion: true });
    const setRefs = useCallback((n: HTMLDivElement | null) => { (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = n; if (typeof ref === "function") ref(n); else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n; }, [ref, containerRef]);
    if (empty) return <div ref={ref} className={cn("inline-flex items-center justify-center text-sm text-[var(--text-secondary)]", className)} style={{ height: h }} role="img" aria-label="Waterfall — no data" data-testid="waterfall-chart-empty" {...rest}>{noDataText}</div>;
    return <div ref={setRefs} className={cn("w-full", className)} style={{ height: h, width: "100%" }} role="img" aria-label={title ? `Waterfall: ${esc(title)}` : "Waterfall chart"} data-testid="waterfall-chart" {...rest} />;
  },
);
WaterfallChart.displayName = "WaterfallChart";
export default WaterfallChart;
