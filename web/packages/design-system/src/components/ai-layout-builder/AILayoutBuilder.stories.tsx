import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AILayoutBuilder } from './AILayoutBuilder';
import type { LayoutBlock } from './AILayoutBuilder';

const meta: Meta<typeof AILayoutBuilder> = {
  title: 'Components/AI/AILayoutBuilder',
  component: AILayoutBuilder,
  tags: ['autodocs'],
  argTypes: {
    intent: {
      control: 'select',
      options: ['overview', 'detail', 'comparison', 'workflow', 'monitoring'],
    },
    columns: {
      control: 'select',
      options: [1, 2, 3, 4],
    },
    density: {
      control: 'select',
      options: ['comfortable', 'compact', 'spacious'],
    },
    draggable: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof AILayoutBuilder>;

const sampleBlocks: LayoutBlock[] = [
  { key: 'metric-1', type: 'metric', title: 'Toplam Kullanici', priority: 'high', content: <div style={{ fontSize: 24, fontWeight: 700 }}>1.234</div> },
  { key: 'metric-2', type: 'metric', title: 'Aktif Oturum', priority: 'high', content: <div style={{ fontSize: 24, fontWeight: 700 }}>89</div> },
  { key: 'chart-1', type: 'chart', title: 'Haftalik Trend', priority: 'medium', span: 2, content: <div style={{ height: 120, background: 'var(--surface-muted)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>Grafik alani</div> },
  { key: 'list-1', type: 'list', title: 'Son Islemler', priority: 'low', content: <div style={{ fontSize: 13 }}>Islem listesi burada gorunur</div> },
];

export const Default: Story = {
  args: {
    blocks: sampleBlocks,
    intent: 'overview',
    title: 'Dashboard',
  },
};

export const DetailIntent: Story = {
  args: {
    blocks: sampleBlocks,
    intent: 'detail',
    columns: 2,
  },
};

export const CompactDensity: Story = {
  args: {
    blocks: sampleBlocks,
    density: 'compact',
    columns: 3,
  },
};

export const Draggable: Story = {
  args: {
    blocks: sampleBlocks,
    draggable: true,
  },
};

export const CollapsibleBlocks: Story = {
  args: {
    blocks: sampleBlocks.map((b) => ({ ...b, collapsible: true })),
  },
};
