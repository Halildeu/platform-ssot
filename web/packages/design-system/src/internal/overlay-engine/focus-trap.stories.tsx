import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FocusTrap } from './focus-trap';

const meta: Meta<typeof FocusTrap> = {
  component: FocusTrap,
  title: 'Internal/FocusTrap',
};
export default meta;

type Story = StoryObj<typeof FocusTrap>;

export const Default: Story = {
  render: () => (
    <FocusTrap active>
      <div>
        <button>Focusable button inside trap</button>
      </div>
    </FocusTrap>
  ),
};

export const Inactive: Story = {
  render: () => (
    <FocusTrap active={false}>
      <div>
        <button>Button outside active trap</button>
      </div>
    </FocusTrap>
  ),
};

export const MultipleFocusable: Story = {
  render: () => (
    <FocusTrap active>
      <div>
        <button>First</button>
        <input placeholder="Text input" />
        <button>Last</button>
      </div>
    </FocusTrap>
  ),
};
