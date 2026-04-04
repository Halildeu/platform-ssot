import React, { useMemo } from "react";
import { cn } from "../../utils/cn";
import { resolveAccessState, type AccessControlledProps } from "../../internal/access-controller";
import { useInlineECharts, buildLightTheme } from "./useInlineECharts";
import type { ChartSize, ChartSeries, ChartLocaleText, ChartClickEvent } from "./types";

export interface LineChartProps extends AccessControlledProps {
  series: ChartSeries[]; labels: string[]; size?: ChartSize; showDots?: boolean;
  showGrid?: boolean; showLegend?: boolean; showArea?: boolean; curved?: boolean;
  valueFormatter?: (value: number) => string; animate?: boolean; title?: string;
  description?: string; localeText?: ChartLocaleText; className?: string;
  onDataPointClick?: (event: ChartClickEvent) => void;
}

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };
const PAL = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  function LineChart(props, ref) {
    const { series: sd, labels, size = "md", showDots = true, showGrid = true, showLegend = false,
      showArea = false, curved = false, valueFormatter, animate = true, title, description,
      localeText, className, onDataPointClick, access = "full", accessReason, ...rest } = props;
    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;
    const height = SIZE_HEIGHT[size];
    const empty = !sd || sd.length === 0 || !labels || labels.length === 0;
    const theme = useMemo(() => buildLightTheme(), []);

    const option = useMemo(() => {
      if (empty) return {};
      return {
        title: title ? { text: title, subtext: description } : undefined,
        tooltip: { trigger: 'axis' as const }, legend: { show: showLegend || sd.length > 1 },
        xAxis: { type: 'category' as const, data: labels },
        yAxis: { type: 'value' as const, splitLine: { show: showGrid }, axisLabel: valueFormatter ? { formatter: (v: number) => valueFormatter(v) } : undefined },
        series: sd.map((s, i) => ({ type: 'line' as const, name: s.name, data: s.data, smooth: curved, showSymbol: showDots, symbolSize: 6, lineStyle: { color: s.color ?? PAL[i % PAL.length], width: 2 }, itemStyle: { color: s.color ?? PAL[i % PAL.length] }, areaStyle: showArea ? { opacity: 0.18 } : undefined })),
        animation: animate,
      };
    }, [sd, labels, showDots, showGrid, showLegend, showArea, curved, valueFormatter, animate, title, description, empty]);
    const { containerRef } = useInlineECharts({ option, theme, onClick: onDataPointClick ? (p: unknown) => { const e = p as Record<string, unknown>; onDataPointClick({ datum: e, value: e.value as number, label: e.name as string }); } : undefined });

    if (empty) return (<div ref={ref} data-access-state={accessState.state} className={cn("inline-flex items-center justify-center text-sm text-text-secondary", accessState.isDisabled && "opacity-50", className)} style={{ height }} title={accessReason} data-testid="line-chart-empty" {...rest}>{localeText?.noData ?? "Veri yok"}</div>);
    return (<div ref={ref} className={cn("w-full", accessState.isDisabled && "opacity-50", className)} title={accessReason} data-testid="line-chart" {...rest}><div ref={containerRef as React.Ref<HTMLDivElement>} style={{ height, width: "100%" }} /></div>);
  },
);
LineChart.displayName = "LineChart";
export default LineChart;
