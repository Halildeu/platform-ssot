import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'danger', 'info', 'muted'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    dot: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Varsayilan',
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    children: 'Birincil',
    variant: 'primary',
  },
};

export const Success: Story = {
  args: {
    children: 'Onaylandi',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Beklemede',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    children: 'Hata',
    variant: 'error',
  },
};

export const Danger: Story = {
  args: {
    children: 'Reddedildi',
    variant: 'danger',
  },
};

export const Info: Story = {
  args: {
    children: 'Bilgi',
    variant: 'info',
  },
};

export const Muted: Story = {
  args: {
    children: 'Pasif',
    variant: 'muted',
  },
};

export const DotMode: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Badge variant="success" dot />
      <Badge variant="warning" dot />
      <Badge variant="error" dot />
      <Badge variant="primary" dot />
      <Badge variant="info" dot />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Badge variant="default">Varsayilan</Badge>
      <Badge variant="primary">Birincil</Badge>
      <Badge variant="success">Basarili</Badge>
      <Badge variant="warning">Uyari</Badge>
      <Badge variant="error">Hata</Badge>
      <Badge variant="danger">Tehlike</Badge>
      <Badge variant="info">Bilgi</Badge>
      <Badge variant="muted">Pasif</Badge>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Badge variant="primary" size="sm">Kucuk</Badge>
      <Badge variant="primary" size="md">Orta</Badge>
      <Badge variant="primary" size="lg">Buyuk</Badge>
    </div>
  ),
};
