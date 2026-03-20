import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NotificationDrawer } from './NotificationDrawer';

const meta: Meta<typeof NotificationDrawer> = {
  title: 'Components/Overlay/NotificationDrawer',
  component: NotificationDrawer,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof NotificationDrawer>;

const sampleItems = [
  { key: '1', title: 'Yeni yorum', description: 'Ali bir yorum birakti.', timestamp: '5 dk once', read: false },
  { key: '2', title: 'Gorev tamamlandi', description: 'Sprint gorevleri tamamlandi.', timestamp: '1 saat once', read: false },
  { key: '3', title: 'Sistem guncelleme', description: 'v2.1 surumu yayinlandi.', timestamp: 'Dun', read: true },
];

export const Default: Story = {
  args: {
    open: true,
    items: sampleItems,
    title: 'Bildirimler',
    disablePortal: true,
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = {
  args: {
    open: true,
    items: [],
    disablePortal: true,
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};
