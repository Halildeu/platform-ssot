/**
 * ChartRenderer — Renders the appropriate chart from Design Lab based on ChartConfig.
 *
 * Transforms report row data into Design Lab chart props format.
 */

import React, { useMemo } from 'react';
import {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
} from '@mfe/design-system';
import type { ChartDataPoint, ChartSeries } from '@mfe/design-system';
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

function toDataPoints(
  data: Record<string, unknown>[],
  xField: string,
  yField: string,
): ChartDataPoint[] {
  return data.map((row) => ({
    label: String(row[xField] ?? ''),
    value: Number(row[yField] ?? 0),
  }));
}

function toMultiSeries(
  data: Record<string, unknown>[],
  xField: string,
  yFields: string[],
): { labels: string[]; series: ChartSeries[] } {
  const labels = data.map((row) => String(row[xField] ?? ''));
  const series: ChartSeries[] = yFields.map((field) => ({
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
): ChartDataPoint[] {
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
    if (!yField && config.type !== 'pie') return [];

    if (config.aggregation) {
      return aggregateByCategory(data, config.xAxis, yField, config.aggregation);
    }

    return toDataPoints(data, config.xAxis, yField);
  }, [data, config]);

  const commonProps = {
    data: chartData,
    title: config.title,
    showLegend: config.showLegend ?? false,
    showValues: config.showLabels ?? false,
    animate: true,
    size: config.size ?? 'md' as const,
  };

  if (!chartData.length) {
    return (
      <div className={`flex items-center justify-center text-sm text-text-tertiary ${className}`} style={{ height }}>
        Grafik verisi yok
      </div>
    );
  }

  switch (config.type) {
    case 'bar':
      return (
        <div className={className} style={{ height }}>
          <BarChart {...commonProps} orientation={config.stacked ? 'horizontal' : 'vertical'} />
        </div>
      );

    case 'line':
      return (
        <div className={className} style={{ height }}>
          <LineChart {...commonProps} />
        </div>
      );

    case 'pie':
      return (
        <div className={className} style={{ height }}>
          <PieChart {...commonProps} />
        </div>
      );

    case 'area':
      return (
        <div className={className} style={{ height }}>
          <AreaChart {...commonProps} />
        </div>
      );

    /* Enterprise charts — lazy import to avoid bundle bloat */
    case 'funnel':
    case 'gauge':
    case 'radar':
    case 'treemap':
    case 'waterfall':
    case 'histogram':
    case 'bullet':
    case 'pareto':
      return (
        <div className={`flex items-center justify-center text-sm text-text-secondary ${className}`} style={{ height }}>
          <div className="text-center">
            <div className="text-2xl mb-2">{config.type === 'funnel' ? '▽' : config.type === 'gauge' ? '◔' : '📊'}</div>
            <div>{config.type.charAt(0).toUpperCase() + config.type.slice(1)} Chart</div>
            <div className="text-xs text-text-tertiary mt-1">Enterprise bileşen — Design Lab'dan yüklenecek</div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
