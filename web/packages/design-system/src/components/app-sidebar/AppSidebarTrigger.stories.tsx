import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppSidebar';
import { AppSidebarTrigger } from './AppSidebarTrigger';
import { expect, within, userEvent } from '@storybook/test';

const meta: Meta<typeof AppSidebarTrigger> = {
  title: 'Components/Navigation/AppSidebarTrigger',
  component: AppSidebarTrigger,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    className: { control: 'text', description: 'Additional CSS class' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, display: 'flex' }}>
        <AppSidebar>
          <AppSidebar.Header action={<Story />} />
          <AppSidebar.Nav><AppSidebar.NavItem label="Home" /></AppSidebar.Nav>
        </AppSidebar>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AppSidebarTrigger>;

export const Default: Story = {
  render: () => <AppSidebarTrigger />,
};

export const CustomClass: Story = {
  render: () => <AppSidebarTrigger className="bg-surface-muted" />,
};

export const InExpandedSidebar: Story = {
  render: () => <AppSidebarTrigger />,
};

export const CollapseAction: Story = {
  render: () => <AppSidebarTrigger />,
};

export const ExpandAction: Story = {
  render: () => <AppSidebarTrigger />,
};

export const Interactive: Story = {
  render: () => <AppSidebarTrigger />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByLabelText('Collapse sidebar');
    await expect(btn).toBeInTheDocument();
    await userEvent.click(btn);
    const expandBtn = canvas.getByLabelText('Expand sidebar');
    await expect(expandBtn).toBeInTheDocument();
  },
};
