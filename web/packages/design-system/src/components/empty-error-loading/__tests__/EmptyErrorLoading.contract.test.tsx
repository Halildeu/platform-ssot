// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyErrorLoading } from '../EmptyErrorLoading';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('EmptyErrorLoading contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(EmptyErrorLoading.displayName).toBe('EmptyErrorLoading');
  });

  /* ---- Default render (empty mode) ---- */
  it('renders in empty mode', () => {
    const { container } = render(<EmptyErrorLoading mode="empty" />);
    expect(container.querySelector('[data-mode="empty"]')).toBeInTheDocument();
  });

  it('sets data-component attribute', () => {
    const { container } = render(<EmptyErrorLoading mode="empty" />);
    expect(container.querySelector('[data-component="empty-error-loading"]')).toBeInTheDocument();
  });

  /* ---- Error mode ---- */
  it('renders in error mode with retry button', () => {
    const onRetry = vi.fn();
    render(<EmptyErrorLoading mode="error" onRetry={onRetry} />);
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<EmptyErrorLoading mode="error" onRetry={onRetry} />);
    await user.click(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  /* ---- Loading mode ---- */
  it('renders in loading mode with spinner', () => {
    render(<EmptyErrorLoading mode="loading" />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('sets data-mode attribute correctly', () => {
    const { container } = render(<EmptyErrorLoading mode="loading" />);
    expect(container.querySelector('[data-mode="loading"]')).toBeInTheDocument();
  });

  /* ---- Custom title and description ---- */
  it('renders custom title', () => {
    render(<EmptyErrorLoading mode="empty" title="No data" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  /* ---- className merging ---- */
  it('merges className', () => {
    const { container } = render(<EmptyErrorLoading mode="empty" className="my-state" />);
    const section = container.querySelector('[data-component="empty-error-loading"]');
    expect(section?.className).toContain('my-state');
  });

  /* ---- Access hidden ---- */
  it('renders nothing when access=hidden', () => {
    const { container } = render(<EmptyErrorLoading mode="empty" access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  /* ---- Custom retryLabel ---- */
  it('renders custom retryLabel', () => {
    render(<EmptyErrorLoading mode="error" onRetry={() => {}} retryLabel="Try Again" />);
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
});

describe('EmptyErrorLoading — accessibility', () => {
  it('has no axe-core a11y violations (empty)', async () => {
    const { container } = render(<EmptyErrorLoading mode="empty" />);
    await expectNoA11yViolations(container);
  });

  it('has no axe-core a11y violations (error)', async () => {
    const { container } = render(<EmptyErrorLoading mode="error" />);
    await expectNoA11yViolations(container);
  });
});
