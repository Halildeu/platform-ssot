import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormDrawer } from './FormDrawer';
import { Button } from '../../primitives/button/Button';

const meta: Meta<typeof FormDrawer> = {
  title: 'Patterns/FormDrawer',
  component: FormDrawer,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    placement: {
      control: 'select',
      options: ['right', 'left'],
    },
    loading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof FormDrawer>;

const FormContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
    <div>
      <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>Ad</label>
      <input type="text" placeholder="Adinizi girin" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-default)', fontSize: 14 }} />
    </div>
    <div>
      <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>E-posta</label>
      <input type="email" placeholder="ornek@mail.com" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-default)', fontSize: 14 }} />
    </div>
  </div>
);

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Yeni Kullanici',
    subtitle: 'Kullanici bilgilerini girin.',
    children: <FormContent />,
    footer: (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 16px', borderTop: '1px solid var(--border-subtle)' }}>
        <Button variant="ghost" size="sm">Iptal</Button>
        <Button variant="primary" size="sm">Kaydet</Button>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};

export const Loading: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Kayit Duzenleme',
    children: <FormContent />,
    loading: true,
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};

export const LeftPlacement: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Sol Taraftan',
    placement: 'left',
    children: <FormContent />,
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};
