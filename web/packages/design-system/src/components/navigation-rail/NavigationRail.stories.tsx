import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NavigationRail } from './NavigationRail';
import type { NavigationRailItem } from './NavigationRail';

const HomeIcon = <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1L1 7h2v6h4V9h2v4h4V7h2L8 1z" /></svg>;
const TaskIcon = <svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 3h10v10H3V3zm1 1v8h8V4H4zm2 2h4v1H6V6zm0 2h4v1H6V8z" /></svg>;
const ChartIcon = <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 14V6h3v8H2zm5 0V2h3v12H7zm5 0V9h3v5h-3z" /></svg>;
const GearIcon = <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 10a2 2 0 100-4 2 2 0 000 4z" /></svg>;

const meta: Meta<typeof NavigationRail> = {
  title: 'Components/Navigation/NavigationRail',
  component: NavigationRail,
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
    labelVisibility: {
      control: 'select',
      options: ['always', 'active', 'none'],
    },
    compact: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400, display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof NavigationRail>;

const items: NavigationRailItem[] = [
  { value: 'home', label: 'Ana Sayfa', icon: HomeIcon },
  { value: 'tasks', label: 'Gorevler', icon: TaskIcon, badge: <span style={{ fontSize: 9 }}>3</span> },
  { value: 'reports', label: 'Raporlar', icon: ChartIcon },
  { value: 'settings', label: 'Ayarlar', icon: GearIcon },
];

export const Default: Story = {
  args: {
    items,
    defaultValue: 'home',
  },
};

export const CompactMode: Story = {
  args: {
    items,
    compact: true,
    defaultValue: 'home',
  },
};

export const LabelsHidden: Story = {
  args: {
    items,
    labelVisibility: 'none',
    defaultValue: 'tasks',
  },
};

export const LabelsOnActive: Story = {
  args: {
    items,
    labelVisibility: 'active',
    defaultValue: 'reports',
  },
};
