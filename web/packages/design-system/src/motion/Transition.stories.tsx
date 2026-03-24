import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Transition } from './Transition';

function TransitionDemo({ preset = 'fadeIn' as const }) {
  const [show, setShow] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button
        onClick={() => setShow((s) => !s)}
        style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', width: 'fit-content' }}
      >
        {show ? 'Hide' : 'Show'}
      </button>
      <Transition show={show} preset={preset}>
        <div style={{ padding: 24, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8 }}>
          Animated content with preset: <strong>{preset}</strong>
        </div>
      </Transition>
    </div>
  );
}

const meta: Meta<typeof Transition> = {
  title: 'Motion/Transition',
  component: Transition,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Transition>;

export const Default: Story = {
  render: () => <TransitionDemo preset="fadeIn" />,
};

export const ZoomIn: Story = {
  render: () => <TransitionDemo preset="zoomIn" />,
};

export const SlideUp: Story = {
  render: () => <TransitionDemo preset="slideUp" />,
};

export const SlideDown: Story = {
  render: () => <TransitionDemo preset="slideDown" />,
};

export const SlideLeft: Story = {
  render: () => <TransitionDemo preset="slideLeft" />,
};

export const SlideRight: Story = {
  render: () => <TransitionDemo preset="slideRight" />,
};
