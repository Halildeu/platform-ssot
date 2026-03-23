// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, within } from '@testing-library/react';
import { IconButton } from '../IconButton';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const TestIcon = () => <svg data-testid="test-icon" viewBox="0 0 24 24"><path d="M12 2l10 20H2z" /></svg>;

const defaultProps = {
  icon: <TestIcon />,
  label: 'Test action',
};

describe('IconButton contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(IconButton.displayName).toBe('IconButton');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(<IconButton {...defaultProps} />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  /* ---- Forwards ref ---- */
  it('forwards ref to <button>', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<IconButton {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  /* ---- data-component attribute ---- */
  it('has data-component="icon-button"', () => {
    const { container } = render(<IconButton {...defaultProps} />);
    expect(container.querySelector('[data-component="icon-button"]')).toBeInTheDocument();
  });

  /* ---- aria-label ---- */
  it('sets aria-label from label prop', () => {
    const { container } = render(<IconButton {...defaultProps} />);
    const btn = within(container).getByRole('button');
    expect(btn).toHaveAttribute('aria-label', 'Test action');
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(<IconButton {...defaultProps} className="custom-icon-btn" />);
    expect(container.querySelector('button')).toHaveClass('custom-icon-btn');
  });

  /* ---- Variants ---- */
  it.each(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const)(
    'renders variant=%s without crash',
    (variant) => {
      const { container } = render(<IconButton {...defaultProps} variant={variant} />);
      expect(container.querySelector('button')).toBeInTheDocument();
    },
  );

  /* ---- Sizes ---- */
  it.each(['xs', 'sm', 'md', 'lg'] as const)(
    'renders size=%s without crash',
    (size) => {
      const { container } = render(<IconButton {...defaultProps} size={size} />);
      expect(container.querySelector('button')).toBeInTheDocument();
    },
  );

  /* ---- Disabled ---- */
  it('respects disabled prop', () => {
    const { container } = render(<IconButton {...defaultProps} disabled />);
    expect(container.querySelector('button')).toBeDisabled();
  });

  /* ---- Loading ---- */
  it('disables button when loading', () => {
    const { container } = render(<IconButton {...defaultProps} loading />);
    expect(container.querySelector('button')).toBeDisabled();
  });

  /* ---- Loading hides icon ---- */
  it('hides icon and shows spinner when loading', () => {
    const { container } = render(<IconButton {...defaultProps} loading />);
    expect(container.querySelector('[data-testid="test-icon"]')).not.toBeInTheDocument();
  });

  /* ---- Rounded ---- */
  it('applies rounded-full class when rounded=true', () => {
    const { container } = render(<IconButton {...defaultProps} rounded-sm />);
    expect(container.querySelector('button')).toHaveClass('rounded-full');
  });

  /* ---- type=button by default ---- */
  it('has type="button" by default', () => {
    const { container } = render(<IconButton {...defaultProps} />);
    expect(container.querySelector('button')).toHaveAttribute('type', 'button');
  });

  /* ---- Props propagation ---- */
  it('passes through HTML attributes', () => {
    const { container } = render(<IconButton {...defaultProps} data-testid="my-icon-btn" />);
    expect(container.querySelector('[data-testid="my-icon-btn"]')).toBeInTheDocument();
  });

  /* ---- Button role ---- */
  it('renders accessible button role', () => {
    const { container } = render(<IconButton {...defaultProps} />);
    expect(within(container).getByRole('button')).toBeInTheDocument();
  });
});

describe('IconButton — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<IconButton {...defaultProps} />);
    await expectNoA11yViolations(container);
  });
});
