import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppSidebar';
import { AppSidebarGroup } from './AppSidebarGroup';
import { expect, within, userEvent } from '@storybook/test';

const FolderIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16"><path d="M1 3h5l2 2h7v9H1V3z" /></svg>
);

const meta: Meta<typeof AppSidebarGroup> = {
  title: 'Components/Navigation/AppSidebarGroup',
  component: AppSidebarGroup,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    label: { control: 'text', description: 'Group heading label' },
    collapsible: { control: 'boolean', description: 'Whether group can collapse' },
    defaultOpen: { control: 'boolean', description: 'Initial open state' },
    className: { control: 'text', description: 'Additional CSS class' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, display: 'flex' }}>
        <AppSidebar><AppSidebar.Nav><Story /></AppSidebar.Nav></AppSidebar>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AppSidebarGroup>;

export const Default: Story = {
  render: () => (
    <AppSidebarGroup label="Resources" icon={<FolderIcon />}>
      <AppSidebar.NavItem label="Docs" />
      <AppSidebar.NavItem label="API" />
    </AppSidebarGroup>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <AppSidebarGroup label="Collapsible" collapsible defaultOpen>
      <AppSidebar.NavItem label="Item 1" />
      <AppSidebar.NavItem label="Item 2" />
    </AppSidebarGroup>
  ),
};

export const CollapsedByDefault: Story = {
  render: () => (
    <AppSidebarGroup label="Closed" collapsible defaultOpen={false}>
      <AppSidebar.NavItem label="Hidden" />
    </AppSidebarGroup>
  ),
};

export const WithAction: Story = {
  render: () => (
    <AppSidebarGroup label="With Action" action={<button type="button" style={{ fontSize: 10 }}>+</button>}>
      <AppSidebar.NavItem label="Item" />
    </AppSidebarGroup>
  ),
};

export const NonCollapsible: Story = {
  render: () => (
    <AppSidebarGroup label="Static" collapsible={false}>
      <AppSidebar.NavItem label="Fixed" />
    </AppSidebarGroup>
  ),
};

export const Interactive: Story = {
  render: () => (
    <AppSidebarGroup label="Toggle Me" collapsible defaultOpen>
      <AppSidebar.NavItem label="Content" />
    </AppSidebarGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button', { name: /Toggle Me/ });
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(btn);
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
  },
};
