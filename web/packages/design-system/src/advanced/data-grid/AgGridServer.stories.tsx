import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = { title: 'Advanced/DataGrid/AgGridServer' };
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <div>AgGridServer requires AG Grid modules — see integration docs</div>,
};

export const WithServerSideModel: Story = {
  render: () => <div>AgGridServer — server-side row model with lazy loading</div>,
};

export const ErrorState: Story = {
  render: () => <div>AgGridServer — error / empty state when datasource fails</div>,
};
