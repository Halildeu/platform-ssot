import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stack, HStack, VStack } from './Stack';

const Box = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div
    style={{
      padding: '12px 16px',
      background: 'var(--surface-muted)',
      borderRadius: 8,
      fontSize: 13,
      ...style,
    }}
  >
    {children}
  </div>
);

const meta: Meta<typeof Stack> = {
  title: 'Components/Primitives/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
    gap: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12],
    },
    wrap: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Box>Eleman 1</Box>
        <Box>Eleman 2</Box>
        <Box>Eleman 3</Box>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component], div, svg');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const Row: Story = {
  args: {
    direction: 'row',
    gap: 4,
    children: (
      <>
        <Box>Sol</Box>
        <Box>Orta</Box>
        <Box>Sag</Box>
      </>
    ),
  },
};

export const Column: Story = {
  args: {
    direction: 'column',
    gap: 4,
    children: (
      <>
        <Box>Ust</Box>
        <Box>Orta</Box>
        <Box>Alt</Box>
      </>
    ),
  },
};

export const WithAlignment: Story = {
  args: {
    direction: 'row',
    align: 'center',
    justify: 'between',
    gap: 4,
    children: (
      <>
        <Box style={{ height: 40 }}>Kisa</Box>
        <Box style={{ height: 80 }}>Uzun</Box>
        <Box style={{ height: 60 }}>Orta</Box>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const Wrapped: Story = {
  args: {
    direction: 'row',
    wrap: true,
    gap: 3,
    children: (
      <>
        {Array.from({ length: 8 }, (_, i) => (
          <Box key={i}>Eleman {i + 1}</Box>
        ))}
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export const HStackExample: Story = {
  render: () => (
    <HStack gap={4}>
      <Box>HStack 1</Box>
      <Box>HStack 2</Box>
      <Box>HStack 3</Box>
    </HStack>
  ),
};

export const VStackExample: Story = {
  render: () => (
    <VStack gap={4}>
      <Box>VStack 1</Box>
      <Box>VStack 2</Box>
      <Box>VStack 3</Box>
    </VStack>
  ),
};
