import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InputNumber } from './InputNumber';

const meta: Meta<typeof InputNumber> = {
  title: 'Components/DataEntry/InputNumber',
  component: InputNumber,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof InputNumber>;

export const Default: Story = {
  args: {
    label: 'Miktar',
    placeholder: 'Deger giriniz...',
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'Miktar',
    defaultValue: 42,
  },
};

export const WithMinMax: Story = {
  args: {
    label: 'Yas',
    min: 0,
    max: 120,
    defaultValue: 25,
    hint: '0-120 arasi deger giriniz.',
  },
};

export const WithStep: Story = {
  args: {
    label: 'Fiyat',
    step: 0.5,
    precision: 2,
    defaultValue: 10.0,
    prefix: '\u20BA',
    hint: '0.50 adimlarla arttirilir.',
  },
};

export const WithPrecision: Story = {
  args: {
    label: 'Oran (%)',
    precision: 2,
    min: 0,
    max: 100,
    defaultValue: 33.33,
    suffix: '%',
  },
};

export const WithPrefixSuffix: Story = {
  args: {
    label: 'Agirlik',
    defaultValue: 75,
    suffix: 'kg',
    min: 0,
    max: 500,
  },
};

export const CurrencyInput: Story = {
  args: {
    label: 'Tutar',
    prefix: '\u20BA',
    precision: 2,
    step: 1,
    defaultValue: 1500.0,
    min: 0,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Stok Adedi',
    description: 'Urun stok miktarini giriniz.',
    defaultValue: 100,
    min: 0,
  },
};

export const WithError: Story = {
  args: {
    label: 'Miktar',
    error: 'Minimum 1 adet gereklidir.',
    defaultValue: 0,
    min: 1,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Miktar',
    defaultValue: 50,
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Toplam',
    defaultValue: 1250,
    readOnly: true,
    prefix: '\u20BA',
  },
};

export const Required: Story = {
  args: {
    label: 'Adet',
    required: true,
    placeholder: 'Zorunlu alan',
    min: 1,
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(10);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <InputNumber
          label="Kontrollü"
          value={value}
          onChange={setValue}
          min={0}
          max={100}
        />
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Deger: <strong>{value !== null ? value : '(bos)'}</strong>
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setValue(0)}>Sifirla</button>
          <button onClick={() => setValue(50)}>50 yap</button>
          <button onClick={() => setValue(null)}>Temizle</button>
        </div>
      </div>
    );
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <InputNumber label="Kucuk" size="sm" placeholder="SM" defaultValue={10} />
      <InputNumber label="Orta" size="md" placeholder="MD" defaultValue={20} />
      <InputNumber label="Buyuk" size="lg" placeholder="LG" defaultValue={30} />
    </div>
  ),
};

export const LargeStep: Story = {
  args: {
    label: 'Shift ile buyuk adim',
    step: 5,
    defaultValue: 50,
    min: 0,
    max: 1000,
    hint: 'Shift+Arrow ile 10x adim atlar.',
  },
};
