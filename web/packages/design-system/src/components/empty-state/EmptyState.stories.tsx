import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from '../../primitives/button/Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    compact: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

const DefaultIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Default: Story = {
  args: {
    icon: DefaultIcon,
    title: 'Henuz veri yok',
    description: 'Ilk kaydinizi ekleyerek baslayin.',
    action: <Button variant="primary">Yeni Ekle</Button>,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="button"], button, [data-testid], input, [tabindex]');
    if (el) (el as HTMLElement).click();
  },
};

export const WithSecondaryAction: Story = {
  args: {
    icon: DefaultIcon,
    title: 'Sonuc bulunamadi',
    description: 'Arama kriterlerinizi degistirmeyi deneyin.',
    action: <Button variant="primary">Filtre Temizle</Button>,
    secondaryAction: <Button variant="ghost">Yardim</Button>,
  },
};

export const Compact: Story = {
  args: {
    icon: DefaultIcon,
    title: 'Liste bos',
    description: 'Eleman bulunamadi.',
    compact: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    title: 'Icerik mevcut degil',
    description: 'Bu bolumde henuz icerik bulunmamaktadir.',
  },
};

export const WithCustomAction: Story = {
  args: {
    icon: DefaultIcon,
    title: 'Ozel islem',
    description: 'Farkli bir islem baslatin.',
    action: <Button variant="outline">Geri Don</Button>,
  },
};

export const LargeTitle: Story = {
  args: {
    title: 'Bu bolumde henuz hicbir icerik bulunmamaktadir',
    description: 'Icerik eklemek icin yukaridaki butona tiklayin.',
  },
};
