import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tree } from './Tree';
import type { TreeNode } from './Tree';

const meta: Meta<typeof Tree> = {
  title: 'Components/DataDisplay/Tree',
  component: Tree,
  tags: ['autodocs'],
  argTypes: {
    density: {
      control: 'select',
      options: ['comfortable', 'compact'],
    },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Tree>;

const organizasyon: TreeNode[] = [
  {
    key: 'yonetim',
    label: 'Ust Yonetim',
    description: 'Genel mudur ve yardimcilari',
    meta: '3 kisi',
    children: [
      {
        key: 'gm',
        label: 'Genel Mudur',
        description: 'Ahmet Yilmaz',
        badges: ['CEO'],
      },
      {
        key: 'gmy-1',
        label: 'Genel Mudur Yardimcisi - Finans',
        description: 'Mehmet Kaya',
      },
      {
        key: 'gmy-2',
        label: 'Genel Mudur Yardimcisi - Operasyon',
        description: 'Ayse Demir',
      },
    ],
  },
  {
    key: 'bilgi-teknolojileri',
    label: 'Bilgi Teknolojileri',
    description: 'Yazilim gelistirme ve altyapi',
    meta: '24 kisi',
    tone: 'info',
    badges: ['Teknoloji'],
    children: [
      {
        key: 'frontend',
        label: 'Frontend Ekibi',
        description: 'Web uygulamasi gelistirme',
        meta: '8 kisi',
        children: [
          { key: 'fe-1', label: 'React Gelistiriciler', meta: '5 kisi' },
          { key: 'fe-2', label: 'UI/UX Tasarimcilar', meta: '3 kisi' },
        ],
      },
      {
        key: 'backend',
        label: 'Backend Ekibi',
        description: 'API ve sunucu tarafli gelistirme',
        meta: '10 kisi',
      },
      {
        key: 'devops',
        label: 'DevOps',
        description: 'Altyapi ve surekli dagitim',
        meta: '6 kisi',
        tone: 'success',
      },
    ],
  },
  {
    key: 'insan-kaynaklari',
    label: 'Insan Kaynaklari',
    description: 'Ise alim ve calisan iliskileri',
    meta: '8 kisi',
  },
];

export const Default: Story = {
  args: {
    title: 'Organizasyon Yapisi',
    description: 'Sirket departman ve ekip yapisi',
    nodes: organizasyon,
    defaultExpandedKeys: ['yonetim', 'bilgi-teknolojileri'],
  },
  play: async ({ canvasElement }) => {
    const node = canvasElement.querySelector('[role="treeitem"], button, [data-testid]');
    if (node) (node as HTMLElement).click();
  },
};

export const WithSelection: Story = {
  render: () => {
    const [selectedKey, setSelectedKey] = useState<React.Key | null>('frontend');
    return (
      <Tree
        title="Ekip Sec"
        nodes={organizasyon}
        selectedKey={selectedKey}
        onNodeSelect={(key) => setSelectedKey(key)}
        defaultExpandedKeys={['bilgi-teknolojileri']}
      />
    );
  },
};

export const Compact: Story = {
  args: {
    title: 'Kompakt Gorunum',
    nodes: organizasyon,
    density: 'compact',
    defaultExpandedKeys: ['yonetim'],
  },
};

export const WithTones: Story = {
  args: {
    title: 'Durum Gosterimi',
    nodes: [
      {
        key: 'basarili',
        label: 'Tamamlanan Gorevler',
        description: 'Basariyla biten isler',
        tone: 'success',
        badges: ['3 adet'],
      },
      {
        key: 'uyari',
        label: 'Bekleyen Gorevler',
        description: 'Onay bekleyen isler',
        tone: 'warning',
        badges: ['5 adet'],
      },
      {
        key: 'hata',
        label: 'Sorunlu Gorevler',
        description: 'Mudahale gerektiren isler',
        tone: 'danger',
        badges: ['2 adet'],
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    title: 'Yukleniyor',
    nodes: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    title: 'Bos Agac',
    nodes: [],
    emptyStateLabel: 'Gosterilecek kayit bulunamadi.',
  },
};

export const ControlledExpansion: Story = {
  render: () => {
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['yonetim']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setExpandedKeys(['yonetim', 'bilgi-teknolojileri', 'frontend'])}
            style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border-default)', cursor: 'pointer' }}
          >
            Tumunu Ac
          </button>
          <button
            type="button"
            onClick={() => setExpandedKeys([])}
            style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border-default)', cursor: 'pointer' }}
          >
            Tumunu Kapat
          </button>
        </div>
        <Tree
          title="Kontrol Edilen Agac"
          nodes={organizasyon}
          expandedKeys={expandedKeys}
          onExpandedKeysChange={setExpandedKeys}
        />
      </div>
    );
  },
};
