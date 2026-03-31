import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Components/Primitives/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['line', 'circle', 'dashboard'] },
    status: { control: 'select', options: ['normal', 'active', 'success', 'exception'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    percent: { control: { type: 'range', min: 0, max: 100 } },
    showInfo: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem', maxWidth: 400 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = { args: { percent: 65 } };
export const Active: Story = { args: { percent: 45, status: 'active' } };
export const Success: Story = { args: { percent: 100, status: 'success' } };
export const Exception: Story = { args: { percent: 70, status: 'exception' } };

export const Circle: Story = {
  render: () => (
    <div className="flex gap-6">
      <Progress type="circle" percent={75} />
      <Progress type="circle" percent={100} status="success" />
      <Progress type="circle" percent={50} status="exception" />
    </div>
  ),
};

export const Dashboard: Story = {
  render: () => (
    <div className="flex gap-6">
      <Progress type="dashboard" percent={60} />
      <Progress type="dashboard" percent={85} size="lg" />
    </div>
  ),
};

export const Steps: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Progress percent={60} steps={5} />
      <Progress percent={40} steps={8} status="active" />
      <Progress percent={100} steps={3} status="success" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Progress percent={50} size="sm" />
      <Progress percent={50} size="md" />
      <Progress percent={50} size="lg" />
    </div>
  ),
};
