import type { Meta, StoryObj } from '@storybook/react';
import { OverlaySurface } from './OverlaySurface';

const meta: Meta<typeof OverlaySurface> = {
  component: OverlaySurface,
  title: 'Internal/OverlaySurface',
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
