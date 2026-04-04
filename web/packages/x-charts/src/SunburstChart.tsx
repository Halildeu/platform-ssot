/**
 * SunburstChart — ECharts-powered hierarchical sunburst (new in P3)
 */
import React, { useMemo, useCallback } from "react";
import { cn } from "@mfe/design-system";
import { useEChartsRenderer } from "./renderers";
import type { EChartsOption } from "./renderers/echarts-imports";

export type ChartSize = "sm" | "md" | "lg";
export interface SunburstNode { name: string; value?: number; children?: SunburstNode[]; itemStyle?: { color?: string } }
export interface SunburstChartProps { data: SunburstNode[]; size?: ChartSize; title?: string; description?: string; animate?: boolean; className?: string; noDataText?: string }

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const SunburstChart = React.forwardRef<HTMLDivElement, SunburstChartProps>(
  function SunburstChart({ data, size = "md", title, description, animate = true, className, noDataText = "Veri yok", ...rest }, ref) {
    const h = SIZE_HEIGHT[size];
    const empty = !data?.length;
    const option = useMemo((): EChartsOption | null => {
      if (empty) return null;
      return { animation: animate, title: title ? { text: esc(title), left: "center", textStyle: { fontSize: 16, fontWeight: 600 } } : undefined,
        tooltip: { trigger: "item" }, series: [{ type: "sunburst", data, radius: ["15%", "90%"], label: { rotate: "radial", fontSize: 10 }, emphasis: { focus: "ancestor" },
        levels: [{}, { r0: "15%", r: "45%", label: { rotate: "tangential" } }, { r0: "45%", r: "70%", label: { align: "right" } }, { r0: "70%", r: "90%", label: { position: "outside", padding: 3 }, itemStyle: { borderWidth: 1 } }] }],
        aria: { enabled: true, label: { description: description ? esc(description) : "Sunburst chart" } } } as EChartsOption;
    }, [data, animate, title, description, empty]);
    const { containerRef } = useEChartsRenderer({ option: option ?? ({} as EChartsOption), respectReducedMotion: true });
    const setRefs = useCallback((n: HTMLDivElement | null) => { (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = n; if (typeof ref === "function") ref(n); else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n; }, [ref, containerRef]);
    if (empty) return <div ref={ref} className={cn("inline-flex items-center justify-center text-sm text-[var(--text-secondary)]", className)} style={{ height: h }} role="img" aria-label="Sunburst — no data" data-testid="sunburst-chart-empty" {...rest}>{noDataText}</div>;
    return <div ref={setRefs} className={cn("w-full", className)} style={{ height: h, width: "100%" }} role="img" aria-label={title ? `Sunburst: ${esc(title)}` : "Sunburst chart"} data-testid="sunburst-chart" {...rest} />;
  },
);
SunburstChart.displayName = "SunburstChart";
export default SunburstChart;
