/**
 * ChartRenderer — Renders charts from @mfe/x-charts.
 *
 * All chart types (core + enterprise) are rendered via x-charts.
 * Enterprise charts use React.lazy for code splitting.
 */

import React, { Suspense, useMemo } from 'react';
import {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
  GaugeChart,
  RadarChart,
  TreemapChart,
  HeatmapChart,
  WaterfallChart,
  FunnelChart,
  SankeyChart,
  SunburstChart,
  KPICard,
} from '@mfe/x-charts';
import type { ChartConfig, ChartType } from './types';

interface ChartRendererProps {
  config: ChartConfig;
  data: Record<string, unknown>[];
  height?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Data transformers                                                  */
/* ------------------------------------------------------------------ */

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface Series {
  name: string;
  data: number[];
  color?: string;
}

function toDataPoints(
  data: Record<string, unknown>[],
  xField: string,
  yField: string,
): DataPoint[] {
  return data.map((row) => ({
    label: String(row[xField] ?? ''),
    value: Number(row[yField] ?? 0),
  }));
}

function toMultiSeries(
  data: Record<string, unknown>[],
  xField: string,
  yFields: string[],
): { labels: string[]; series: Series[] } {
  const labels = data.map((row) => String(row[xField] ?? ''));
  const series: Series[] = yFields.map((field) => ({
    name: field,
    data: data.map((row) => Number(row[field] ?? 0)),
  }));
  return { labels, series };
}

function aggregateByCategory(
  data: Record<string, unknown>[],
  categoryField: string,
  valueField: string,
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max' = 'sum',
): DataPoint[] {
  const groups = new Map<string, number[]>();

  for (const row of data) {
    const key = String(row[categoryField] ?? 'Diğer');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(Number(row[valueField] ?? 0));
  }

  return [...groups.entries()].map(([label, values]) => {
    let value: number;
    switch (aggregation) {
      case 'sum': value = values.reduce((a, b) => a + b, 0); break;
      case 'avg': value = values.reduce((a, b) => a + b, 0) / values.length; break;
      case 'count': value = values.length; break;
      case 'min': value = Math.min(...values); break;
      case 'max': value = Math.max(...values); break;
    }
    return { label, value };
  });
}

/* ------------------------------------------------------------------ */
/*  Loading fallback                                                   */
/* ------------------------------------------------------------------ */

const ChartLoading: React.FC<{ height: number }> = ({ height }) => (
  <div className="flex items-center justify-center animate-pulse" style={{ height }}>
    <div className="h-8 w-8 rounded-full border-2 border-action-primary border-t-transparent animate-spin" />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Renderer                                                           */
/* ------------------------------------------------------------------ */

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  config,
  data,
  height = 400,
  className,
}) => {
  const chartData = useMemo(() => {
    if (!data.length || !config.xAxis) return [];
    const yField = config.yAxis[0];
    if (!yField && config.type !== 'pie' && config.type !== 'kpi') return [];

    if (config.aggregation) {
      return aggregateByCategory(data, config.xAxis, yField, config.aggregation);
    }
    return toDataPoints(data, config.xAxis, yField);
  }, [data, config]);

  const multiSeries = useMemo(() => {
    if (config.yAxis.length <= 1 || !config.xAxis) return null;
    return toMultiSeries(data, config.xAxis, config.yAxis);
  }, [data, config]);

  if (!chartData.length && config.type !== 'kpi') {
    return (
      <div className={`flex items-center justify-center text-sm text-text-tertiary ${className}`} style={{ height }}>
        Grafik verisi yok
      </div>
    );
  }

  const commonProps = {
    title: config.title,
    showLegend: config.showLegend ?? false,
    animate: true,
    size: config.size ?? 'md' as const,
  };

  const wrap = (el: React.ReactNode) => (
    <Suspense fallback={<ChartLoading height={height} />}>
      <div className={className} style={{ height }}>{el}</div>
    </Suspense>
  );

  switch (config.type) {
    case 'bar':
      return wrap(<BarChart data={chartData} {...commonProps} showValues={config.showLabels} orientation={config.stacked ? 'horizontal' : 'vertical'} />);
    case 'line':
      return multiSeries
        ? wrap(<LineChart series={multiSeries.series} labels={multiSeries.labels} {...commonProps} />)
        : wrap(<LineChart series={[{ name: config.yAxis[0], data: chartData.map(d => d.value) }]} labels={chartData.map(d => d.label)} {...commonProps} />);
    case 'pie':
      return wrap(<PieChart data={chartData} {...commonProps} />);
    case 'area':
      return multiSeries
        ? wrap(<AreaChart series={multiSeries.series} labels={multiSeries.labels} {...commonProps} />)
        : wrap(<AreaChart series={[{ name: config.yAxis[0], data: chartData.map(d => d.value) }]} labels={chartData.map(d => d.label)} {...commonProps} />);
    case 'scatter':
      return wrap(<ScatterChart data={chartData} {...commonProps} />);
    case 'gauge':
      return wrap(<GaugeChart value={chartData[0]?.value ?? 0} {...commonProps} />);
    case 'radar':
      return wrap(<RadarChart data={chartData} {...commonProps} />);
    case 'treemap':
      return wrap(<TreemapChart data={chartData} {...commonProps} />);
    case 'heatmap':
      return wrap(<HeatmapChart data={chartData} {...commonProps} />);
    case 'waterfall':
      return wrap(<WaterfallChart data={chartData} {...commonProps} />);
    case 'funnel':
      return wrap(<FunnelChart data={chartData} {...commonProps} />);
    case 'kpi':
      return wrap(<KPICard title={config.title ?? ''} value={String(chartData[0]?.value ?? 0)} />);
    default:
      return null;
  }
};
