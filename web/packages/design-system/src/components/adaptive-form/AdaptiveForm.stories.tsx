import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AdaptiveForm } from './AdaptiveForm';
import type { FormField } from './AdaptiveForm';

const meta: Meta<typeof AdaptiveForm> = {
  title: 'Components/Form/AdaptiveForm',
  component: AdaptiveForm,
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal', 'inline'],
    },
    columns: {
      control: 'select',
      options: [1, 2],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    showReset: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof AdaptiveForm>;

const basicFields: FormField[] = [
  { key: 'name', type: 'text', label: 'Ad Soyad', required: true, placeholder: 'Adinizi girin' },
  { key: 'email', type: 'text', label: 'E-posta', required: true, placeholder: 'ornek@mail.com' },
  { key: 'role', type: 'select', label: 'Rol', options: [{ label: 'Yonetici', value: 'admin' }, { label: 'Kullanici', value: 'user' }, { label: 'Izleyici', value: 'viewer' }] },
  { key: 'notes', type: 'textarea', label: 'Notlar', placeholder: 'Ek bilgi...' },
];

export const Default: Story = {
  args: {
    fields: basicFields,
    submitLabel: 'Kaydet',
  },
};

export const TwoColumns: Story = {
  args: {
    fields: basicFields,
    columns: 2,
    submitLabel: 'Gonder',
  },
};

export const WithReset: Story = {
  args: {
    fields: basicFields,
    showReset: true,
    resetLabel: 'Temizle',
    submitLabel: 'Kaydet',
  },
};

export const Loading: Story = {
  args: {
    fields: basicFields,
    loading: true,
    submitLabel: 'Gonderiliyor...',
  },
};

export const ConditionalFields: Story = {
  args: {
    fields: [
      { key: 'type', type: 'select', label: 'Tur', options: [{ label: 'Bireysel', value: 'individual' }, { label: 'Kurumsal', value: 'corporate' }] },
      { key: 'company', type: 'text', label: 'Sirket Adi', dependsOn: { field: 'type', value: 'corporate' } },
      { key: 'taxId', type: 'text', label: 'Vergi No', dependsOn: { field: 'type', value: 'corporate' } },
    ],
    submitLabel: 'Devam',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{size}</div>
          <AdaptiveForm
            fields={basicFields.slice(0, 2)}
            size={size}
            submitLabel="Kaydet"
          />
        </div>
      ))}
    </div>
  ),
};
