import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NotificationItemCard } from './NotificationItemCard';
import type { NotificationSurfaceItem } from './NotificationItemCard';

const infoItem: NotificationSurfaceItem = {
  id: 'n1',
  message: 'System maintenance scheduled for tonight at 02:00 UTC.',
  description: 'All services will be temporarily unavailable during the maintenance window.',
  type: 'info',
  priority: 'normal',
  createdAt: Date.now() - 3_600_000,
  read: false,
};

const errorItem: NotificationSurfaceItem = {
  id: 'n2',
  message: 'Payment processing failed for invoice #8832.',
  description: 'The payment gateway returned a timeout error. Automatic retry is scheduled in 15 minutes.',
  type: 'error',
  priority: 'high',
  createdAt: Date.now() - 300_000,
  read: false,
  pinned: true,
};

const meta: Meta<typeof NotificationItemCard> = {
  title: 'Components/NotificationItemCard',
  component: NotificationItemCard,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof NotificationItemCard>;

export const Default: Story = {
  args: {
    item: infoItem,
  },
};

export const HighPriorityError: Story = {
  args: {
    item: errorItem,
    getPrimaryActionLabel: () => 'Retry Payment',
    onPrimaryAction: (item) => console.log('Action:', item.id),
    onRemove: (id) => console.log('Remove:', id),
  },
};

export const ReadNotification: Story = {
  args: {
    item: { ...infoItem, read: true, type: 'success', message: 'Deployment v2.14.0 completed successfully.' },
  },
};

export const WarningType: Story = {
  args: {
    item: { ...infoItem, type: 'warning', message: 'Disk usage approaching threshold.' },
  },
};

export const PinnedNotification: Story = {
  args: {
    item: { ...infoItem, pinned: true, message: 'Pinned notification item.' },
  },
};

export const LongDescription: Story = {
  args: {
    item: { ...infoItem, description: 'This is a much longer description that provides additional context about the notification event and its implications for the system.' },
  },
};
