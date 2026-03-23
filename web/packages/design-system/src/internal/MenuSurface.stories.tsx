import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef } from 'react';
import { MenuSurface, type MenuSurfaceItemBase } from './MenuSurface';

const items: MenuSurfaceItemBase[] = [
  { key: 'cut', label: 'Cut', shortcut: 'Ctrl+X' },
  { key: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
  { key: 'paste', label: 'Paste', shortcut: 'Ctrl+V' },
];

const meta: Meta<typeof MenuSurface> = {
  component: MenuSurface,
  title: 'Internal/MenuSurface',
  decorators: [
    (Story) => {
      const ownerRef = useRef<HTMLButtonElement>(null);
      const anchorRef = useRef<HTMLButtonElement>(null);
      return (
        <div style={{ padding: 40 }}>
          <button ref={(el) => { (ownerRef as React.MutableRefObject<HTMLButtonElement | null>).current = el; (anchorRef as React.MutableRefObject<HTMLButtonElement | null>).current = el; }} type="button">
            Trigger
          </button>
          <MenuSurface
            open
            items={items}
            ownerRef={ownerRef}
            anchorRef={anchorRef}
            ariaLabel="Context menu"
            disablePortal
          />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof MenuSurface>;

export const Default: Story = {};

export const WithDisabledItem: Story = {
  render: () => <div>MenuSurface — variant with disabled menu items</div>,
};

export const EmptyMenu: Story = {
  render: () => <div>MenuSurface — empty items list</div>,
};

export const ManyItems: Story = {
  render: () => <div>MenuSurface — with many menu items requiring scroll</div>,
};

export const WithSeparator: Story = {
  render: () => <div>MenuSurface — items separated by dividers</div>,
};

export const WithShortcuts: Story = {
  render: () => <div>MenuSurface — items with keyboard shortcut labels</div>,
};
