import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EntitySummaryBlock } from './EntitySummaryBlock';
import { Badge } from '../../primitives/badge/Badge';
import { Button } from '../../primitives/button/Button';

const meta: Meta<typeof EntitySummaryBlock> = {
  title: 'Patterns/EntitySummaryBlock',
  component: EntitySummaryBlock,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof EntitySummaryBlock>;

export const Default: Story = {
  args: {
    title: 'Halil Kocoglu',
    subtitle: 'Kidemli Yazilim Muhendisi',
    avatar: { name: 'HK' },
    items: [
      { key: 'email', label: 'E-posta', value: 'halil@example.com' },
      { key: 'team', label: 'Takim', value: 'Platform' },
      { key: 'location', label: 'Konum', value: 'Istanbul' },
    ],
  },
};

export const WithBadgeAndActions: Story = {
  args: {
    title: 'API Servisi',
    subtitle: 'v2.3.1',
    badge: <Badge variant="success">Canli</Badge>,
    avatar: { name: 'AP' },
    actions: (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" size="sm">Duzenle</Button>
        <Button variant="primary" size="sm">Detay</Button>
      </div>
    ),
    items: [
      { key: 'uptime', label: 'Uptime', value: '%99.9', tone: 'success' as const },
      { key: 'requests', label: 'Istek/dk', value: '1.234' },
      { key: 'errors', label: 'Hata Orani', value: '%0.1', tone: 'success' as const },
    ],
  },
};

export const WithImage: Story = {
  args: {
    title: 'Proje Alpha',
    subtitle: 'Aktif gelistirme',
    avatar: { src: 'https://i.pravatar.cc/150?u=entity', alt: 'Proje' },
    items: [
      { key: 'members', label: 'Uyeler', value: '12' },
      { key: 'sprint', label: 'Sprint', value: '#24' },
    ],
  },
};
