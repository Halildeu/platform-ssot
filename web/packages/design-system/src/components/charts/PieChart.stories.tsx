import React from 'react';
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
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
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

export const SmallSize: Story = {
  args: {
    data: marketShareData,
    size: 'sm',
    title: 'Compact Pie Chart',
  },
};

export const TwoSlices: Story = {
  args: {
    data: [
      { label: 'Yes', value: 72 },
      { label: 'No', value: 28 },
    ],
    title: 'Binary Distribution',
    showPercentage: true,
  },
};

export const WithLabelsOnly: Story = {
  args: {
    data: marketShareData,
    showLabels: true,
    showPercentage: false,
    title: 'Labels Only',
  },
};
