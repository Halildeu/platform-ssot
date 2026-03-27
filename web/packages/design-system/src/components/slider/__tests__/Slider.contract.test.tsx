// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Slider } from '../Slider';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Slider contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Slider.displayName).toBe('Slider');
  });

  it('renders with required props', () => {
    const { container } = render(<Slider />);
    expect(container.querySelector('input[type="range"]')).toBeInTheDocument();
  });

  it('forwards ref to <input>', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Slider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  /* ---- Label ---- */
  it('renders label', () => {
    render(<Slider label="Volume" />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  /* ---- Description ---- */
  it('renders description', () => {
    render(<Slider description="Adjust the volume level" />);
    expect(screen.getByText('Adjust the volume level')).toBeInTheDocument();
  });

  /* ---- Error ---- */
  it('sets aria-invalid when error is provided', () => {
    const { container } = render(<Slider error="Out of range" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders error message text', () => {
    render(<Slider error="Out of range" />);
    expect(screen.getByText('Out of range')).toBeInTheDocument();
  });

  it('sets aria-invalid when invalid=true', () => {
    const { container } = render(<Slider invalid />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ---- Disabled ---- */
  it('respects disabled prop', () => {
    const { container } = render(<Slider disabled />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  /* ---- Required ---- */
  it('sets required attribute on the input', () => {
    const { container } = render(<Slider required />);
    expect(container.querySelector('input')).toHaveAttribute('required');
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<Slider className="my-custom" />);
    expect(container.querySelector('.my-custom')).toBeInTheDocument();
  });

  /* ---- data-testid ---- */
  it('forwards data-testid', () => {
    const { container } = render(<Slider data-testid="slider-field" />);
    expect(container.querySelector('[data-testid="slider-field"]')).toBeInTheDocument();
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    const { container } = render(<Slider size={size} />);
    expect(container.querySelector('input[type="range"]')).toBeInTheDocument();
  });

  /* ---- Access control ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<Slider access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access=disabled renders disabled input', () => {
    const { container } = render(<Slider access="disabled" />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  it('access=readonly renders read-only input', () => {
    const { container } = render(<Slider access="readonly" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-readonly', 'true');
  });
});

describe('Slider — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Slider label="Volume" />);
    await expectNoA11yViolations(container);
  });
});
