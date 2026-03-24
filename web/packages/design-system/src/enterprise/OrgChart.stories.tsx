import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OrgChart } from './OrgChart';

const meta: Meta<typeof OrgChart> = {
  title: 'Enterprise/OrgChart',
  component: OrgChart,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'radio', options: ['vertical', 'horizontal'] },
    compact: { control: 'boolean' },
    access: { control: 'radio', options: ['full', 'readonly', 'disabled', 'hidden'] },
  },
  decorators: [(Story) => <div style={{ padding: '1rem', overflow: 'auto' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof OrgChart>;

const sampleData = {
  id: 'ceo',
  label: 'Jane Doe',
  title: 'CEO',
  children: [
    {
      id: 'cto',
      label: 'John Smith',
      title: 'CTO',
      children: [
        { id: 'dev-lead', label: 'Alice Brown', title: 'Dev Lead' },
        { id: 'qa-lead', label: 'Bob White', title: 'QA Lead' },
      ],
    },
    {
      id: 'cfo',
      label: 'Carol Green',
      title: 'CFO',
      children: [
        { id: 'accounting', label: 'Dave Black', title: 'Accounting Mgr' },
      ],
    },
    {
      id: 'coo',
      label: 'Eve Gray',
      title: 'COO',
    },
  ],
};

export const Default: Story = {
  args: {
    data: sampleData,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-testid="org-chart"]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const HighlightedPath: Story = {
  args: {
    data: sampleData,
    highlightPath: ['ceo', 'cto', 'dev-lead'],
  },
};

export const CompactMode: Story = {
  args: {
    data: sampleData,
    compact: true,
    nodeWidth: 140,
    nodeHeight: 60,
  },
};
