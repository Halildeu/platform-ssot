import type { Meta, StoryObj } from '@storybook/react';
import { AgingBuckets } from './AgingBuckets';
import type { AgingBucket } from './AgingBuckets';

const sampleBuckets: AgingBucket[] = [
  { id: 'b1', label: '0-30 Days', count: 42, value: 125_000, tone: 'success' },
  { id: 'b2', label: '31-60 Days', count: 28, value: 87_500, tone: 'info' },
  { id: 'b3', label: '61-90 Days', count: 15, value: 52_300, tone: 'warning' },
  { id: 'b4', label: '91-120 Days', count: 8, value: 31_200, tone: 'danger' },
  { id: 'b5', label: '120+ Days', count: 3, value: 14_800, tone: 'danger' },
];

const meta: Meta<typeof AgingBuckets> = {
  title: 'Enterprise/AgingBuckets',
  component: AgingBuckets,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AgingBuckets>;

export const Default: Story = {
  args: {
    buckets: sampleBuckets,
  },
};

export const Vertical: Story = {
  args: {
    buckets: sampleBuckets,
    orientation: 'vertical',
  },
};

export const WithStackedBar: Story = {
  args: {
    buckets: sampleBuckets,
    showStackedBar: true,
    formatOptions: { style: 'currency', currency: 'USD' },
  },
};
