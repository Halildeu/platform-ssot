import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AIActionAuditTimeline } from './AIActionAuditTimeline';
import type { AIActionAuditTimelineItem } from './AIActionAuditTimeline';

const meta: Meta<typeof AIActionAuditTimeline> = {
  title: 'Components/AI/AIActionAuditTimeline',
  component: AIActionAuditTimeline,
  tags: ['autodocs'],
  argTypes: {
    compact: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof AIActionAuditTimeline>;

const sampleItems: AIActionAuditTimelineItem[] = [
  { id: '1', actor: 'ai', title: 'Oneri olusturuldu', timestamp: '10:30', status: 'drafted', summary: 'AI tarafindan yeni bir oneri hazirlandi.' },
  { id: '2', actor: 'human', title: 'Oneri incelendi', timestamp: '11:00', status: 'approved', summary: 'Yonetici tarafindan onaylandi.' },
  { id: '3', actor: 'system', title: 'Islem yurutuldu', timestamp: '11:15', status: 'executed', summary: 'Sistem tarafindan otomatik olarak yurutuldu.' },
  { id: '4', actor: 'ai', title: 'Alternatif onerisi', timestamp: '12:00', status: 'rejected', summary: 'Bu oneri reddedildi.' },
];

export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

export const Compact: Story = {
  args: {
    items: sampleItems,
    compact: true,
  },
};

export const WithSelection: Story = {
  args: {
    items: sampleItems,
    selectedId: '2',
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const SingleItem: Story = {
  args: {
    items: [sampleItems[0]],
  },
};

export const ManyItems: Story = {
  args: {
    items: [...sampleItems, ...sampleItems.map((item) => ({ ...item, id: item.id + '-dup', timestamp: '14:00' }))],
  },
};
