import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MetricComparisonCard } from './MetricComparisonCard';

const meta: Meta<typeof MetricComparisonCard> = {
  title: 'Enterprise/MetricComparisonCard',
  component: MetricComparisonCard,
  tags: ['autodocs'],
  argTypes: {
    format: { control: 'select', options: ['number', 'currency', 'percent'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    invertTrend: { control: 'boolean' },
    access: {
      control: 'select',
      options: ['full', 'readonly', 'disabled', 'hidden'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem', maxWidth: 360 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof MetricComparisonCard>;

export const Default: Story = {
  args: {
    title: 'Monthly Revenue',
    currentValue: 125000,
    previousValue: 100000,
    format: 'currency',
    currencySymbol: 'USD',
    period: { current: 'March 2025', previous: 'February 2025' },
    target: 130000,
    sparklineData: [85000, 92000, 98000, 100000, 107000, 115000, 125000],
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="metric-comparison-card"]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const PercentDown: Story = {
  args: {
    title: 'Churn Rate',
    currentValue: 3.2,
    previousValue: 4.5,
    format: 'percent',
    period: { current: 'Q1 2025', previous: 'Q4 2024' },
    invertTrend: true,
    size: 'md',
    sparklineData: [5.1, 4.8, 4.5, 4.0, 3.5, 3.2],
  },
};

export const SmallCard: Story = {
  args: {
    title: 'Active Users',
    currentValue: 12450,
    previousValue: 12300,
    format: 'number',
    size: 'sm',
  },
};
