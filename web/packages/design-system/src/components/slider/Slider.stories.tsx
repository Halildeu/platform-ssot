import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Form/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    label: 'Ses Seviyesi',
    defaultValue: 50,
    min: 0,
    max: 100,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithLabels: Story = {
  args: {
    label: 'Parlaklik',
    defaultValue: 70,
    min: 0,
    max: 100,
    minLabel: 'Dusuk',
    maxLabel: 'Yuksek',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithDescription: Story = {
  args: {
    label: 'Kalite',
    description: 'Video cikti kalitesini belirler.',
    defaultValue: 80,
    min: 0,
    max: 100,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithError: Story = {
  args: {
    label: 'Deger',
    error: 'Deger 10 ile 90 arasinda olmalidir.',
    invalid: true,
    defaultValue: 95,
    min: 0,
    max: 100,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    label: 'Devre Disi',
    defaultValue: 40,
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const SteppedValues: Story = {
  args: {
    label: 'Adim Sayisi',
    defaultValue: 20,
    min: 0,
    max: 100,
    step: 10,
    valueFormatter: (v: number) => `${v}%`,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};
