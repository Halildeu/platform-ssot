import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TimePicker } from './TimePicker';

const meta: Meta<typeof TimePicker> = {
  title: 'Components/Form/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  args: {
    label: 'Saat',
    defaultValue: '14:30',
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input, textarea, select');
    if (input) (input as HTMLElement).focus();
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithDescription: Story = {
  args: {
    label: 'Toplanti Saati',
    description: 'Toplanti baslangic saatini secin.',
    defaultValue: '09:00',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithError: Story = {
  args: {
    label: 'Bitis Saati',
    error: 'Bitis saati baslangictan sonra olmalidir.',
    invalid: true,
    defaultValue: '08:00',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    label: 'Saat',
    defaultValue: '12:00',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithMinMax: Story = {
  args: {
    label: 'Calisma Saati',
    min: '09:00',
    max: '18:00',
    hint: '09:00 - 18:00 arasi',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
};
