// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Spinner } from '../Spinner';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Spinner contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Spinner.displayName).toBe('Spinner');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className in inline mode', () => {
    const { container } = render(<Spinner className="custom-spinner" />);
    expect(container.querySelector('svg')).toHaveClass('custom-spinner');
  });

  /* ---- ARIA attributes ---- */
  it('has role="status" and aria-label', () => {
    render(<Spinner label="Loading data" />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-label', 'Loading data');
  });

  /* ---- data-component attribute ---- */
  it('has data-component="spinner"', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('[data-component="spinner"]')).toBeInTheDocument();
  });

  /* ---- Sizes ---- */
  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
    'renders size=%s without crash',
    (size) => {
      render(<Spinner size={size} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    },
  );

  /* ---- Block mode ---- */
  it('renders in block mode with visible label', () => {
    render(<Spinner mode="block" label="Please wait" />);
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  /* ---- Default label ---- */
  it('defaults aria-label to "Loading"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });
});

describe('Spinner — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Spinner />);
    await expectNoA11yViolations(container);
  });
});
