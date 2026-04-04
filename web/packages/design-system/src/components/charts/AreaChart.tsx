import React, { useMemo } from "react";
import { cn } from "../../utils/cn";
import { resolveAccessState, type AccessControlledProps } from "../../internal/access-controller";
import { useInlineECharts, buildLightTheme } from "./useInlineECharts";
import type { ChartSize, ChartSeries, ChartLocaleText } from "./types";

export interface AreaChartProps extends AccessControlledProps {
  series: ChartSeries[]; labels: string[]; size?: ChartSize; stacked?: boolean;
  showDots?: boolean; showGrid?: boolean; showLegend?: boolean; gradient?: boolean;
  curved?: boolean; valueFormatter?: (value: number) => string; animate?: boolean;
  title?: string; description?: string; localeText?: ChartLocaleText; className?: string;
}

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };
const PAL = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

export const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  function AreaChart(props, ref) {
    const { series: sd, labels, size = "md", stacked = false, showDots = true, showGrid = true,
      showLegend = false, gradient = true, curved = false, valueFormatter, animate = true,
      title, description, localeText, className, access = "full", accessReason, ...rest } = props;
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
        xAxis: { type: 'category' as const, data: labels, boundaryGap: false },
        yAxis: { type: 'value' as const, splitLine: { show: showGrid }, axisLabel: valueFormatter ? { formatter: (v: number) => valueFormatter(v) } : undefined },
        series: sd.map((s, i) => ({ type: 'line' as const, name: s.name, data: s.data, smooth: curved, showSymbol: showDots, symbolSize: 5, stack: stacked ? 'total' : undefined, areaStyle: { opacity: gradient ? 0.3 : 0.6 }, lineStyle: { color: s.color ?? PAL[i % PAL.length] }, itemStyle: { color: s.color ?? PAL[i % PAL.length] } })),
        animation: animate,
      };
    }, [sd, labels, stacked, showDots, showGrid, showLegend, gradient, curved, valueFormatter, animate, title, description, empty]);
    const { containerRef } = useInlineECharts({ option, theme });

    if (empty) return (<div ref={ref} data-access-state={accessState.state} className={cn("inline-flex items-center justify-center text-sm text-text-secondary", accessState.isDisabled && "opacity-50", className)} style={{ height }} title={accessReason} data-testid="area-chart-empty" {...rest}>{localeText?.noData ?? "Veri yok"}</div>);
    return (<div ref={ref} className={cn("w-full", accessState.isDisabled && "opacity-50", className)} title={accessReason} data-testid="area-chart" {...rest}><div ref={containerRef as React.Ref<HTMLDivElement>} style={{ height, width: "100%" }} /></div>);
  },
);
AreaChart.displayName = "AreaChart";
export default AreaChart;
