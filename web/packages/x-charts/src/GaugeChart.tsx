/**
 * GaugeChart — ECharts-powered gauge with threshold zones
 * @migration SVG → ECharts (P3)
 */
import React, { useMemo, useCallback } from "react";
import { cn } from "@mfe/design-system";
import { useEChartsRenderer } from "./renderers";
import type { EChartsOption } from "./renderers/echarts-imports";

export type ChartSize = "sm" | "md" | "lg";
export type GaugeThreshold = { value: number; color: string };
export interface GaugeChartProps {
  value: number; min?: number; max?: number; label?: string; size?: ChartSize;
  thresholds?: GaugeThreshold[]; title?: string; className?: string;
  valueFormatter?: (value: number) => string; noDataText?: string;
}

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 160, md: 240, lg: 320 };
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GaugeChart = React.forwardRef<HTMLDivElement, GaugeChartProps>(
  function GaugeChart({ value, min = 0, max = 100, label, size = "md", thresholds, title, className, valueFormatter, noDataText = "Veri yok", ...rest }, ref) {
    const h = SIZE_HEIGHT[size];
    const empty = value == null;
    const option = useMemo((): EChartsOption | null => {
      if (empty) return null;
      const zones = thresholds ?? [{ value: 60, color: "#22c55e" }, { value: 80, color: "#f59e0b" }, { value: 100, color: "#ef4444" }];
      const axisLine = zones.map((z, i) => [(z.value - min) / (max - min), z.color] as [number, string]);
      return { series: [{ type: "gauge", min, max, startAngle: 180, endAngle: 0, data: [{ value, name: label ?? "" }],
        axisLine: { lineStyle: { width: 20, color: axisLine } }, pointer: { length: "60%", width: 4 }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
        detail: { valueAnimation: true, formatter: valueFormatter ? (v: number) => esc(valueFormatter(v)) : "{value}", fontSize: h * 0.08, fontWeight: 600, offsetCenter: [0, "30%"] },
        title: label ? { show: true, offsetCenter: [0, "50%"], fontSize: 12 } : { show: false } }],
        aria: { enabled: true, label: { description: title ? `Gauge: ${esc(title)}` : "Gauge chart" } } } as EChartsOption;
    }, [value, min, max, label, thresholds, title, valueFormatter, h, empty]);
    const { containerRef } = useEChartsRenderer({ option: option ?? ({} as EChartsOption), respectReducedMotion: true });
    const setRefs = useCallback((n: HTMLDivElement | null) => { (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = n; if (typeof ref === "function") ref(n); else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n; }, [ref, containerRef]);
    if (empty) return <div ref={ref} className={cn("inline-flex items-center justify-center text-sm text-[var(--text-secondary)]", className)} style={{ height: h }} role="img" aria-label={title ?? "Gauge — no data"} data-testid="gauge-chart-empty" {...rest}>{noDataText}</div>;
    return <div ref={setRefs} className={cn("w-full", className)} style={{ height: h, width: "100%" }} role="img" aria-label={title ? `Gauge: ${esc(title)}` : "Gauge chart"} data-testid="gauge-chart" {...rest} />;
  },
);
GaugeChart.displayName = "GaugeChart";
export default GaugeChart;
