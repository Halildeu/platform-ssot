import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    maxItems: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Ana Sayfa', href: '#' },
      { label: 'Projeler', href: '#' },
      { label: 'Proje Detayi' },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        label: 'Ana Sayfa',
        href: '#',
        icon: (
          <svg viewBox="0 0 16 16" fill="currentColor" style={{ width: 14, height: 14 }}>
            <path d="M8 1L1 7h2v6h4V9h2v4h4V7h2L8 1z" />
          </svg>
        ),
      },
      { label: 'Ayarlar', href: '#' },
      { label: 'Profil' },
    ],
  },
};

export const Collapsed: Story = {
  args: {
    items: [
      { label: 'Ana Sayfa', href: '#' },
      { label: 'Projeler', href: '#' },
      { label: 'Aktif Proje', href: '#' },
      { label: 'Gorevler', href: '#' },
      { label: 'Gorev Detayi' },
    ],
    maxItems: 3,
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Ana Sayfa' }],
  },
};

export const TwoItems: Story = {
  args: {
    items: [
      { label: 'Ana Sayfa', href: '#' },
      { label: 'Detay' },
    ],
  },
};

export const ManyItems: Story = {
  args: {
    items: Array.from({ length: 7 }, (_, i) => ({
      label: \`Level \${i + 1}\`,
      href: i < 6 ? '#' : undefined,
    })),
    maxItems: 4,
  },
};
