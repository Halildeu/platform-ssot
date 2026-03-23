import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Slot } from './Slot';

const meta: Meta<typeof Slot> = {
  component: Slot,
  title: 'Primitives/Shared/Slot',
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
