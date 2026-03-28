import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadarChart } from './RadarChart';
import type { RadarAxis, RadarSeries } from './RadarChart';

const performanceAxes: RadarAxis[] = [
  { key: 'speed', label: 'Speed' },
  { key: 'reliability', label: 'Reliability' },
  { key: 'security', label: 'Security' },
  { key: 'scalability', label: 'Scalability' },
  { key: 'usability', label: 'Usability' },
  { key: 'cost', label: 'Cost Efficiency' },
];

const singleSeries: RadarSeries[] = [
  {
    id: 'current',
    label: 'Current System',
    values: { speed: 70, reliability: 85, security: 90, scalability: 60, usability: 75, cost: 55 },
  },
];

const multiSeries: RadarSeries[] = [
  ...singleSeries,
  {
    id: 'target',
    label: 'Target State',
    values: { speed: 90, reliability: 95, security: 95, scalability: 85, usability: 88, cost: 70 },
    color: 'var(--state-success-text)',
    fillOpacity: 0.1,
  },
];

const meta: Meta<typeof RadarChart> = {
  title: 'Enterprise/RadarChart',
  component: RadarChart,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof RadarChart>;

export const Default: Story = {
  args: {
    axes: performanceAxes,
    series: singleSeries,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('svg, [role="img"], [data-component]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const MultiSeries: Story = {
  args: {
    axes: performanceAxes,
    series: multiSeries,
    showLegend: true,
    showTooltip: true,
  },
};

export const LargeSize: Story = {
  args: {
    axes: performanceAxes,
    series: multiSeries,
    size: 450,
    levels: 10,
    showLegend: true,
  },
};

export const SmallSize: Story = {
  args: {
    axes: performanceAxes,
    series: singleSeries,
    size: 250,
  },
};

export const WithTooltip: Story = {
  args: {
    axes: performanceAxes,
    series: singleSeries,
    showTooltip: true,
  },
};

export const ThreeAxes: Story = {
  args: {
    axes: performanceAxes.slice(0, 3),
    series: [{ id: 'current', label: 'Current', values: { speed: 70, reliability: 85, security: 90 } }],
  },
};
