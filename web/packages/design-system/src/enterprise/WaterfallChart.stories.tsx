import type { Meta, StoryObj } from '@storybook/react';
import { WaterfallChart } from './WaterfallChart';
import type { WaterfallItem } from './WaterfallChart';

const revenueBreakdown: WaterfallItem[] = [
  { id: 'rev', label: 'Revenue', value: 1200, type: 'increase' },
  { id: 'cogs', label: 'COGS', value: -450, type: 'decrease' },
  { id: 'gp', label: 'Gross Profit', value: 750, type: 'total' },
  { id: 'opex', label: 'OpEx', value: -280, type: 'decrease' },
  { id: 'marketing', label: 'Marketing', value: -120, type: 'decrease' },
  { id: 'other', label: 'Other Income', value: 50, type: 'increase' },
  { id: 'net', label: 'Net Profit', value: 400, type: 'total' },
];

const profitLoss: WaterfallItem[] = [
  { id: 'q1', label: 'Q1 Revenue', value: 500, type: 'increase' },
  { id: 'q2', label: 'Q2 Revenue', value: 650, type: 'increase' },
  { id: 'costs', label: 'Total Costs', value: -800, type: 'decrease' },
  { id: 'tax', label: 'Tax', value: -70, type: 'decrease' },
  { id: 'total', label: 'EBITDA', value: 280, type: 'total' },
];

const meta: Meta<typeof WaterfallChart> = {
  title: 'Enterprise/WaterfallChart',
  component: WaterfallChart,
  tags: ['autodocs'],
  argTypes: {
    showValues: { control: 'boolean' },
    showConnectors: { control: 'boolean' },
    height: { control: 'number' },
    access: {
      control: 'select',
      options: ['full', 'readonly', 'disabled', 'hidden'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof WaterfallChart>;

export const Default: Story = {
  args: {
    items: revenueBreakdown,
    showValues: true,
    showConnectors: true,
  },
};

export const ProfitLoss: Story = {
  args: {
    items: profitLoss,
    showValues: true,
    showConnectors: true,
    format: (v: number) => `$${(v / 1).toLocaleString()}K`,
    height: 450,
  },
};

export const NoConnectors: Story = {
  args: {
    items: revenueBreakdown,
    showValues: true,
    showConnectors: false,
  },
};
