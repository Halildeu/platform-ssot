import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GovernanceBoard } from './GovernanceBoard';
import type { GovernanceItem } from './GovernanceBoard';

const sampleItems: GovernanceItem[] = [
  { id: 'g1', title: 'Data Privacy Policy', domain: 'IT Governance', status: 'compliant', severity: 'high', owner: 'Ayse Demir', findingsCount: 0, nextReviewDate: new Date('2024-09-15') },
  { id: 'g2', title: 'Access Control', domain: 'IT Governance', status: 'non-compliant', severity: 'critical', owner: 'Mehmet Kaya', findingsCount: 5, nextReviewDate: new Date('2024-04-01') },
  { id: 'g3', title: 'Financial Reporting', domain: 'Finance', status: 'compliant', severity: 'medium', owner: 'Fatma Yilmaz', findingsCount: 1, nextReviewDate: new Date('2024-12-31') },
  { id: 'g4', title: 'Employee Onboarding', domain: 'HR', status: 'partially-compliant', severity: 'low', owner: 'Ali Ozturk', findingsCount: 3, nextReviewDate: new Date('2024-06-01') },
  { id: 'g5', title: 'Vendor Risk Management', domain: 'Procurement', status: 'not-assessed', severity: 'high', owner: 'Zeynep Aksoy', findingsCount: 0 },
  { id: 'g6', title: 'Business Continuity Plan', domain: 'IT Governance', status: 'partially-compliant', severity: 'critical', owner: 'Can Tekin', findingsCount: 8, nextReviewDate: new Date('2024-05-15') },
];

const meta: Meta<typeof GovernanceBoard> = {
  title: 'Enterprise/GovernanceBoard',
  component: GovernanceBoard,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof GovernanceBoard>;

export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

export const GroupedByDomain: Story = {
  args: {
    items: sampleItems,
    groupBy: 'domain',
  },
};

export const GroupedBySeverity: Story = {
  args: {
    items: sampleItems,
    groupBy: 'severity',
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const SingleItem: Story = {
  args: {
    items: [sampleItems[0]],
  },
};

export const GroupedByStatus: Story = {
  args: {
    items: sampleItems,
    groupBy: 'status',
  },
};
