import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BoxPlot } from './BoxPlot';
import type { BoxPlotData } from './BoxPlot';

const quarterlyData: BoxPlotData[] = [
  { label: 'Q1', min: 10, q1: 25, median: 35, q3: 50, max: 70, outliers: [5, 82] },
  { label: 'Q2', min: 15, q1: 30, median: 42, q3: 55, max: 75 },
  { label: 'Q3', min: 8, q1: 20, median: 30, q3: 45, max: 65, outliers: [2, 78, 85] },
  { label: 'Q4', min: 20, q1: 35, median: 48, q3: 60, max: 80 },
];

const teamPerformance: BoxPlotData[] = [
  { label: 'Gelistirme', min: 60, q1: 72, median: 80, q3: 88, max: 95, color: '#3b82f6' },
  { label: 'Tasarim', min: 55, q1: 68, median: 76, q3: 85, max: 92, color: '#8b5cf6' },
  { label: 'QA', min: 50, q1: 65, median: 75, q3: 82, max: 90, color: '#10b981' },
  { label: 'DevOps', min: 65, q1: 78, median: 85, q3: 92, max: 98, color: '#f59e0b', outliers: [55] },
];

const meta: Meta<typeof BoxPlot> = {
  title: 'Enterprise/BoxPlot',
  component: BoxPlot,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'radio', options: ['vertical', 'horizontal'] },
    showOutliers: { control: 'boolean' },
    showMean: { control: 'boolean' },
    height: { control: 'number' },
    access: {
      control: 'select',
      options: ['full', 'readonly', 'disabled', 'hidden'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof BoxPlot>;

export const Default: Story = {
  args: {
    data: quarterlyData,
    showOutliers: true,
    showMean: false,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('svg, [data-component]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const WithMeanMarker: Story = {
  args: {
    data: teamPerformance,
    showOutliers: true,
    showMean: true,
    height: 450,
  },
};

export const Horizontal: Story = {
  args: {
    data: quarterlyData,
    orientation: 'horizontal',
    showOutliers: true,
    showMean: true,
  },
};
