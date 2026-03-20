import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import type { DropdownEntry } from './Dropdown';
import { Button } from '../button/Button';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Primitives/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

const temelOgeler: DropdownEntry[] = [
  { key: 'duzenle', label: 'Duzenle', onClick: () => {} },
  { key: 'kopyala', label: 'Kopyala', onClick: () => {} },
  { key: 'tasi', label: 'Tasi', onClick: () => {} },
  { type: 'separator' },
  { key: 'sil', label: 'Sil', danger: true, onClick: () => {} },
];

export const Default: Story = {
  render: () => (
    <Dropdown items={temelOgeler}>
      <Button variant="outline">Islemler</Button>
    </Dropdown>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <Dropdown
      items={[
        {
          key: 'yayinla',
          label: 'Yayinla',
          description: 'Herkese acik olarak yayinla',
          onClick: () => {},
        },
        {
          key: 'taslak',
          label: 'Taslak Olarak Kaydet',
          description: 'Daha sonra duzenlemek icin kaydet',
          onClick: () => {},
        },
        {
          key: 'zamanla',
          label: 'Zamanla',
          description: 'Belirli bir tarihte yayinla',
          onClick: () => {},
        },
      ]}
    >
      <Button>Yayinla</Button>
    </Dropdown>
  ),
};

export const WithLabelsAndSeparators: Story = {
  render: () => (
    <Dropdown
      items={[
        { type: 'label', label: 'KAYIT ISLEMLERI' },
        { key: 'goruntule', label: 'Goruntule', onClick: () => {} },
        { key: 'duzenle', label: 'Duzenle', onClick: () => {} },
        { type: 'separator' },
        { type: 'label', label: 'TEHLIKELI' },
        { key: 'arsivle', label: 'Arsivle', onClick: () => {} },
        { key: 'sil', label: 'Kalici Olarak Sil', danger: true, onClick: () => {} },
      ]}
    >
      <Button variant="outline">Daha Fazla</Button>
    </Dropdown>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <Dropdown
      items={[
        { key: 'kopyala', label: 'Kopyala', onClick: () => {} },
        { key: 'yapistir', label: 'Yapistir', onClick: () => {} },
        { key: 'geri-al', label: 'Geri Al', disabled: true, onClick: () => {} },
        { key: 'ileri-al', label: 'Ileri Al', disabled: true, onClick: () => {} },
      ]}
    >
      <Button variant="outline">Duzenle</Button>
    </Dropdown>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Dropdown
      items={[
        {
          key: 'ekle',
          label: 'Yeni Ekle',
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 3v10M3 8h10" strokeLinecap="round" />
            </svg>
          ),
          onClick: () => {},
        },
        {
          key: 'indir',
          label: 'Indir',
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 3v8M4 8l4 4 4-4M3 13h10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ),
          onClick: () => {},
        },
        { type: 'separator' },
        {
          key: 'sil',
          label: 'Sil',
          danger: true,
          icon: (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 4L4 12M4 4l8 8" strokeLinecap="round" />
            </svg>
          ),
          onClick: () => {},
        },
      ]}
    >
      <Button>Islemler</Button>
    </Dropdown>
  ),
};

export const BottomEnd: Story = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Dropdown items={temelOgeler} placement="bottom-end">
        <Button variant="outline">Sag Hizali</Button>
      </Dropdown>
    </div>
  ),
};
