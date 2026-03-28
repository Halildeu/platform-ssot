import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SWOTMatrix } from './SWOTMatrix';
import type { SWOTItem } from './SWOTMatrix';

const strengths: SWOTItem[] = [
  { id: 's1', text: 'Strong brand recognition', priority: 'high' },
  { id: 's2', text: 'Experienced leadership team', priority: 'medium' },
  { id: 's3', text: 'Proprietary technology', priority: 'high' },
  { id: 's4', text: 'Loyal customer base', priority: 'low' },
];

const weaknesses: SWOTItem[] = [
  { id: 'w1', text: 'Limited marketing budget', priority: 'high' },
  { id: 'w2', text: 'Aging infrastructure', priority: 'medium' },
  { id: 'w3', text: 'High employee turnover', priority: 'low' },
];

const opportunities: SWOTItem[] = [
  { id: 'o1', text: 'Emerging markets expansion', priority: 'high' },
  { id: 'o2', text: 'Strategic partnerships', priority: 'medium' },
  { id: 'o3', text: 'Digital transformation', priority: 'high' },
];

const threats: SWOTItem[] = [
  { id: 't1', text: 'Rising material costs', priority: 'high' },
  { id: 't2', text: 'New competitor entry', priority: 'medium' },
  { id: 't3', text: 'Regulatory changes', priority: 'low' },
  { id: 't4', text: 'Supply chain disruption', priority: 'high' },
];

const meta: Meta<typeof SWOTMatrix> = {
  title: 'Enterprise/SWOTMatrix',
  component: SWOTMatrix,
  tags: ['autodocs'],
  argTypes: {
    compact: { control: 'boolean' },
    title: { control: 'text' },
    access: {
      control: 'select',
      options: ['full', 'readonly', 'disabled', 'hidden'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem', maxWidth: 700 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof SWOTMatrix>;

export const Default: Story = {
  args: {
    strengths,
    weaknesses,
    opportunities,
    threats,
    title: 'Company SWOT Analysis',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="swot-matrix"]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const Compact: Story = {
  args: {
    strengths,
    weaknesses,
    opportunities,
    threats,
    title: 'Compact SWOT',
    compact: true,
  },
};

export const EmptyQuadrants: Story = {
  args: {
    strengths: [{ id: 's1', text: 'Only strength', priority: 'high' }],
    weaknesses: [],
    opportunities: [],
    threats: [{ id: 't1', text: 'Only threat', priority: 'low' }],
    title: 'Sparse Analysis',
  },
};
