import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppSidebar';
import { AppSidebarResizer } from './AppSidebarResizer';
import { expect, within } from '@storybook/test';

const meta: Meta<typeof AppSidebarResizer> = {
  title: 'Components/Navigation/AppSidebarResizer',
  component: AppSidebarResizer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    className: { control: 'text', description: 'Additional CSS class' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, display: 'flex' }}>
        <AppSidebar resizable>
          <AppSidebar.Nav><AppSidebar.NavItem label="Home" /></AppSidebar.Nav>
          <Story />
        </AppSidebar>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AppSidebarResizer>;

export const Default: Story = {
  render: () => <AppSidebarResizer />,
};

export const CustomClass: Story = {
  render: () => <AppSidebarResizer className="bg-blue-200" />,
};

export const WithContent: Story = {
  render: () => <AppSidebarResizer />,
};

export const MinWidth: Story = {
  render: () => <AppSidebarResizer />,
};

export const MaxWidth: Story = {
  render: () => <AppSidebarResizer />,
};

export const Interactive: Story = {
  render: () => <AppSidebarResizer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const separator = canvas.getByRole('separator');
    await expect(separator).toBeInTheDocument();
    await expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  },
};
