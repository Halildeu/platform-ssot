import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DataEntry/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    label: 'Tarih',
    placeholder: 'Tarih seciniz',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Baslangic Tarihi',
    description: 'Projenin baslangic tarihini seciniz.',
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'Dogum Tarihi',
    defaultValue: '1990-01-15',
  },
};

export const WithError: Story = {
  args: {
    label: 'Bitis Tarihi',
    error: 'Bitis tarihi baslangic tarihinden sonra olmalidir.',
    defaultValue: '2024-01-01',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Teslim Tarihi',
    hint: 'En erken teslim tarihi yarin.',
  },
};

export const WithMinMax: Story = {
  args: {
    label: 'Randevu Tarihi',
    description: 'Yalnizca onumuzdeki 30 gun icerisinde secim yapabilirsiniz.',
    min: new Date().toISOString().split('T')[0],
    max: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
};

export const Disabled: Story = {
  args: {
    label: 'Olusturulma Tarihi',
    defaultValue: '2024-03-15',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Islem Tarihi',
    required: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('2024-06-15');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <DatePicker
          label="Secili Tarih"
          value={value}
          onValueChange={(v) => setValue(v)}
        />
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Secili: {value || 'Yok'}
        </div>
      </div>
    );
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DatePicker label="Kucuk" size="sm" defaultValue="2024-01-01" />
      <DatePicker label="Orta" size="md" defaultValue="2024-01-01" />
      <DatePicker label="Buyuk" size="lg" defaultValue="2024-01-01" />
    </div>
  ),
};
