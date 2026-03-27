import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DecisionMatrix } from './DecisionMatrix';

const options = [
  { id: 'a', name: 'Solution A' },
  { id: 'b', name: 'Solution B' },
  { id: 'c', name: 'Solution C' },
];

const criteria = [
  { id: 'cost', name: 'Cost Effectiveness', weight: 30 },
  { id: 'quality', name: 'Quality', weight: 25 },
  { id: 'speed', name: 'Implementation Speed', weight: 20 },
  { id: 'risk', name: 'Risk Level', weight: 15 },
  { id: 'support', name: 'Vendor Support', weight: 10 },
];

const scores = [
  { optionId: 'a', criterionId: 'cost', score: 8 },
  { optionId: 'a', criterionId: 'quality', score: 6 },
  { optionId: 'a', criterionId: 'speed', score: 9 },
  { optionId: 'a', criterionId: 'risk', score: 5 },
  { optionId: 'a', criterionId: 'support', score: 7 },
  { optionId: 'b', criterionId: 'cost', score: 5 },
  { optionId: 'b', criterionId: 'quality', score: 9 },
  { optionId: 'b', criterionId: 'speed', score: 4 },
  { optionId: 'b', criterionId: 'risk', score: 8 },
  { optionId: 'b', criterionId: 'support', score: 9 },
  { optionId: 'c', criterionId: 'cost', score: 7 },
  { optionId: 'c', criterionId: 'quality', score: 7 },
  { optionId: 'c', criterionId: 'speed', score: 6 },
  { optionId: 'c', criterionId: 'risk', score: 7 },
  { optionId: 'c', criterionId: 'support', score: 6 },
];

const meta: Meta<typeof DecisionMatrix> = {
  title: 'Enterprise/DecisionMatrix',
  component: DecisionMatrix,
  tags: ['autodocs'],
  argTypes: {
    maxScore: { control: { type: 'number', min: 1, max: 100 } },
    showWeightedTotals: { control: 'boolean' },
    highlightWinner: { control: 'boolean' },
    access: {
      control: 'select',
      options: ['full', 'readonly', 'disabled', 'hidden'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof DecisionMatrix>;

export const Default: Story = {
  args: {
    options,
    criteria,
    scores,
    showWeightedTotals: true,
    highlightWinner: true,
    maxScore: 10,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="decision-matrix"]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const WithoutTotals: Story = {
  args: {
    options: options.slice(0, 2),
    criteria: criteria.slice(0, 3),
    scores: scores.filter(
      (s) => ['a', 'b'].includes(s.optionId) && ['cost', 'quality', 'speed'].includes(s.criterionId),
    ),
    showWeightedTotals: false,
    highlightWinner: false,
  },
};

export const Readonly: Story = {
  args: {
    ...Default.args,
    access: 'readonly' as const,
  },
};
