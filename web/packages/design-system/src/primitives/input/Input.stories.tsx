import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Ad Soyad',
    placeholder: 'Ornegin: Ahmet Yilmaz',
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    if (input) { (input as HTMLInputElement).focus(); (input as HTMLInputElement).value = 'Test'; input.dispatchEvent(new Event('input', { bubbles: true })); }
  },
};

export const WithDescription: Story = {
  args: {
    label: 'E-posta Adresi',
    description: 'Kurumsal e-posta adresinizi giriniz.',
    placeholder: 'ornek@sirket.com',
    type: 'email',
  },
};

export const WithError: Story = {
  args: {
    label: 'Kullanici Adi',
    error: 'Bu kullanici adi zaten kullanilmakta.',
    defaultValue: 'ahmet123',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Sifre',
    hint: 'En az 8 karakter, buyuk harf ve rakam icermelidir.',
    type: 'password',
  },
};

export const WithCharacterCount: Story = {
  args: {
    label: 'Aciklama',
    placeholder: 'Kisa bir aciklama yaziniz...',
    maxLength: 100,
    showCount: true,
  },
};

export const WithLeadingVisual: Story = {
  args: {
    label: 'Arama',
    placeholder: 'Ara...',
    leadingVisual: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L14 14" strokeLinecap="round" />
      </svg>
    ),
  },
};

export const WithTrailingVisual: Story = {
  args: {
    label: 'Tutar',
    placeholder: '0.00',
    type: 'number',
    trailingVisual: <span style={{ fontSize: 12, color: '#6b7280' }}>TL</span>,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Devre Disi Alan',
    defaultValue: 'Duzenlenemez',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Salt Okunur',
    defaultValue: 'Bu alan salt okunurdur',
    readOnly: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Input label="Kucuk" size="sm" placeholder="SM boyut" />
      <Input label="Orta" size="md" placeholder="MD boyut" />
      <Input label="Buyuk" size="lg" placeholder="LG boyut" />
    </div>
  ),
};
