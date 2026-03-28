import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = { title: 'Advanced/DataGrid/AgGridServer' 
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <div>AgGridServer requires AG Grid modules — see integration docs</div>,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="button"], button, [data-testid], input, [tabindex]');
    if (el) (el as HTMLElement).click();
  },
};

export const WithServerSideModel: Story = {
  render: () => <div>AgGridServer — server-side row model with lazy loading</div>,
};

export const ErrorState: Story = {
  render: () => <div>AgGridServer — error / empty state when datasource fails</div>,
};

export const LoadingState: Story = {
  render: () => <div>AgGridServer — loading state with skeleton placeholder</div>,
};

export const WithPagination: Story = {
  render: () => <div>AgGridServer — paginated server-side row model</div>,
};

export const WithFiltering: Story = {
  render: () => <div>AgGridServer — server-side filtering enabled</div>,
};
