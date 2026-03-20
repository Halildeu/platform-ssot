import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyErrorLoading } from './EmptyErrorLoading';

const meta: Meta<typeof EmptyErrorLoading> = {
  title: 'Components/Feedback/EmptyErrorLoading',
  component: EmptyErrorLoading,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['empty', 'error', 'loading'],
    },
    showSkeleton: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof EmptyErrorLoading>;

export const EmptyMode: Story = {
  args: {
    mode: 'empty',
    title: 'Veri bulunamadi',
    description: 'Henuz kayit bulunmamaktadir.',
  },
};

export const ErrorMode: Story = {
  args: {
    mode: 'error',
    title: 'Bir hata olustu',
    errorLabel: 'Sunucu baglantisi kurulamadi. Lutfen tekrar deneyin.',
    retryLabel: 'Tekrar Dene',
  },
};

export const LoadingMode: Story = {
  args: {
    mode: 'loading',
    loadingLabel: 'Veriler yukleniyor...',
  },
};

export const LoadingWithSkeleton: Story = {
  args: {
    mode: 'loading',
    showSkeleton: true,
    loadingLabel: 'Icerik hazirlaniyor...',
  },
};

export const AllModes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <EmptyErrorLoading mode="empty" title="Bos durum" />
      <EmptyErrorLoading mode="error" title="Hata durumu" />
      <EmptyErrorLoading mode="loading" title="Yukleme durumu" />
    </div>
  ),
};
