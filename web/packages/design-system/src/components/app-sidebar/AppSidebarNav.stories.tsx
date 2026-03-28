import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppSidebar';
import { AppSidebarNav } from './AppSidebarNav';
import { expect, within, userEvent } from '@storybook/test';

const meta: Meta<typeof AppSidebarNav> = {
  title: 'Components/Navigation/AppSidebarNav',
  component: AppSidebarNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    className: { control: 'text', description: 'Additional CSS class' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, display: 'flex' }}>
        <AppSidebar><Story /></AppSidebar>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AppSidebarNav>;

export const Default: Story = {
  render: () => (
    <AppSidebarNav>
      <AppSidebar.NavItem label="Home" />
      <AppSidebar.NavItem label="Settings" />
    </AppSidebarNav>
  ),
};

export const WithSections: Story = {
  render: () => (
    <AppSidebarNav>
      <AppSidebar.Section title="Main">
        <AppSidebar.NavItem label="Dashboard" />
      </AppSidebar.Section>
    </AppSidebarNav>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <AppSidebarNav>
      <AppSidebar.Group label="Resources" collapsible>
        <AppSidebar.NavItem label="Docs" />
      </AppSidebar.Group>
    </AppSidebarNav>
  ),
};

export const Empty: Story = {
  render: () => <AppSidebarNav><span /></AppSidebarNav>,
};

export const CustomClass: Story = {
  render: () => (
    <AppSidebarNav className="bg-surface-muted">
      <AppSidebar.NavItem label="Styled" />
    </AppSidebarNav>
  ),
};

export const Interactive: Story = {
  render: () => (
    <AppSidebarNav>
      <AppSidebar.NavItem label="Clickable" />
    </AppSidebarNav>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation');
    await expect(nav).toBeInTheDocument();
  },
};
