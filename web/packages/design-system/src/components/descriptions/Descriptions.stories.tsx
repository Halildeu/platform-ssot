import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Descriptions } from './Descriptions';
import type { DescriptionsItem } from './Descriptions';

const meta: Meta<typeof Descriptions> = {
  title: 'Components/Data/Descriptions',
  component: Descriptions,
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'select',
      options: [1, 2, 3],
    },
    density: {
      control: 'select',
      options: ['comfortable', 'compact'],
    },
    bordered: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Descriptions>;

const items: DescriptionsItem[] = [
  { key: 'name', label: 'Ad', value: 'Halil Kocoglu' },
  { key: 'email', label: 'E-posta', value: 'halil@example.com' },
  { key: 'role', label: 'Rol', value: 'Yonetici' },
  { key: 'status', label: 'Durum', value: 'Aktif', tone: 'success' },
  { key: 'created', label: 'Olusturulma', value: '15 Mart 2024' },
  { key: 'updated', label: 'Guncelleme', value: '20 Mart 2026' },
];

export const Default: Story = {
  args: {
    items,
    title: 'Kullanici Bilgileri',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="button"], button, [data-testid], input, [tabindex]');
    if (el) (el as HTMLElement).click();
  },
};

export const ThreeColumns: Story = {
  args: {
    items,
    columns: 3,
    title: 'Detay Bilgiler',
  },
};

export const Bordered: Story = {
  args: {
    items,
    bordered: true,
    title: 'Cerceveli Gorunum',
  },
};

export const Compact: Story = {
  args: {
    items,
    density: 'compact',
    title: 'Sikisik Gorunum',
  },
};

export const WithTones: Story = {
  args: {
    items: [
      { key: '1', label: 'Bilgi', value: 'Normal deger' },
      { key: '2', label: 'Bilgi', value: 'Bilgilendirme', tone: 'info' },
      { key: '3', label: 'Basari', value: 'Tamamlandi', tone: 'success' },
      { key: '4', label: 'Uyari', value: 'Dikkat', tone: 'warning' },
      { key: '5', label: 'Tehlike', value: 'Kritik', tone: 'danger' },
    ],
    columns: 1,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    emptyStateLabel: 'Veri bulunamadi',
  },
};
