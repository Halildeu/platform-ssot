import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from './Drawer';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Primitives/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
    },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    showOverlay: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Drawer>;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const SampleContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <p>
      Bu bir ornek drawer icerigidir. Detaylari burada goruntuleyebilirsiniz.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </div>
);

const SampleFooter = () => (
  <>
    <button
      type="button"
      style={{
        padding: '8px 16px',
        borderRadius: 8,
        border: '1px solid #ccc',
        background: 'transparent',
        cursor: 'pointer',
      }}
    >
      Iptal
    </button>
    <button
      type="button"
      style={{
        padding: '8px 16px',
        borderRadius: 8,
        border: 'none',
        background: '#2563eb',
        color: '#fff',
        cursor: 'pointer',
      }}
    >
      Kaydet
    </button>
  </>
);

/**
 * Wrapper that provides controlled open/close state for drawer stories.
 */
const DrawerTemplate: React.FC<
  Omit<React.ComponentProps<typeof Drawer>, 'open' | 'onClose'> & {
    defaultOpen?: boolean;
  }
> = ({ defaultOpen = true, children, ...rest }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid #ccc',
          cursor: 'pointer',
        }}
      >
        Drawer Ac
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} {...rest}>
        {children}
      </Drawer>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Stories                                                             */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  render: () => (
    <DrawerTemplate title="Varsayilan Drawer">
      <SampleContent />
    </DrawerTemplate>
  ),
};

export const PlacementRight: Story = {
  render: () => (
    <DrawerTemplate title="Sag Panel" placement="right">
      <SampleContent />
    </DrawerTemplate>
  ),
};

export const PlacementLeft: Story = {
  render: () => (
    <DrawerTemplate title="Sol Panel" placement="left">
      <SampleContent />
    </DrawerTemplate>
  ),
};

export const PlacementTop: Story = {
  render: () => (
    <DrawerTemplate title="Ust Panel" placement="top">
      <SampleContent />
    </DrawerTemplate>
  ),
};

export const PlacementBottom: Story = {
  render: () => (
    <DrawerTemplate title="Alt Panel" placement="bottom">
      <SampleContent />
    </DrawerTemplate>
  ),
};

export const SizeSmall: Story = {
  render: () => (
    <DrawerTemplate title="Kucuk Drawer" size="sm">
      <SampleContent />
    </DrawerTemplate>
  ),
};

export const SizeLarge: Story = {
  render: () => (
    <DrawerTemplate title="Buyuk Drawer" size="lg">
      <SampleContent />
    </DrawerTemplate>
  ),
};

export const SizeFull: Story = {
  render: () => (
    <DrawerTemplate title="Tam Ekran Drawer" size="full">
      <SampleContent />
    </DrawerTemplate>
  ),
};

export const WithTitleAndDescription: Story = {
  render: () => (
    <DrawerTemplate
      title="Kullanici Ayarlari"
      description="Hesap tercihlerinizi buradan duzenleyebilirsiniz."
    >
      <SampleContent />
    </DrawerTemplate>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <DrawerTemplate title="Form Drawer" footer={<SampleFooter />}>
      <SampleContent />
    </DrawerTemplate>
  ),
};

export const WithoutOverlay: Story = {
  render: () => (
    <DrawerTemplate title="Arka Plan Yok" showOverlay={false}>
      <SampleContent />
    </DrawerTemplate>
  ),
};

export const DisabledBackdropClose: Story = {
  render: () => (
    <DrawerTemplate title="Tiklama ile Kapanmaz" closeOnOverlayClick={false}>
      <p>Arka plana tiklayarak kapatamazsiniz. Sadece kapatma butonu veya Escape kullanin.</p>
    </DrawerTemplate>
  ),
};

export const DisabledEscapeClose: Story = {
  render: () => (
    <DrawerTemplate title="Escape ile Kapanmaz" closeOnEscape={false}>
      <p>Escape tusuna basarak kapatamazsiniz. Kapatma butonunu veya arka plani kullanin.</p>
    </DrawerTemplate>
  ),
};

export const ControlledOpenClose: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          Drawer Ac
        </button>
        <p style={{ marginTop: 8 }}>
          Durum: {open ? 'Acik' : 'Kapali'}
        </p>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Kontrol Edilen Drawer"
          footer={
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#2563eb',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Kapat
            </button>
          }
        >
          <SampleContent />
        </Drawer>
      </>
    );
  },
};

export const AllPlacements: Story = {
  render: () => {
    const [active, setActive] = useState<'left' | 'right' | 'top' | 'bottom' | null>(null);
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(['left', 'right', 'top', 'bottom'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setActive(p)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #ccc',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {p}
          </button>
        ))}
        {active && (
          <Drawer
            open
            onClose={() => setActive(null)}
            placement={active}
            title={`${active.charAt(0).toUpperCase() + active.slice(1)} Drawer`}
          >
            <SampleContent />
          </Drawer>
        )}
      </div>
    );
  },
};

export const AllSizes: Story = {
  render: () => {
    const [active, setActive] = useState<'sm' | 'md' | 'lg' | 'full' | null>(null);
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(['sm', 'md', 'lg', 'full'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setActive(s)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #ccc',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            {s}
          </button>
        ))}
        {active && (
          <Drawer
            open
            onClose={() => setActive(null)}
            size={active}
            title={`Boyut: ${active.toUpperCase()}`}
          >
            <SampleContent />
          </Drawer>
        )}
      </div>
    );
  },
};

export const CustomClassName: Story = {
  render: () => (
    <DrawerTemplate title="Ozel Sinif" className="bg-yellow-50">
      <SampleContent />
    </DrawerTemplate>
  ),
};
