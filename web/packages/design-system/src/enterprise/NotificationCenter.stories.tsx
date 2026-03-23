import type { Meta, StoryObj } from '@storybook/react';
import { NotificationCenter } from './NotificationCenter';
import type { NotificationItem } from './NotificationCenter';

const sampleNotifications: NotificationItem[] = [
  { id: 'n1', type: 'action', title: 'Approval Required', message: 'Purchase order #4521 requires your approval.', timestamp: new Date(Date.now() - 300_000).toISOString(), actionLabel: 'Review', actionPayload: { orderId: 4521 } },
  { id: 'n2', type: 'success', title: 'Deploy Completed', message: 'Production deployment v2.14.0 completed successfully.', timestamp: new Date(Date.now() - 3_600_000).toISOString(), read: true },
  { id: 'n3', type: 'warning', title: 'Disk Usage High', message: 'Server db-primary disk usage at 87%.', timestamp: new Date(Date.now() - 7_200_000).toISOString() },
  { id: 'n4', type: 'error', title: 'Payment Failed', message: 'Invoice #8832 payment processing failed. Retry scheduled.', timestamp: new Date(Date.now() - 86_400_000).toISOString() },
  { id: 'n5', type: 'info', title: 'Scheduled Maintenance', message: 'System maintenance planned for Sunday 02:00-04:00.', timestamp: new Date(Date.now() - 172_800_000).toISOString(), read: true },
  { id: 'n6', type: 'action', title: 'Review Report', message: 'Monthly financial report is ready for review.', timestamp: new Date(Date.now() - 259_200_000).toISOString(), actionLabel: 'Open Report' },
];

const meta: Meta<typeof NotificationCenter> = {
  title: 'Enterprise/NotificationCenter',
  component: NotificationCenter,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof NotificationCenter>;

export const Default: Story = {
  args: {
    notifications: sampleNotifications,
  },
};

export const GroupedByType: Story = {
  args: {
    notifications: sampleNotifications,
    groupByType: true,
    title: 'Notifications',
  },
};

export const LimitedVisible: Story = {
  args: {
    notifications: sampleNotifications,
    maxVisible: 3,
    title: 'Recent Alerts',
  },
};
