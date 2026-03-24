import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './Timeline';
import type { TimelineItemProps } from './Timeline';
import { Badge } from '../../primitives/badge/Badge';

const meta: Meta<typeof Timeline> = {
  title: 'Components/DataDisplay/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['left', 'right', 'alternate'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    reverse: { control: 'boolean' },
    showConnector: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Timeline>;

const surecAdımlari: TimelineItemProps[] = [
  {
    key: '1',
    children: 'Basvuru formu dolduruldu ve sisteme yuklendi.',
    color: 'success',
    label: '10:30',
    meta: '15 Ocak 2024',
  },
  {
    key: '2',
    children: 'Belgeler incelemeye alindi. Eksik evrak tespiti yapildi.',
    color: 'warning',
    label: '14:15',
    meta: '16 Ocak 2024',
  },
  {
    key: '3',
    children: 'Eksik belgeler tamamlandi ve yeniden gonderildi.',
    color: 'primary',
    label: '09:00',
    meta: '18 Ocak 2024',
  },
  {
    key: '4',
    children: 'Denetim ekibi tarafindan onaylandi.',
    color: 'success',
    label: '16:45',
    meta: '20 Ocak 2024',
  },
];

export const Default: Story = {
  args: {
    items: surecAdımlari,
    mode: 'left',
  },
};

export const AlternateMode: Story = {
  args: {
    items: surecAdımlari,
    mode: 'alternate',
  },
};

export const RightMode: Story = {
  args: {
    items: surecAdımlari,
    mode: 'right',
  },
};

export const WithColors: Story = {
  args: {
    items: [
      { key: '1', children: 'Sistem baslatildi', color: 'info' as const, meta: '08:00' },
      { key: '2', children: 'Kullanici giris yapti', color: 'primary' as const, meta: '08:15' },
      { key: '3', children: 'Islem tamamlandi', color: 'success' as const, meta: '09:30' },
      { key: '4', children: 'Uyari: Disk alani azaliyor', color: 'warning' as const, meta: '11:45' },
      { key: '5', children: 'Hata: Baglanti zaman asimi', color: 'danger' as const, meta: '14:20' },
      { key: '6', children: 'Bakim modu aktif', color: 'default' as const, meta: '16:00' },
    ],
    mode: 'left',
  },
};

export const WithCustomDots: Story = {
  args: {
    items: [
      {
        key: '1',
        children: 'Tasarim tamamlandi',
        dot: (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        color: 'success' as const,
      },
      {
        key: '2',
        children: 'Gelistirme devam ediyor',
        dot: (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="8" r="3" />
          </svg>
        ),
        color: 'primary' as const,
      },
      {
        key: '3',
        children: 'Test asamasi bekleniyor',
        dot: (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 4v4M8 11h.01" strokeLinecap="round" />
          </svg>
        ),
        color: 'warning' as const,
      },
    ],
  },
};

export const WithPending: Story = {
  args: {
    items: surecAdımlari.slice(0, 3),
    pending: 'Son islem devam ediyor...',
    mode: 'left',
  },
};

export const SmallSize: Story = {
  args: {
    items: surecAdımlari,
    size: 'sm',
    mode: 'left',
  },
};

export const Reversed: Story = {
  args: {
    items: surecAdımlari,
    reverse: true,
    mode: 'left',
  },
};
