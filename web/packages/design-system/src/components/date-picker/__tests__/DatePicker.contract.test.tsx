// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { DatePicker } from '../DatePicker';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('DatePicker contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(DatePicker.displayName).toBe('DatePicker');
  });

  it('renders with required props', () => {
    const { container } = render(<DatePicker />);
    expect(container.querySelector('input[type="date"]')).toBeInTheDocument();
  });

  it('forwards ref to <input>', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<DatePicker ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  /* ---- Label ---- */
  it('renders label', () => {
    render(<DatePicker label="Start date" />);
    expect(screen.getByText('Start date')).toBeInTheDocument();
  });

  /* ---- Description ---- */
  it('renders description', () => {
    render(<DatePicker description="Pick a valid date" />);
    expect(screen.getByText('Pick a valid date')).toBeInTheDocument();
  });

  /* ---- Error ---- */
  it('sets aria-invalid when error is provided', () => {
    const { container } = render(<DatePicker error="Date is required" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders error message text', () => {
    render(<DatePicker error="Date is required" />);
    expect(screen.getByText('Date is required')).toBeInTheDocument();
  });

  it('sets aria-invalid when invalid=true', () => {
    const { container } = render(<DatePicker invalid />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ---- Disabled ---- */
  it('respects disabled prop', () => {
    const { container } = render(<DatePicker disabled />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  /* ---- Required ---- */
  it('sets required on the input', () => {
    const { container } = render(<DatePicker required />);
    expect(container.querySelector('input')).toBeRequired();
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<DatePicker className="my-custom" />);
    expect(container.querySelector('.my-custom')).toBeInTheDocument();
  });

  /* ---- data-testid ---- */
  it('forwards data-testid', () => {
    const { container } = render(<DatePicker data-testid="dp-field" />);
    expect(container.querySelector('[data-testid="dp-field"]')).toBeInTheDocument();
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    const { container } = render(<DatePicker size={size} />);
    expect(container.querySelector('input[type="date"]')).toBeInTheDocument();
  });

  /* ---- Access control ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<DatePicker access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access=disabled renders disabled input', () => {
    const { container } = render(<DatePicker access="disabled" />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  it('access=readonly renders read-only input', () => {
    const { container } = render(<DatePicker access="readonly" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-readonly', 'true');
  });
});

describe('DatePicker — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<DatePicker label="Start date" />);
    await expectNoA11yViolations(container);
  });
});
