import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';
import type { TabItem } from './Tabs';
import { Badge } from '../../primitives/badge/Badge';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['line', 'enclosed', 'pill'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

const temelSekmeler: TabItem[] = [
  {
    key: 'genel',
    label: 'Genel Bakis',
    content: (
      <div>
        <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>Genel Bakis</h3>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
          Sistemin genel durumu ve ozet istatistikleri bu sekmede goruntulenir.
        </p>
      </div>
    ),
  },
  {
    key: 'kullanicilar',
    label: 'Kullanicilar',
    content: (
      <div>
        <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>Kullanicilar</h3>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
          Toplam 1.234 aktif kullanici bulunmaktadir. Son 30 gunde 89 yeni kayit yapildi.
        </p>
      </div>
    ),
  },
  {
    key: 'raporlar',
    label: 'Raporlar',
    content: (
      <div>
        <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>Raporlar</h3>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
          Aylik performans raporlari ve analiz sonuclari burada listelenir.
        </p>
      </div>
    ),
  },
  {
    key: 'ayarlar',
    label: 'Ayarlar',
    content: (
      <div>
        <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>Ayarlar</h3>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
          Sistem yapilandirmasi ve tercihler bu sekmeden yonetilir.
        </p>
      </div>
    ),
  },
];

export const Line: Story = {
  args: {
    items: temelSekmeler,
    variant: 'line',
  },
  play: async ({ canvasElement }) => {
    const tab = canvasElement.querySelector('[role="tab"], button');
    if (tab) (tab as HTMLElement).click();
  },
};

export const Enclosed: Story = {
  args: {
    items: temelSekmeler,
    variant: 'enclosed',
  },
};

export const Pill: Story = {
  args: {
    items: temelSekmeler,
    variant: 'pill',
  },
};

export const WithDisabledTab: Story = {
  args: {
    items: [
      ...temelSekmeler.slice(0, 3),
      {
        key: 'premium',
        label: 'Premium',
        disabled: true,
        content: <div>Premium icerik</div>,
      },
    ],
    variant: 'line',
  },
};

export const WithBadges: Story = {
  args: {
    items: [
      {
        key: 'gelen',
        label: 'Gelen Kutusu',
        badge: <Badge variant="primary" size="sm">12</Badge>,
        content: <div>12 yeni mesajiniz var.</div>,
      },
      {
        key: 'gonderilen',
        label: 'Gonderilenler',
        content: <div>Gonderilmis mesajlar.</div>,
      },
      {
        key: 'taslaklar',
        label: 'Taslaklar',
        badge: <Badge variant="muted" size="sm">3</Badge>,
        content: <div>3 taslak mesajiniz var.</div>,
      },
    ],
    variant: 'line',
  },
};

export const FullWidth: Story = {
  args: {
    items: temelSekmeler.slice(0, 3),
    fullWidth: true,
    variant: 'line',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 600 }}>
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600 }}>Line</div>
        <Tabs items={temelSekmeler.slice(0, 3)} variant="line" />
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600 }}>Enclosed</div>
        <Tabs items={temelSekmeler.slice(0, 3)} variant="enclosed" />
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600 }}>Pill</div>
        <Tabs items={temelSekmeler.slice(0, 3)} variant="pill" />
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Tabs items={temelSekmeler.slice(0, 3)} size="sm" />
      <Tabs items={temelSekmeler.slice(0, 3)} size="md" />
      <Tabs items={temelSekmeler.slice(0, 3)} size="lg" />
    </div>
  ),
};
