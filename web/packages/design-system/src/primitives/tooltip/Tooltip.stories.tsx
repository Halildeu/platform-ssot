import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../button/Button';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Primitives/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    delay: { control: 'number' },
    closeDelay: { control: 'number' },
    disabled: { control: 'boolean' },
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
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'Bu bir tooltip mesajidir',
    children: <Button>Uzerine gel</Button>,
  },
};

export const Top: Story = {
  args: {
    content: 'Ust tarafta gorunur',
    placement: 'top',
    children: <Button>Ust</Button>,
  },
};

export const Bottom: Story = {
  args: {
    content: 'Alt tarafta gorunur',
    placement: 'bottom',
    children: <Button>Alt</Button>,
  },
};

export const Left: Story = {
  args: {
    content: 'Sol tarafta gorunur',
    placement: 'left',
    children: <Button>Sol</Button>,
  },
};

export const Right: Story = {
  args: {
    content: 'Sag tarafta gorunur',
    placement: 'right',
    children: <Button>Sag</Button>,
  },
};

export const WithArrow: Story = {
  args: {
    content: 'Ok isaretli tooltip',
    showArrow: true,
    children: <Button>Ok Isaretli</Button>,
  },
};

export const CustomDelay: Story = {
  args: {
    content: '500ms gecikmeli',
    delay: 500,
    children: <Button>Gecikme: 500ms</Button>,
  },
};

export const DisabledTooltip: Story = {
  args: {
    content: 'Bu gorunmez',
    disabled: true,
    children: <Button>Devre Disi</Button>,
  },
};

export const AllPlacements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
      <Tooltip content="Ust" placement="top">
        <Button variant="outline">Ust</Button>
      </Tooltip>
      <Tooltip content="Alt" placement="bottom">
        <Button variant="outline">Alt</Button>
      </Tooltip>
      <Tooltip content="Sol" placement="left">
        <Button variant="outline">Sol</Button>
      </Tooltip>
      <Tooltip content="Sag" placement="right">
        <Button variant="outline">Sag</Button>
      </Tooltip>
    </div>
  ),
};

export const RichContent: Story = {
  args: {
    content: (
      <div>
        <strong>Klavye Kisayolu</strong>
        <div style={{ marginTop: 4, opacity: 0.8 }}>Ctrl + S</div>
      </div>
    ),
    children: <Button>Kaydet</Button>,
  },
};
