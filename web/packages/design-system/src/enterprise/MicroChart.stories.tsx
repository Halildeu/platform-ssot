import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MicroChart } from './MicroChart';

const meta: Meta<typeof MicroChart> = {
  title: 'Enterprise/MicroChart',
  component: MicroChart,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof MicroChart>;

export const Sparkline: Story = {
  args: {
    type: 'sparkline',
    data: [12, 18, 14, 22, 19, 25, 28, 24, 30],
    width: 96,
    height: 32,
    color: '#3b82f6',
  },
};

export const Bar: Story = {
  args: {
    type: 'bar',
    data: [40, 65, 30, 80, 55, 70],
    width: 80,
    height: 32,
    color: '#22c55e',
  },
};

export const Progress: Story = {
  args: {
    type: 'progress',
    data: [72],
    width: 80,
    height: 8,
    color: '#6366f1',
  },
};

export const DonutRing: Story = {
  args: {
    type: 'donut-ring',
    data: [35, 25, 20, 15, 5],
    width: 48,
    height: 48,
  },
};

export const Waffle: Story = {
  args: {
    type: 'waffle',
    data: [68],
    width: 48,
    height: 48,
    color: '#f59e0b',
  },
};

export const SmallSparkline: Story = {
  args: {
    type: 'sparkline',
    data: [5, 10, 8, 15, 12],
    width: 64,
    height: 24,
    color: '#ef4444',
  },
};
