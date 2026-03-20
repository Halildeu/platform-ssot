import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LinkInline } from './LinkInline';

const meta: Meta<typeof LinkInline> = {
  title: 'Components/Primitives/LinkInline',
  component: LinkInline,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    underline: {
      control: 'select',
      options: ['always', 'hover', 'none'],
    },
    disabled: { control: 'boolean' },
    external: { control: 'boolean' },
    current: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof LinkInline>;

export const Default: Story = {
  args: {
    children: 'Detaylari Goruntule',
    href: '#',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Ikincil Baglanti',
    href: '#',
    tone: 'secondary',
  },
};

export const ExternalLink: Story = {
  args: {
    children: 'Harici Sayfa',
    href: 'https://example.com',
    external: true,
  },
};

export const AlwaysUnderline: Story = {
  args: {
    children: 'Her Zaman Alt Cizgili',
    href: '#',
    underline: 'always',
  },
};

export const NoUnderline: Story = {
  args: {
    children: 'Alt Cizgisiz',
    href: '#',
    underline: 'none',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Devre Disi Baglanti',
    href: '#',
    disabled: true,
  },
};

export const CurrentPage: Story = {
  args: {
    children: 'Mevcut Sayfa',
    href: '#',
    current: true,
  },
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <LinkInline href="#" tone="primary">Birincil</LinkInline>
      <LinkInline href="#" tone="secondary">Ikincil</LinkInline>
    </div>
  ),
};

export const AllUnderlineStyles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <LinkInline href="#" underline="always">Her Zaman</LinkInline>
      <LinkInline href="#" underline="hover">Hover</LinkInline>
      <LinkInline href="#" underline="none">Yok</LinkInline>
    </div>
  ),
};
