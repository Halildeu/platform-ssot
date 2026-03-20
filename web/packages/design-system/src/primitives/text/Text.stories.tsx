import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Components/Primitives/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['span', 'p', 'div', 'h1', 'h2', 'h3', 'h4', 'label', 'strong', 'em', 'small', 'code', 'kbd'],
    },
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'muted', 'success', 'warning', 'error', 'info'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
    truncate: { control: 'boolean' },
    mono: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    children: 'Varsayilan metin gorunumu',
  },
};

export const Heading: Story = {
  args: {
    as: 'h1',
    size: '3xl',
    weight: 'bold',
    children: 'Sayfa Basligi',
  },
};

export const SecondaryText: Story = {
  args: {
    variant: 'secondary',
    children: 'Ikincil aciklama metni',
  },
};

export const Truncated: Story = {
  args: {
    truncate: true,
    children: 'Bu cok uzun bir metin olup tasma durumunda uc nokta ile kesilecektir. Icerik devam eder ama gorunmez.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
};

export const LineClamp: Story = {
  args: {
    lineClamp: 2,
    as: 'p',
    children:
      'Bu metin iki satir ile sinirlandirilmistir. Uzun bir metin yazildiginda uc nokta ile kesilir. Daha fazla icerik burada devam eder ama gorunmez.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 250 }}>
        <Story />
      </div>
    ),
  ],
};

export const Monospace: Story = {
  args: {
    mono: true,
    size: 'sm',
    children: 'const x = 42;',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text variant="default">Varsayilan</Text>
      <Text variant="secondary">Ikincil</Text>
      <Text variant="muted">Soluk</Text>
      <Text variant="success">Basarili</Text>
      <Text variant="warning">Uyari</Text>
      <Text variant="error">Hata</Text>
      <Text variant="info">Bilgi</Text>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Text size="xs">XS boyut</Text>
      <Text size="sm">SM boyut</Text>
      <Text size="base">Base boyut</Text>
      <Text size="lg">LG boyut</Text>
      <Text size="xl">XL boyut</Text>
      <Text size="2xl">2XL boyut</Text>
      <Text size="3xl">3XL boyut</Text>
      <Text size="4xl">4XL boyut</Text>
    </div>
  ),
};

export const AllWeights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Text weight="normal">Normal agirlik</Text>
      <Text weight="medium">Medium agirlik</Text>
      <Text weight="semibold">Semibold agirlik</Text>
      <Text weight="bold">Bold agirlik</Text>
    </div>
  ),
};
