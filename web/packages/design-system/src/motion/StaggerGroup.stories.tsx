import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StaggerGroup } from './StaggerGroup';

const CardItem = ({ label }: { label: string }) => (
  <div
    style={{
      padding: '16px 20px',
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    }}
  >
    {label}
  </div>
);

const meta: Meta<typeof StaggerGroup> = {
  title: 'Motion/StaggerGroup',
  component: StaggerGroup,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof StaggerGroup>;

export const Default: Story = {
  args: {
    staggerDelay: 50,
    duration: 200,
    children: [
      <CardItem key="1" label="Dashboard Overview" />,
      <CardItem key="2" label="Recent Activity" />,
      <CardItem key="3" label="Performance Metrics" />,
      <CardItem key="4" label="Team Updates" />,
      <CardItem key="5" label="Upcoming Deadlines" />,
    ],
  },
};

export const SlowStagger: Story = {
  args: {
    staggerDelay: 150,
    duration: 400,
    className: 'animate-in fade-in-0 slide-in-from-bottom-2',
    children: [
      <CardItem key="1" label="Step 1: Gather Requirements" />,
      <CardItem key="2" label="Step 2: Design Solution" />,
      <CardItem key="3" label="Step 3: Implement Changes" />,
      <CardItem key="4" label="Step 4: Test & Validate" />,
    ],
  },
};

export const FastStagger: Story = {
  args: {
    staggerDelay: 25,
    duration: 150,
    children: Array.from({ length: 8 }, (_, i) => (
      <CardItem key={i} label={`Item ${i + 1}`} />
    )),
  },
};

export const SingleItem: Story = {
  args: {
    staggerDelay: 50,
    duration: 200,
    children: [<CardItem key="1" label="Single Item" />],
  },
};

export const ManyItems: Story = {
  args: {
    staggerDelay: 30,
    duration: 150,
    children: Array.from({ length: 12 }, (_, i) => (
      <CardItem key={i} label={`Entry ${i + 1}`} />
    )),
  },
};

export const ZeroDelay: Story = {
  args: {
    staggerDelay: 0,
    duration: 200,
    children: [
      <CardItem key="1" label="Instant A" />,
      <CardItem key="2" label="Instant B" />,
      <CardItem key="3" label="Instant C" />,
    ],
  },
};
