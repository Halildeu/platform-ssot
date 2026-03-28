import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Internal/usePortal',
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div>
      usePortal is a hook — import it from overlay-engine to create and manage a portal container
      div.
    </div>
  ),
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component], div, svg');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const WithCustomId: Story = {
  render: () => <div>usePortal — creates portal container with custom ID attribute</div>,
};

export const Cleanup: Story = {
  render: () => <div>usePortal — portal container removed on unmount</div>,
};

export const Disabled: Story = {
  render: () => <div>usePortal — renders inline when enabled=false (no portal container created)</div>,
};

export const MultiplePortals: Story = {
  render: () => (
    <div>usePortal — multiple instances create independent portal containers</div>
  ),
};

export const WithContainerRef: Story = {
  render: () => (
    <div>usePortal — custom container ref targets a specific DOM element</div>
  ),
};
