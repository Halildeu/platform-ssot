import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Primitives/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    circle: { control: 'boolean' },
    lines: { control: 'number' },
    animated: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {},
};

export const CustomSize: Story = {
  args: {
    width: 200,
    height: 24,
  },
};

export const Circle: Story = {
  args: {
    circle: true,
    height: 48,
  },
};

export const MultiLine: Story = {
  args: {
    lines: 4,
    height: 14,
  },
};

export const NotAnimated: Story = {
  args: {
    animated: false,
    width: 200,
    height: 20,
  },
};

export const CardSkeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Skeleton circle height={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <Skeleton height={120} />
      <Skeleton lines={3} height={12} />
    </div>
  ),
};
