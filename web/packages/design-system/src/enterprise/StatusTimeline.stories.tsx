import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StatusTimeline } from './StatusTimeline';
import type { StatusTimelineEvent } from './StatusTimeline';

const orderEvents: StatusTimelineEvent[] = [
  { id: 'e1', status: 'created', timestamp: '2024-03-10T09:00:00Z', actor: 'System', description: 'Order #1042 created' },
  { id: 'e2', status: 'pending', timestamp: '2024-03-10T09:15:00Z', actor: 'System', description: 'Awaiting payment confirmation' },
  { id: 'e3', status: 'in-progress', timestamp: '2024-03-10T10:30:00Z', actor: 'Ayse Demir', description: 'Payment received, processing started' },
  { id: 'e4', status: 'in-review', timestamp: '2024-03-11T14:00:00Z', actor: 'Mehmet Kaya', description: 'Quality review in progress' },
  { id: 'e5', status: 'approved', timestamp: '2024-03-11T16:45:00Z', actor: 'Fatma Yilmaz', description: 'Order approved for shipment' },
  { id: 'e6', status: 'completed', timestamp: '2024-03-12T11:00:00Z', actor: 'System', description: 'Order delivered successfully' },
];

const meta: Meta<typeof StatusTimeline> = {
  title: 'Enterprise/StatusTimeline',
  component: StatusTimeline,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof StatusTimeline>;

export const Default: Story = {
  args: {
    events: orderEvents,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component], div, svg');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const Horizontal: Story = {
  args: {
    events: orderEvents,
    orientation: 'horizontal',
  },
};

export const Compact: Story = {
  args: {
    events: orderEvents,
    compact: true,
  },
};

export const WithRejection: Story = {
  args: {
    events: [
      ...orderEvents.slice(0, 4),
      { id: 'e-rej', status: 'rejected', timestamp: '2024-03-11T17:00:00Z', actor: 'Ali Ozturk', description: 'Order rejected due to stock unavailability' },
    ],
    statusColors: {
      created: 'var(--action-primary)',
      pending: 'var(--state-warning-text)',
      'in-progress': 'var(--action-primary)',
      'in-review': 'var(--action-primary)',
      rejected: 'var(--state-danger-text)',
    },
  },
};

export const SingleEvent: Story = {
  args: {
    events: [orderEvents[0]],
  },
};

export const AllCompleted: Story = {
  args: {
    events: orderEvents.map((e) => ({ ...e, status: 'completed' })),
  },
};
