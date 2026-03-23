import type { Meta, StoryObj } from '@storybook/react';
import { NotificationPanel } from './NotificationPanel';
import type { NotificationSurfaceItem } from './NotificationItemCard';

const sampleItems: NotificationSurfaceItem[] = [
  { id: 'n1', message: 'Deployment v2.14.0 completed', type: 'success', priority: 'normal', createdAt: Date.now() - 600_000, read: false },
  { id: 'n2', message: 'Payment failed for invoice #8832', description: 'Retry scheduled in 15 minutes.', type: 'error', priority: 'high', createdAt: Date.now() - 1_800_000, read: false, pinned: true },
  { id: 'n3', message: 'Scheduled maintenance tonight', type: 'info', priority: 'normal', createdAt: Date.now() - 3_600_000, read: true },
  { id: 'n4', message: 'Disk usage at 87% on db-primary', type: 'warning', priority: 'high', createdAt: Date.now() - 86_400_000, read: false },
  { id: 'n5', message: 'New team member joined', description: 'Zeynep Aksoy has joined the Engineering team.', type: 'info', priority: 'normal', createdAt: Date.now() - 172_800_000, read: true },
];

const meta: Meta<typeof NotificationPanel> = {
  title: 'Components/NotificationPanel',
  component: NotificationPanel,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof NotificationPanel>;

export const Default: Story = {
  args: {
    items: sampleItems,
    title: 'Notifications',
  },
};

export const WithActions: Story = {
  args: {
    items: sampleItems,
    title: 'Notifications',
    onMarkAllRead: () => console.log('Mark all read'),
    onClear: () => console.log('Clear all'),
    onRemoveItem: (id) => console.log('Remove:', id),
    markAllReadLabel: 'Mark all as read',
    clearLabel: 'Clear all',
  },
};

export const Empty: Story = {
  args: {
    items: [],
    title: 'Notifications',
    emptyTitle: 'All caught up!',
    emptyDescription: 'No new notifications at this time.',
  },
};
