import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConfidenceBadge } from './ConfidenceBadge';

const meta: Meta<typeof ConfidenceBadge> = {
  title: 'Components/AI/ConfidenceBadge',
  component: ConfidenceBadge,
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: ['low', 'medium', 'high', 'very-high'],
    },
    compact: { control: 'boolean' },
    showScore: { control: 'boolean' },
    score: { control: 'number' },
    sourceCount: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<typeof ConfidenceBadge>;

export const Default: Story = {
  args: {
    level: 'medium',
    score: 72,
  },
};

export const HighConfidence: Story = {
  args: {
    level: 'high',
    score: 95,
    sourceCount: 8,
  },
};

export const LowConfidence: Story = {
  args: {
    level: 'low',
    score: 30,
    sourceCount: 2,
  },
};

export const Compact: Story = {
  args: {
    level: 'very-high',
    score: 98,
    compact: true,
  },
};

export const AllLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <ConfidenceBadge level="low" score={25} sourceCount={1} />
      <ConfidenceBadge level="medium" score={55} sourceCount={4} />
      <ConfidenceBadge level="high" score={85} sourceCount={8} />
      <ConfidenceBadge level="very-high" score={98} sourceCount={15} />
    </div>
  ),
};
