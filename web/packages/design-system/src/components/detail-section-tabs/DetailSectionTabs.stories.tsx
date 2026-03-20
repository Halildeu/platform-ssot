import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DetailSectionTabs } from './DetailSectionTabs';

const meta: Meta<typeof DetailSectionTabs> = {
  title: 'Components/Navigation/DetailSectionTabs',
  component: DetailSectionTabs,
  tags: ['autodocs'],
  argTypes: {
    density: {
      control: 'select',
      options: ['comfortable', 'compact'],
    },
    sticky: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof DetailSectionTabs>;

const tabs = [
  { id: 'overview', label: 'Genel Bakis' },
  { id: 'details', label: 'Detaylar', description: 'Ek bilgi' },
  { id: 'history', label: 'Gecmis' },
  { id: 'settings', label: 'Ayarlar' },
];

export const Default: Story = {
  args: {
    tabs,
    activeTabId: 'overview',
    onTabChange: () => {},
  },
};

export const WithBadges: Story = {
  args: {
    tabs: [
      { id: 'tasks', label: 'Gorevler', badge: <span>12</span> },
      { id: 'comments', label: 'Yorumlar', badge: <span>3</span> },
      { id: 'files', label: 'Dosyalar' },
    ],
    activeTabId: 'tasks',
    onTabChange: () => {},
  },
};

export const WithDisabled: Story = {
  args: {
    tabs: [
      ...tabs.slice(0, 3),
      { id: 'premium', label: 'Premium', disabled: true },
    ],
    activeTabId: 'overview',
    onTabChange: () => {},
  },
};
