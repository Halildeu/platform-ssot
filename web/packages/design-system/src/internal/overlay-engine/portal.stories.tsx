import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Portal } from './portal';

const meta: Meta<typeof Portal> = {
  component: Portal,
  title: 'Internal/Portal',
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Portal>;

export const Default: Story = {
  render: () => (
    <Portal>
      <div>Portaled content rendered at document.body</div>
    </Portal>
  ),
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component], div, svg');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const WithCustomContainer: Story = {
  render: () => (
    <div id="custom-container">
      <Portal>
        <div>Portal with custom mount target</div>
      </Portal>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => <div>Portal disabled — content renders inline</div>,
};

export const WithCallback: Story = {
  render: () => (
    <Portal>
      <div>Portal with mount callback tracking</div>
    </Portal>
  ),
};

export const MultiplePortals: Story = {
  render: () => (
    <>
      <Portal><div>Portal A</div></Portal>
      <Portal><div>Portal B</div></Portal>
    </>
  ),
};

export const WithNestedContent: Story = {
  render: () => (
    <Portal>
      <div>
        <h4>Nested heading</h4>
        <p>Nested paragraph in portal</p>
      </div>
    </Portal>
  ),
};
