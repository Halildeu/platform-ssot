import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Segmented } from './Segmented';

const meta: Meta<typeof Segmented> = {
  title: 'Components/Form/Segmented',
  component: Segmented,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    appearance: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    fullWidth: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Segmented>;

const items = [
  { value: 'list', label: 'Liste' },
  { value: 'grid', label: 'Izgara' },
  { value: 'board', label: 'Pano' },
];

export const Default: Story = {
  args: {
    items,
    defaultValue: 'list',
  },
};

export const OutlineAppearance: Story = {
  args: {
    items,
    appearance: 'outline',
    defaultValue: 'grid',
  },
};

export const GhostAppearance: Story = {
  args: {
    items,
    appearance: 'ghost',
    defaultValue: 'board',
  },
};

export const Vertical: Story = {
  args: {
    items,
    orientation: 'vertical',
    defaultValue: 'list',
  },
};

export const FullWidth: Story = {
  args: {
    items,
    fullWidth: true,
    defaultValue: 'list',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Segmented key={size} items={items} size={size} defaultValue="list" />
      ))}
    </div>
  ),
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      ...items,
      { value: 'timeline', label: 'Zaman Cizelgesi', disabled: true },
    ],
    defaultValue: 'list',
  },
};
