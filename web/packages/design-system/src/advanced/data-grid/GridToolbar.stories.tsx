import type { Meta, StoryObj } from '@storybook/react';
import { GridToolbar } from './GridToolbar';

const meta: Meta<typeof GridToolbar> = {
  component: GridToolbar,
  title: 'Advanced/DataGrid/GridToolbar',
};
export default meta;

type Story = StoryObj<typeof GridToolbar>;

export const Default: Story = {
  args: {
    gridApi: null,
    theme: 'quartz',
    density: 'comfortable',
  },
};

export const CompactDensity: Story = {
  args: {
    gridApi: null,
    theme: 'quartz',
    density: 'compact',
  },
};

export const BalhamTheme: Story = {
  args: {
    gridApi: null,
    theme: 'balham',
    density: 'comfortable',
  },
};
