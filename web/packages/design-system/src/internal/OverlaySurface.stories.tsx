import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OverlaySurface } from './OverlaySurface';

const meta: Meta<typeof OverlaySurface> = {
  component: OverlaySurface,
  title: 'Internal/OverlaySurface',
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof OverlaySurface>;

export const Default: Story = {
  args: {
    open: true,
    disablePortal: true,
    ariaLabel: 'Example overlay',
    children: 'Overlay content',
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('button, [role="button"], input, a, [tabindex]');
    if (el) (el as HTMLElement).click();
  },
};

export const Closed: Story = {
  args: {
    open: false,
    disablePortal: true,
    ariaLabel: 'Closed overlay',
    children: 'Hidden content',
  },
};

export const WithLongContent: Story = {
  args: {
    open: true,
    disablePortal: true,
    ariaLabel: 'Scrollable overlay',
    children: 'Overlay with longer content that may require scrolling or layout adjustments',
  },
};

export const WithCustomRole: Story = {
  args: {
    open: true,
    disablePortal: true,
    ariaLabel: 'Dialog overlay',
    role: 'dialog',
    children: 'Dialog role overlay',
  },
};

export const FullWidth: Story = {
  args: {
    open: true,
    disablePortal: true,
    ariaLabel: 'Full width overlay',
    children: 'Full width overlay content',
    className: 'w-full',
  },
};

export const WithMultipleChildren: Story = {
  args: {
    open: true,
    disablePortal: true,
    ariaLabel: 'Multi-child overlay',
    children: 'Header content | Body content | Footer content',
  },
};
