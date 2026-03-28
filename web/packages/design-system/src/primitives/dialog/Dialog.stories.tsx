import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './Dialog';
import { Button } from '../button/Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Primitives/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    closable: { control: 'boolean' },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Dialog Ac</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Onay"
          description="Bu islemi gerceklestirmek istediginize emin misiniz?"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Iptal
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Onayla
              </Button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
            Bu islem geri alinamaz. Devam etmek istiyor musunuz?
          </p>
        </Dialog>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button');
    if (btn) (btn as HTMLElement).click();
  },
};

export const Small: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Kucuk Dialog</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          size="sm"
          title="Bilgi"
        >
          <p style={{ margin: 0, fontSize: 14 }}>
            Islem basariyla tamamlandi.
          </p>
        </Dialog>
      </>
    );
  },
};

export const Large: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Buyuk Dialog</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          size="lg"
          title="Detayli Rapor"
          description="Ocak 2024 performans raporu"
          footer={
            <Button variant="primary" onClick={() => setOpen(false)}>
              Kapat
            </Button>
          }
        >
          <div style={{ fontSize: 14 }}>
            <p>Rapor icerigini gormektesiniz. Bu dialog buyuk boyuttadir ve daha fazla icerik gosterebilir.</p>
            <p>Birden fazla paragraf ve detayli bilgi icin uygundur.</p>
          </div>
        </Dialog>
      </>
    );
  },
};

export const WithoutCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Kapatma Buton Yok</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          closable={false}
          title="Zorunlu Islem"
          footer={
            <Button variant="primary" onClick={() => setOpen(false)}>
              Tamam
            </Button>
          }
        >
          <p style={{ margin: 0, fontSize: 14 }}>
            Bu dialog yalnizca buton ile kapatilabilir.
          </p>
        </Dialog>
      </>
    );
  },
};

export const AllSizes: Story = {
  render: () => {
    const [openSize, setOpenSize] = useState<string | null>(null);
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {sizes.map((size) => (
          <React.Fragment key={size}>
            <Button onClick={() => setOpenSize(size)}>
              {size.toUpperCase()}
            </Button>
            <Dialog
              open={openSize === size}
              onClose={() => setOpenSize(null)}
              size={size}
              title={`${size.toUpperCase()} Dialog`}
              footer={
                <Button variant="primary" onClick={() => setOpenSize(null)}>
                  Kapat
                </Button>
              }
            >
              <p style={{ margin: 0, fontSize: 14 }}>
                Bu {size.toUpperCase()} boyutunda bir dialog penceresidir.
              </p>
            </Dialog>
          </React.Fragment>
        ))}
      </div>
    );
  },
};
