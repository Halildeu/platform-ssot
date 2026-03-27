import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PivotTable } from './PivotTable';

const meta: Meta<typeof PivotTable> = {
  title: 'Enterprise/PivotTable',
  component: PivotTable,
  tags: ['autodocs'],
  argTypes: {
    showTotals: { control: 'boolean' },
    compact: { control: 'boolean' },
    sortable: { control: 'boolean' },
    access: { control: 'radio', options: ['full', 'readonly', 'disabled', 'hidden'] },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof PivotTable>;

const salesData = [
  { region: 'North', quarter: 'Q1', revenue: 100, units: 10 },
  { region: 'North', quarter: 'Q2', revenue: 150, units: 14 },
  { region: 'North', quarter: 'Q3', revenue: 130, units: 12 },
  { region: 'South', quarter: 'Q1', revenue: 200, units: 20 },
  { region: 'South', quarter: 'Q2', revenue: 180, units: 17 },
  { region: 'South', quarter: 'Q3', revenue: 220, units: 22 },
  { region: 'East', quarter: 'Q1', revenue: 90, units: 8 },
  { region: 'East', quarter: 'Q2', revenue: 110, units: 11 },
  { region: 'East', quarter: 'Q3', revenue: 95, units: 9 },
];

export const Default: Story = {
  args: {
    data: salesData,
    rows: ['region'],
    columns: ['quarter'],
    values: [{ field: 'revenue', aggregate: 'sum', label: 'Revenue' }],
    showTotals: true,
    sortable: true,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-testid="pivot-table"]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const MultipleValues: Story = {
  args: {
    data: salesData,
    rows: ['region'],
    columns: ['quarter'],
    values: [
      { field: 'revenue', aggregate: 'sum', label: 'Revenue' },
      { field: 'units', aggregate: 'sum', label: 'Units' },
    ],
    showTotals: true,
  },
};

export const CompactSortable: Story = {
  args: {
    data: salesData,
    rows: ['region'],
    columns: ['quarter'],
    values: [{ field: 'revenue', aggregate: 'avg', label: 'Avg Revenue' }],
    compact: true,
    sortable: true,
  },
};
