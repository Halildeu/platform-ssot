import React, { useMemo } from "react";
import { cn } from "../../utils/cn";
import { resolveAccessState, type AccessControlledProps } from "../../internal/access-controller";
import { useInlineECharts, buildLightTheme } from "./useInlineECharts";
import type { ChartSize, ChartDataPoint, ChartLocaleText, ChartClickEvent } from "./types";

export interface PieChartProps extends AccessControlledProps {
  data: ChartDataPoint[]; size?: ChartSize; donut?: boolean; showLabels?: boolean;
  showLegend?: boolean; showPercentage?: boolean; valueFormatter?: (value: number) => string;
  innerLabel?: React.ReactNode; animate?: boolean; title?: string; description?: string;
  localeText?: ChartLocaleText; className?: string; onDataPointClick?: (event: ChartClickEvent) => void;
}

const SIZE_DIM: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };
const PAL = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6'];

export const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  function PieChart(props, ref) {
    const { data, size = "md", donut = false, showLabels = false, showLegend = false,
      showPercentage = false, valueFormatter, innerLabel, animate = true, title, description,
      localeText, className, onDataPointClick, access = "full", accessReason, ...rest } = props;
    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;
    const dim = SIZE_DIM[size];
    const theme = useMemo(() => buildLightTheme(), []);
    const valid = useMemo(() => (data ?? []).filter(d => d.value > 0), [data]);

    const option = useMemo(() => {
      if (valid.length === 0) return {};
      return {
        title: title ? { text: title, subtext: description } : undefined,
        tooltip: { trigger: 'item' as const, formatter: valueFormatter ? (p: { name: string; value: number }) => `${p.name}: ${valueFormatter(p.value)}` : undefined },
        legend: { show: showLegend },
        series: [{ type: 'pie' as const, radius: donut ? ['40%', '70%'] : '70%',
          data: valid.map((d, i) => ({ name: d.label, value: d.value, itemStyle: { color: d.color ?? PAL[i % PAL.length] } })),
          label: { show: showLabels || showPercentage, formatter: showPercentage ? '{d}%' : '{b}' },
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' } },
        }],
        animation: animate,
      };
    }, [valid, donut, showLabels, showLegend, showPercentage, valueFormatter, animate, title, description]);
    const { containerRef } = useInlineECharts({ option, theme, onClick: onDataPointClick ? (p: unknown) => { const e = p as Record<string, unknown>; onDataPointClick({ datum: e, value: e.value as number, label: e.name as string }); } : undefined });

    if (valid.length === 0) return (<div ref={ref} data-access-state={accessState.state} className={cn("inline-flex items-center justify-center text-sm text-text-secondary", accessState.isDisabled && "opacity-50", className)} style={{ width: dim, height: dim }} title={accessReason} data-testid="pie-chart-empty" {...rest}>{localeText?.noData ?? "Veri yok"}</div>);
    return (<div ref={ref} className={cn("relative w-full", accessState.isDisabled && "opacity-50", className)} title={accessReason} data-testid="pie-chart" {...rest}><div ref={containerRef as React.Ref<HTMLDivElement>} style={{ height: dim, width: "100%" }} />{donut && innerLabel ? (<div className="pointer-events-none absolute inset-0 flex items-center justify-center" data-testid="pie-chart-inner-label">{innerLabel}</div>) : null}</div>);
  },
);
PieChart.displayName = "PieChart";
export default PieChart;
