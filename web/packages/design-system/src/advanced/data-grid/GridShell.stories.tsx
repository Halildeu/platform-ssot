import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GridShell } from './GridShell';

const meta: Meta<typeof GridShell> = {
  component: GridShell,
  title: 'Advanced/DataGrid/GridShell',
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof GridShell>;

export const Default: Story = {
  args: {
    columnDefs: [
      { field: 'name', headerName: 'Name' },
      { field: 'value', headerName: 'Value' },
    ],
    rowData: [
      { name: 'Alpha', value: 1 },
      { name: 'Beta', value: 2 },
    ],
    height: 300,
  },
};

export const EmptyGrid: Story = {
  args: {
    columnDefs: [
      { field: 'name', headerName: 'Name' },
    ],
    rowData: [],
    height: 200,
  },
};

export const ManyColumns: Story = {
  args: {
    columnDefs: [
      { field: 'id', headerName: 'ID' },
      { field: 'name', headerName: 'Name' },
      { field: 'email', headerName: 'Email' },
      { field: 'status', headerName: 'Status' },
    ],
    rowData: [
      { id: 1, name: 'Alpha', email: 'a@test.com', status: 'active' },
    ],
    height: 300,
  },
};

export const CompactHeight: Story = {
  args: {
    columnDefs: [
      { field: 'name', headerName: 'Name' },
      { field: 'value', headerName: 'Value' },
    ],
    rowData: [
      { name: 'Alpha', value: 1 },
      { name: 'Beta', value: 2 },
    ],
    height: 150,
  },
};

export const ManyRows: Story = {
  args: {
    columnDefs: [
      { field: 'id', headerName: 'ID' },
      { field: 'name', headerName: 'Name' },
    ],
    rowData: Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: \`Row \${i + 1}\` })),
    height: 400,
  },
};

export const TallGrid: Story = {
  args: {
    columnDefs: [
      { field: 'name', headerName: 'Name' },
      { field: 'value', headerName: 'Value' },
    ],
    rowData: [{ name: 'Gamma', value: 3 }],
    height: 500,
  },
};
