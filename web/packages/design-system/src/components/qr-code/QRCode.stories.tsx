import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QRCode } from './QRCode';

const meta: Meta<typeof QRCode> = {
  title: 'Components/Data/QRCode',
  component: QRCode,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'number' },
    errorLevel: {
      control: 'select',
      options: ['L', 'M', 'Q', 'H'],
    },
    bordered: { control: 'boolean' },
    status: {
      control: 'select',
      options: ['active', 'expired', 'loading'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof QRCode>;

export const Default: Story = {
  args: {
    value: 'https://example.com',
  },
};

export const LargeSize: Story = {
  args: {
    value: 'https://example.com/login',
    size: 200,
  },
};

export const Bordered: Story = {
  args: {
    value: 'https://example.com',
    bordered: true,
  },
};

export const Expired: Story = {
  args: {
    value: 'https://example.com/expired',
    status: 'expired',
  },
};

export const Loading: Story = {
  args: {
    value: 'https://example.com',
    status: 'loading',
  },
};

export const CustomColors: Story = {
  args: {
    value: 'https://example.com',
    color: '#3b82f6',
    bgColor: '#f0f9ff',
  },
};

export const HighErrorCorrection: Story = {
  args: {
    value: 'https://example.com',
    errorLevel: 'H',
  },
};
