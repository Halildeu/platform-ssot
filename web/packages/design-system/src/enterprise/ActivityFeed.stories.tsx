import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ActivityFeed } from './ActivityFeed';
import type { ActivityItem } from './ActivityFeed';

const now = Date.now();

const sampleItems: ActivityItem[] = [
  { id: '1', type: 'create', actor: { name: 'Ali Yilmaz' }, description: 'yeni rapor olusturdu', target: 'Q1 Performans Raporu', timestamp: new Date(now - 600000).toISOString() },
  { id: '2', type: 'comment', actor: { name: 'Zeynep Kaya' }, description: 'yorum ekledi', target: 'Q1 Performans Raporu', timestamp: new Date(now - 3600000).toISOString() },
  { id: '3', type: 'approve', actor: { name: 'Mehmet Demir' }, description: 'onayladi', target: 'Butce Talebi #142', timestamp: new Date(now - 7200000).toISOString() },
  { id: '4', type: 'assign', actor: { name: 'Ayse Celik' }, description: 'gorevi atadi', target: 'Veri Temizleme', timestamp: new Date(now - 86400000).toISOString() },
  { id: '5', type: 'delete', actor: { name: 'Can Ozturk' }, description: 'tasagi sildi', target: 'Eski Draft', timestamp: new Date(now - 86400000 * 2).toISOString() },
  { id: '6', type: 'complete', actor: { name: 'Ali Yilmaz' }, description: 'tamamladi', target: 'Sprint #14', timestamp: new Date(now - 86400000 * 3).toISOString() },
  { id: '7', type: 'alert', actor: { name: 'Sistem' }, description: 'uyari: disk alani %90', timestamp: new Date(now - 86400000 * 3).toISOString() },
  { id: '8', type: 'update', actor: { name: 'Zeynep Kaya' }, description: 'guncelledi', target: 'Dashboard Layout', timestamp: new Date(now - 86400000 * 5).toISOString() },
];

const meta: Meta<typeof ActivityFeed> = {
  title: 'Enterprise/ActivityFeed',
  component: ActivityFeed,
  tags: ['autodocs'],
  argTypes: {
    maxVisible: { control: { type: 'number', min: 1, max: 20 } },
    groupByDate: { control: 'boolean' },
    showLoadMore: { control: 'boolean' },
    access: {
      control: 'select',
      options: ['full', 'readonly', 'disabled', 'hidden'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem', maxWidth: 560 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof ActivityFeed>;

export const Default: Story = {
  args: {
    items: sampleItems,
    groupByDate: false,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="activity-feed"]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const GroupedByDate: Story = {
  args: {
    items: sampleItems,
    groupByDate: true,
  },
};

export const WithPagination: Story = {
  args: {
    items: sampleItems,
    maxVisible: 3,
    showLoadMore: true,
  },
};
