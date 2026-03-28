import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppSidebar';
import { AppSidebarHeader } from './AppSidebarHeader';
import { expect, within, userEvent } from '@storybook/test';

const meta: Meta<typeof AppSidebarHeader> = {
  title: 'Components/Navigation/AppSidebarHeader',
  component: AppSidebarHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    title: { control: 'text', description: 'Primary title' },
    subtitle: { control: 'text', description: 'Secondary subtitle' },
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
type Story = StoryObj<typeof AppSidebarHeader>;

export const Default: Story = {
  render: () => <AppSidebarHeader title="Design Lab" subtitle="Component Library" />,
};

export const WithLogo: Story = {
  render: () => (
    <AppSidebarHeader
      title="Design Lab"
      logo={<span style={{ width: 28, height: 28, borderRadius: 6, background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>DL</span>}
    />
  ),
};

export const WithAction: Story = {
  render: () => (
    <AppSidebarHeader title="App" action={<AppSidebar.Trigger />} />
  ),
};

export const TitleOnly: Story = {
  render: () => <AppSidebarHeader title="Simple Header" />,
};

export const SubtitleOnly: Story = {
  render: () => <AppSidebarHeader subtitle="Subtitle only" />,
};

export const Interactive: Story = {
  render: () => (
    <AppSidebarHeader title="Interactive" action={<AppSidebar.Trigger />} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByLabelText('Collapse sidebar');
    await expect(trigger).toBeInTheDocument();
    await userEvent.click(trigger);
  },
};
