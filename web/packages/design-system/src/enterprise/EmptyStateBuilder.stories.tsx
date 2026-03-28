import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyStateBuilder } from './EmptyStateBuilder';

const meta: Meta<typeof EmptyStateBuilder> = {
  title: 'Enterprise/EmptyStateBuilder',
  component: EmptyStateBuilder,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof EmptyStateBuilder>;

export const NoData: Story = {
  args: {
    reason: 'no-data',
    primaryAction: { label: 'Create First Entry', onClick: () => {} },
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button, [role="button"], input, a, [tabindex]');
    if (el) (el as HTMLElement).click();
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

export const Maintenance: Story = {
  args: {
    reason: 'maintenance' as any,
    title: 'Under maintenance',
    description: 'This feature is temporarily unavailable.',
    size: 'md',
  },
};
