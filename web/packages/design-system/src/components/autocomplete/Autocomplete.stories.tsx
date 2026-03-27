import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Autocomplete } from './Autocomplete';
import type { AutocompleteOption } from './Autocomplete';

const meta: Meta<typeof Autocomplete> = {
  title: 'Components/DataEntry/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    allowCustomValue: { control: 'boolean' },
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
type Story = StoryObj<typeof Autocomplete>;

const sehirler: AutocompleteOption[] = [
  { label: 'Istanbul', value: 'istanbul' },
  { label: 'Ankara', value: 'ankara' },
  { label: 'Izmir', value: 'izmir' },
  { label: 'Antalya', value: 'antalya' },
  { label: 'Bursa', value: 'bursa' },
  { label: 'Trabzon', value: 'trabzon' },
  { label: 'Adana', value: 'adana' },
  { label: 'Gaziantep', value: 'gaziantep' },
  { label: 'Konya', value: 'konya' },
  { label: 'Mersin', value: 'mersin' },
];

export const Default: Story = {
  args: {
    label: 'Sehir',
    placeholder: 'Sehir arayiniz...',
    options: sehirler,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Sehir Sec',
    description: 'Calisma sehrinizi seciniz.',
    placeholder: 'Yazmaya baslayin...',
    options: sehirler,
  },
};

export const WithError: Story = {
  args: {
    label: 'Sehir',
    error: 'Gecerli bir sehir seciniz.',
    placeholder: 'Sehir arayiniz...',
    options: sehirler,
  },
};

export const WithHint: Story = {
  args: {
    label: 'Sehir',
    hint: 'En az 2 karakter yazarak arama yapabilirsiniz.',
    placeholder: 'Sehir arayiniz...',
    options: sehirler,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Sehir',
    placeholder: 'Devre disi',
    options: sehirler,
    disabled: true,
    defaultValue: 'istanbul',
  },
};

export const NoCustomValue: Story = {
  args: {
    label: 'Sehir (sadece listeden)',
    placeholder: 'Sehir seciniz...',
    options: sehirler,
    allowCustomValue: false,
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'Sehir',
    placeholder: 'Sehir arayiniz...',
    options: sehirler,
    defaultValue: 'ankara',
  },
};

export const AsyncSearch: Story = {
  render: () => {
    const [options, setOptions] = useState<AutocompleteOption[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = (query: string) => {
      setLoading(true);
      setTimeout(() => {
        const filtered = sehirler.filter((s) =>
          s.label.toLowerCase().includes(query.toLowerCase()),
        );
        setOptions(filtered);
        setLoading(false);
      }, 500);
    };

    return (
      <Autocomplete
        label="Async Arama"
        placeholder="Sehir arayiniz..."
        options={options}
        onSearch={handleSearch}
        loading={loading}
      />
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Autocomplete
          label="Kontrollü"
          placeholder="Sehir arayiniz..."
          options={sehirler}
          value={value}
          onChange={setValue}
        />
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Secili deger: <strong>{value || '(bos)'}</strong>
        </p>
      </div>
    );
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Autocomplete label="Kucuk" size="sm" placeholder="SM boyut" options={sehirler} />
      <Autocomplete label="Orta" size="md" placeholder="MD boyut" options={sehirler} />
      <Autocomplete label="Buyuk" size="lg" placeholder="LG boyut" options={sehirler} />
    </div>
  ),
};

export const MaxSuggestions: Story = {
  args: {
    label: 'Sehir (maks 3 oneri)',
    placeholder: 'Yazmaya baslayin...',
    options: sehirler,
    maxSuggestions: 3,
  },
};

export const Loading: Story = {
  args: {
    label: 'Sehir',
    placeholder: 'Yukleniyor...',
    options: [],
    loading: true,
  },
};
