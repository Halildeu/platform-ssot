import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { AreaChart } from './AreaChart';
import type { ChartDataPoint } from './types';

const meta: Meta<typeof BarChart> = {
  title: 'Components/Data/Charts',
  component: BarChart,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showValues: { control: 'boolean' },
    showGrid: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof BarChart>;

const data: ChartDataPoint[] = [
  { label: 'Oca', value: 120 },
  { label: 'Sub', value: 200 },
  { label: 'Mar', value: 150 },
  { label: 'Nis', value: 280 },
  { label: 'May', value: 220 },
  { label: 'Haz', value: 310 },
];

export const BarChartDefault: Story = {
  args: {
    data,
    title: 'Aylik Satis',
    showValues: true,
  },
};

export const BarChartHorizontal: Story = {
  args: {
    data,
    orientation: 'horizontal',
    title: 'Yatay Bar Grafik',
  },
};

export const LineChartDefault: Story = {
  render: () => (
    <LineChart
      series={[{ name: 'Trend', data: data.map((d) => d.value), color: '#3b82f6' }]}
      labels={data.map((d) => d.label)}
      size="md"
    />
  ),
};

export const AreaChartDefault: Story = {
  render: () => (
    <AreaChart
      series={[{ name: 'Alan', data: data.map((d) => d.value), color: '#10b981' }]}
      labels={data.map((d) => d.label)}
      size="md"
    />
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{size}</div>
          <BarChart data={data} size={size} />
        </div>
      ))}
    </div>
  ),
};
