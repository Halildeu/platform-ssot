import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AnimatePresence } from './AnimatePresence';

function AnimatePresenceDemo({ exitDuration = 200 }: { exitDuration?: number }) {
  const [items, setItems] = useState(['Item A', 'Item B', 'Item C']);

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems((prev) => [...prev, `Item ${String.fromCharCode(65 + prev.length)}`]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button
        onClick={addItem}
        style={{ padding: '6px 14px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', width: 'fit-content' }}
      >
        Add Item
      </button>
      <AnimatePresence exitDuration={exitDuration}>
        {items.map((item, i) => (
          <div
            key={item}
            className="animate-in fade-in-0 slide-in-from-left-2"
            style={{
              padding: '12px 16px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              animationDuration: '200ms',
            }}
          >
            {item}
            <button
              onClick={() => removeItem(i)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16 }}
            >
              x
            </button>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const meta: Meta<typeof AnimatePresence> = {
  title: 'Motion/AnimatePresence',
  component: AnimatePresence,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AnimatePresence>;

export const Default: Story = {
  render: () => <AnimatePresenceDemo />,
};

export const SlowExit: Story = {
  render: () => <AnimatePresenceDemo exitDuration={500} />,
};

export const FastExit: Story = {
  render: () => <AnimatePresenceDemo exitDuration={50} />,
  name: 'Fast Exit',
};

export const MediumExit: Story = {
  render: () => <AnimatePresenceDemo exitDuration={300} />,
  name: 'Medium Exit Duration',
};

export const ZeroExit: Story = {
  render: () => <AnimatePresenceDemo exitDuration={0} />,
  name: 'Instant Exit',
};

export const LongExit: Story = {
  render: () => <AnimatePresenceDemo exitDuration={1000} />,
  name: 'Long Exit Duration',
};
