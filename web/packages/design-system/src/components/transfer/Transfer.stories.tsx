import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Transfer } from './Transfer';
import type { TransferItem } from './Transfer';

const meta: Meta<typeof Transfer> = {
  title: 'Components/Form/Transfer',
  component: Transfer,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    searchable: { control: 'boolean' },
    showSelectAll: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Transfer>;

const dataSource: TransferItem[] = [
  { key: '1', label: 'React', description: 'UI kutuphanesi' },
  { key: '2', label: 'TypeScript', description: 'Tip guvenligi' },
  { key: '3', label: 'Next.js', description: 'React framework' },
  { key: '4', label: 'Tailwind', description: 'CSS framework' },
  { key: '5', label: 'Storybook', description: 'Bilesen dokumantasyonu' },
  { key: '6', label: 'Vitest', description: 'Test framework' },
  { key: '7', label: 'ESLint', description: 'Kod kalitesi' },
  { key: '8', label: 'Prettier', description: 'Kod formatlama' },
];

export const Default: Story = {
  args: {
    dataSource,
    titles: ['Mevcut', 'Secili'],
    defaultTargetKeys: ['1', '2'],
  },
};

export const Searchable: Story = {
  args: {
    dataSource,
    searchable: true,
    titles: ['Tumu', 'Secilmis'],
  },
};

export const WithDisabledItems: Story = {
  args: {
    dataSource: [
      ...dataSource.slice(0, 3),
      { key: '4', label: 'Tailwind', description: 'Zorunlu', disabled: true },
      ...dataSource.slice(4),
    ],
    defaultTargetKeys: ['4'],
    titles: ['Kaynak', 'Hedef'],
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{size}</div>
          <Transfer dataSource={dataSource.slice(0, 4)} size={size} titles={['Kaynak', 'Hedef']} />
        </div>
      ))}
    </div>
  ),
};
