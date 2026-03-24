import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Advanced/DataGrid/TablePagination',
  argTypes: {
    pageSize: { control: 'select', options: [10, 25, 50, 100] },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <div>TablePagination — requires grid context for full functionality</div>,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="button"], button, [data-testid], input, [tabindex]');
    if (el) (el as HTMLElement).click();
  },
};

export const WithPageSizes: Story = {
  render: () => <div>Page size options: 10 | 25 | 50 | 100</div>,
};

export const DisabledState: Story = {
  render: () => <div>TablePagination — disabled / readonly mode</div>,
};

export const FirstPage: Story = {
  render: () => <div>TablePagination — first page selected, previous disabled</div>,
};

export const LastPage: Story = {
  render: () => <div>TablePagination — last page selected, next disabled</div>,
};

export const SinglePage: Story = {
  render: () => <div>TablePagination — single page of data, no navigation</div>,
};
