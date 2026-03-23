import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DirectionProvider } from './DirectionProvider';

const meta: Meta<typeof DirectionProvider> = {
  component: DirectionProvider,
  title: 'Providers/DirectionProvider',
};

export default meta;
type Story = StoryObj<typeof DirectionProvider>;

export const Default: Story = {
  args: {
    direction: 'ltr',
    children: 'Left-to-right content',
  },
};

export const RTL: Story = {
  args: {
    direction: 'rtl',
    children: 'Right-to-left content',
  },
};

export const NestedDirections: Story = {
  render: () => (
    <DirectionProvider direction="ltr">
      <div>LTR parent
        <DirectionProvider direction="rtl">
          <div>RTL child override</div>
        </DirectionProvider>
      </div>
    </DirectionProvider>
  ),
};
