import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { List } from './List';
import type { ListItem } from './List';

const meta: Meta<typeof List> = {
  title: 'Components/Data/List',
  component: List,
  tags: ['autodocs'],
  argTypes: {
    density: {
      control: 'select',
      options: ['comfortable', 'compact'],
    },
    bordered: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof List>;

const items: ListItem[] = [
  { key: '1', title: 'Sistem Guncelleme', description: 'Yeni surum yuklemesi tamamlandi.', tone: 'success' },
  { key: '2', title: 'Guvenlik Uyarisi', description: 'Basarisiz giris denemesi tespit edildi.', tone: 'warning' },
  { key: '3', title: 'Veritabani Bakim', description: 'Planlanan bakim calismasi 22:00-23:00.', tone: 'info' },
  { key: '4', title: 'API Rate Limit', description: 'Istek limiti asimi.', tone: 'danger' },
];

export const Default: Story = {
  args: {
    items,
    title: 'Bildirimler',
  },
};

export const Compact: Story = {
  args: {
    items,
    density: 'compact',
    title: 'Sikisik Liste',
  },
};

export const WithSelection: Story = {
  args: {
    items,
    selectedKey: '2',
  },
};

export const Loading: Story = {
  args: {
    items: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    emptyStateLabel: 'Henuz kayit bulunmuyor.',
  },
};

export const Bordered: Story = {
  args: {
    items,
    bordered: true,
    title: 'Cerceveli Liste',
  },
};
