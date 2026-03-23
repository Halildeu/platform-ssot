import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeLayout } from './ThemeLayout';

const Placeholder = ({ label, h = 80 }: { label: string; h?: number }) => (
  <div
    style={{
      height: h,
      background: 'var(--surface-muted, #f3f4f6)',
      border: '1px dashed var(--border-default, #d1d5db)',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      color: 'var(--text-secondary, #6b7280)',
    }}
  >
    {label}
  </div>
);

const sampleSlots = {
  header: <Placeholder label="Header / KPI Strip" h={60} />,
  charts: [
    <Placeholder key="c1" label="Chart 1" h={160} />,
    <Placeholder key="c2" label="Chart 2" h={160} />,
    <Placeholder key="c3" label="Chart 3" h={160} />,
    <Placeholder key="c4" label="Chart 4" h={160} />,
  ],
  grid: <Placeholder label="Data Grid" h={200} />,
  sidebar: <Placeholder label="Sidebar" h={300} />,
  footer: <Placeholder label="Footer" h={48} />,
};

const meta: Meta<typeof ThemeLayout> = {
  title: 'Enterprise/ThemeLayout',
  component: ThemeLayout,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ThemeLayout>;

export const Executive: Story = {
  args: {
    theme: 'executive',
    slots: sampleSlots,
  },
};

export const Operations: Story = {
  args: {
    theme: 'operations',
    slots: sampleSlots,
  },
};

export const Analytics: Story = {
  args: {
    theme: 'analytics',
    slots: sampleSlots,
  },
};

export const Compact: Story = {
  args: {
    theme: 'compact',
    slots: sampleSlots,
  },
};

export const MinimalSlots: Story = {
  args: {
    theme: 'executive',
    slots: { header: sampleSlots.header, grid: sampleSlots.grid },
  },
};

export const WithSidebar: Story = {
  args: {
    theme: 'operations',
    slots: { ...sampleSlots, sidebar: sampleSlots.sidebar },
  },
};
