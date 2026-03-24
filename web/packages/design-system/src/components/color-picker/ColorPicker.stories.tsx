import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/Form/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    format: {
      control: 'select',
      options: ['hex', 'rgb', 'hsl'],
    },
    showInput: { control: 'boolean' },
    showPresets: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  args: {
    label: 'Renk Sec',
    defaultValue: '#3b82f6',
  },
};

export const WithPresets: Story = {
  args: {
    label: 'Tema Rengi',
    presets: [
      { label: 'Birincil', colors: ['#3b82f6', '#2563eb', '#1d4ed8'] },
      { label: 'Basarili', colors: ['#22c55e', '#16a34a', '#15803d'] },
      { label: 'Uyari', colors: ['#f59e0b', '#d97706', '#b45309'] },
    ],
  },
};

export const WithoutInput: Story = {
  args: {
    showInput: false,
    defaultValue: '#ef4444',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ColorPicker key={size} size={size} label={size} defaultValue="#8b5cf6" />
      ))}
    </div>
  ),
};
