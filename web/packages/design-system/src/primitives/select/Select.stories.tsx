import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const sehirler = [
  { value: 'ist', label: 'Istanbul' },
  { value: 'ank', label: 'Ankara' },
  { value: 'izm', label: 'Izmir' },
  { value: 'ant', label: 'Antalya' },
  { value: 'brs', label: 'Bursa' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Primitives/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    options: sehirler,
    placeholder: 'Sehir seciniz...',
  },
};

export const WithPlaceholder: Story = {
  args: {
    options: sehirler,
    placeholder: 'Bir sehir seciniz',
  },
};

export const ErrorState: Story = {
  args: {
    options: sehirler,
    placeholder: 'Sehir seciniz...',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    options: sehirler,
    placeholder: 'Sehir seciniz...',
    disabled: true,
  },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'ist', label: 'Istanbul' },
      { value: 'ank', label: 'Ankara' },
      { value: 'izm', label: 'Izmir', disabled: true },
      { value: 'ant', label: 'Antalya' },
    ],
    placeholder: 'Sehir seciniz...',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 280 }}>
      <Select options={sehirler} placeholder="Kucuk (SM)" size="sm" />
      <Select options={sehirler} placeholder="Orta (MD)" size="md" />
      <Select options={sehirler} placeholder="Buyuk (LG)" size="lg" />
    </div>
  ),
};

export const DepartmanSecimi: Story = {
  args: {
    options: [
      { value: 'it', label: 'Bilgi Teknolojileri' },
      { value: 'hr', label: 'Insan Kaynaklari' },
      { value: 'fin', label: 'Finans' },
      { value: 'ops', label: 'Operasyon' },
      { value: 'sales', label: 'Satis ve Pazarlama' },
    ],
    placeholder: 'Departman seciniz...',
  },
};
