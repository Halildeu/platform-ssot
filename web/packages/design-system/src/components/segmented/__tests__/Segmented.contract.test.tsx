// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Segmented, type SegmentedItem } from '../Segmented';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeItems = (): SegmentedItem[] => [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
];

describe('Segmented contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Segmented.displayName).toBe('Segmented');
  });

  it('renders with required props', () => {
    render(<Segmented items={makeItems()} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Segmented ref={ref} items={makeItems()} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<Segmented items={makeItems()} className="custom-seg" />);
    expect(container.querySelector('.custom-seg')).toBeInTheDocument();
  });

  /* ---- Controlled value ---- */
  it('respects controlled value', () => {
    render(<Segmented items={makeItems()} value="b" />);
    expect(screen.getByRole('radio', { name: 'Option B' })).toHaveAttribute('aria-checked', 'true');
  });

  /* ---- onValueChange callback ---- */
  it('fires onValueChange on click', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Segmented items={makeItems()} onValueChange={handler} />);
    await user.click(screen.getByRole('radio', { name: 'Option B' }));
    expect(handler).toHaveBeenCalledWith('b');
  });

  /* ---- Disabled item ---- */
  it('disables individual items', () => {
    const items: SegmentedItem[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ];
    render(<Segmented items={items} />);
    expect(screen.getByRole('radio', { name: 'B' })).toBeDisabled();
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    render(<Segmented items={makeItems()} size={size} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  /* ---- Orientation ---- */
  it('renders vertical orientation', () => {
    const { container } = render(<Segmented items={makeItems()} orientation="vertical" />);
    expect(container.querySelector('[data-orientation="vertical"]')).toBeInTheDocument();
  });

  /* ---- ariaLabel ---- */
  it('passes ariaLabel', () => {
    render(<Segmented items={makeItems()} ariaLabel="View mode" />);
    expect(screen.getByRole('radiogroup', { name: 'View mode' })).toBeInTheDocument();
  });
});

describe('Segmented — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Segmented items={makeItems()} ariaLabel="View mode" />);
    await expectNoA11yViolations(container);
  });
});
