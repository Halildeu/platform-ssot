import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppSidebar';
import { AppSidebarFooter } from './AppSidebarFooter';
import { expect, within, userEvent } from '@storybook/test';

const meta: Meta<typeof AppSidebarFooter> = {
  title: 'Components/Navigation/AppSidebarFooter',
  component: AppSidebarFooter,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    className: { control: 'text', description: 'Additional CSS class' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, display: 'flex' }}>
        <AppSidebar>
          <AppSidebar.Nav><AppSidebar.NavItem label="Home" /></AppSidebar.Nav>
          <Story />
        </AppSidebar>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AppSidebarFooter>;

export const Default: Story = {
  render: () => (
    <AppSidebarFooter><span>v2.0.0</span></AppSidebarFooter>
  ),
};

export const WithUserInfo: Story = {
  render: () => (
    <AppSidebarFooter>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--action-primary)', color: 'var(--surface-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>HK</span>
        <span style={{ fontSize: 12 }}>Halil K.</span>
      </div>
    </AppSidebarFooter>
  ),
};

export const WithActions: Story = {
  render: () => (
    <AppSidebarFooter>
      <button type="button" style={{ fontSize: 12 }}>Logout</button>
    </AppSidebarFooter>
  ),
};

export const CustomClass: Story = {
  render: () => (
    <AppSidebarFooter className="bg-state-info-bg"><span>styled</span></AppSidebarFooter>
  ),
};

export const Empty: Story = {
  render: () => <AppSidebarFooter><span /></AppSidebarFooter>,
};

export const Interactive: Story = {
  render: () => (
    <AppSidebarFooter>
      <button type="button" data-testid="footer-btn">Click me</button>
    </AppSidebarFooter>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByTestId('footer-btn');
    await expect(btn).toBeInTheDocument();
    await userEvent.click(btn);
  },
};
