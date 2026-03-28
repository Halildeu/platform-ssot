import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SummaryStrip } from './SummaryStrip';
import type { SummaryStripItem } from './SummaryStrip';

const meta: Meta<typeof SummaryStrip> = {
  title: 'Patterns/SummaryStrip',
  component: SummaryStrip,
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'select',
      options: [2, 3, 4],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof SummaryStrip>;

const items: SummaryStripItem[] = [
  { key: 'users', label: 'Toplam Kullanici', value: '1.234', trend: '+12%', tone: 'info' },
  { key: 'revenue', label: 'Gelir', value: '₺45.678', trend: '+8%', tone: 'success' },
  { key: 'orders', label: 'Siparis', value: '567', note: 'Bu ay' },
  { key: 'errors', label: 'Hata Orani', value: '%2.3', trend: '-5%', tone: 'warning' },
];

export const Default: Story = {
  args: {
    items,
    title: 'Ozet Metrikleri',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component], div, svg');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const ThreeColumns: Story = {
  args: {
    items: items.slice(0, 3),
    columns: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    items: items.slice(0, 2),
    columns: 2,
    title: 'KPI Ozeti',
    description: 'Son 30 gunluk ozet veriler.',
  },
};

export const WithDescription: Story = {
  args: {
    items,
    title: 'Performans Metrikleri',
    description: 'Sistem performans ozeti.',
  },
};

export const SingleItem: Story = {
  args: {
    items: [items[0]],
    columns: 1,
  },
};

export const FourColumns: Story = {
  args: {
    items,
    columns: 4,
    title: 'Dort Sutunlu',
  },
};
