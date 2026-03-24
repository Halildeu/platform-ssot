import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Slot } from './Slot';

const meta: Meta<typeof Slot> = {
  component: Slot,
  title: 'Primitives/Shared/Slot',
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Slot>;

export const Default: Story = {
  render: () => (
    <Slot className="text-blue-500 font-bold">
      <button type="button">Slot renders child with merged props</button>
    </Slot>
  ),
};

export const WithAnchor: Story = {
  render: () => (
    <Slot className="underline text-green-600">
      <a href="#">Link rendered through Slot composition</a>
    </Slot>
  ),
};

export const WithSpan: Story = {
  render: () => (
    <Slot className="italic text-gray-500">
      <span>Span element with Slot-merged styles</span>
    </Slot>
  ),
};

export const WithDiv: Story = {
  render: () => (
    <Slot className="bg-yellow-100 p-2 rounded-xs">
      <div>Div rendered through Slot composition</div>
    </Slot>
  ),
};

export const WithInput: Story = {
  render: () => (
    <Slot className="border-2 border-blue-500">
      <input type="text" placeholder="Input through Slot" />
    </Slot>
  ),
};

export const WithNestedSlot: Story = {
  render: () => (
    <Slot className="text-red-500">
      <Slot className="font-semibold">
        <span>Nested Slot composition</span>
      </Slot>
    </Slot>
  ),
};
