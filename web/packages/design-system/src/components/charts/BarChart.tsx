import React, { useMemo } from "react";
import { cn } from "../../utils/cn";
import { resolveAccessState, type AccessControlledProps } from "../../internal/access-controller";
import { useInlineECharts, buildLightTheme } from "./useInlineECharts";
import type { ChartSize, ChartDataPoint, ChartLocaleText, ChartClickEvent } from "./types";

export interface BarChartProps extends AccessControlledProps {
  data: ChartDataPoint[];
  orientation?: "vertical" | "horizontal";
  size?: ChartSize;
  showValues?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  valueFormatter?: (value: number) => string;
  animate?: boolean;
  colors?: string[];
  title?: string;
  description?: string;
  localeText?: ChartLocaleText;
  className?: string;
  series?: { field: string; name: string; color?: string }[];
  onDataPointClick?: (event: ChartClickEvent) => void;
}

const SIZE_HEIGHT: Record<ChartSize, number> = { sm: 200, md: 300, lg: 400 };
const PALETTE = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];

export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  function BarChart(props, forwardedRef) {
    const { data, orientation = "vertical", size = "md", showValues = false, showGrid = true,
      showLegend = false, valueFormatter, animate = true, colors, title, description,
      localeText, className, series: seriesDef, onDataPointClick,
      access = "full", accessReason, ...rest } = props;

    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;
    const height = SIZE_HEIGHT[size];
    const theme = useMemo(() => buildLightTheme(), []);
    const palette = colors ?? PALETTE;
    const isH = orientation === "horizontal";
    const multi = seriesDef && seriesDef.length > 0;

    const option = useMemo(() => {
      if (!data || data.length === 0) return {};
      const cats = data.map(d => d.label);
      const series = multi
        ? seriesDef!.map((s, i) => ({ type: 'bar' as const, name: s.name, data: data.map(d => (d as Record<string, unknown>)[s.field] as number ?? 0), itemStyle: { color: s.color ?? palette[i % palette.length] }, label: showValues ? { show: true, formatter: (p: { value: number }) => valueFormatter ? valueFormatter(p.value) : String(p.value) } : undefined }))
        : [{ type: 'bar' as const, data: data.map((d, i) => ({ value: d.value, itemStyle: { color: d.color ?? palette[i % palette.length] } })), label: showValues ? { show: true, position: 'top' as const, formatter: (p: { value: number }) => valueFormatter ? valueFormatter(p.value) : String(p.value) } : undefined, barMaxWidth: 40, itemStyle: { borderRadius: isH ? [0, 4, 4, 0] : [4, 4, 0, 0] } }];
      return {
        title: title ? { text: title, subtext: description } : undefined,
        tooltip: { trigger: 'axis' as const },
        legend: { show: showLegend || !!multi },
        xAxis: isH ? { type: 'value' as const, splitLine: { show: showGrid } } : { type: 'category' as const, data: cats },
        yAxis: isH ? { type: 'category' as const, data: cats } : { type: 'value' as const, splitLine: { show: showGrid }, axisLabel: valueFormatter ? { formatter: (v: number) => valueFormatter(v) } : undefined },
        series, animation: animate,
      };
    }, [data, orientation, showValues, showGrid, showLegend, valueFormatter, animate, colors, title, description, seriesDef, multi, isH, palette]);

    const { containerRef } = useInlineECharts({ option, theme, onClick: onDataPointClick ? (p: unknown) => { const e = p as Record<string, unknown>; onDataPointClick({ datum: e, value: e.value as number, label: e.name as string }); } : undefined });

    if (!data || data.length === 0) {
      return (<div ref={forwardedRef} data-access-state={accessState.state} className={cn("inline-flex items-center justify-center text-sm text-text-secondary", accessState.isDisabled && "opacity-50", className)} style={{ height }} title={accessReason} data-testid="bar-chart-empty" {...rest}>{localeText?.noData ?? "Veri yok"}</div>);
    }
    return (<div ref={forwardedRef} className={cn("w-full", accessState.isDisabled && "opacity-50", className)} title={accessReason} data-testid="bar-chart" {...rest}><div ref={containerRef as React.Ref<HTMLDivElement>} style={{ height, width: "100%" }} /></div>);
  },
);
BarChart.displayName = "BarChart";
export default BarChart;
