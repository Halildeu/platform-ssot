import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from './LineChart';
import type { ChartSeries } from './types';

const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const singleSeries: ChartSeries[] = [
  { name: 'Page Views', data: [1200, 1450, 1380, 1520, 1680, 980, 750] },
];

const multiSeries: ChartSeries[] = [
  { name: 'Page Views', data: [1200, 1450, 1380, 1520, 1680, 980, 750], color: '#3b82f6' },
  { name: 'Unique Visitors', data: [800, 920, 880, 1020, 1100, 620, 480], color: '#22c55e' },
  { name: 'Bounce Rate %', data: [45, 42, 48, 40, 38, 52, 55], color: '#ef4444' },
];

const meta: Meta<typeof LineChart> = {
  title: 'Components/Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof LineChart>;

export const Default: Story = {
  args: {
    series: singleSeries,
    labels: weekLabels,
    title: 'Weekly Page Views',
  },
};

export const MultiSeriesWithLegend: Story = {
  args: {
    series: multiSeries,
    labels: weekLabels,
    showLegend: true,
    showDots: true,
    title: 'Website Traffic',
  },
};

export const CurvedWithArea: Story = {
  args: {
    series: singleSeries,
    labels: weekLabels,
    curved: true,
    showArea: true,
    size: 'lg',
  },
};
