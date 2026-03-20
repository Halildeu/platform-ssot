// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import { Badge } from '../Badge';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Badge contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Badge.displayName).toBe('Badge');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(<Badge>5</Badge>);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(<Badge className="custom-badge">5</Badge>);
    expect(container.querySelector('span')).toHaveClass('custom-badge');
  });

  /* ---- data-component attribute ---- */
  it('has data-component="badge"', () => {
    const { container } = render(<Badge>5</Badge>);
    expect(container.querySelector('[data-component="badge"]')).toBeInTheDocument();
  });

  /* ---- Variants ---- */
  it.each(['default', 'primary', 'success', 'warning', 'error', 'danger', 'info', 'muted'] as const)(
    'renders variant=%s without crash',
    (variant) => {
      const { container } = render(<Badge variant={variant}>V</Badge>);
      expect(container.querySelector('span')).toBeInTheDocument();
    },
  );

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s without crash', (size) => {
    const { container } = render(<Badge size={size}>S</Badge>);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  /* ---- Dot mode ---- */
  it('renders dot mode without children', () => {
    const { container } = render(<Badge dot />);
    const dot = container.querySelector('span');
    expect(dot).toBeInTheDocument();
    expect(dot?.textContent).toBe('');
  });

  /* ---- Children content ---- */
  it('renders children text content', () => {
    render(<Badge>Online</Badge>);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('renders JSX children (e.g. icon + text)', () => {
    const { container } = render(
      <Badge>
        <svg data-testid="icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" /></svg>
        Status
      </Badge>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  /* ---- HTML attribute passthrough ---- */
  it('applies aria-label when provided', () => {
    const { container } = render(<Badge aria-label="3 notifications">3</Badge>);
    expect(container.querySelector('span')).toHaveAttribute('aria-label', '3 notifications');
  });

  it('applies custom data-testid', () => {
    render(<Badge data-testid="status-badge">Active</Badge>);
    expect(screen.getByTestId('status-badge')).toBeInTheDocument();
  });

  it('applies role attribute when provided', () => {
    const { container } = render(<Badge role="status">Live</Badge>);
    expect(container.querySelector('span')).toHaveAttribute('role', 'status');
  });

  /* ---- Event handlers ---- */
  it('fires onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Badge onClick={onClick} data-testid="clickable">Click</Badge>);
    fireEvent.click(screen.getByTestId('clickable'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  /* ---- Dot mode with variant ---- */
  it('dot mode applies variant-derived background color', () => {
    const { container } = render(<Badge dot variant="success" />);
    const dot = container.querySelector('span');
    expect(dot?.className).toContain('bg-[var(--state-success-text)]');
  });

  /* ---- Dot mode passthrough ---- */
  it('dot mode forwards aria-label', () => {
    const { container } = render(<Badge dot aria-label="online indicator" />);
    expect(container.querySelector('span')).toHaveAttribute('aria-label', 'online indicator');
  });

  /* ---- No children renders without crash ---- */
  it('renders without children and without crash', () => {
    expect(() => render(<Badge />)).not.toThrow();
  });

});

describe('Badge — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Badge>3</Badge>);
    await expectNoA11yViolations(container);
  });
});
