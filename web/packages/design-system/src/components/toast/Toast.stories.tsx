import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './Toast';
import { Button } from '../../primitives/button/Button';

const meta: Meta<typeof ToastProvider> = {
  title: 'Components/Feedback/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top-right', 'top-center', 'bottom-right', 'bottom-center'],
    },
    duration: { control: 'number' },
    maxVisible: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ToastProvider>;

function ToastDemoButtons() {
  const toast = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button variant="primary" onClick={() => toast.info('Bilgilendirme mesaji.')}>
        Info
      </Button>
      <Button
        variant="primary"
        onClick={() => toast.success('Islem basariyla tamamlandi.')}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning('Oturum suresi dolmak uzere.')}
      >
        Warning
      </Button>
      <Button
        variant="danger"
        onClick={() => toast.error('Bir hata olustu. Tekrar deneyiniz.')}
      >
        Error
      </Button>
    </div>
  );
}

export const Default: Story = {
  render: () => <ToastDemoButtons />,
};

function ToastWithTitleButtons() {
  const toast = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button
        onClick={() =>
          toast.success('Dosya basariyla yuklendi.', {
            title: 'Yukleme Tamamlandi',
          })
        }
      >
        Baslikli Toast
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toast.error('Sunucuya baglanilamadi.', {
            title: 'Baglanti Hatasi',
            duration: 8000,
          })
        }
      >
        Uzun Sureli Toast
      </Button>
    </div>
  );
}

export const WithTitle: Story = {
  render: () => <ToastWithTitleButtons />,
};

function AllVariantsButtons() {
  const toast = useToast();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Button
        onClick={() => {
          toast.info('Sistem bakimi planlanmistir.', { title: 'Bilgi' });
          toast.success('Kayit guncellendi.', { title: 'Basarili' });
          toast.warning('Disk alani azaliyor.', { title: 'Uyari' });
          toast.error('Islem basarisiz oldu.', { title: 'Hata' });
        }}
      >
        Tum Varyantlari Goster
      </Button>
    </div>
  );
}

export const AllVariants: Story = {
  render: () => <AllVariantsButtons />,
};

export const TopCenter: Story = {
  render: () => {
    function Demo() {
      const toast = useToast();
      return (
        <Button onClick={() => toast.info('Ust orta konum.')}>
          Ust Orta Toast
        </Button>
      );
    }
    return (
      <ToastProvider position="top-center">
        <Demo />
      </ToastProvider>
    );
  },
};

export const BottomRight: Story = {
  render: () => {
    function Demo() {
      const toast = useToast();
      return (
        <Button onClick={() => toast.success('Alt sag konum.')}>
          Alt Sag Toast
        </Button>
      );
    }
    return (
      <ToastProvider position="bottom-right">
        <Demo />
      </ToastProvider>
    );
  },
};
