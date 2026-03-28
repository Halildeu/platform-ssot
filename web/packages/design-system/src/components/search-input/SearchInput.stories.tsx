import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/Form/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    clearable: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    placeholder: 'Arama yapin...',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    if (input) { (input as HTMLInputElement).focus(); (input as HTMLInputElement).value = 'test'; input.dispatchEvent(new Event('input', { bubbles: true })); }
  },
};

export const WithValue: Story = {
  args: {
    value: 'React components',
    clearable: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const Loading: Story = {
  args: {
    placeholder: 'Arama yapin...',
    loading: true,
    value: 'sorgu',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithShortcutHint: Story = {
  args: {
    placeholder: 'Arama...',
    shortcutHint: '⌘K',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <SearchInput size="sm" placeholder="Kucuk" />
      <SearchInput size="md" placeholder="Orta" />
      <SearchInput size="lg" placeholder="Buyuk" />
    </div>
  ),
};
