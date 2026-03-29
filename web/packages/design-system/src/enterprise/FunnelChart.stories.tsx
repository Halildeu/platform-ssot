import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FunnelChart } from './FunnelChart';
import type { FunnelStage } from './FunnelChart';

const salesFunnel: FunnelStage[] = [
  { id: 's1', label: 'Visitors', value: 12_500 },
  { id: 's2', label: 'Leads', value: 5_200 },
  { id: 's3', label: 'Qualified', value: 2_800 },
  { id: 's4', label: 'Proposals', value: 1_400 },
  { id: 's5', label: 'Closed Won', value: 620 },
];

const meta: Meta<typeof FunnelChart> = {
  title: 'Enterprise/FunnelChart',
  component: FunnelChart,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof FunnelChart>;

export const Default: Story = {
  args: {
    stages: salesFunnel,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('svg, [role="img"], [data-component]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const Horizontal: Story = {
  args: {
    stages: salesFunnel,
    orientation: 'horizontal',
  },
};

export const WithCustomColors: Story = {
  args: {
    stages: salesFunnel.map((s, i) => ({
      ...s,
      color: ['var(--action-primary)', 'var(--action-primary)', 'var(--action-primary)', 'var(--action-primary)', 'var(--action-primary)'][i],
    })),
    animated: true,
  },
};

export const TwoStages: Story = {
  args: {
    stages: salesFunnel.slice(0, 2),
  },
};

export const WithLabels: Story = {
  args: {
    stages: salesFunnel,
    showLabels: true,
    showPercentage: true,
  },
};

export const LargeSize: Story = {
  args: {
    stages: salesFunnel,
    size: 'lg',
    animated: true,
  },
};
