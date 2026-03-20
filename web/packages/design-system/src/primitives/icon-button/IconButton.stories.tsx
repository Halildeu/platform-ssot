import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const PlusIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3v10M3 8h10" strokeLinecap="round" />
  </svg>
);

const TrashIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EditIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'Components/Primitives/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    rounded: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: PlusIcon,
    label: 'Ekle',
    variant: 'ghost',
  },
};

export const Primary: Story = {
  args: {
    icon: PlusIcon,
    label: 'Ekle',
    variant: 'primary',
  },
};

export const Danger: Story = {
  args: {
    icon: TrashIcon,
    label: 'Sil',
    variant: 'danger',
  },
};

export const Loading: Story = {
  args: {
    icon: EditIcon,
    label: 'Duzenle',
    variant: 'primary',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    icon: EditIcon,
    label: 'Duzenle',
    variant: 'primary',
    disabled: true,
  },
};

export const Rounded: Story = {
  args: {
    icon: PlusIcon,
    label: 'Ekle',
    variant: 'primary',
    rounded: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <IconButton icon={EditIcon} label="Primary" variant="primary" />
      <IconButton icon={EditIcon} label="Secondary" variant="secondary" />
      <IconButton icon={EditIcon} label="Outline" variant="outline" />
      <IconButton icon={EditIcon} label="Ghost" variant="ghost" />
      <IconButton icon={TrashIcon} label="Danger" variant="danger" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <IconButton icon={PlusIcon} label="XS" size="xs" variant="primary" />
      <IconButton icon={PlusIcon} label="SM" size="sm" variant="primary" />
      <IconButton icon={PlusIcon} label="MD" size="md" variant="primary" />
      <IconButton icon={PlusIcon} label="LG" size="lg" variant="primary" />
    </div>
  ),
};
