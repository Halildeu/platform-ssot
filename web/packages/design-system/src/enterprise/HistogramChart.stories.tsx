import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HistogramChart } from './HistogramChart';

// Generate sample data: normal-ish distribution
function generateNormalData(n: number, mean: number, stddev: number): number[] {
  const data: number[] = [];
  for (let i = 0; i < n; i++) {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    data.push(Math.round((mean + z * stddev) * 10) / 10);
  }
  return data;
}

const responseTimeData = generateNormalData(200, 150, 30);
const temperatureData = generateNormalData(100, 22, 3);

const meta: Meta<typeof HistogramChart> = {
  title: 'Enterprise/HistogramChart',
  component: HistogramChart,
  tags: ['autodocs'],
  argTypes: {
    bins: { control: { type: 'number', min: 3, max: 30 } },
    showNormalCurve: { control: 'boolean' },
    showMean: { control: 'boolean' },
    showMedian: { control: 'boolean' },
    height: { control: 'number' },
    access: {
      control: 'select',
      options: ['full', 'readonly', 'disabled', 'hidden'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof HistogramChart>;

export const Default: Story = {
  args: {
    data: responseTimeData,
    bins: 12,
    showNormalCurve: true,
    showMean: true,
    xLabel: 'Response Time (ms)',
    yLabel: 'Frequency',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('svg, [data-component]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const WithMedian: Story = {
  args: {
    data: temperatureData,
    bins: 10,
    showMean: true,
    showMedian: true,
    xLabel: 'Temperature (C)',
    yLabel: 'Count',
    color: 'var(--state-success-text)',
  },
};

export const AutoBins: Story = {
  args: {
    data: responseTimeData,
    showNormalCurve: true,
    showMean: true,
    showMedian: true,
  },
};
