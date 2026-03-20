import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TableSimple } from './TableSimple';

const meta: Meta<typeof TableSimple> = {
  title: 'Components/Data/TableSimple',
  component: TableSimple,
  tags: ['autodocs'],
  argTypes: {
    density: {
      control: 'select',
      options: ['comfortable', 'compact'],
    },
    striped: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof TableSimple>;

type Row = { id: number; ad: string; rol: string; durum: string };

const columns = [
  { key: 'id', label: 'ID', accessor: 'id' as const, width: '60px' },
  { key: 'ad', label: 'Ad Soyad', accessor: 'ad' as const },
  { key: 'rol', label: 'Rol', accessor: 'rol' as const },
  { key: 'durum', label: 'Durum', accessor: 'durum' as const },
];

const rows: Row[] = [
  { id: 1, ad: 'Halil Kocoglu', rol: 'Yonetici', durum: 'Aktif' },
  { id: 2, ad: 'Ayse Demir', rol: 'Gelistirici', durum: 'Aktif' },
  { id: 3, ad: 'Mehmet Kaya', rol: 'Tasarimci', durum: 'Pasif' },
  { id: 4, ad: 'Zeynep Arslan', rol: 'QA', durum: 'Aktif' },
];

export const Default: Story = {
  args: {
    columns,
    rows,
    caption: 'Kullanici Tablosu',
  },
};

export const Striped: Story = {
  args: {
    columns,
    rows,
    striped: true,
  },
};

export const Compact: Story = {
  args: {
    columns,
    rows,
    density: 'compact',
  },
};

export const Loading: Story = {
  args: {
    columns,
    rows: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    columns,
    rows: [],
    emptyStateLabel: 'Kayit bulunamadi.',
  },
};
