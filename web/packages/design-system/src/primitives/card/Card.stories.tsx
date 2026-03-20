import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { Button } from '../button/Button';
import { Badge } from '../badge/Badge';

const meta: Meta<typeof Card> = {
  title: 'Components/Primitives/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled', 'ghost'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    hoverable: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader
          title="Proje Ozeti"
          subtitle="Son guncelleme: 2 saat once"
        />
        <CardBody>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
            Projede toplam 24 gorev bulunmaktadir. 18 gorev tamamlandi,
            4 gorev devam ediyor, 2 gorev beklemede.
          </p>
        </CardBody>
        <CardFooter>
          <Button variant="primary" size="sm">Detaylar</Button>
          <Button variant="ghost" size="sm">Paylas</Button>
        </CardFooter>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <CardHeader
        title="Golge Efektli Kart"
        subtitle="Varsayilan yukseltilmis gorunum"
      />
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <CardHeader
        title="Cerceveli Kart"
        subtitle="Sadece kenarligi olan kart"
      />
    ),
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: (
      <CardHeader
        title="Dolgulu Kart"
        subtitle="Arkaplan renkli kart"
      />
    ),
  },
};

export const GhostCard: Story = {
  name: 'Ghost',
  args: {
    variant: 'ghost',
    children: (
      <CardHeader
        title="Hayalet Kart"
        subtitle="Seffaf arka plan"
      />
    ),
  },
};

export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: (
      <>
        <CardHeader
          title="Tiklanabilir Kart"
          subtitle="Uzerine gelin ve tiklayin"
          action={<Badge variant="success">Aktif</Badge>}
        />
        <CardBody>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
            Bu kart hover efektine sahiptir ve tiklanabilir gorunumdedir.
          </p>
        </CardBody>
      </>
    ),
  },
};

export const AllPaddings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card padding="none"><div style={{ padding: 8, fontSize: 13 }}>Padding: none</div></Card>
      <Card padding="sm"><div style={{ fontSize: 13 }}>Padding: sm</div></Card>
      <Card padding="md"><div style={{ fontSize: 13 }}>Padding: md</div></Card>
      <Card padding="lg"><div style={{ fontSize: 13 }}>Padding: lg</div></Card>
    </div>
  ),
};

export const WithHeaderAction: Story = {
  args: {
    children: (
      <>
        <CardHeader
          title="Kullanici Istatistikleri"
          subtitle="Bu ayin ozeti"
          action={<Badge variant="primary">Yeni</Badge>}
        />
        <CardBody>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>1.234</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Toplam Kullanici</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>89%</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Aktif Oran</div>
            </div>
          </div>
        </CardBody>
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: 600 }}>
      {(['elevated', 'outlined', 'filled', 'ghost'] as const).map((v) => (
        <Card key={v} variant={v}>
          <CardHeader title={v.charAt(0).toUpperCase() + v.slice(1)} subtitle={`${v} varyant`} />
        </Card>
      ))}
    </div>
  ),
};
