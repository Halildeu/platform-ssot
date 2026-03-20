import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ContextMenu } from './ContextMenu';
import type { ContextMenuEntry } from './ContextMenu';

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/Overlay/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof ContextMenu>;

const menuItems: ContextMenuEntry[] = [
  { key: 'cut', label: 'Kes', shortcut: 'Ctrl+X' },
  { key: 'copy', label: 'Kopyala', shortcut: 'Ctrl+C' },
  { key: 'paste', label: 'Yapistir', shortcut: 'Ctrl+V' },
  { type: 'separator', key: 'sep-1' },
  { key: 'delete', label: 'Sil', danger: true },
];

export const Default: Story = {
  args: {
    items: menuItems,
    children: (
      <div style={{ padding: 40, border: '2px dashed var(--border-subtle)', borderRadius: 12, textAlign: 'center', fontSize: 14 }}>
        Sag tikla
      </div>
    ),
  },
};

export const WithLabels: Story = {
  args: {
    items: [
      { type: 'label', key: 'actions-label', label: 'Islemler' },
      { key: 'edit', label: 'Duzenle' },
      { key: 'duplicate', label: 'Kopyala' },
      { type: 'separator', key: 'sep-1' },
      { type: 'label', key: 'danger-label', label: 'Tehlikeli' },
      { key: 'delete', label: 'Sil', danger: true },
    ],
    children: (
      <div style={{ padding: 40, border: '2px dashed var(--border-subtle)', borderRadius: 12, textAlign: 'center', fontSize: 14 }}>
        Sag tikla
      </div>
    ),
  },
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      { key: 'view', label: 'Goruntule' },
      { key: 'edit', label: 'Duzenle', disabled: true },
      { key: 'delete', label: 'Sil', disabled: true, danger: true },
    ],
    children: (
      <div style={{ padding: 40, border: '2px dashed var(--border-subtle)', borderRadius: 12, textAlign: 'center', fontSize: 14 }}>
        Sag tikla
      </div>
    ),
  },
};

export const Disabled: Story = {
  args: {
    items: menuItems,
    disabled: true,
    children: (
      <div style={{ padding: 40, border: '2px dashed var(--border-subtle)', borderRadius: 12, textAlign: 'center', fontSize: 14, opacity: 0.5 }}>
        Devre disi
      </div>
    ),
  },
};
