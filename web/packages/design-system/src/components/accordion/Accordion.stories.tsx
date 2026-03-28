import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, createAccordionPreset } from './Accordion';
import type { AccordionItem } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Layout/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    bordered: { control: 'boolean' },
    ghost: { control: 'boolean' },
    showArrow: { control: 'boolean' },
    expandIconPosition: {
      control: 'select',
      options: ['start', 'end'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Accordion>;

const sssItems: AccordionItem[] = [
  {
    value: 'iade',
    title: 'Iade sureci nasil isler?',
    content:
      'Satin aldiginiz urunu 14 gun icinde iade edebilirsiniz. Urun kullanilmamis ve orijinal ambalajinda olmalidir. Iade talebinizi hesabinizdan olusturabilirsiniz.',
  },
  {
    value: 'kargo',
    title: 'Kargo suresi ne kadar?',
    content:
      'Standart kargo ile 3-5 is gunu, hizli kargo ile 1-2 is gunu icinde teslimat yapilmaktadir. Istanbul ici siparisler ayni gun icerisinde teslim edilebilir.',
  },
  {
    value: 'odeme',
    title: 'Hangi odeme yontemlerini kabul ediyorsunuz?',
    content:
      'Kredi karti, banka karti, havale/EFT ve kapida odeme seceneklerini destekliyoruz. 9 aya kadar taksit imkani sunulmaktadir.',
  },
  {
    value: 'garanti',
    title: 'Garanti kapsaminda neler yer aliyor?',
    content:
      'Tum urunlerimiz 2 yil garanti kapsamindadir. Uretim hatalarindan kaynaklanan sorunlar ucretsiz onarilir veya degistirilir.',
  },
];

export const Default: Story = {
  args: {
    items: sssItems,
    selectionMode: 'single',
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('button, [role="button"], [data-testid]');
    if (trigger) (trigger as HTMLElement).click();
  },
};

export const MultipleSelection: Story = {
  args: {
    items: sssItems,
    selectionMode: 'multiple',
  },
};

export const Ghost: Story = {
  args: {
    items: sssItems,
    ghost: true,
    bordered: false,
  },
};

export const SmallSize: Story = {
  args: {
    items: sssItems,
    size: 'sm',
  },
};

export const WithDescriptions: Story = {
  args: {
    items: [
      {
        value: 'profil',
        title: 'Profil Ayarlari',
        description: 'Kisisel bilgilerinizi ve tercihlerinizi yonetin',
        content: 'Profil detaylari burada goruntulenir.',
      },
      {
        value: 'guvenlik',
        title: 'Guvenlik',
        description: 'Sifre, iki faktorlu dogrulama ve oturum yonetimi',
        content: 'Guvenlik ayarlari burada goruntulenir.',
      },
      {
        value: 'bildirimler',
        title: 'Bildirim Tercihleri',
        description: 'E-posta, SMS ve uygulama bildirimlerini yapilandirin',
        content: 'Bildirim tercihleri burada goruntulenir.',
      },
    ],
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { value: 'a', title: 'Aktif Bolum', content: 'Bu bolum acilabilir.' },
      {
        value: 'b',
        title: 'Devre Disi Bolum',
        content: 'Bu bolum acilamaz.',
        disabled: true,
      },
      { value: 'c', title: 'Diger Bolum', content: 'Bu bolum de acilabilir.' },
    ],
  },
};

export const FAQPreset: Story = {
  name: 'SSS Preset',
  args: {
    items: sssItems,
    ...createAccordionPreset('faq'),
  },
};

export const CompactPreset: Story = {
  name: 'Kompakt Preset',
  args: {
    items: sssItems,
    ...createAccordionPreset('compact'),
  },
};

export const SettingsPreset: Story = {
  name: 'Ayarlar Preset',
  args: {
    items: sssItems,
    ...createAccordionPreset('settings'),
  },
};
