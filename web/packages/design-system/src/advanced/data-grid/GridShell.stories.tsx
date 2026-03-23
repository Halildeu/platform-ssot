import type { Meta, StoryObj } from '@storybook/react';
import { GridShell } from './GridShell';

const meta: Meta<typeof GridShell> = {
  component: GridShell,
  title: 'Advanced/DataGrid/GridShell',
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
