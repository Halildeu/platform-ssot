// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { Rating } from '../Rating';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Rating contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Rating.displayName).toBe('Rating');
  });

  it('renders with required props', () => {
    const { container } = render(<Rating />);
    expect(container.querySelector('[role="radiogroup"]')).toBeInTheDocument();
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Rating ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute('role')).toBe('radiogroup');
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<Rating className="my-custom" />);
    expect(container.querySelector('.my-custom')).toBeInTheDocument();
  });

  /* ---- data-testid ---- */
  it('forwards data-testid', () => {
    const { container } = render(<Rating data-testid="rating-field" />);
    expect(container.querySelector('[data-testid="rating-field"]')).toBeInTheDocument();
  });

  /* ---- Size variants ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    const { container } = render(<Rating size={size} />);
    expect(container.querySelector('[role="radiogroup"]')).toBeInTheDocument();
  });

  /* ---- Disabled via access ---- */
  it('access=disabled sets aria-disabled', () => {
    const { container } = render(<Rating access="disabled" />);
    expect(container.querySelector('[role="radiogroup"]')).toHaveAttribute('aria-disabled', 'true');
  });

  it('access=disabled prevents interaction', () => {
    const onValueChange = vi.fn();
    render(<Rating access="disabled" onValueChange={onValueChange} />);
    const stars = screen.getAllByRole('radio');
    fireEvent.click(stars[2]!);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  /* ---- Readonly via access ---- */
  it('access=readonly sets aria-readonly', () => {
    const { container } = render(<Rating access="readonly" />);
    expect(container.querySelector('[role="radiogroup"]')).toHaveAttribute('aria-readonly', 'true');
  });

  /* ---- Access control ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<Rating access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access=full renders interactive stars', () => {
    const { container } = render(<Rating access="full" />);
    const group = container.querySelector('[role="radiogroup"]');
    expect(group).toBeInTheDocument();
    expect(group).not.toHaveAttribute('aria-disabled');
  });
});

describe('Rating — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Rating />);
    await expectNoA11yViolations(container);
  });
});
