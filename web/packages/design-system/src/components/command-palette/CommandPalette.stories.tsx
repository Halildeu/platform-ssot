import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CommandPalette } from './CommandPalette';
import type { CommandPaletteItem } from './CommandPalette';
import { Button } from '../../primitives/button/Button';
import { Badge } from '../../primitives/badge/Badge';

const meta: Meta<typeof CommandPalette> = {
  title: 'Components/Navigation/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CommandPalette>;

const ornekKomutlar: CommandPaletteItem[] = [
  {
    id: 'dashboard',
    title: 'Ana Sayfa',
    description: 'Kontrol paneline git',
    group: 'Navigasyon',
    shortcut: 'G H',
    keywords: ['home', 'giris'],
  },
  {
    id: 'users',
    title: 'Kullanicilar',
    description: 'Kullanici yonetimi sayfasi',
    group: 'Navigasyon',
    shortcut: 'G U',
  },
  {
    id: 'reports',
    title: 'Raporlar',
    description: 'Denetim ve performans raporlari',
    group: 'Navigasyon',
    shortcut: 'G R',
  },
  {
    id: 'new-user',
    title: 'Yeni Kullanici Ekle',
    description: 'Sisteme yeni kullanici kaydı olustur',
    group: 'Islemler',
    shortcut: 'N U',
  },
  {
    id: 'new-report',
    title: 'Yeni Rapor Olustur',
    description: 'Bos rapor sablonu ile basla',
    group: 'Islemler',
    shortcut: 'N R',
  },
  {
    id: 'export',
    title: 'Disa Aktar',
    description: 'Verileri CSV veya Excel formatinda indir',
    group: 'Islemler',
  },
  {
    id: 'settings',
    title: 'Ayarlar',
    description: 'Sistem ayarlarini yapilandir',
    group: 'Sistem',
    shortcut: 'G S',
  },
  {
    id: 'theme',
    title: 'Tema Degistir',
    description: 'Acik/koyu tema arasinda gecis yap',
    group: 'Sistem',
  },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>
          Komut Paleti Ac (Cmd+K)
        </Button>
        <CommandPalette
          open={open}
          items={ornekKomutlar}
          onClose={() => setOpen(false)}
          onSelect={(id) => {
            setOpen(false);
          }}
        />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button');
    if (btn) (btn as HTMLElement).click();
  },
};

export const WithBadges: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const items: CommandPaletteItem[] = [
      {
        id: 'ai-summarize',
        title: 'AI ile Ozetle',
        description: 'Secili icerigi yapay zeka ile ozetler',
        group: 'AI Islemleri',
        badge: <Badge variant="primary" size="sm">AI</Badge>,
      },
      {
        id: 'ai-translate',
        title: 'AI ile Cevir',
        description: 'Icerik cevirisi yap',
        group: 'AI Islemleri',
        badge: <Badge variant="primary" size="sm">AI</Badge>,
      },
      {
        id: 'search',
        title: 'Gelismis Arama',
        description: 'Tum kayitlarda arama yap',
        group: 'Arama',
        badge: <Badge variant="muted" size="sm">Beta</Badge>,
      },
    ];
    return (
      <>
        <Button onClick={() => setOpen(true)}>Badge Ornegi</Button>
        <CommandPalette
          open={open}
          items={items}
          onClose={() => setOpen(false)}
          onSelect={() => setOpen(false)}
        />
      </>
    );
  },
};

export const WithDisabledItems: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const items: CommandPaletteItem[] = [
      {
        id: 'view',
        title: 'Goruntule',
        group: 'Islemler',
      },
      {
        id: 'edit',
        title: 'Duzenle',
        group: 'Islemler',
        disabled: true,
      },
      {
        id: 'delete',
        title: 'Sil',
        group: 'Islemler',
        disabled: true,
      },
    ];
    return (
      <>
        <Button onClick={() => setOpen(true)}>Devre Disi Ogeler</Button>
        <CommandPalette
          open={open}
          items={items}
          onClose={() => setOpen(false)}
          onSelect={() => setOpen(false)}
        />
      </>
    );
  },
};

export const EmptyState: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Bos Durum</Button>
        <CommandPalette
          open={open}
          items={[]}
          onClose={() => setOpen(false)}
          onSelect={() => setOpen(false)}
          emptyStateLabel="Eslesen komut bulunamadi."
        />
      </>
    );
  },
};

export const CustomFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Footer Ornegi</Button>
        <CommandPalette
          open={open}
          items={ornekKomutlar.slice(0, 3)}
          onClose={() => setOpen(false)}
          onSelect={() => setOpen(false)}
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
              <span>Yon tuslari ile gezin, Enter ile secin</span>
              <span>ESC ile kapatin</span>
            </div>
          }
        />
      </>
    );
  },
};

export const SingleGroup: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Tek Grup</Button>
        <CommandPalette
          open={open}
          items={ornekKomutlar.filter((k) => k.group === 'Navigasyon')}
          onClose={() => setOpen(false)}
          onSelect={() => setOpen(false)}
        />
      </>
    );
  },
};
