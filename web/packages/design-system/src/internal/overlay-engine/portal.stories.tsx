import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Portal } from './portal';

const meta: Meta<typeof Portal> = {
  component: Portal,
  title: 'Internal/Portal',
};
export default meta;

type Story = StoryObj<typeof Portal>;

export const Default: Story = {
  render: () => (
    <Portal>
      <div>Portaled content rendered at document.body</div>
    </Portal>
  ),
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
