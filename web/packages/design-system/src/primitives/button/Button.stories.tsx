import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'link'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Kaydet',
    variant: 'primary',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button');
    if (btn) (btn as HTMLElement).click();
  },
};

export const Secondary: Story = {
  args: {
    children: 'Iptal',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Detaylar',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Daha Fazla',
    variant: 'ghost',
  },
};

export const Danger: Story = {
  args: {
    children: 'Sil',
    variant: 'danger',
  },
};

export const Link: Story = {
  args: {
    children: 'Sartlari oku',
    variant: 'link',
  },
};

export const Loading: Story = {
  args: {
    children: 'Gonderiliyor...',
    loading: true,
    variant: 'primary',
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: 'Ekle',
    variant: 'primary',
    leftIcon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 3v10M3 8h10" strokeLinecap="round" />
      </svg>
    ),
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Sonraki',
    variant: 'primary',
    rightIcon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Giris Yap',
    variant: 'primary',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Button size="xs">XS Buton</Button>
      <Button size="sm">SM Buton</Button>
      <Button size="md">MD Buton</Button>
      <Button size="lg">LG Buton</Button>
      <Button size="xl">XL Buton</Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <Button variant="primary">Birincil</Button>
      <Button variant="secondary">Ikincil</Button>
      <Button variant="outline">Cerceveli</Button>
      <Button variant="ghost">Hayalet</Button>
      <Button variant="danger">Tehlike</Button>
      <Button variant="link">Baglanti</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: 'Devre Disi',
    disabled: true,
    variant: 'primary',
  },
};
