import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ApprovalCheckpoint } from './ApprovalCheckpoint';

const meta: Meta<typeof ApprovalCheckpoint> = {
  title: 'Components/Workflow/ApprovalCheckpoint',
  component: ApprovalCheckpoint,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['pending', 'approved', 'rejected', 'blocked'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof ApprovalCheckpoint>;

export const Default: Story = {
  args: {
    title: 'Yayin Onay Noktasi',
    summary: 'Bu degisiklik canli ortama alinmadan once onay gerektirir.',
    status: 'pending',
    steps: [
      { key: '1', label: 'Kod incelemesi', status: 'approved' },
      { key: '2', label: 'Guvenlik taramasi', status: 'ready' },
      { key: '3', label: 'Yonetici onayi', status: 'todo' },
    ],
  },
};

export const Approved: Story = {
  args: {
    title: 'Onaylanan Kontrol Noktasi',
    summary: 'Tum adimlar tamamlandi.',
    status: 'approved',
    steps: [
      { key: '1', label: 'Kod incelemesi', status: 'approved' },
      { key: '2', label: 'Test sonuclari', status: 'approved' },
    ],
  },
};

export const Rejected: Story = {
  args: {
    title: 'Reddedilen Istek',
    summary: 'Guvenlik gereksinimleri karsilanmadi.',
    status: 'rejected',
  },
};

export const Blocked: Story = {
  args: {
    title: 'Engellenen Islem',
    summary: 'On kosullar tamamlanmadi.',
    status: 'blocked',
    steps: [
      { key: '1', label: 'Bagimlilik kontrolu', status: 'blocked' },
    ],
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['pending', 'approved', 'rejected', 'blocked'] as const).map((status) => (
        <ApprovalCheckpoint
          key={status}
          title={`${status} durumu`}
          summary={`Bu bir ${status} durumundaki kontrol noktasidir.`}
          status={status}
        />
      ))}
    </div>
  ),
};
