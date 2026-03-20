import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';
import { Button } from '../button/Button';

const meta: Meta<typeof Alert> = {
  title: 'Components/Primitives/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    closable: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Bilgilendirme',
    children: 'Sistem bakimi 22:00-02:00 arasinda yapilacaktir.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Basarili',
    children: 'Kaydiniz basariyla olusturuldu.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Uyari',
    children: 'Oturum suresinin dolmasina 5 dakika kaldi.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Hata',
    children: 'Baglanti kurulamadi. Lutfen tekrar deneyiniz.',
  },
};

export const Closable: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    if (!visible) {
      return (
        <Button variant="outline" onClick={() => setVisible(true)}>
          Tekrar Goster
        </Button>
      );
    }
    return (
      <Alert
        variant="info"
        title="Kapatilabilir Bildirim"
        closable
        onClose={() => setVisible(false)}
      >
        Bu bildirimi kapatabilirsiniz.
      </Alert>
    );
  },
};

export const WithAction: Story = {
  args: {
    variant: 'warning',
    title: 'Guncelleme Mevcut',
    children: 'Yeni bir surum yayinlandi. Simdi guncelleyebilirsiniz.',
    action: (
      <Button size="xs" variant="outline">
        Guncelle
      </Button>
    ),
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: 'info',
    children: 'Basliklar isteege baglidir. Sadece icerik gosterilebilir.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 500 }}>
      <Alert variant="info" title="Bilgi">
        Bilgilendirme mesaji.
      </Alert>
      <Alert variant="success" title="Basarili">
        Islem basariyla tamamlandi.
      </Alert>
      <Alert variant="warning" title="Uyari">
        Dikkat edilmesi gereken bir durum var.
      </Alert>
      <Alert variant="error" title="Hata">
        Bir hata olustu.
      </Alert>
    </div>
  ),
};
