import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';
import { Button } from '../button/Button';

const meta: Meta<typeof Popover> = {
  title: 'Components/Primitives/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    triggerMode: {
      control: 'select',
      options: ['click', 'hover', 'focus', 'hover-focus'],
    },
    showArrow: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    trigger: <Button variant="outline">Popover Ac</Button>,
    title: 'Bilgi',
    content: 'Bu bir popover icerigidir. Ek bilgi gostermek icin kullanilir.',
  },
};

export const HoverTrigger: Story = {
  args: {
    trigger: <Button variant="ghost">Uzerine Gelin</Button>,
    title: 'Hover Popover',
    content: 'Fareyi uzerine getirdiginizde acilir.',
    triggerMode: 'hover',
  },
};

export const WithoutArrow: Story = {
  args: {
    trigger: <Button variant="outline">Ok Yok</Button>,
    content: 'Bu popover ok gostermez.',
    showArrow: false,
  },
};

export const TopSide: Story = {
  args: {
    trigger: <Button variant="outline">Ust Taraf</Button>,
    title: 'Ust Popover',
    content: 'Bu popover ust tarafta acilir.',
    side: 'top',
  },
};

export const WithoutTitle: Story = {
  args: {
    trigger: <Button variant="outline">Basliksiz</Button>,
    content: 'Baslik olmadan sadece icerik gosterilir.',
  },
};

export const AllSides: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: 400 }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <Popover
          key={side}
          trigger={<Button variant="outline">{side}</Button>}
          content={`${side} tarafinda acilir.`}
          side={side}
          disablePortal
        />
      ))}
    </div>
  ),
};
