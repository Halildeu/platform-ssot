import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Upload } from './Upload';

const meta: Meta<typeof Upload> = {
  title: 'Components/Form/Upload',
  component: Upload,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Upload>;

export const Default: Story = {
  args: {
    label: 'Dosya Yukle',
    description: 'PNG, JPG veya PDF dosyalari yukleyebilirsiniz.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithFiles: Story = {
  args: {
    label: 'Belgeler',
    files: [
      { name: 'rapor.pdf', size: 1048576 },
      { name: 'logo.png', size: 524288 },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithError: Story = {
  args: {
    label: 'Profil Resmi',
    error: 'Dosya boyutu 5MB i asamaz.',
    invalid: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    label: 'Dosya Yukle',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const MultipleFiles: Story = {
  args: {
    label: 'Coklu Dosya',
    description: 'Birden fazla dosya secebilirsiniz.',
    multiple: true,
    maxFiles: 5,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};
