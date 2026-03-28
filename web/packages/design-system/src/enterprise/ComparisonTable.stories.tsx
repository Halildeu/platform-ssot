import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ComparisonTable } from './ComparisonTable';
import type { ComparisonRow } from './ComparisonTable';

const sampleRows: ComparisonRow[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    actual: 2_450_000,
    target: 2_200_000,
    format: { style: 'currency', currency: 'USD' },
    children: [
      { id: 'product-sales', label: 'Product Sales', actual: 1_800_000, target: 1_600_000 },
      { id: 'services', label: 'Services', actual: 650_000, target: 600_000 },
    ],
  },
  { id: 'costs', label: 'Operating Costs', actual: 980_000, target: 1_050_000, format: { style: 'currency', currency: 'USD' } },
  { id: 'margin', label: 'Gross Margin', actual: 42.5, target: 40.0, format: { style: 'percent' } },
  { id: 'headcount', label: 'Headcount', actual: 145, target: 150 },
];

const meta: Meta<typeof ComparisonTable> = {
  title: 'Enterprise/ComparisonTable',
  component: ComparisonTable,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof ComparisonTable>;

export const Default: Story = {
  args: {
    rows: sampleRows,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component], div, svg');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const CustomColumnLabels: Story = {
  args: {
    rows: sampleRows,
    columns: {
      label: 'Metric',
      actual: 'YTD Actual',
      target: 'YTD Budget',
      variance: 'Variance',
      variancePercent: 'Var %',
    },
  },
};

export const InvertedVariance: Story = {
  args: {
    rows: [
      { id: 'costs', label: 'Total Costs', actual: 820_000, target: 900_000, format: { style: 'currency', currency: 'USD' } },
      { id: 'churn', label: 'Churn Rate', actual: 2.1, target: 3.0, format: { style: 'percent' } },
      { id: 'defects', label: 'Defect Count', actual: 12, target: 20 },
    ],
    invertVarianceColors: true,
  },
};

export const SingleRow: Story = {
  args: {
    rows: [sampleRows[0]],
  },
};

export const EmptyTable: Story = {
  args: {
    rows: [],
  },
};

export const PercentageOnly: Story = {
  args: {
    rows: [
      { id: 'margin', label: 'Margin', actual: 42.5, target: 40.0, format: { style: 'percent' } },
      { id: 'efficiency', label: 'Efficiency', actual: 88.0, target: 90.0, format: { style: 'percent' } },
    ],
  },
};
