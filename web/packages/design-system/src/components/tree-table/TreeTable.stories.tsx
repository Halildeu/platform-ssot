import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TreeTable } from './TreeTable';
import type { TreeTableNode, TreeTableColumn } from './TreeTable';

const meta: Meta<typeof TreeTable> = {
  title: 'Components/Data/TreeTable',
  component: TreeTable,
  tags: ['autodocs'],
  argTypes: {
    density: {
      control: 'select',
      options: ['comfortable', 'compact'],
    },
    loading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof TreeTable>;

type RowData = { boyut: string; tur: string };

const columns: TreeTableColumn<RowData>[] = [
  { key: 'boyut', label: 'Boyut', accessor: 'boyut' },
  { key: 'tur', label: 'Tur', accessor: 'tur' },
];

const nodes: TreeTableNode<RowData>[] = [
  {
    key: 'src',
    label: 'src',
    data: { boyut: '4.2 MB', tur: 'Klasor' },
    children: [
      {
        key: 'components',
        label: 'components',
        data: { boyut: '2.1 MB', tur: 'Klasor' },
        children: [
          { key: 'button', label: 'Button.tsx', data: { boyut: '8 KB', tur: 'TypeScript' } },
          { key: 'card', label: 'Card.tsx', data: { boyut: '12 KB', tur: 'TypeScript' } },
        ],
      },
      {
        key: 'utils',
        label: 'utils',
        data: { boyut: '1.5 MB', tur: 'Klasor' },
        children: [
          { key: 'cn', label: 'cn.ts', data: { boyut: '2 KB', tur: 'TypeScript' } },
        ],
      },
    ],
  },
  {
    key: 'package',
    label: 'package.json',
    data: { boyut: '3 KB', tur: 'JSON' },
  },
];

export const Default: Story = {
  args: {
    nodes,
    columns,
    title: 'Dosya Yapisi',
  },
};

export const Compact: Story = {
  args: {
    nodes,
    columns,
    density: 'compact',
  },
};

export const Loading: Story = {
  args: {
    nodes: [],
    columns,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    nodes: [],
    columns,
    emptyStateLabel: 'Dosya bulunamadi.',
  },
};
