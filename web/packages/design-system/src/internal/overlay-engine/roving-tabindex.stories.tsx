import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Internal/useRovingTabindex',
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
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
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-component], div, svg');
    if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  },
};

export const HorizontalNavigation: Story = {
  render: () => <div>useRovingTabindex — horizontal arrow key navigation pattern</div>,
};

export const VerticalNavigation: Story = {
  render: () => <div>useRovingTabindex — vertical arrow key navigation pattern</div>,
};

export const WithLoop: Story = {
  render: () => <div>useRovingTabindex — loop=true wraps focus from last to first item</div>,
};

export const WithDisabledItems: Story = {
  render: () => <div>useRovingTabindex — skips disabled items during navigation</div>,
};

export const GridNavigation: Story = {
  render: () => <div>useRovingTabindex — 2D grid navigation with arrow keys</div>,
};
