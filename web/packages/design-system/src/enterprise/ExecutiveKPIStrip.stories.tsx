import type { Meta, StoryObj } from '@storybook/react';
import { ExecutiveKPIStrip } from './ExecutiveKPIStrip';
import type { KPIMetric } from './ExecutiveKPIStrip';

const sampleMetrics: KPIMetric[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    value: 2_450_000,
    format: { style: 'currency', currency: 'USD' },
    trend: { direction: 'up', value: 12.5 },
    sparkline: [180, 210, 195, 240, 260, 245, 280],
  },
  {
    id: 'orders',
    label: 'Orders',
    value: 1_842,
    trend: { direction: 'up', value: 8.3 },
    sparkline: [120, 135, 128, 142, 155, 149, 168],
  },
  {
    id: 'conversion',
    label: 'Conversion Rate',
    value: 3.24,
    format: { style: 'percent' },
    trend: { direction: 'down', value: -1.2 },
    sparkline: [3.8, 3.5, 3.6, 3.3, 3.1, 3.2, 3.24],
  },
  {
    id: 'churn',
    label: 'Churn Rate',
    value: 2.1,
    format: { style: 'percent' },
    trend: { direction: 'down', value: -0.5 },
    invertTrend: true,
    sparkline: [3.1, 2.8, 2.6, 2.5, 2.3, 2.2, 2.1],
  },
];

const meta: Meta<typeof ExecutiveKPIStrip> = {
  title: 'Enterprise/ExecutiveKPIStrip',
  component: ExecutiveKPIStrip,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ExecutiveKPIStrip>;

export const Default: Story = {
  args: {
    metrics: sampleMetrics,
  },
};

export const ThreeColumns: Story = {
  args: {
    metrics: sampleMetrics.slice(0, 3),
    columns: 3,
  },
};

export const LargeSize: Story = {
  args: {
    metrics: sampleMetrics,
    size: 'lg',
    columns: 2,
  },
};

export const WithTargets: Story = {
  args: {
    metrics: sampleMetrics.map((m) => ({
      ...m,
      target: { current: 72, goal: 100 },
    })),
    size: 'md',
  },
};
