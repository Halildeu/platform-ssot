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

export const Disabled: Story = {
  args: {
    inputId: 'disabled-input',
    label: 'Disabled field',
    hint: 'This field is disabled',
    required: false,
  },
  render: (args) => (
    <FieldControlShell {...args}>
      <input
        id={args.inputId}
        type="text"
        placeholder="Cannot edit"
        disabled
        className="w-full rounded border px-3 py-2 opacity-50"
      />
    </FieldControlShell>
  ),
};

export const WithDescription: Story = {
  args: {
    inputId: 'desc-input',
    label: 'Full Name',
    description: 'Please enter your legal name as shown on official documents',
    hint: 'First and last name',
    required: false,
  },
  render: (args) => (
    <FieldControlShell {...args}>
      <input
        id={args.inputId}
        type="text"
        placeholder="John Doe"
        className="w-full rounded border px-3 py-2"
      />
    </FieldControlShell>
  ),
};

export const WithCount: Story = {
  args: {
    inputId: 'count-input',
    label: 'Bio',
    hint: 'Write a short bio',
    countLabel: '42/200',
    required: false,
  },
  render: (args) => (
    <FieldControlShell {...args}>
      <textarea
        id={args.inputId}
        placeholder="Tell us about yourself..."
        className="w-full rounded border px-3 py-2"
        rows={3}
      />
    </FieldControlShell>
  ),
};

export const WithLongLabel: Story = {
  args: {
    inputId: 'long-label-input',
    label: 'A very long field label that might wrap to the next line in narrow containers',
    hint: 'Hint text for the long label field',
    required: true,
  },
  render: (args) => (
    <FieldControlShell {...args}>
      <input
        id={args.inputId}
        type="text"
        placeholder="Enter value"
        className="w-full rounded border px-3 py-2"
      />
    </FieldControlShell>
  ),
};
