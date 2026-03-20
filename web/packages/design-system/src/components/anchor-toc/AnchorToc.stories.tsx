import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AnchorToc } from './AnchorToc';
import type { AnchorTocItem } from './AnchorToc';

const meta: Meta<typeof AnchorToc> = {
  title: 'Components/Navigation/AnchorToc',
  component: AnchorToc,
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
type Story = StoryObj<typeof AnchorToc>;

const items: AnchorTocItem[] = [
  { id: 'giris', label: 'Giris', level: 1 },
  { id: 'genel-bakis', label: 'Genel Bakis', level: 1 },
  { id: 'kurulum', label: 'Kurulum', level: 2 },
  { id: 'yapilandirma', label: 'Yapilandirma', level: 2 },
  { id: 'api-referansi', label: 'API Referansi', level: 1 },
  { id: 'ornekler', label: 'Ornekler', level: 2 },
  { id: 'sss', label: 'Sikca Sorulan Sorular', level: 1 },
];

export const Default: Story = {
  args: {
    items,
    title: 'Icerik',
    syncWithHash: false,
  },
};

export const Compact: Story = {
  args: {
    items,
    density: 'compact',
    syncWithHash: false,
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      ...items.slice(0, 4),
      { id: 'premium', label: 'Premium Icerik', level: 1, disabled: true },
      ...items.slice(4),
    ],
    syncWithHash: false,
  },
};

export const WithMeta: Story = {
  args: {
    items: items.map((item, i) => ({
      ...item,
      meta: <span style={{ fontSize: 10, opacity: 0.6 }}>{i + 1}</span>,
    })),
    syncWithHash: false,
  },
};
