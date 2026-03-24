import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AriaLiveRegion } from './aria-live';

const meta: Meta<typeof AriaLiveRegion> = {
  component: AriaLiveRegion,
  title: 'Internal/AriaLiveRegion',
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof AriaLiveRegion>;

export const Default: Story = {
  render: () => <AriaLiveRegion />,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component], div, svg');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const Polite: Story = {
  render: () => <AriaLiveRegion />,
};

export const Assertive: Story = {
  render: () => <div>AriaLiveRegion — assertive announcements for urgent updates</div>,
};

export const AutoClear: Story = {
  render: () => <div>AriaLiveRegion — messages auto-clear after 5 seconds</div>,
};

export const WithRole: Story = {
  render: () => <div>AriaLiveRegion — role=status for non-critical updates</div>,
};

export const OffScreen: Story = {
  render: () => <div>AriaLiveRegion — visually hidden but accessible to screen readers</div>,
};
