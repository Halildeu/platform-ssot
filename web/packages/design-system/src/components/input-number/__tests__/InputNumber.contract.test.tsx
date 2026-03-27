// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputNumber } from '../InputNumber';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('InputNumber contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(InputNumber.displayName).toBe('InputNumber');
  });

  it('renders with required props', () => {
    render(<InputNumber />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('forwards ref to <input>', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<InputNumber ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  /* ---- Label ---- */
  it('renders label', () => {
    render(<InputNumber label="Quantity" />);
    expect(screen.getByText('Quantity')).toBeInTheDocument();
  });

  /* ---- Description ---- */
  it('renders description', () => {
    render(<InputNumber description="Enter a number" />);
    expect(screen.getByText('Enter a number')).toBeInTheDocument();
  });

  /* ---- Error ---- */
  it('sets aria-invalid when error is provided', () => {
    render(<InputNumber error="Must be positive" />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders error message text', () => {
    render(<InputNumber error="Must be positive" />);
    expect(screen.getByText('Must be positive')).toBeInTheDocument();
  });

  /* ---- Disabled ---- */
  it('respects disabled prop', () => {
    render(<InputNumber disabled />);
    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });

  /* ---- Required ---- */
  it('sets required on the input', () => {
    render(<InputNumber required />);
    expect(screen.getByRole('spinbutton')).toBeRequired();
  });

  /* ---- ReadOnly ---- */
  it('sets aria-readonly when readOnly', () => {
    render(<InputNumber readOnly />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-readonly', 'true');
  });

  /* ---- Increment / Decrement buttons ---- */
  it('renders increment and decrement buttons', () => {
    render(<InputNumber />);
    expect(screen.getByLabelText('Increment')).toBeInTheDocument();
    expect(screen.getByLabelText('Decrement')).toBeInTheDocument();
  });

  it('fires onChange on increment click', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<InputNumber defaultValue={5} onChange={handler} />);
    await user.click(screen.getByLabelText('Increment'));
    expect(handler).toHaveBeenCalledWith(6);
  });

  /* ---- min/max ---- */
  it('sets aria-valuemin and aria-valuemax', () => {
    render(<InputNumber min={0} max={100} defaultValue={50} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('aria-valuemin', '0');
    expect(input).toHaveAttribute('aria-valuemax', '100');
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<InputNumber className="my-number" />);
    expect(container.querySelector('.my-number')).toBeInTheDocument();
  });

  /* ---- Prefix/suffix ---- */
  it('renders prefix and suffix', () => {
    render(<InputNumber prefix={<span>$</span>} suffix={<span>.00</span>} />);
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('.00')).toBeInTheDocument();
  });
});

describe('InputNumber — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<InputNumber label="Quantity" />);
    await expectNoA11yViolations(container);
  });
});
