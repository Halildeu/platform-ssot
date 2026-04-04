/**
 * FunnelChart — ECharts-powered funnel visualization (new in P3)
 */
import React, { useMemo, useCallback } from "react";
import { cn } from "@mfe/design-system";
import { useEChartsRenderer } from "./renderers";
import type { EChartsOption } from "./renderers/echarts-imports";

export type ChartSize = "sm" | "md" | "lg";
export interface FunnelStage { label: string; value: number; color?: string }
export interface FunnelChartProps { data: FunnelStage[]; size?: ChartSize; title?: string; description?: string; showLabels?: boolean; animate?: boolean; className?: string; noDataText?: string }

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const FunnelChart = React.forwardRef<HTMLDivElement, FunnelChartProps>(
  function FunnelChart({ data, size = "md", title, description, showLabels = true, animate = true, className, noDataText = "Veri yok", ...rest }, ref) {
    const h = SIZE_HEIGHT[size];
    const empty = !data?.length;
    const option = useMemo((): EChartsOption | null => {
      if (empty) return null;
      return { animation: animate, title: title ? { text: esc(title), left: "center", textStyle: { fontSize: 16, fontWeight: 600 } } : undefined,
        tooltip: { trigger: "item" }, series: [{ type: "funnel", left: "10%", top: title ? 50 : 16, bottom: 16, width: "80%", sort: "descending", gap: 2, label: { show: showLabels, position: "inside", fontSize: 12 },
        data: data.map((d) => ({ name: d.label, value: d.value, itemStyle: d.color ? { color: d.color } : undefined })) }],
        aria: { enabled: true, label: { description: description ? esc(description) : "Funnel chart" } } } as EChartsOption;
    }, [data, animate, title, description, showLabels, empty]);
    const { containerRef } = useEChartsRenderer({ option: option ?? ({} as EChartsOption), respectReducedMotion: true });
    const setRefs = useCallback((n: HTMLDivElement | null) => { (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = n; if (typeof ref === "function") ref(n); else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n; }, [ref, containerRef]);
    if (empty) return <div ref={ref} className={cn("inline-flex items-center justify-center text-sm text-[var(--text-secondary)]", className)} style={{ height: h }} role="img" aria-label="Funnel — no data" data-testid="funnel-chart-empty" {...rest}>{noDataText}</div>;
    return <div ref={setRefs} className={cn("w-full", className)} style={{ height: h, width: "100%" }} role="img" aria-label={title ? `Funnel: ${esc(title)}` : "Funnel chart"} data-testid="funnel-chart" {...rest} />;
  },
);
FunnelChart.displayName = "FunnelChart";
export default FunnelChart;
