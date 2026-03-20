// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from '../Alert';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Alert contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Alert.displayName).toBe('Alert');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(<Alert>Message</Alert>);
    expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(<Alert className="custom-alert">Message</Alert>);
    expect(container.querySelector('[role="alert"]')).toHaveClass('custom-alert');
  });

  /* ---- ARIA role ---- */
  it('has role="alert"', () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  /* ---- data-component attribute ---- */
  it('has data-component="alert"', () => {
    const { container } = render(<Alert>Message</Alert>);
    expect(container.querySelector('[data-component="alert"]')).toBeInTheDocument();
  });

  /* ---- Variants ---- */
  it.each(['info', 'success', 'warning', 'error'] as const)(
    'renders variant=%s without crash',
    (variant) => {
      render(<Alert variant={variant}>V</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    },
  );

  /* ---- Title ---- */
  it('renders title when provided', () => {
    render(<Alert title="Attention">Body</Alert>);
    expect(screen.getByText('Attention')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  /* ---- Closable ---- */
  it('shows dismiss button when closable', () => {
    render(<Alert closable>Message</Alert>);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('fires onClose when dismiss clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Alert closable onClose={handler}>Message</Alert>);
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(handler).toHaveBeenCalledOnce();
  });

  /* ---- Action slot ---- */
  it('renders action node', () => {
    render(<Alert action={<button>Retry</button>}>Error</Alert>);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});

describe('Alert — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Alert>Accessible alert</Alert>);
    await expectNoA11yViolations(container);
  });
});
