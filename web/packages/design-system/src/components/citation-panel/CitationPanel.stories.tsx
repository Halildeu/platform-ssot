import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CitationPanel } from './CitationPanel';
import type { CitationPanelItem } from './CitationPanel';

const meta: Meta<typeof CitationPanel> = {
  title: 'Components/AI/CitationPanel',
  component: CitationPanel,
  tags: ['autodocs'],
  argTypes: {
    compact: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof CitationPanel>;

const items: CitationPanelItem[] = [
  { id: '1', title: 'Guvenlik Politikasi v2.1', excerpt: 'Tum erisim kontrolleri yillik olarak gozden gecirilmelidir.', source: 'Kurumsal Politikalar', kind: 'policy' },
  { id: '2', title: 'API Dokumantasyonu', excerpt: 'Rate limiting 1000 istek/dakika olarak ayarlanmistir.', source: 'Teknik Dokumanlar', kind: 'doc' },
  { id: '3', title: 'auth-service/middleware.ts', excerpt: 'Token dogrulama JWT RS256 algoritmasi kullanir.', source: 'Kaynak Kodu', kind: 'code' },
];

export const Default: Story = {
  args: {
    items,
  },
};

export const Compact: Story = {
  args: {
    items,
    compact: true,
  },
};

export const WithActiveItem: Story = {
  args: {
    items,
    activeCitationId: '2',
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const SingleItem: Story = {
  args: {
    items: [items[0]],
  },
};

export const ManyItems: Story = {
  args: {
    items: [...items, ...items.map((item) => ({ ...item, id: item.id + '-dup', title: item.title + ' (Copy)' }))],
  },
};
