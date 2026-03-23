import type { Meta, StoryObj } from '@storybook/react';
import { EmptyStateBuilder } from './EmptyStateBuilder';

const meta: Meta<typeof EmptyStateBuilder> = {
  title: 'Enterprise/EmptyStateBuilder',
  component: EmptyStateBuilder,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof EmptyStateBuilder>;

export const NoData: Story = {
  args: {
    reason: 'no-data',
    primaryAction: { label: 'Create First Entry', onClick: () => {} },
  },
};

export const NoResults: Story = {
  args: {
    reason: 'no-results',
    title: 'No matching records',
    description: 'Try adjusting your search filters or keywords.',
  },
};

export const Error: Story = {
  args: {
    reason: 'error',
    primaryAction: { label: 'Retry', onClick: () => {}, variant: 'primary' },
    secondaryAction: { label: 'Go Back', onClick: () => {}, variant: 'secondary' },
    size: 'lg',
  },
};

export const FirstTime: Story = {
  args: {
    reason: 'first-time',
    primaryAction: { label: 'Get Started', onClick: () => {} },
    size: 'md',
  },
};

export const NoPermission: Story = {
  args: {
    reason: 'no-permission',
    size: 'sm',
  },
};
