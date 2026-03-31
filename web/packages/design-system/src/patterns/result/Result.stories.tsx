import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Result } from './Result';

const meta: Meta<typeof Result> = {
  title: 'Components/Patterns/Result',
  component: Result,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['success', 'info', 'warning', 'error', '403', '404', '500'] },
  },
  decorators: [(Story) => <div style={{ padding: '2rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Result>;

export const Success: Story = { args: { status: 'success', title: 'Odeme Basarili', subTitle: 'Siparis #12345 onaylandi.' } };
export const Error: Story = { args: { status: 'error', title: 'Gonderim Basarisiz', subTitle: 'Lutfen girdilerinizi kontrol edin.' } };
export const NotFound: Story = { args: { status: '404', title: 'Sayfa Bulunamadi', subTitle: 'Aradiginiz sayfa mevcut degil.' } };
export const Forbidden: Story = { args: { status: '403', title: 'Erisim Engellendi', subTitle: 'Bu sayfayi goruntuleme yetkiniz yok.' } };
export const ServerError: Story = { args: { status: '500', title: 'Sunucu Hatasi', subTitle: 'Lutfen daha sonra tekrar deneyin.' } };

export const WithExtra: Story = {
  render: () => (
    <Result status="success" title="Islem Tamamlandi" extra={
      <div className="flex gap-2">
        <button className="rounded-lg bg-action-primary px-4 py-2 text-sm text-white">Ana Sayfa</button>
        <button className="rounded-lg border border-border-default px-4 py-2 text-sm">Detaylar</button>
      </div>
    } />
  ),
};

export const AllStatuses: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 xl:grid-cols-4">
      {(['success', 'info', 'warning', 'error', '403', '404', '500'] as const).map((s) => (
        <Result key={s} status={s} />
      ))}
    </div>
  ),
};
