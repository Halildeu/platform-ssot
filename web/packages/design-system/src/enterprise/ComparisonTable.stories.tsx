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
};
export default meta;
type Story = StoryObj<typeof ComparisonTable>;

export const Default: Story = {
  args: {
    rows: sampleRows,
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
