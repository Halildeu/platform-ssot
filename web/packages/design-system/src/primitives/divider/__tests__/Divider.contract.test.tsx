// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Divider } from '../Divider';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Divider contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Divider.displayName).toBe('Divider');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(<Divider />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(<Divider className="custom-divider" />);
    expect(container.firstElementChild).toHaveClass('custom-divider');
  });

  /* ---- Horizontal (default) renders <hr> ---- */
  it('renders as <hr> for horizontal without label', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  /* ---- Vertical orientation ---- */
  it('renders vertical separator with correct ARIA', () => {
    render(<Divider orientation="vertical" />);
    const sep = screen.getByRole('separator');
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
  });

  /* ---- Label ---- */
  it('renders label text in the middle', () => {
    render(<Divider label="OR" />);
    expect(screen.getByText('OR')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  /* ---- Spacing ---- */
  it.each(['none', 'sm', 'md', 'lg'] as const)(
    'renders spacing=%s without crash',
    (spacing) => {
      const { container } = render(<Divider spacing={spacing} />);
      expect(container.firstElementChild).toBeInTheDocument();
    },
  );
});

describe('Divider — accessibility', () => {
  it('has no axe-core a11y violations (horizontal)', async () => {
    const { container } = render(<Divider />);
    await expectNoA11yViolations(container);
  });

  it('has no axe-core a11y violations (vertical)', async () => {
    const { container } = render(<Divider orientation="vertical" />);
    await expectNoA11yViolations(container);
  });
});
