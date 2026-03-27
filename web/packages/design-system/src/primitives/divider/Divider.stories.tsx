import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Primitives/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    label: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <p style={{ margin: '0 0 4px', fontSize: 14 }}>Ust icerik</p>
        <Story />
        <p style={{ margin: '4px 0 0', fontSize: 14 }}>Alt icerik</p>
      </div>
    ),
  ],
};

export const WithLabel: Story = {
  args: {
    label: 'veya',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', alignItems: 'center', height: 40, gap: 8 }}>
        <span style={{ fontSize: 14 }}>Sol</span>
        <Story />
        <span style={{ fontSize: 14 }}>Sag</span>
      </div>
    ),
  ],
};

export const AllSpacings: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <p style={{ fontSize: 12, fontWeight: 600 }}>none</p>
      <Divider spacing="none" />
      <p style={{ fontSize: 12, fontWeight: 600 }}>sm</p>
      <Divider spacing="sm" />
      <p style={{ fontSize: 12, fontWeight: 600 }}>md</p>
      <Divider spacing="md" />
      <p style={{ fontSize: 12, fontWeight: 600 }}>lg</p>
      <Divider spacing="lg" />
    </div>
  ),
};
