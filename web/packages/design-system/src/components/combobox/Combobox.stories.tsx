import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from './Combobox';
import type { ComboboxOption, ComboboxOptionGroup } from './Combobox';

const meta: Meta<typeof Combobox> = {
  title: 'Components/DataEntry/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple', 'tags'],
    },
    loading: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Combobox>;

const sehirler: ComboboxOption[] = [
  { label: 'Istanbul', value: 'istanbul', description: 'Marmara Bolgesi' },
  { label: 'Ankara', value: 'ankara', description: 'Ic Anadolu Bolgesi' },
  { label: 'Izmir', value: 'izmir', description: 'Ege Bolgesi' },
  { label: 'Antalya', value: 'antalya', description: 'Akdeniz Bolgesi' },
  { label: 'Bursa', value: 'bursa', description: 'Marmara Bolgesi' },
  { label: 'Trabzon', value: 'trabzon', description: 'Karadeniz Bolgesi' },
];

export const Default: Story = {
  args: {
    label: 'Sehir',
    placeholder: 'Sehir seciniz...',
    options: sehirler,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Sehir Sec',
    description: 'Calisma sehrinizi seciniz.',
    placeholder: 'Ara...',
    options: sehirler,
  },
};

export const WithError: Story = {
  args: {
    label: 'Sehir',
    error: 'Bu alan zorunludur.',
    placeholder: 'Sehir seciniz...',
    options: sehirler,
  },
};

export const Clearable: Story = {
  args: {
    label: 'Sehir',
    placeholder: 'Sehir seciniz...',
    options: sehirler,
    clearable: true,
    defaultValue: 'istanbul',
  },
};

export const WithGroups: Story = {
  args: {
    label: 'Konum',
    placeholder: 'Konum seciniz...',
    options: [
      {
        label: 'Marmara',
        options: [
          { label: 'Istanbul', value: 'istanbul' },
          { label: 'Bursa', value: 'bursa' },
        ],
      },
      {
        label: 'Ege',
        options: [
          { label: 'Izmir', value: 'izmir' },
          { label: 'Mugla', value: 'mugla' },
        ],
      },
      {
        label: 'Akdeniz',
        options: [
          { label: 'Antalya', value: 'antalya' },
          { label: 'Mersin', value: 'mersin' },
        ],
      },
    ] as ComboboxOptionGroup[],
  },
};

export const MultipleSelection: Story = {
  args: {
    label: 'Beceriler',
    placeholder: 'Beceri seciniz...',
    selectionMode: 'multiple',
    options: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'typescript' },
      { label: 'Node.js', value: 'nodejs' },
      { label: 'Python', value: 'python' },
      { label: 'Go', value: 'go' },
      { label: 'Rust', value: 'rust' },
    ],
    defaultValues: ['react', 'typescript'],
  },
};

export const TagsMode: Story = {
  args: {
    label: 'Etiketler',
    placeholder: 'Etiket ekle...',
    selectionMode: 'tags',
    freeSolo: true,
    options: [
      { label: 'onemli', value: 'onemli' },
      { label: 'acil', value: 'acil' },
      { label: 'takip', value: 'takip' },
    ],
    defaultValues: ['onemli'],
  },
};

export const Loading: Story = {
  args: {
    label: 'Kullanici',
    placeholder: 'Kullanici ara...',
    options: [],
    loading: true,
  },
};

export const DisabledOptions: Story = {
  args: {
    label: 'Plan',
    placeholder: 'Plan seciniz...',
    options: [
      { label: 'Ucretsiz', value: 'free' },
      { label: 'Baslangic', value: 'starter' },
      { label: 'Profesyonel', value: 'pro' },
      { label: 'Kurumsal', value: 'enterprise', disabled: true, disabledReason: 'Iletisime gecin' },
    ],
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Combobox label="Kucuk" size="sm" placeholder="SM boyut" options={sehirler} />
      <Combobox label="Orta" size="md" placeholder="MD boyut" options={sehirler} />
      <Combobox label="Buyuk" size="lg" placeholder="LG boyut" options={sehirler} />
    </div>
  ),
};
