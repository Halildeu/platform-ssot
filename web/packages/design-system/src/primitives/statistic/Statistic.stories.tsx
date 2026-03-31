import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Statistic } from './Statistic';

const meta: Meta<typeof Statistic> = {
  title: 'Components/Primitives/Statistic',
  component: Statistic,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    trend: { control: 'select', options: ['up', 'down', 'neutral', undefined] },
    loading: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Statistic>;

export const Default: Story = { args: { title: 'Active Users', value: 1128 } };

export const WithTrend: Story = {
  render: () => (
    <div className="flex gap-8">
      <Statistic title="Revenue" value={93.12} prefix="$" suffix="M" precision={2} trend="up" trendValue="+12.5%" />
      <Statistic title="Churn Rate" value={2.3} suffix="%" precision={1} trend="down" trendValue="-0.5%" />
      <Statistic title="NPS" value={72} trend="neutral" trendValue="±0" />
    </div>
  ),
};

export const WithPrefix: Story = {
  args: { title: 'Balance', value: 45230, prefix: '₺', precision: 0 },
};

export const Countdown: Story = {
  render: () => (
    <Statistic.Countdown
      title="Launch Countdown"
      value={Date.now() + 3600000}
      format="HH:mm:ss"
      onFinish={() => console.log('Finished!')}
    />
  ),
};

export const Loading: Story = {
  args: { title: 'Revenue', loading: true },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-8">
      <Statistic title="Small" value={42} size="sm" />
      <Statistic title="Medium" value={42} size="md" />
      <Statistic title="Large" value={42} size="lg" />
    </div>
  ),
};
