import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DetailDrawer } from './DetailDrawer';

const meta: Meta<typeof DetailDrawer> = {
  title: 'Patterns/DetailDrawer',
  component: DetailDrawer,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['md', 'lg', 'xl', 'full'],
    },
    closeOnBackdrop: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof DetailDrawer>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Kayit Detayi',
    subtitle: 'ID: 12345',
    sections: [
      { key: 'info', title: 'Genel Bilgi', content: <p style={{ fontSize: 14 }}>Kayit hakkinda genel bilgiler burada gorunur.</p> },
      { key: 'history', title: 'Gecmis', content: <p style={{ fontSize: 14 }}>Degisiklik gecmisi bu bolumde listelenir.</p> },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithFooter: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Belge Detayi',
    children: <p style={{ fontSize: 14, padding: 16 }}>Belge icerigi burada gorunur.</p>,
    footer: (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 16px' }}>
        <button style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid var(--border-default)', fontSize: 13 }}>Kapat</button>
      </div>
    ),
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};
