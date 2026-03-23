import type { Meta, StoryObj } from '@storybook/react';
import { PieChart } from './PieChart';
import type { ChartDataPoint } from './types';

const marketShareData: ChartDataPoint[] = [
  { label: 'Chrome', value: 65.7 },
  { label: 'Safari', value: 18.3 },
  { label: 'Firefox', value: 7.2 },
  { label: 'Edge', value: 5.1 },
  { label: 'Other', value: 3.7 },
];

const meta: Meta<typeof PieChart> = {
  title: 'Components/Charts/PieChart',
  component: PieChart,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PieChart>;

export const Default: Story = {
  args: {
    data: marketShareData,
    title: 'Browser Market Share',
  },
};

export const DonutWithLabels: Story = {
  args: {
    data: marketShareData,
    donut: true,
    showLabels: true,
    showPercentage: true,
    showLegend: true,
    title: 'Browser Usage',
  },
};

export const LargeDonut: Story = {
  args: {
    data: marketShareData,
    donut: true,
    size: 'lg',
    showLegend: true,
    innerLabel: 'Total',
  },
};
