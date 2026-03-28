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
    <Slot className="text-action-primary font-bold">
      <button type="button">Slot renders child with merged props</button>
    </Slot>
  ),
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component], div, svg');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const WithAnchor: Story = {
  render: () => (
    <Slot className="underline text-state-success-text">
      <a href="#">Link rendered through Slot composition</a>
    </Slot>
  ),
};

export const WithSpan: Story = {
  render: () => (
    <Slot className="italic text-text-subtle">
      <span>Span element with Slot-merged styles</span>
    </Slot>
  ),
};

export const WithDiv: Story = {
  render: () => (
    <Slot className="bg-state-warning-bg p-2 rounded-xs">
      <div>Div rendered through Slot composition</div>
    </Slot>
  ),
};

export const WithInput: Story = {
  render: () => (
    <Slot className="border-2 border-action-primary">
      <input type="text" placeholder="Input through Slot" />
    </Slot>
  ),
};

export const WithNestedSlot: Story = {
  render: () => (
    <Slot className="text-state-danger-text">
      <Slot className="font-semibold">
        <span>Nested Slot composition</span>
      </Slot>
    </Slot>
  ),
};
