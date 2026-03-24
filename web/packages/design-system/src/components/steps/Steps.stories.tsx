import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Steps } from './Steps';
import type { StepItem } from './Steps';
import { Button } from '../../primitives/button/Button';

const meta: Meta<typeof Steps> = {
  title: 'Components/Navigation/Steps',
  component: Steps,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    dot: { control: 'boolean' },
    status: {
      control: 'select',
      options: ['wait', 'process', 'finish', 'error'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Steps>;

const temelAdimlar: StepItem[] = [
  { key: 'bilgi', title: 'Kisisel Bilgiler', description: 'Ad, soyad ve iletisim bilgileri' },
  { key: 'adres', title: 'Adres', description: 'Yasadiginiz adres bilgileri' },
  { key: 'belge', title: 'Belgeler', description: 'Kimlik ve evrak yuklemesi' },
  { key: 'onay', title: 'Onay', description: 'Bilgileri kontrol edin ve gonderiniz' },
];

export const Default: Story = {
  args: {
    items: temelAdimlar,
    current: 1,
  },
  play: async ({ canvasElement }) => {
    const step = canvasElement.querySelector('[role="button"], button, [data-testid]');
    if (step) (step as HTMLElement).click();
  },
};

export const Interactive: Story = {
  render: () => {
    const [current, setCurrent] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Steps items={temelAdimlar} current={current} onChange={setCurrent} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Button
            variant="secondary"
            disabled={current <= 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            Geri
          </Button>
          <Button
            variant="primary"
            disabled={current >= temelAdimlar.length - 1}
            onClick={() => setCurrent((c) => c + 1)}
          >
            Ileri
          </Button>
        </div>
      </div>
    );
  },
};

export const Vertical: Story = {
  args: {
    items: temelAdimlar,
    current: 2,
    direction: 'vertical',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const DotStyle: Story = {
  args: {
    items: temelAdimlar,
    current: 1,
    dot: true,
  },
};

export const ErrorStatus: Story = {
  args: {
    items: temelAdimlar,
    current: 2,
    status: 'error',
  },
};

export const AllCompleted: Story = {
  args: {
    items: temelAdimlar,
    current: temelAdimlar.length,
  },
};

export const WithDisabledStep: Story = {
  args: {
    items: [
      ...temelAdimlar.slice(0, 3),
      { key: 'premium', title: 'Premium Adim', description: 'Erisim kisitli', disabled: true },
    ],
    current: 1,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600 }}>Kucuk</div>
        <Steps items={temelAdimlar} current={1} size="sm" />
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600 }}>Orta</div>
        <Steps items={temelAdimlar} current={1} size="md" />
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600 }}>Buyuk</div>
        <Steps items={temelAdimlar} current={1} size="lg" />
      </div>
    </div>
  ),
};
