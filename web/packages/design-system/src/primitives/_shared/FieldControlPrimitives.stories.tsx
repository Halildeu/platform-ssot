import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FieldControlShell } from './FieldControlPrimitives';

const meta: Meta<typeof FieldControlShell> = {
  component: FieldControlShell,
  title: 'Primitives/Shared/FieldControlShell',
};
export default meta;

type Story = StoryObj<typeof FieldControlShell>;

export const Default: Story = {
  args: {
    inputId: 'demo-input',
    label: 'Username',
    hint: 'Enter your username',
    required: true,
  },
  render: (args) => (
    <FieldControlShell {...args}>
      <input
        id={args.inputId}
        type="text"
        placeholder="johndoe"
        className="w-full rounded border px-3 py-2"
      />
    </FieldControlShell>
  ),
};

export const WithError: Story = {
  args: {
    inputId: 'error-input',
    label: 'Email',
    hint: 'Invalid email address',
    required: true,
  },
  render: (args) => (
    <FieldControlShell {...args}>
      <input
        id={args.inputId}
        type="email"
        placeholder="user@example.com"
        className="w-full rounded border border-red-500 px-3 py-2"
      />
    </FieldControlShell>
  ),
};

export const Optional: Story = {
  args: {
    inputId: 'optional-input',
    label: 'Nickname',
    hint: 'This field is optional',
    required: false,
  },
  render: (args) => (
    <FieldControlShell {...args}>
      <input
        id={args.inputId}
        type="text"
        placeholder="Optional nickname"
        className="w-full rounded border px-3 py-2"
      />
    </FieldControlShell>
  ),
};
