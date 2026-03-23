import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Advanced/DataGrid/TablePagination',
  argTypes: {
    pageSize: { control: 'select', options: [10, 25, 50, 100] },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <div>TablePagination — requires grid context for full functionality</div>,
};

export const WithPageSizes: Story = {
  render: () => <div>Page size options: 10 | 25 | 50 | 100</div>,
};

export const DisabledState: Story = {
  render: () => <div>TablePagination — disabled / readonly mode</div>,
};
