/**
 * TreemapChart — ECharts-powered hierarchical treemap
 * @migration AG Charts → ECharts (P3)
 */
import React, { useMemo, useCallback } from "react";
import { cn } from "@mfe/design-system";
import { useEChartsRenderer } from "./renderers";
import type { EChartsOption } from "./renderers/echarts-imports";

export type ChartSize = "sm" | "md" | "lg";
export type TreemapNode = { label: string; value?: number; children?: TreemapNode[]; color?: string };
export interface TreemapChartProps { data: TreemapNode[]; size?: ChartSize; colors?: string[]; valueFormatter?: (v: number) => string; animate?: boolean; title?: string; description?: string; className?: string; noDataText?: string }

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function toTree(nodes: TreemapNode[]): Record<string, unknown>[] { return nodes.map((n) => ({ name: n.label, value: n.value, children: n.children ? toTree(n.children) : undefined, itemStyle: n.color ? { color: n.color } : undefined })); }

export const TreemapChart = React.forwardRef<HTMLDivElement, TreemapChartProps>(
  function TreemapChart({ data, size = "md", valueFormatter, animate = true, title, description, className, noDataText = "Veri yok", ...rest }, ref) {
    const h = SIZE_HEIGHT[size];
    const empty = !data?.length;
    const option = useMemo((): EChartsOption | null => {
      if (empty) return null;
      return { animation: animate, title: title ? { text: esc(title), left: "center", textStyle: { fontSize: 16, fontWeight: 600 } } : undefined,
        tooltip: { trigger: "item" }, series: [{ type: "treemap", data: toTree(data), leafDepth: 1, label: { show: true, formatter: "{b}" }, breadcrumb: { show: true } }],
        aria: { enabled: true, label: { description: description ? esc(description) : "Treemap chart" } } } as EChartsOption;
    }, [data, animate, title, description, empty]);
    const { containerRef } = useEChartsRenderer({ option: option ?? ({} as EChartsOption), respectReducedMotion: true });
    const setRefs = useCallback((n: HTMLDivElement | null) => { (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = n; if (typeof ref === "function") ref(n); else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n; }, [ref, containerRef]);
    if (empty) return <div ref={ref} className={cn("inline-flex items-center justify-center text-sm text-[var(--text-secondary)]", className)} style={{ height: h }} role="img" aria-label="Treemap — no data" data-testid="treemap-chart-empty" {...rest}>{noDataText}</div>;
    return <div ref={setRefs} className={cn("w-full", className)} style={{ height: h, width: "100%" }} role="img" aria-label={title ? `Treemap: ${esc(title)}` : "Treemap chart"} data-testid="treemap-chart" {...rest} />;
  },
);
TreemapChart.displayName = "TreemapChart";
export default TreemapChart;
