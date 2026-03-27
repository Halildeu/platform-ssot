import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Cascader } from './Cascader';
import type { CascaderOption } from './Cascader';

const meta: Meta<typeof Cascader> = {
  title: 'Components/Form/Cascader',
  component: Cascader,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    searchable: { control: 'boolean' },
    multiple: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Cascader>;

const options: CascaderOption[] = [
  {
    value: 'istanbul',
    label: 'Istanbul',
    children: [
      { value: 'kadikoy', label: 'Kadikoy', children: [{ value: 'moda', label: 'Moda' }, { value: 'fenerbahce', label: 'Fenerbahce' }] },
      { value: 'besiktas', label: 'Besiktas', children: [{ value: 'levent', label: 'Levent' }] },
    ],
  },
  {
    value: 'ankara',
    label: 'Ankara',
    children: [
      { value: 'cankaya', label: 'Cankaya' },
      { value: 'kecioren', label: 'Kecioren' },
    ],
  },
  {
    value: 'izmir',
    label: 'Izmir',
    children: [
      { value: 'alsancak', label: 'Alsancak' },
      { value: 'bornova', label: 'Bornova' },
    ],
  },
];

export const Default: Story = {
  args: {
    options,
    placeholder: 'Konum secin',
    label: 'Lokasyon',
  },
};

export const Searchable: Story = {
  args: {
    options,
    searchable: true,
    placeholder: 'Arama yapin...',
    label: 'Konum',
  },
};

export const WithError: Story = {
  args: {
    options,
    error: true,
    description: 'Lutfen gecerli bir konum secin.',
    label: 'Konum',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Cascader key={size} options={options} size={size} placeholder={`${size} boyut`} label={size} />
      ))}
    </div>
  ),
};
