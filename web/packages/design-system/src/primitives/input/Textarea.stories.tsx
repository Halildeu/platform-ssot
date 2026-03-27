import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Primitives/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    resize: {
      control: 'select',
      options: ['vertical', 'none', 'auto'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    showCount: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: 'Aciklama',
    placeholder: 'Aciklamanizi buraya yaziniz...',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Proje Notu',
    description: 'Proje hakkinda kisa bir not ekleyebilirsiniz.',
    placeholder: 'Notunuzu giriniz...',
  },
};

export const WithError: Story = {
  args: {
    label: 'Geri Bildirim',
    error: 'Bu alan zorunludur.',
    defaultValue: '',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Biyografi',
    hint: 'En fazla 500 karakter kullanabilirsiniz.',
    placeholder: 'Kendinizi kisa bir sekilde tanitin...',
  },
};

export const WithCharacterCount: Story = {
  args: {
    label: 'Tweet',
    placeholder: 'Ne dusunuyorsunuz?',
    maxLength: 280,
    showCount: true,
    rows: 3,
  },
};

export const AutoResize: Story = {
  args: {
    label: 'Otomatik Boyut',
    placeholder: 'Yazdikca alan buyur...',
    resize: 'auto',
    rows: 2,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Devre Disi',
    defaultValue: 'Bu alan duzenlenemez.',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Salt Okunur',
    defaultValue: 'Bu icerik yalnizca okunabilir.',
    readOnly: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400 }}>
      <Textarea label="Kucuk" size="sm" placeholder="SM boyut" rows={2} />
      <Textarea label="Orta" size="md" placeholder="MD boyut" rows={2} />
      <Textarea label="Buyuk" size="lg" placeholder="LG boyut" rows={2} />
    </div>
  ),
};

export const FormExample: Story = {
  name: 'Form Ornegi',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400 }}>
      <Textarea
        label="Destek Talebi"
        description="Sorununuzu detayli bir sekilde aciklayiniz."
        placeholder="Sorun hakkinda bilgi veriniz..."
        required
        rows={5}
        maxLength={1000}
        showCount
      />
    </div>
  ),
};
