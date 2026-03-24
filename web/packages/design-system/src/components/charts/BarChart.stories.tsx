import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';
import type { ChartDataPoint } from './types';

const quarterlyData: ChartDataPoint[] = [
  { label: 'Q1 2024', value: 245_000 },
  { label: 'Q2 2024', value: 312_000 },
  { label: 'Q3 2024', value: 278_000 },
  { label: 'Q4 2024', value: 356_000 },
];

const departmentData: ChartDataPoint[] = [
  { label: 'Engineering', value: 42, color: '#3b82f6' },
  { label: 'Marketing', value: 28, color: '#22c55e' },
  { label: 'Sales', value: 35, color: '#f59e0b' },
  { label: 'Operations', value: 18, color: '#8b5cf6' },
  { label: 'HR', value: 12, color: '#ec4899' },
];

const meta: Meta<typeof BarChart> = {
  title: 'Components/Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof BarChart>;

export const Default: Story = {
  args: {
    data: quarterlyData,
    title: 'Quarterly Revenue',
  },
};

export const HorizontalWithValues: Story = {
  args: {
    data: departmentData,
    orientation: 'horizontal',
    showValues: true,
    title: 'Headcount by Department',
  },
};

export const LargeWithLegend: Story = {
  args: {
    data: quarterlyData,
    size: 'lg',
    showLegend: true,
    showValues: true,
    valueFormatter: (v: number) => `$${(v / 1000).toFixed(0)}k`,
  },
};

export const SmallSize: Story = {
  args: {
    data: quarterlyData,
    size: 'sm',
    title: 'Compact Bar Chart',
  },
};

export const SingleBar: Story = {
  args: {
    data: [{ label: 'Q1', value: 100 }],
    title: 'Single Bar',
  },
};

export const ManyBars: Story = {
  args: {
    data: Array.from({ length: 12 }, (_, i) => ({
      label: \`Month \${i + 1}\`,
      value: Math.round(50 + Math.random() * 200),
    })),
    title: 'Monthly Data',
    showValues: true,
  },
};
