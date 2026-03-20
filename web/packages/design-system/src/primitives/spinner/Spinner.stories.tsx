import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Primitives/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    mode: {
      control: 'select',
      options: ['inline', 'block'],
    },
    label: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const BlockMode: Story = {
  args: {
    mode: 'block',
    label: 'Yukleniyor...',
    size: 'lg',
  },
};

export const CustomLabel: Story = {
  args: {
    mode: 'block',
    label: 'Veriler getiriliyor...',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const AllModes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Inline</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Spinner size="sm" mode="inline" />
          <span style={{ fontSize: 14 }}>Yukleniyor...</span>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Block</div>
        <Spinner size="md" mode="block" label="Icerik yukleniyor" />
      </div>
    </div>
  ),
};
