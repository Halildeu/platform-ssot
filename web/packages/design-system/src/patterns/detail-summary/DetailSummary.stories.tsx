import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DetailSummary } from './DetailSummary';

const meta: Meta<typeof DetailSummary> = {
  title: 'Patterns/DetailSummary',
  component: DetailSummary,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof DetailSummary>;

export const Default: Story = {
  args: {
    title: 'Proje Detayi',
    description: 'Proje yonetim paneli ozet sayfasi.',
    entity: {
      title: 'Otonom Orkestrator',
      subtitle: 'Ana proje',
      items: [
        { key: 'owner', label: 'Sahip', value: 'Halil Kocoglu' },
        { key: 'status', label: 'Durum', value: 'Aktif', tone: 'success' as const },
        { key: 'created', label: 'Olusturulma', value: '15 Ocak 2024' },
      ],
      avatar: { name: 'HK' },
    },
    summaryItems: [
      { key: 'tasks', label: 'Gorevler', value: '48' },
      { key: 'completed', label: 'Tamamlanan', value: '36' },
      { key: 'coverage', label: 'Kapsam', value: '%75' },
    ],
    detailItems: [
      { key: 'framework', label: 'Framework', value: 'React + TypeScript' },
      { key: 'ci', label: 'CI/CD', value: 'GitHub Actions' },
    ],
  },
};
