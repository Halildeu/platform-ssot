import type { Meta, StoryObj } from '@storybook/react';
import { TreemapChart } from './TreemapChart';
import type { TreemapItem } from './TreemapChart';

const departmentSpend: TreemapItem[] = [
  { id: 'd1', label: 'Engineering', value: 450_000 },
  { id: 'd2', label: 'Marketing', value: 280_000 },
  { id: 'd3', label: 'Sales', value: 320_000 },
  { id: 'd4', label: 'Operations', value: 180_000 },
  { id: 'd5', label: 'HR', value: 95_000 },
  { id: 'd6', label: 'Finance', value: 120_000 },
  { id: 'd7', label: 'Legal', value: 75_000 },
  { id: 'd8', label: 'Support', value: 140_000 },
];

const meta: Meta<typeof TreemapChart> = {
  title: 'Enterprise/TreemapChart',
  component: TreemapChart,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TreemapChart>;

export const Default: Story = {
  args: {
    items: departmentSpend,
  },
};

export const WithCurrencyFormat: Story = {
  args: {
    items: departmentSpend,
    formatOptions: { style: 'currency', currency: 'USD' },
    height: 500,
  },
};

export const NestedItems: Story = {
  args: {
    items: [
      {
        id: 'tech',
        label: 'Technology',
        value: 0,
        children: [
          { id: 'infra', label: 'Infrastructure', value: 200_000 },
          { id: 'dev', label: 'Development', value: 350_000 },
          { id: 'sec', label: 'Security', value: 120_000 },
        ],
      },
      {
        id: 'biz',
        label: 'Business',
        value: 0,
        children: [
          { id: 'mkt', label: 'Marketing', value: 280_000 },
          { id: 'sales', label: 'Sales', value: 320_000 },
        ],
      },
    ],
    height: 400,
  },
};
