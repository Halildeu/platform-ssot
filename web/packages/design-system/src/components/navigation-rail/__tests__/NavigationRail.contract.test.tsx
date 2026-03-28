// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavigationRail, type NavigationRailItem } from '../NavigationRail';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeItems = (): NavigationRailItem[] => [
  { value: 'home', label: 'Home' },
  { value: 'explore', label: 'Explore' },
  { value: 'settings', label: 'Settings' },
];

describe('NavigationRail contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(NavigationRail.displayName).toBe('NavigationRail');
  });

  it('renders with required props', () => {
    render(<NavigationRail items={makeItems()} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<NavigationRail ref={ref} items={makeItems()} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  /* ---- ariaLabel ---- */
  it('renders with aria-label', () => {
    render(<NavigationRail items={makeItems()} ariaLabel="Side nav" />);
    expect(screen.getByLabelText('Side nav')).toBeInTheDocument();
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<NavigationRail items={makeItems()} className="custom-rail" />);
    expect(container.querySelector('.custom-rail')).toBeInTheDocument();
  });

  /* ---- Controlled value ---- */
  it('respects controlled value and shows aria-current', () => {
    const { container } = render(<NavigationRail items={makeItems()} value="explore" />);
    expect(container.querySelector('[aria-current="page"]')).toBeInTheDocument();
  });

  /* ---- onValueChange callback ---- */
  it('fires onValueChange on item click', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<NavigationRail items={makeItems()} onValueChange={handler} />);
    await user.click(screen.getByText('Explore'));
    expect(handler).toHaveBeenCalledWith('explore');
  });

  /* ---- Disabled item ---- */
  it('disables individual items', () => {
    const items: NavigationRailItem[] = [
      { value: 'a', label: 'Active' },
      { value: 'b', label: 'Disabled', disabled: true },
    ];
    render(<NavigationRail items={items} />);
    const disabledBtn = screen.getByText('Disabled').closest('button');
    expect(disabledBtn).toBeDisabled();
  });

  /* ---- Access control: hidden ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<NavigationRail items={makeItems()} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  /* ---- Footer ---- */
  it('renders footer slot', () => {
    render(<NavigationRail items={makeItems()} footer={<div data-testid="footer">Footer</div>} />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  /* ---- Compact mode ---- */
  it('renders in compact mode', () => {
    const { container } = render(<NavigationRail items={makeItems()} compact />);
    expect(container.querySelector('[data-compact="true"]')).toBeInTheDocument();
  });
});

describe('NavigationRail — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<NavigationRail items={makeItems()} ariaLabel="Side nav" />);
    await expectNoA11yViolations(container);
  });
});
