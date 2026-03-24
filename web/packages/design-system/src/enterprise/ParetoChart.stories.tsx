import type { Meta, StoryObj } from '@storybook/react';
import { ParetoChart } from './ParetoChart';
import type { ParetoItem } from './ParetoChart';

const defectData: ParetoItem[] = [
  { id: 'd1', label: 'Missing Parts', value: 82 },
  { id: 'd2', label: 'Surface Defect', value: 65 },
  { id: 'd3', label: 'Wrong Dimension', value: 43 },
  { id: 'd4', label: 'Color Mismatch', value: 28 },
  { id: 'd5', label: 'Packaging Issue', value: 15 },
  { id: 'd6', label: 'Label Error', value: 9 },
  { id: 'd7', label: 'Other', value: 5 },
];

const customerComplaints: ParetoItem[] = [
  { id: 'c1', label: 'Late Delivery', value: 120 },
  { id: 'c2', label: 'Damaged Product', value: 95 },
  { id: 'c3', label: 'Wrong Item', value: 60 },
  { id: 'c4', label: 'Billing Error', value: 35 },
  { id: 'c5', label: 'Poor Quality', value: 25 },
  { id: 'c6', label: 'Rude Staff', value: 10 },
];

const meta: Meta<typeof ParetoChart> = {
  title: 'Enterprise/ParetoChart',
  component: ParetoChart,
  tags: ['autodocs'],
  argTypes: {
    showCumulativeLine: { control: 'boolean' },
    showPercentLabels: { control: 'boolean' },
    show80Line: { control: 'boolean' },
    height: { control: 'number' },
    access: {
      control: 'select',
      options: ['full', 'readonly', 'disabled', 'hidden'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof ParetoChart>;

export const Default: Story = {
  args: {
    items: defectData,
    showCumulativeLine: true,
    showPercentLabels: true,
    show80Line: true,
  },
};

export const With80Line: Story = {
  args: {
    items: customerComplaints,
    show80Line: true,
    showCumulativeLine: true,
    showPercentLabels: false,
    height: 450,
  },
};

export const BarsOnly: Story = {
  args: {
    items: defectData,
    showCumulativeLine: false,
    show80Line: false,
  },
};
