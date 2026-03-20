import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../button/Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Primitives/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    surface: {
      control: 'select',
      options: ['base', 'confirm', 'destructive', 'audit'],
    },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Modal Ac</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Kullanici Ekle"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Iptal
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Kaydet
              </Button>
            </>
          }
        >
          <div style={{ fontSize: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: 0 }}>
              Yeni kullanici bilgilerini giriniz.
            </p>
          </div>
        </Modal>
      </>
    );
  },
};

export const ConfirmSurface: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Onay Modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          surface="confirm"
          title="Islemi Onaylayin"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Vazgec
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Onayla
              </Button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14 }}>
            Secili kayitlar onaylanacaktir. Devam etmek istiyor musunuz?
          </p>
        </Modal>
      </>
    );
  },
};

export const DestructiveSurface: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>Silme Modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          surface="destructive"
          title="Kaydi Sil"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Iptal
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Sil
              </Button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14 }}>
            Bu kayit kalici olarak silinecektir. Bu islem geri alinamaz.
          </p>
        </Modal>
      </>
    );
  },
};

export const AuditSurface: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Denetim Modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          surface="audit"
          title="Denetim Kaydi"
          footer={
            <Button variant="primary" onClick={() => setOpen(false)}>
              Kapat
            </Button>
          }
        >
          <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><strong>Islem:</strong> Kullanici guncelleme</div>
            <div><strong>Tarih:</strong> 15.01.2024 14:30</div>
            <div><strong>Kullanici:</strong> admin@sirket.com</div>
          </div>
        </Modal>
      </>
    );
  },
};

export const AllSizes: Story = {
  render: () => {
    const [openSize, setOpenSize] = useState<string | null>(null);
    const sizes = ['sm', 'md', 'lg'] as const;
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {sizes.map((size) => (
          <React.Fragment key={size}>
            <Button onClick={() => setOpenSize(size)}>
              {size.toUpperCase()}
            </Button>
            <Modal
              open={openSize === size}
              onClose={() => setOpenSize(null)}
              size={size}
              title={`${size.toUpperCase()} Modal`}
              footer={
                <Button variant="primary" onClick={() => setOpenSize(null)}>
                  Kapat
                </Button>
              }
            >
              <p style={{ margin: 0, fontSize: 14 }}>
                Bu {size.toUpperCase()} boyutunda bir modal penceresidir.
              </p>
            </Modal>
          </React.Fragment>
        ))}
      </div>
    );
  },
};

export const AllSurfaces: Story = {
  render: () => {
    const [openSurface, setOpenSurface] = useState<string | null>(null);
    const surfaces = ['base', 'confirm', 'destructive', 'audit'] as const;
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {surfaces.map((surface) => (
          <React.Fragment key={surface}>
            <Button onClick={() => setOpenSurface(surface)}>
              {surface}
            </Button>
            <Modal
              open={openSurface === surface}
              onClose={() => setOpenSurface(null)}
              surface={surface}
              title={`${surface} surface`}
              footer={
                <Button variant="primary" onClick={() => setOpenSurface(null)}>
                  Kapat
                </Button>
              }
            >
              <p style={{ margin: 0, fontSize: 14 }}>
                Surface: {surface}
              </p>
            </Modal>
          </React.Fragment>
        ))}
      </div>
    );
  },
};
