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
    defaultValue: 'var(--action-primary)',
  },
};

export const WithPresets: Story = {
  args: {
    label: 'Tema Rengi',
    presets: [
      { label: 'Birincil', colors: ['var(--action-primary)', 'var(--action-primary)', 'var(--action-primary)'] },
      { label: 'Basarili', colors: ['var(--state-success-text)', 'var(--state-success-text)', 'var(--state-success-text)'] },
      { label: 'Uyari', colors: ['var(--state-warning-text)', 'var(--state-warning-text)', 'var(--state-warning-text)'] },
    ],
  },
};

export const WithoutInput: Story = {
  args: {
    showInput: false,
    defaultValue: 'var(--state-danger-text)',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ColorPicker key={size} size={size} label={size} defaultValue="var(--action-primary)" />
      ))}
    </div>
  ),
};
