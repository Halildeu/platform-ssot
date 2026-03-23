import type { Meta, StoryObj } from '@storybook/react';
import { AreaChart } from './AreaChart';
import type { ChartSeries } from './types';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const revenueSeries: ChartSeries[] = [
  { name: 'Revenue', data: [42, 48, 55, 52, 61, 58, 65, 72, 68, 75, 80, 85] },
];

const multiSeries: ChartSeries[] = [
  { name: 'Product A', data: [30, 35, 40, 38, 45, 42, 48, 52, 50, 55, 58, 62], color: '#3b82f6' },
  { name: 'Product B', data: [12, 13, 15, 14, 16, 16, 17, 20, 18, 20, 22, 23], color: '#22c55e' },
];

const meta: Meta<typeof AreaChart> = {
  title: 'Components/Charts/AreaChart',
  component: AreaChart,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof AreaChart>;

export const Default: Story = {
  args: {
    series: revenueSeries,
    labels: monthLabels,
    title: 'Monthly Revenue',
  },
};

export const StackedMultiSeries: Story = {
  args: {
    series: multiSeries,
    labels: monthLabels,
    stacked: true,
    showLegend: true,
    title: 'Product Revenue Comparison',
  },
};

export const CurvedWithGradient: Story = {
  args: {
    series: revenueSeries,
    labels: monthLabels,
    curved: true,
    gradient: true,
    showDots: true,
    size: 'lg',
  },
};

export const SmallSize: Story = {
  args: {
    series: revenueSeries,
    labels: monthLabels,
    size: 'sm',
    title: 'Compact Area Chart',
  },
};

export const WithDotsAndLegend: Story = {
  args: {
    series: multiSeries,
    labels: monthLabels,
    showDots: true,
    showLegend: true,
    title: 'Area Chart with Dots',
  },
};

export const SingleDataPoint: Story = {
  args: {
    series: [{ name: 'Revenue', data: [42] }],
    labels: ['Jan'],
    title: 'Single Point',
  },
};
