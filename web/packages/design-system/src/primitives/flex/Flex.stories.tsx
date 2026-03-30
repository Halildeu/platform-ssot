import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from './Flex';

const meta: Meta<typeof Flex> = {
  title: 'Components/Primitives/Flex',
  component: Flex,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
    gap: { control: 'select', options: [0, 1, 2, 3, 4, 5, 6, 8] },
    wrap: { control: 'boolean' },
    inline: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Flex>;

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border border-border-subtle bg-surface-muted px-4 py-2 text-sm">{children}</div>
);

export const Default: Story = {
  render: () => (
    <Flex gap={4} align="center">
      <Box>Item 1</Box><Box>Item 2</Box><Box>Item 3</Box>
    </Flex>
  ),
};

export const Column: Story = {
  render: () => (
    <Flex direction="column" gap={3}>
      <Box>Top</Box><Box>Middle</Box><Box>Bottom</Box>
    </Flex>
  ),
};

export const JustifyBetween: Story = {
  render: () => (
    <Flex justify="between" align="center" gap={4}>
      <Box>Left</Box><Box>Center</Box><Box>Right</Box>
    </Flex>
  ),
};

export const Wrap: Story = {
  render: () => (
    <Flex gap={3} wrap>
      {Array.from({ length: 12 }).map((_, i) => <Box key={i}>Item {i + 1}</Box>)}
    </Flex>
  ),
};

export const Inline: Story = {
  render: () => (
    <p className="text-sm">
      Text before <Flex inline gap={2} align="center"><Box>A</Box><Box>B</Box></Flex> text after
    </p>
  ),
};
