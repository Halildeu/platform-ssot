import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar } from './AppSidebar';
import { AppSidebarSearch } from './AppSidebarSearch';
import { expect, within, userEvent } from '@storybook/test';

const meta: Meta<typeof AppSidebarSearch> = {
  title: 'Components/Navigation/AppSidebarSearch',
  component: AppSidebarSearch,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text' },
    shortcut: { control: 'text', description: 'Keyboard shortcut hint' },
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
type Story = StoryObj<typeof AppSidebarSearch>;

export const Default: Story = {
  render: () => <AppSidebarSearch placeholder="Search..." />,
};

export const WithShortcut: Story = {
  render: () => <AppSidebarSearch placeholder="Search navigation..." shortcut="⌘K" />,
};

export const Controlled: Story = {
  render: function ControlledSearch() {
    const [value, setValue] = useState('');
    return <AppSidebarSearch placeholder="Type here..." value={value} onChange={setValue} />;
  },
};

export const CustomPlaceholder: Story = {
  render: () => <AppSidebarSearch placeholder="Find components..." />,
};

export const CustomClass: Story = {
  render: () => <AppSidebarSearch placeholder="Styled..." className="bg-blue-50" />,
};

export const Interactive: Story = {
  render: function InteractiveSearch() {
    const [value, setValue] = useState('');
    return <AppSidebarSearch placeholder="Type to search..." value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Type to search...');
    await expect(input).toBeInTheDocument();
    await userEvent.type(input, 'hello');
  },
};
