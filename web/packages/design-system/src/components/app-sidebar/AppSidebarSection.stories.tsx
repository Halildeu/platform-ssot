import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppSidebar';
import { AppSidebarSection } from './AppSidebarSection';
import { expect, within, userEvent } from '@storybook/test';

const meta: Meta<typeof AppSidebarSection> = {
  title: 'Components/Navigation/AppSidebarSection',
  component: AppSidebarSection,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    title: { control: 'text', description: 'Section heading text' },
    collapsible: { control: 'boolean', description: 'Whether section can collapse' },
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
type Story = StoryObj<typeof AppSidebarSection>;

export const Default: Story = {
  render: () => (
    <AppSidebarSection title="General">
      <AppSidebar.NavItem label="Overview" />
    </AppSidebarSection>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <AppSidebarSection title="Collapsible" collapsible defaultOpen>
      <AppSidebar.NavItem label="Item" />
    </AppSidebarSection>
  ),
};

export const CollapsedByDefault: Story = {
  render: () => (
    <AppSidebarSection title="Closed" collapsible defaultOpen={false}>
      <AppSidebar.NavItem label="Hidden" />
    </AppSidebarSection>
  ),
};

export const NoTitle: Story = {
  render: () => (
    <AppSidebarSection>
      <AppSidebar.NavItem label="No heading" />
    </AppSidebarSection>
  ),
};

export const CustomClass: Story = {
  render: () => (
    <AppSidebarSection title="Styled" className="bg-surface-muted">
      <AppSidebar.NavItem label="Content" />
    </AppSidebarSection>
  ),
};

export const Interactive: Story = {
  render: () => (
    <AppSidebarSection title="Toggle Me" collapsible defaultOpen>
      <AppSidebar.NavItem label="Content" />
    </AppSidebarSection>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button', { name: /Toggle Me/ });
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(btn);
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
  },
};
