import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JsonViewer } from './JsonViewer';

const meta: Meta<typeof JsonViewer> = {
  title: 'Components/Data/JsonViewer',
  component: JsonViewer,
  tags: ['autodocs'],
  argTypes: {
    defaultExpandedDepth: { control: 'number' },
    showTypes: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof JsonViewer>;

const sampleData = {
  kullanici: {
    ad: 'Halil',
    soyad: 'Kocoglu',
    yas: 30,
    aktif: true,
    roller: ['admin', 'developer'],
  },
  ayarlar: {
    tema: 'dark',
    dil: 'tr',
    bildirimler: { email: true, sms: false },
  },
};

export const Default: Story = {
  args: {
    value: sampleData,
    title: 'JSON Goruntuleyici',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="button"], button, [data-testid], input, [tabindex]');
    if (el) (el as HTMLElement).click();
  },
};

export const ExpandedByDefault: Story = {
  args: {
    value: sampleData,
    defaultExpandedDepth: 3,
  },
};

export const WithTypes: Story = {
  args: {
    value: sampleData,
    showTypes: true,
  },
};

export const ArrayData: Story = {
  args: {
    value: [
      { id: 1, ad: 'Proje A', durum: 'aktif' },
      { id: 2, ad: 'Proje B', durum: 'tamamlandi' },
      { id: 3, ad: 'Proje C', durum: 'beklemede' },
    ],
    title: 'Proje Listesi',
  },
};

export const PrimitiveValue: Story = {
  args: {
    value: 'Basit metin degeri',
  },
};

export const NullValue: Story = {
  args: {
    value: null,
  },
};
