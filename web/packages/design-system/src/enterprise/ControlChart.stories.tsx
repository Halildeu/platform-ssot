import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ControlChart } from './ControlChart';

const stableProcess = Array.from({ length: 25 }, (_, i) => ({
  x: i + 1,
  y: 50 + (Math.random() - 0.5) * 10,
}));

const unstableProcess = [
  ...Array.from({ length: 10 }, (_, i) => ({ x: i + 1, y: 50 + (Math.random() - 0.5) * 8 })),
  { x: 11, y: 72 }, // violation
  ...Array.from({ length: 5 }, (_, i) => ({ x: i + 12, y: 50 + (Math.random() - 0.5) * 8 })),
  { x: 17, y: 28 }, // violation
  ...Array.from({ length: 8 }, (_, i) => ({ x: i + 18, y: 50 + (Math.random() - 0.5) * 8 })),
];

const monthlyData = [
  'Oca', 'Sub', 'Mar', 'Nis', 'May', 'Haz',
  'Tem', 'Agu', 'Eyl', 'Eki', 'Kas', 'Ara',
].map((label, i) => ({
  x: label,
  y: 100 + Math.sin(i * 0.5) * 15 + (Math.random() - 0.5) * 10,
}));

const meta: Meta<typeof ControlChart> = {
  title: 'Enterprise/ControlChart',
  component: ControlChart,
  tags: ['autodocs'],
  argTypes: {
    showZones: { control: 'boolean' },
    showViolations: { control: 'boolean' },
    height: { control: 'number' },
    access: {
      control: 'select',
      options: ['full', 'readonly', 'disabled', 'hidden'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof ControlChart>;

export const Default: Story = {
  args: {
    data: stableProcess,
    showZones: true,
    showViolations: true,
    xLabel: 'Sample #',
    yLabel: 'Measurement',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('svg, [data-component]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const WithViolations: Story = {
  args: {
    data: unstableProcess,
    showZones: true,
    showViolations: true,
    xLabel: 'Sample #',
    yLabel: 'Value',
  },
};

export const MonthlyTrend: Story = {
  args: {
    data: monthlyData,
    showZones: false,
    showViolations: true,
    xLabel: 'Ay',
    yLabel: 'Metrik',
  },
};
