import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppSidebar';
import { AppSidebarNavItem } from './AppSidebarNavItem';
import { expect, within, userEvent } from '@storybook/test';

const HomeIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16"><path d="M8 1L1 7h2v6h4V9h2v4h4V7h2L8 1z" /></svg>
);

const meta: Meta<typeof AppSidebarNavItem> = {
  title: 'Components/Navigation/AppSidebarNavItem',
  component: AppSidebarNavItem,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    label: { control: 'text', description: 'Text label' },
    active: { control: 'boolean', description: 'Active state' },
    disabled: { control: 'boolean', description: 'Disabled state' },
    href: { control: 'text', description: 'Navigation URL' },
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
type Story = StoryObj<typeof AppSidebarNavItem>;

export const Default: Story = {
  render: () => <AppSidebarNavItem icon={<HomeIcon />} label="Dashboard" />,
};

export const Active: Story = {
  render: () => <AppSidebarNavItem icon={<HomeIcon />} label="Home" active />,
};

export const Disabled: Story = {
  render: () => <AppSidebarNavItem icon={<HomeIcon />} label="Disabled" disabled />,
};

export const WithBadge: Story = {
  render: () => (
    <AppSidebarNavItem
      icon={<HomeIcon />}
      label="Notifications"
      badge={<span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 9999, background: '#dcfce7', color: '#16a34a' }}>5</span>}
    />
  ),
};

export const AsLink: Story = {
  render: () => <AppSidebarNavItem icon={<HomeIcon />} label="Docs" href="/docs" />,
};

export const Interactive: Story = {
  render: () => <AppSidebarNavItem icon={<HomeIcon />} label="Click Me" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button', { name: /Click Me/ });
    await expect(btn).toBeInTheDocument();
    await userEvent.click(btn);
  },
};
