import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FloatButton } from './FloatButton';

const PlusIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3v10M3 8h10" strokeLinecap="round" />
  </svg>
);

const meta: Meta<typeof FloatButton> = {
  title: 'Components/Action/FloatButton',
  component: FloatButton,
  tags: ['autodocs'],
  argTypes: {
    shape: {
      control: 'select',
      options: ['circle', 'square'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 300, border: '1px dashed var(--border-subtle)', borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof FloatButton>;

export const Default: Story = {
  args: {
    icon: PlusIcon,
    label: 'Ekle',
  },
};

export const WithBadge: Story = {
  args: {
    icon: PlusIcon,
    badge: 5,
  },
};

export const WithGroupItems: Story = {
  args: {
    icon: PlusIcon,
    items: [
      { key: 'task', label: 'Gorev Ekle' },
      { key: 'note', label: 'Not Ekle' },
      { key: 'file', label: 'Dosya Yukle' },
    ],
  },
};

export const SquareShape: Story = {
  args: {
    icon: PlusIcon,
    shape: 'square',
    label: 'Yeni',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ position: 'relative' }}>
          <FloatButton icon={PlusIcon} size={size} position="bottom-right" className="!static" />
        </div>
      ))}
    </div>
  ),
};
