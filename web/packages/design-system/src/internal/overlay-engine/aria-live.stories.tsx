import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AriaLiveRegion } from './aria-live';

const meta: Meta<typeof AriaLiveRegion> = {
  component: AriaLiveRegion,
  title: 'Internal/AriaLiveRegion',
};
export default meta;

type Story = StoryObj<typeof AriaLiveRegion>;

export const Default: Story = {
  render: () => <AriaLiveRegion />,
};

export const Polite: Story = {
  render: () => <AriaLiveRegion />,
};

export const Assertive: Story = {
  render: () => <div>AriaLiveRegion — assertive announcements for urgent updates</div>,
};
