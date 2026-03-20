import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Primitives/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Kullanim kosullarini kabul ediyorum',
  },
};

export const Checked: Story = {
  args: {
    label: 'E-posta bildirimleri',
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Tum ogeleri sec',
    indeterminate: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Pazarlama e-postalari',
    description: 'Kampanya ve firsatlardan haberdar olmak istiyorum.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Zorunlu alan',
    checked: true,
    disabled: true,
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Gizlilik politikasini onaylayiniz',
    error: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="Kucuk onay kutusu" size="sm" />
      <Checkbox label="Orta onay kutusu" size="md" />
      <Checkbox label="Buyuk onay kutusu" size="lg" />
    </div>
  ),
};

export const FormGroup: Story = {
  render: () => (
    <fieldset style={{ border: 'none', padding: 0 }}>
      <legend style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
        Bildirim Tercihleri
      </legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Checkbox label="E-posta bildirimleri" description="Onemli guncellemeler icin" />
        <Checkbox label="SMS bildirimleri" description="Acil durum bilgilendirmeleri" />
        <Checkbox label="Uygulama bildirimleri" description="Anlik bildirimler" />
      </div>
    </fieldset>
  ),
};
