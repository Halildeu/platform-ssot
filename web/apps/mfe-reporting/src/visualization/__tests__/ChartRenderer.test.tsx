// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

/* Mock x-charts — all chart components */
vi.mock('@mfe/x-charts', () => ({
  BarChart: (props: any) => <div data-testid="bar-chart">{props.title}</div>,
  LineChart: (props: any) => <div data-testid="line-chart">{props.title}</div>,
  PieChart: (props: any) => <div data-testid="pie-chart">{props.title}</div>,
  AreaChart: (props: any) => <div data-testid="area-chart">{props.title}</div>,
  ScatterChart: (props: any) => <div data-testid="scatter-chart">{props.title}</div>,
  GaugeChart: (props: any) => <div data-testid="gauge-chart" />,
  RadarChart: (props: any) => <div data-testid="radar-chart" />,
  TreemapChart: (props: any) => <div data-testid="treemap-chart" />,
  HeatmapChart: (props: any) => <div data-testid="heatmap-chart" />,
  WaterfallChart: (props: any) => <div data-testid="waterfall-chart" />,
  FunnelChart: (props: any) => <div data-testid="funnel-chart" />,
  SankeyChart: (props: any) => <div data-testid="sankey-chart" />,
  SunburstChart: (props: any) => <div data-testid="sunburst-chart" />,
  KPICard: (props: any) => <div data-testid="kpi-card">{props.value}</div>,
}));

import { ChartRenderer } from '../ChartRenderer';

const sampleData = [
  { department: 'IT', revenue: 100 },
  { department: 'HR', revenue: 200 },
  { department: 'Sales', revenue: 300 },
];

const baseConfig = {
  xAxis: 'department',
  yAxis: ['revenue'],
  showLegend: true,
};

describe('ChartRenderer', () => {
  it('renders bar chart', () => {
    render(<ChartRenderer config={{ ...baseConfig, type: 'bar' as any }} data={sampleData} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders line chart', () => {
    render(<ChartRenderer config={{ ...baseConfig, type: 'line' as any }} data={sampleData} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('renders pie chart', () => {
    render(<ChartRenderer config={{ ...baseConfig, type: 'pie' as any }} data={sampleData} />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('renders area chart', () => {
    render(<ChartRenderer config={{ ...baseConfig, type: 'area' as any }} data={sampleData} />);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('renders scatter chart (enterprise)', () => {
    render(<ChartRenderer config={{ ...baseConfig, type: 'scatter' as any }} data={sampleData} />);
    expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
  });

  it('renders gauge chart (enterprise)', () => {
    render(<ChartRenderer config={{ ...baseConfig, type: 'gauge' as any }} data={sampleData} />);
    expect(screen.getByTestId('gauge-chart')).toBeInTheDocument();
  });

  it('renders radar chart (enterprise)', () => {
    render(<ChartRenderer config={{ ...baseConfig, type: 'radar' as any }} data={sampleData} />);
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
  });

  it('renders funnel chart (enterprise)', () => {
    render(<ChartRenderer config={{ ...baseConfig, type: 'funnel' as any }} data={sampleData} />);
    expect(screen.getByTestId('funnel-chart')).toBeInTheDocument();
  });

  it('renders waterfall chart (enterprise)', () => {
    render(<ChartRenderer config={{ ...baseConfig, type: 'waterfall' as any }} data={sampleData} />);
    expect(screen.getByTestId('waterfall-chart')).toBeInTheDocument();
  });

  it('renders treemap chart (enterprise)', () => {
    render(<ChartRenderer config={{ ...baseConfig, type: 'treemap' as any }} data={sampleData} />);
    expect(screen.getByTestId('treemap-chart')).toBeInTheDocument();
  });

  it('renders heatmap chart (enterprise)', () => {
    render(<ChartRenderer config={{ ...baseConfig, type: 'heatmap' as any }} data={sampleData} />);
    expect(screen.getByTestId('heatmap-chart')).toBeInTheDocument();
  });

  it('shows empty state for no data', () => {
    render(<ChartRenderer config={{ ...baseConfig, type: 'bar' as any }} data={[]} />);
    expect(screen.getByText('Grafik verisi yok')).toBeInTheDocument();
  });

  it('applies aggregation', () => {
    const data = [
      { dept: 'IT', val: 10 },
      { dept: 'IT', val: 20 },
      { dept: 'HR', val: 30 },
    ];
    render(<ChartRenderer config={{ type: 'bar' as any, xAxis: 'dept', yAxis: ['val'], aggregation: 'sum' }} data={data} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('returns null for unknown type', () => {
    const { container } = render(<ChartRenderer config={{ ...baseConfig, type: 'unknown' as any }} data={sampleData} />);
    expect(container.innerHTML).toBe('');
  });
});
