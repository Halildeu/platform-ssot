import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from './ErrorBoundary';

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/Feedback/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** A child that always throws */
const BrokenChild: React.FC = () => {
  throw new Error('Something unexpected happened');
};

/** A child that can be toggled to throw */
const ToggleBrokenChild: React.FC<{ shouldThrow: boolean }> = ({
  shouldThrow,
}) => {
  if (shouldThrow) throw new Error('Recoverable error');
  return <p style={{ padding: 16 }}>Content loaded successfully.</p>;
};

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  args: {
    children: <p style={{ padding: 16 }}>Everything is fine. No error here.</p>,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="button"], button, [data-testid], input, [tabindex]');
    if (el) (el as HTMLElement).click();
  },
};

export const WithError: Story = {
  args: {
    children: <BrokenChild />,
    onError: (error, info) => {
      // eslint-disable-next-line no-console
      console.log('[Story] onError fired:', error.message, info);
    },
  },
};

export const CustomFallback: Story = {
  args: {
    children: <BrokenChild />,
    fallback: (
      <div
        style={{
          padding: 24,
          textAlign: 'center',
          color: 'var(--text-primary))',
        }}
      >
        Custom fallback UI — an error occurred.
      </div>
    ),
  },
};

export const WithFallback: Story = {
  args: {
    children: <BrokenChild />,
    fallback: (error: Error, reset: () => void) => (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-primary))' }}>
          Error: {error.message}
        </p>
        <button onClick={reset} style={{ marginTop: 8, padding: '4px 12px', borderRadius: 4, border: '1px solid var(--border-default)' }}>
          Retry
        </button>
      </div>
    ),
  },
};

export const NestedError: Story = {
  render: () => (
    <ErrorBoundary
      fallback={<div style={{ padding: 16, textAlign: 'center', color: 'var(--text-primary))' }}>Outer boundary caught an error</div>}
    >
      <ErrorBoundary
        fallback={<div style={{ padding: 16, textAlign: 'center', color: 'var(--text-primary))' }}>Inner boundary caught an error</div>}
      >
        <BrokenChild />
      </ErrorBoundary>
    </ErrorBoundary>
  ),
};

export const WithReset: Story = {
  render: () => {
    const [key, setKey] = useState(0);
    const [broke, setBroke] = useState(true);

    return (
      <div>
        <button
          style={{ marginBottom: 12 }}
          onClick={() => {
            setBroke(false);
            setKey((k) => k + 1);
          }}
        >
          Fix the child & remount
        </button>
        <ErrorBoundary
          key={key}
          fallback={(error, reset) => (
            <div
              role="alert"
              style={{
                padding: 24,
                border: '1px solid var(--border-default))',
                borderRadius: 8,
                textAlign: 'center',
              }}
            >
              <p style={{ fontWeight: 600 }}>Caught: {error.message}</p>
              <button onClick={reset} style={{ marginTop: 8 }}>
                Reset boundary
              </button>
            </div>
          )}
        >
          <ToggleBrokenChild shouldThrow={broke} />
        </ErrorBoundary>
      </div>
    );
  },
};
