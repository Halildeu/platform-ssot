import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TrainingTracker } from './TrainingTracker';
import type { TrainingItem } from './TrainingTracker';

const sampleItems: TrainingItem[] = [
  { id: 't1', title: 'Information Security Awareness', category: 'Compliance', status: 'completed', progress: 100, dueDate: new Date('2024-06-01'), assignee: 'Ayse Demir', mandatory: true },
  { id: 't2', title: 'Anti-Money Laundering', category: 'Compliance', status: 'in-progress', progress: 65, dueDate: new Date('2024-07-15'), assignee: 'Mehmet Kaya', mandatory: true },
  { id: 't3', title: 'Leadership Essentials', category: 'Professional', status: 'not-started', progress: 0, dueDate: new Date('2024-08-01'), assignee: 'Fatma Yilmaz' },
  { id: 't4', title: 'Fire Safety', category: 'Health & Safety', status: 'expired', progress: 40, dueDate: new Date('2024-01-15'), assignee: 'Ali Ozturk', mandatory: true },
  { id: 't5', title: 'GDPR Data Handling', category: 'Compliance', status: 'overdue', progress: 20, dueDate: new Date('2024-03-01'), assignee: 'Zeynep Aksoy', mandatory: true },
  { id: 't6', title: 'Agile Methodology', category: 'Professional', status: 'completed', progress: 100, assignee: 'Mehmet Kaya' },
];

const meta: Meta<typeof TrainingTracker> = {
  title: 'Enterprise/TrainingTracker',
  component: TrainingTracker,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof TrainingTracker>;

export const Default: Story = {
  args: {
    items: sampleItems,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component], div, svg');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const GroupedByCategory: Story = {
  args: {
    items: sampleItems,
    groupBy: 'category',
  },
};

export const FilteredOverdue: Story = {
  args: {
    items: sampleItems,
    filterStatuses: ['overdue', 'expired'],
    groupBy: 'status',
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const AllCompleted: Story = {
  args: {
    items: sampleItems.map((item) => ({ ...item, status: 'completed' as const, progress: 100 })),
  },
};

export const MandatoryOnly: Story = {
  args: {
    items: sampleItems.filter((item) => item.mandatory),
    groupBy: 'status',
  },
};
