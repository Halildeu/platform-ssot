import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CommentThread } from './CommentThread';
import type { Comment } from './CommentThread';

const sampleComments: Comment[] = [
  {
    id: '1',
    author: { name: 'Ali Yilmaz' },
    content: 'Bu rapor son derece detayli olmus, tebrikler.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    replies: [
      {
        id: '1-1',
        author: { name: 'Zeynep Kaya' },
        content: 'Katiliyorum, grafik bolumu ozellikle basarili.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        replies: [
          {
            id: '1-1-1',
            author: { name: 'Ali Yilmaz' },
            content: 'Tesekkurler Zeynep, gelecek hafta detaylandiriyoruz.',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            edited: true,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    author: { name: 'Mehmet Demir' },
    content: 'Maliyet analizi bolumunde eksik veriler var, guncelleyebilir miyiz?',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

const meta: Meta<typeof CommentThread> = {
  title: 'Enterprise/CommentThread',
  component: CommentThread,
  tags: ['autodocs'],
  argTypes: {
    maxDepth: { control: { type: 'number', min: 0, max: 5 } },
    showReplyForm: { control: 'boolean' },
    access: {
      control: 'select',
      options: ['full', 'readonly', 'disabled', 'hidden'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem', maxWidth: 640 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof CommentThread>;

export const Default: Story = {
  args: {
    comments: sampleComments,
    currentUser: { name: 'Ali Yilmaz' },
    showReplyForm: true,
    maxDepth: 3,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component="comment-thread"]');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const ReadOnly: Story = {
  args: {
    comments: sampleComments,
    currentUser: { name: 'Ali Yilmaz' },
    access: 'readonly',
  },
};

export const EmptyThread: Story = {
  args: {
    comments: [],
    currentUser: { name: 'Zeynep Kaya' },
    showReplyForm: true,
  },
};
