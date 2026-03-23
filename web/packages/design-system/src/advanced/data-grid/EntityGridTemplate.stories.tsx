import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = { title: 'Advanced/DataGrid/EntityGridTemplate' };
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
