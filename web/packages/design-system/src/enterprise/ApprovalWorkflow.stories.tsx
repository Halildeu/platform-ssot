import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ApprovalWorkflow } from './ApprovalWorkflow';
import type { ApprovalStep } from './ApprovalWorkflow';

const sampleSteps: ApprovalStep[] = [
  { id: '1', label: 'Department Review', status: 'approved', assignee: { id: 'u1', name: 'Ayse Demir', initials: 'AD' }, timestamp: '2024-03-10 09:30' },
  { id: '2', label: 'Finance Check', status: 'approved', assignee: { id: 'u2', name: 'Mehmet Kaya', initials: 'MK' }, timestamp: '2024-03-11 14:20' },
  { id: '3', label: 'Legal Review', status: 'in-review', assignee: { id: 'u3', name: 'Fatma Yilmaz', initials: 'FY' } },
  { id: '4', label: 'Executive Approval', status: 'pending', assignee: { id: 'u4', name: 'Ali Ozturk', initials: 'AO' } },
];

const meta: Meta<typeof ApprovalWorkflow> = {
  title: 'Enterprise/ApprovalWorkflow',
  component: ApprovalWorkflow,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof ApprovalWorkflow>;

export const Default: Story = {
  args: {
    steps: sampleSteps,
  },
};

export const Vertical: Story = {
  args: {
    steps: sampleSteps,
    orientation: 'vertical',
  },
};

export const AllApproved: Story = {
  args: {
    steps: sampleSteps.map((s) => ({
      ...s,
      status: 'approved' as const,
      timestamp: '2024-03-12 10:00',
    })),
  },
};

export const WithRejection: Story = {
  args: {
    steps: [
      { ...sampleSteps[0], status: 'approved' as const },
      { ...sampleSteps[1], status: 'rejected' as const, comment: 'Budget exceeds quarterly allocation.' },
      { ...sampleSteps[2], status: 'skipped' as const },
      { ...sampleSteps[3], status: 'pending' as const },
    ],
  },
};

export const SingleStep: Story = {
  args: {
    steps: [sampleSteps[0]],
  },
};

export const AllPending: Story = {
  args: {
    steps: sampleSteps.map((s) => ({ ...s, status: 'pending' as const, timestamp: undefined })),
  },
};
