import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';

const meta: Meta<typeof FormField> = {
  title: 'Components/Form/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    required: { control: 'boolean' },
    optional: { control: 'boolean' },
    disabled: { control: 'boolean' },
    horizontal: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: 'E-posta Adresi',
    help: 'Is e-posta adresinizi girin.',
    children: <input type="email" placeholder="ornek@sirket.com" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-default)', fontSize: 14 }} />,
  },
};

export const Required: Story = {
  args: {
    label: 'Kullanici Adi',
    required: true,
    children: <input type="text" placeholder="Kullanici adi" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-default)', fontSize: 14 }} />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Sifre',
    error: 'Sifre en az 8 karakter olmalidir.',
    required: true,
    children: <input type="password" value="123" readOnly style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--state-error-text)', fontSize: 14 }} />,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Salt Okunur',
    disabled: true,
    children: <input type="text" value="Degistirilemez" readOnly style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-default)', fontSize: 14 }} />,
  },
};

export const Horizontal: Story = {
  args: {
    label: 'Ad Soyad',
    horizontal: true,
    children: <input type="text" placeholder="Ad Soyad" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-default)', fontSize: 14 }} />,
  },
};

export const Optional: Story = {
  args: {
    label: 'Telefon',
    optional: true,
    help: 'Istege bagli alan.',
    children: <input type="tel" placeholder="+90 555 123 4567" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-default)', fontSize: 14 }} />,
  },
};
