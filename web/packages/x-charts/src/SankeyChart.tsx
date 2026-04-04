/**
 * SankeyChart — ECharts-powered Sankey flow diagram (new in P3)
 */
import React, { useMemo, useCallback } from "react";
import { cn } from "@mfe/design-system";
import { useEChartsRenderer } from "./renderers";
import type { EChartsOption } from "./renderers/echarts-imports";

export type ChartSize = "sm" | "md" | "lg";
export interface SankeyNode { name: string; itemStyle?: { color?: string } }
export interface SankeyLink { source: string; target: string; value: number }
export interface SankeyChartProps { nodes: SankeyNode[]; links: SankeyLink[]; size?: ChartSize; title?: string; description?: string; animate?: boolean; className?: string; noDataText?: string }

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const SankeyChart = React.forwardRef<HTMLDivElement, SankeyChartProps>(
  function SankeyChart({ nodes, links, size = "md", title, description, animate = true, className, noDataText = "Veri yok", ...rest }, ref) {
    const h = SIZE_HEIGHT[size];
    const empty = !nodes?.length || !links?.length;
    const option = useMemo((): EChartsOption | null => {
      if (empty) return null;
      return { animation: animate, title: title ? { text: esc(title), left: "center", textStyle: { fontSize: 16, fontWeight: 600 } } : undefined,
        tooltip: { trigger: "item" }, series: [{ type: "sankey", layout: "none", emphasis: { focus: "adjacency" }, data: nodes, links, label: { fontSize: 11 }, lineStyle: { color: "gradient", curveness: 0.5 } }],
        aria: { enabled: true, label: { description: description ? esc(description) : "Sankey diagram" } } } as EChartsOption;
    }, [nodes, links, animate, title, description, empty]);
    const { containerRef } = useEChartsRenderer({ option: option ?? ({} as EChartsOption), respectReducedMotion: true });
    const setRefs = useCallback((n: HTMLDivElement | null) => { (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = n; if (typeof ref === "function") ref(n); else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n; }, [ref, containerRef]);
    if (empty) return <div ref={ref} className={cn("inline-flex items-center justify-center text-sm text-[var(--text-secondary)]", className)} style={{ height: h }} role="img" aria-label="Sankey — no data" data-testid="sankey-chart-empty" {...rest}>{noDataText}</div>;
    return <div ref={setRefs} className={cn("w-full", className)} style={{ height: h, width: "100%" }} role="img" aria-label={title ? `Sankey: ${esc(title)}` : "Sankey diagram"} data-testid="sankey-chart" {...rest} />;
  },
);
SankeyChart.displayName = "SankeyChart";
export default SankeyChart;
