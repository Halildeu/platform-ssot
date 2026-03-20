import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader';
import { Button } from '../../primitives/button/Button';
import { Badge } from '../../primitives/badge/Badge';

const meta: Meta<typeof PageHeader> = {
  title: 'Patterns/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: {
    sticky: { control: 'boolean' },
    noBorder: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: 'Proje Yonetimi',
    subtitle: 'Tum projeleri goruntuleyin ve yonetin.',
  },
};

export const WithActions: Story = {
  args: {
    title: 'Kullanicilar',
    subtitle: 'Sistem kullanicilari listesi.',
    actions: (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" size="sm">Disari Aktar</Button>
        <Button variant="primary" size="sm">Yeni Kullanici</Button>
      </div>
    ),
  },
};

export const WithTags: Story = {
  args: {
    title: 'Dashboard',
    tags: (
      <>
        <Badge variant="success" size="sm">Canli</Badge>
        <Badge variant="info" size="sm">v2.1</Badge>
      </>
    ),
  },
};

export const WithBreadcrumb: Story = {
  args: {
    title: 'Gorev Detayi',
    subtitle: 'Gorev #1234',
    breadcrumb: (
      <nav style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
        Ana Sayfa / Projeler / Gorev Detayi
      </nav>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Raporlar',
    footer: (
      <div style={{ display: 'flex', gap: 16, paddingTop: 8, paddingBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 500, borderBottom: '2px solid var(--action-primary)', paddingBottom: 8 }}>Genel</span>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)', paddingBottom: 8 }}>Performans</span>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)', paddingBottom: 8 }}>Finans</span>
      </div>
    ),
  },
};
