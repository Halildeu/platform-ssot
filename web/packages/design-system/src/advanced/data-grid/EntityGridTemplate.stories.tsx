import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = { title: 'Advanced/DataGrid/EntityGridTemplate' 
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <div>EntityGridTemplate requires AG Grid modules — see integration docs</div>,
};

export const WithToolbar: Story = {
  render: () => <div>EntityGridTemplate — with toolbar and search enabled</div>,
};

export const EmptyState: Story = {
  render: () => <div>EntityGridTemplate — no data / empty state</div>,
};

export const LoadingState: Story = {
  render: () => <div>EntityGridTemplate — loading state with skeleton rows</div>,
};

export const WithPagination: Story = {
  render: () => <div>EntityGridTemplate — with pagination controls</div>,
};

export const CompactDensity: Story = {
  render: () => <div>EntityGridTemplate — compact density mode</div>,
};
