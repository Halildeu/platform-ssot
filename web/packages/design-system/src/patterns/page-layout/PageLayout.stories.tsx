import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PageLayout } from './PageLayout';

const meta: Meta<typeof PageLayout> = {
  title: 'Patterns/PageLayout',
  component: PageLayout,
  tags: ['autodocs'],
  argTypes: {
    pageWidth: {
      control: 'select',
      options: ['default', 'wide', 'full'],
    },
    stickyHeader: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof PageLayout>;

export const Default: Story = {
  args: {
    title: 'Projeler',
    description: 'Tum projelerinizi buradan yonetin.',
    breadcrumbItems: [
      { title: 'Ana Sayfa', path: '/' },
      { title: 'Projeler', current: true },
    ],
    children: (
      <div style={{ padding: 24, fontSize: 14 }}>
        <p>Sayfa icerigi burada gorunur.</p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ height: 500, border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'auto' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithFooter: Story = {
  args: {
    title: 'Ayarlar',
    children: <div style={{ padding: 24, fontSize: 14 }}>Icerik</div>,
    footer: <div style={{ padding: '12px 24px', fontSize: 13, textAlign: 'center', color: 'var(--text-secondary)' }}>Footer alani</div>,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'auto' }}>
        <Story />
      </div>
    ),
  ],
};

export const FullWidth: Story = {
  args: {
    title: 'Genis Sayfa',
    pageWidth: 'full',
    children: <div style={{ padding: 24, fontSize: 14 }}>Tam genislik icerik</div>,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'auto' }}>
        <Story />
      </div>
    ),
  ],
};

export const WideLayout: Story = {
  args: {
    title: 'Genis Sayfa',
    pageWidth: 'wide',
    children: <div style={{ padding: 24, fontSize: 14 }}>Genis icerik</div>,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'auto' }}>
        <Story />
      </div>
    ),
  ],
};

export const StickyHeader: Story = {
  args: {
    title: 'Yapiskan Baslik',
    stickyHeader: true,
    children: <div style={{ padding: 24, fontSize: 14, height: 800 }}>Uzun icerik alani</div>,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'auto' }}>
        <Story />
      </div>
    ),
  ],
};

export const MinimalContent: Story = {
  args: {
    title: 'Minimal',
    children: <div style={{ padding: 24, fontSize: 14 }}>Basit icerik</div>,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 300, border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'auto' }}>
        <Story />
      </div>
    ),
  ],
};
