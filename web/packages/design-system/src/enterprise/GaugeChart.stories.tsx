import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GaugeChart } from './GaugeChart';

const meta: Meta<typeof GaugeChart> = {
  title: 'Enterprise/GaugeChart',
  component: GaugeChart,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    animate: { control: 'boolean' },
    access: { control: 'radio', options: ['full', 'readonly', 'disabled', 'hidden'] },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof GaugeChart>;

export const Default: Story = {
  args: {
    value: 72,
    label: 'CPU Usage',
    unit: '%',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-testid="gauge-chart"]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const CustomThresholds: Story = {
  args: {
    value: 45,
    min: 0,
    max: 100,
    label: 'Disk I/O',
    unit: 'MB/s',
    size: 'lg',
    thresholds: [
      { value: 25, color: 'var(--state-success-text)', label: 'Low' },
      { value: 50, color: 'var(--state-warning-text)', label: 'Medium' },
      { value: 75, color: 'var(--state-warning-text)', label: 'High' },
      { value: 100, color: 'var(--state-danger-text)', label: 'Critical' },
    ],
  },
};

export const SmallSize: Story = {
  args: {
    value: 88,
    label: 'SLA',
    unit: '%',
    size: 'sm',
  },
};
