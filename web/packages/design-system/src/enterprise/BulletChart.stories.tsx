import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BulletChart } from './BulletChart';

const meta: Meta<typeof BulletChart> = {
  title: 'Enterprise/BulletChart',
  component: BulletChart,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof BulletChart>;

export const Default: Story = {
  args: {
    value: 72,
    target: 85,
    label: 'Revenue',
    subtitle: 'Q1 2024 vs Target',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-testid], svg, [role="img"]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const WithCustomRanges: Story = {
  args: {
    value: 280,
    target: 250,
    min: 0,
    max: 400,
    label: 'Customer Satisfaction',
    ranges: [
      { limit: 150, label: 'Poor', color: 'var(--state-danger-bg)' },
      { limit: 300, label: 'Acceptable', color: 'var(--state-warning-bg)' },
      { limit: 400, label: 'Excellent', color: 'var(--state-success-bg)' },
    ],
    barColor: 'var(--action-primary)',
    formatOptions: { style: 'decimal' },
  },
};

export const VerticalSmall: Story = {
  args: {
    value: 60,
    target: 75,
    label: 'Completion',
    orientation: 'vertical',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    value: 88,
    target: 90,
    label: 'SLA Compliance',
    subtitle: 'Last 30 days',
    size: 'lg',
    formatOptions: { style: 'percent' },
  },
};

export const ExceedsTarget: Story = {
  args: {
    value: 110,
    target: 85,
    label: 'Over-Achievement',
  },
};

export const ZeroValue: Story = {
  args: {
    value: 0,
    target: 50,
    label: 'Not Started',
  },
};
