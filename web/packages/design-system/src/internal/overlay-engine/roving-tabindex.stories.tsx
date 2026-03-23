import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Internal/useRovingTabindex',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div>
      useRovingTabindex is a hook — import it from overlay-engine and use within composite widgets
      (tabs, menus, toolbars).
    </div>
  ),
};

export const HorizontalNavigation: Story = {
  render: () => <div>useRovingTabindex — horizontal arrow key navigation pattern</div>,
};

export const VerticalNavigation: Story = {
  render: () => <div>useRovingTabindex — vertical arrow key navigation pattern</div>,
};
