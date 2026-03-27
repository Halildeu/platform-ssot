import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppSidebar';
import { AppSidebarSeparator } from './AppSidebarSeparator';
import { expect, within } from '@storybook/test';

const meta: Meta<typeof AppSidebarSeparator> = {
  title: 'Components/Navigation/AppSidebarSeparator',
  component: AppSidebarSeparator,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    className: { control: 'text', description: 'Additional CSS class' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, display: 'flex' }}>
        <AppSidebar>
          <AppSidebar.Nav>
            <AppSidebar.NavItem label="Above" />
            <Story />
            <AppSidebar.NavItem label="Below" />
          </AppSidebar.Nav>
        </AppSidebar>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AppSidebarSeparator>;

export const Default: Story = {
  render: () => <AppSidebarSeparator />,
};

export const CustomClass: Story = {
  render: () => <AppSidebarSeparator className="border-red-300" />,
};

export const BetweenGroups: Story = {
  render: () => <AppSidebarSeparator />,
};

export const BetweenSections: Story = {
  render: () => <AppSidebarSeparator />,
};

export const Multiple: Story = {
  render: () => <AppSidebarSeparator />,
};

export const Interactive: Story = {
  render: () => <AppSidebarSeparator />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sep = canvas.getByRole('separator');
    await expect(sep).toBeInTheDocument();
  },
};
