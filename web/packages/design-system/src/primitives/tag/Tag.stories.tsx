import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Primitives/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'info', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    closable: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: 'Etiket',
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
    children: 'Basarili',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Uyari',
    variant: 'warning',
  },
};

export const ErrorTag: Story = {
  name: 'Error',
  args: {
    children: 'Hata',
    variant: 'error',
  },
};

export const Closable: Story = {
  args: {
    children: 'Kaldirabilir',
    variant: 'primary',
    closable: true,
    onClose: () => {},
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Ikonlu',
    variant: 'info',
    icon: (
      <svg viewBox="0 0 12 12" fill="currentColor">
        <circle cx="6" cy="6" r="5" />
      </svg>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Tag variant="default">Varsayilan</Tag>
      <Tag variant="primary">Birincil</Tag>
      <Tag variant="success">Basarili</Tag>
      <Tag variant="warning">Uyari</Tag>
      <Tag variant="error">Hata</Tag>
      <Tag variant="info">Bilgi</Tag>
      <Tag variant="danger">Tehlike</Tag>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Tag size="sm" variant="primary">Kucuk</Tag>
      <Tag size="md" variant="primary">Orta</Tag>
      <Tag size="lg" variant="primary">Buyuk</Tag>
    </div>
  ),
};
