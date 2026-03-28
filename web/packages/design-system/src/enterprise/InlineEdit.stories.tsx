import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InlineEdit } from './InlineEdit';

const meta: Meta<typeof InlineEdit> = {
  title: 'Enterprise/InlineEdit',
  component: InlineEdit,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof InlineEdit>;

export const Default: Story = {
  args: {
    value: 'Project Alpha',
    onSave: (value: string) => console.log('Saved:', value),
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-testid], span, button');
    if (el) { const dblClick = new MouseEvent('dblclick', { bubbles: true }); el.dispatchEvent(dblClick); }
  },
};

export const NumberType: Story = {
  args: {
    value: '42500',
    type: 'number',
    onSave: (value: string) => console.log('Saved:', value),
    formatDisplay: (v: string) => `$${Number(v).toLocaleString()}`,
  },
};

export const SelectType: Story = {
  args: {
    value: 'active',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'paused', label: 'Paused' },
      { value: 'archived', label: 'Archived' },
    ],
    onSave: (value: string) => console.log('Saved:', value),
  },
};

export const WithValidation: Story = {
  args: {
    value: 'user@example.com',
    placeholder: 'Enter email address',
    validate: (v: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Invalid email format'),
    onSave: (value: string) => console.log('Saved:', value),
  },
};

export const Disabled: Story = {
  args: {
    value: 'Read-only value',
    disabled: true,
    onSave: (value: string) => console.log('Saved:', value),
  },
};

export const EmptyValue: Story = {
  args: {
    value: '',
    placeholder: 'Click to edit',
    onSave: (value: string) => console.log('Saved:', value),
  },
};
