import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FocusTrap } from './focus-trap';

const meta: Meta<typeof FocusTrap> = {
  component: FocusTrap,
  title: 'Internal/FocusTrap',
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
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

export const WithInitialFocus: Story = {
  render: () => (
    <FocusTrap active>
      <div>
        <button>Skip</button>
        <input placeholder="Should receive initial focus" autoFocus />
        <button>Last</button>
      </div>
    </FocusTrap>
  ),
};

export const NestedTraps: Story = {
  render: () => (
    <FocusTrap active>
      <div>
        <button>Outer button</button>
        <FocusTrap active={false}>
          <div>
            <button>Inner button (trap inactive)</button>
          </div>
        </FocusTrap>
      </div>
    </FocusTrap>
  ),
};

export const SingleFocusable: Story = {
  render: () => (
    <FocusTrap active>
      <div>
        <button>Only focusable element</button>
      </div>
    </FocusTrap>
  ),
};
