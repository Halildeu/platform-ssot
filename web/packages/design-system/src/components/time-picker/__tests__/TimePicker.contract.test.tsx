// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { TimePicker } from '../TimePicker';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('TimePicker contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(TimePicker.displayName).toBe('TimePicker');
  });

  it('renders with required props', () => {
    const { container } = render(<TimePicker />);
    expect(container.querySelector('input[type="time"]')).toBeInTheDocument();
  });

  it('forwards ref to <input>', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<TimePicker ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  /* ---- Label ---- */
  it('renders label', () => {
    render(<TimePicker label="Start time" />);
    expect(screen.getByText('Start time')).toBeInTheDocument();
  });

  /* ---- Description ---- */
  it('renders description', () => {
    render(<TimePicker description="Select a time" />);
    expect(screen.getByText('Select a time')).toBeInTheDocument();
  });

  /* ---- Error ---- */
  it('sets aria-invalid when error is provided', () => {
    const { container } = render(<TimePicker error="Time is required" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders error message text', () => {
    render(<TimePicker error="Time is required" />);
    expect(screen.getByText('Time is required')).toBeInTheDocument();
  });

  it('sets aria-invalid when invalid=true', () => {
    const { container } = render(<TimePicker invalid />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ---- Disabled ---- */
  it('respects disabled prop', () => {
    const { container } = render(<TimePicker disabled />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  /* ---- Required ---- */
  it('sets required on the input', () => {
    const { container } = render(<TimePicker required />);
    expect(container.querySelector('input')).toBeRequired();
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<TimePicker className="my-custom" />);
    expect(container.querySelector('.my-custom')).toBeInTheDocument();
  });

  /* ---- data-testid ---- */
  it('forwards data-testid', () => {
    const { container } = render(<TimePicker data-testid="tp-field" />);
    expect(container.querySelector('[data-testid="tp-field"]')).toBeInTheDocument();
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    const { container } = render(<TimePicker size={size} />);
    expect(container.querySelector('input[type="time"]')).toBeInTheDocument();
  });

  /* ---- Access control ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<TimePicker access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access=disabled renders disabled input', () => {
    const { container } = render(<TimePicker access="disabled" />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  it('access=readonly renders read-only input', () => {
    const { container } = render(<TimePicker access="readonly" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-readonly', 'true');
  });
});

describe('TimePicker — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<TimePicker label="Start time" />);
    await expectNoA11yViolations(container);
  });
});
