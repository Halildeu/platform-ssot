// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '../Toast';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

/* Helper component to trigger toasts */
function ToastTrigger({ variant = 'info', message = 'Test message', title }: { variant?: 'info' | 'success' | 'warning' | 'error'; message?: string; title?: string }) {
  const toast = useToast();
  return (
    <button onClick={() => toast[variant](message, { title })} data-testid="trigger">
      Trigger
    </button>
  );
}

describe('ToastProvider contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(ToastProvider.displayName).toBe('ToastProvider');
  });

  it('renders children', () => {
    render(
      <ToastProvider>
        <div data-testid="child">Hello</div>
      </ToastProvider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  /* ---- Toast rendering ---- */
  it('renders info toast when triggered', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider duration={10000}>
        <ToastTrigger variant="info" message="Info message" />
      </ToastProvider>,
    );
    await user.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Info message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders success toast', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider duration={10000}>
        <ToastTrigger variant="success" message="Saved!" />
      </ToastProvider>,
    );
    await user.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Saved!')).toBeInTheDocument();
  });

  it('renders warning toast', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider duration={10000}>
        <ToastTrigger variant="warning" message="Watch out" />
      </ToastProvider>,
    );
    await user.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Watch out')).toBeInTheDocument();
  });

  it('renders error toast', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider duration={10000}>
        <ToastTrigger variant="error" message="Failed" />
      </ToastProvider>,
    );
    await user.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  /* ---- Title ---- */
  it('renders toast title when provided', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider duration={10000}>
        <ToastTrigger variant="info" message="Body text" title="Title text" />
      </ToastProvider>,
    );
    await user.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Title text')).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  /* ---- Dismiss button ---- */
  it('renders dismiss button with accessible label', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider duration={10000}>
        <ToastTrigger message="Dismissable" />
      </ToastProvider>,
    );
    await user.click(screen.getByTestId('trigger'));
    expect(screen.getByLabelText('Dismiss')).toBeInTheDocument();
  });

  /* ---- aria-live polite region ---- */
  it('has aria-live polite region', () => {
    const { container } = render(
      <ToastProvider>
        <div />
      </ToastProvider>,
    );
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });

  /* ---- useToast outside provider throws ---- */
  it('useToast throws when used outside provider', () => {
    // Suppress expected React error boundary noise for this intentional throw
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
      try {
        return <>{children}</>;
      } catch {
        return <div>Error</div>;
      }
    };
    expect(() => {
      render(
        <ErrorBoundary>
          <ToastTrigger />
        </ErrorBoundary>,
      );
    }).toThrow('useToast must be used within <ToastProvider>');
    spy.mockRestore();
  });
});

describe('Toast — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(
      <ToastProvider>
        <div>App content</div>
      </ToastProvider>,
    );
    await expectNoA11yViolations(container);
  });
});
