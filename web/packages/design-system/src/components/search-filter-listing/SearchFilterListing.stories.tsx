import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchFilterListing } from './SearchFilterListing';
import type { ActiveFilter } from './SearchFilterListing';
import { Badge } from '../../primitives/badge/Badge';
import { Button } from '../../primitives/button/Button';
import { Input } from '../../primitives/input/Input';
import { Select } from '../../primitives/select/Select';

const meta: Meta<typeof SearchFilterListing> = {
  title: 'Components/Patterns/SearchFilterListing',
  component: SearchFilterListing,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'compact'],
    },
    loading: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 900, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SearchFilterListing>;

const ornekSonuclar = [
  <div key="1" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-subtle, #e2e8f0)' }}>
    <div style={{ fontWeight: 600, fontSize: 14 }}>Yillik Denetim Raporu - 2024</div>
    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
      Hazirlayan: Mehmet Kaya | Tarih: 15.01.2024 | Durum: Tamamlandi
    </div>
  </div>,
  <div key="2" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-subtle, #e2e8f0)' }}>
    <div style={{ fontWeight: 600, fontSize: 14 }}>Risk Degerlendirme Raporu - Q4</div>
    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
      Hazirlayan: Ayse Demir | Tarih: 20.12.2023 | Durum: Inceleme Bekliyor
    </div>
  </div>,
  <div key="3" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-subtle, #e2e8f0)' }}>
    <div style={{ fontWeight: 600, fontSize: 14 }}>Uyum Kontrol Listesi - Aralik</div>
    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
      Hazirlayan: Ali Yildiz | Tarih: 31.12.2023 | Durum: Devam Ediyor
    </div>
  </div>,
];

export const Default: Story = {
  args: {
    title: 'Denetim Raporlari',
    description: 'Tum denetim raporlarini goruntuleyebilir ve filtreleyebilirsiniz.',
    items: ornekSonuclar,
    totalCount: 47,
    listTitle: 'Sonuclar',
    actions: <Button size="sm">Yeni Rapor</Button>,
    filters: (
      <div style={{ display: 'flex', gap: 8 }}>
        <Input placeholder="Rapor ara..." size="sm" fullWidth={false} />
        <Select
          options={[
            { value: 'all', label: 'Tum Durumlar' },
            { value: 'tamamlandi', label: 'Tamamlandi' },
            { value: 'bekliyor', label: 'Bekliyor' },
            { value: 'devam', label: 'Devam Ediyor' },
          ]}
          placeholder="Durum"
          size="sm"
          fullWidth={false}
        />
      </div>
    ),
  },
};

export const WithActiveFilters: Story = {
  args: {
    title: 'Kullanici Listesi',
    description: 'Sistemdeki tum kullanicilari yonetebilirsiniz.',
    items: ornekSonuclar,
    totalCount: 12,
    listTitle: 'Filtrelenmis Sonuclar',
    activeFilters: [
      { key: 'dept', label: 'Departman', value: 'Bilgi Teknolojileri', onRemove: () => {} },
      { key: 'role', label: 'Rol', value: 'Yonetici', onRemove: () => {} },
    ] as ActiveFilter[],
    onClearAllFilters: () => {},
  },
};

export const WithSummary: Story = {
  args: {
    title: 'Performans Ozeti',
    description: 'Aylik performans metrikleri ve ozet veriler.',
    eyebrow: 'Raporlama',
    status: <Badge variant="success">Guncel</Badge>,
    items: ornekSonuclar,
    totalCount: 47,
    summaryItems: [
      { label: 'Toplam Rapor', value: '47', change: '+5', changeTone: 'positive' as const },
      { label: 'Tamamlanan', value: '38', change: '+3', changeTone: 'positive' as const },
      { label: 'Bekleyen', value: '9', change: '-2', changeTone: 'negative' as const },
    ],
  },
};

export const Loading: Story = {
  args: {
    title: 'Yukleniyor...',
    loading: true,
    items: [],
  },
};

export const Empty: Story = {
  args: {
    title: 'Arama Sonuclari',
    description: 'Aramaniza uygun sonuc bulunamadi.',
    items: [],
    emptyStateLabel: 'Aramaniza uygun sonuc bulunamadi. Farkli anahtar kelimeler deneyin.',
  },
};

export const Compact: Story = {
  args: {
    title: 'Kompakt Gorunum',
    items: ornekSonuclar,
    totalCount: 47,
    size: 'compact',
    listTitle: 'Sonuclar',
  },
};

export const WithSorting: Story = {
  args: {
    title: 'Siralama Ornegi',
    items: ornekSonuclar,
    totalCount: 47,
    listTitle: 'Sonuclar',
    sortOptions: [
      { key: 'tarih', label: 'Tarih' },
      { key: 'baslik', label: 'Baslik' },
      { key: 'durum', label: 'Durum' },
    ],
    activeSort: { key: 'tarih', direction: 'desc' as const },
  },
};
