import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Primitives/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        label="Bildirimleri Ac"
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};

export const Checked: Story = {
  args: {
    label: 'Karanlik Mod',
    checked: true,
  },
};

export const WithDescription: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Switch
        label="Otomatik Guncelleme"
        description="Yeni surum ciktiginda otomatik olarak guncelle"
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    label: 'Devre Disi',
    checked: false,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Zorunlu Ayar',
    checked: true,
    disabled: true,
    description: 'Bu ayar yonetici tarafindan kilitlenmistir',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Switch label="Kucuk" size="sm" />
      <Switch label="Orta" size="md" />
      <Switch label="Buyuk" size="lg" />
    </div>
  ),
};

export const AyarlarFormu: Story = {
  name: 'Ayarlar Formu',
  render: () => {
    const [settings, setSettings] = useState({
      email: true,
      sms: false,
      push: true,
      marketing: false,
    });
    const toggle = (key: keyof typeof settings) =>
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 320 }}>
        <Switch
          label="E-posta Bildirimleri"
          description="Gunluk ozet ve onemli bildirimler"
          checked={settings.email}
          onCheckedChange={() => toggle('email')}
        />
        <Switch
          label="SMS Bildirimleri"
          description="Acil durum mesajlari"
          checked={settings.sms}
          onCheckedChange={() => toggle('sms')}
        />
        <Switch
          label="Anlik Bildirimler"
          description="Tarayici ve mobil bildirimler"
          checked={settings.push}
          onCheckedChange={() => toggle('push')}
        />
        <Switch
          label="Pazarlama Iletisimi"
          description="Kampanya ve firsatlar hakkinda bilgi"
          checked={settings.marketing}
          onCheckedChange={() => toggle('marketing')}
        />
      </div>
    );
  },
};
