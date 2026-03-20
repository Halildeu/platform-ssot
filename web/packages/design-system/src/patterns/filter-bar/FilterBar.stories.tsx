import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterBar } from './FilterBar';
import { Button } from '../../primitives/button/Button';
import { SearchInput } from '../../components/search-input/SearchInput';

const meta: Meta<typeof FilterBar> = {
  title: 'Patterns/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  argTypes: {
    compact: { control: 'boolean' },
    activeCount: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<typeof FilterBar>;

const FilterChip = ({ label }: { label: string }) => (
  <button style={{ padding: '4px 12px', borderRadius: 20, border: '1px solid var(--border-default)', fontSize: 13, background: 'var(--surface-default)' }}>
    {label}
  </button>
);

export const Default: Story = {
  args: {
    search: <SearchInput placeholder="Arama..." size="sm" />,
    children: (
      <>
        <FilterChip label="Durum" />
        <FilterChip label="Tur" />
        <FilterChip label="Tarih" />
      </>
    ),
    actions: <Button variant="ghost" size="sm">Temizle</Button>,
  },
};

export const WithMoreFilters: Story = {
  args: {
    children: (
      <>
        <FilterChip label="Kategori" />
        <FilterChip label="Oncelik" />
      </>
    ),
    moreFilters: (
      <div style={{ display: 'flex', gap: 8 }}>
        <FilterChip label="Atanan" />
        <FilterChip label="Etiket" />
        <FilterChip label="Tarih Araligi" />
      </div>
    ),
    activeCount: 3,
  },
};

export const Compact: Story = {
  args: {
    compact: true,
    children: (
      <>
        <FilterChip label="Filtre 1" />
        <FilterChip label="Filtre 2" />
      </>
    ),
  },
};
