import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MenuBar } from './MenuBar';
import type { MenuBarItem } from './MenuBar';

const meta: Meta<typeof MenuBar> = {
  title: 'Components/Navigation/MenuBar',
  component: MenuBar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    appearance: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof MenuBar>;

const items: MenuBarItem[] = [
  { value: 'home', label: 'Ana Sayfa' },
  { value: 'projects', label: 'Projeler' },
  { value: 'tasks', label: 'Gorevler', badge: <span style={{ fontSize: 10 }}>5</span> },
  { value: 'reports', label: 'Raporlar' },
  { value: 'settings', label: 'Ayarlar' },
];

export const Default: Story = {
  args: {
    items,
    defaultValue: 'home',
  },
};

export const OutlineAppearance: Story = {
  args: {
    items,
    appearance: 'outline',
    defaultValue: 'projects',
  },
};

export const GhostAppearance: Story = {
  args: {
    items,
    appearance: 'ghost',
    defaultValue: 'tasks',
  },
};

export const SmallSize: Story = {
  args: {
    items,
    size: 'sm',
    defaultValue: 'home',
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      ...items.slice(0, 3),
      { value: 'premium', label: 'Premium', disabled: true },
      ...items.slice(3),
    ],
    defaultValue: 'home',
  },
};

export const FewItems: Story = {
  args: {
    items: items.slice(0, 2),
    defaultValue: 'home',
  },
};
