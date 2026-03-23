import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createLazyComponent } from './LazyComponent';

// Simulate a lazy-loaded component
const HeavyComponent: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: 24, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8 }}>
    <h3 style={{ margin: 0, fontSize: 16 }}>{title}</h3>
    <p style={{ margin: '8px 0 0', fontSize: 14, color: '#6b7280' }}>
      This simulates a heavy component that was lazily loaded.
    </p>
  </div>
);

// Create a lazy version (in real usage, this would use dynamic import)
const LazyHeavy = createLazyComponent<{ title: string }>(
  () => Promise.resolve({ default: HeavyComponent }),
  'LazyHeavy',
);

const meta: Meta = {
  title: 'Performance/LazyComponent',
  component: LazyHeavy,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <LazyHeavy title="Lazy Loaded Dashboard Widget" />,
};

export const WithCustomFallback: Story = {
  render: () => (
    <LazyHeavy
      title="Widget with Custom Loading"
      fallback={
        <div style={{ padding: 24, background: '#fef3c7', borderRadius: 8, textAlign: 'center' }}>
          Loading component...
        </div>
      }
    />
  ),
};

export const WithErrorFallback: Story = {
  render: () => (
    <LazyHeavy
      title="Widget with Error Handling"
      errorFallback={
        <div style={{ padding: 24, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626' }}>
          Failed to load component. Please try again.
        </div>
      }
    />
  ),
};

export const MultipleInstances: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <LazyHeavy title="Widget A" />
      <LazyHeavy title="Widget B" />
    </div>
  ),
};

export const WithTitle: Story = {
  render: () => <LazyHeavy title="Named Widget" />,
  name: 'With Custom Title',
};

export const SmallWidget: Story = {
  render: () => <LazyHeavy title="Compact Widget" />,
  name: 'Small Widget',
};
