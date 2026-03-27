// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render } from '@testing-library/react';
import { Skeleton } from '../Skeleton';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Skeleton contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Skeleton.displayName).toBe('Skeleton');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(<Skeleton className="custom-skeleton" />);
    expect(container.firstElementChild).toHaveClass('custom-skeleton');
  });

  /* ---- data-component attribute ---- */
  it('has data-component="skeleton"', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('[data-component="skeleton"]')).toBeInTheDocument();
  });

  /* ---- Width/height ---- */
  it('applies width and height styles', () => {
    const { container } = render(<Skeleton width={200} height={24} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('24px');
  });

  /* ---- Circle mode ---- */
  it('renders circle shape', () => {
    const { container } = render(<Skeleton circle height={40} />);
    expect(container.firstElementChild).toHaveClass('rounded-full');
  });

  /* ---- Multiple lines ---- */
  it('renders multiple lines when lines > 1', () => {
    const { container } = render(<Skeleton lines={3} />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.children.length).toBe(3);
  });

  /* ---- Animation control ---- */
  it('applies pulse animation by default', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toHaveClass('animate-pulse');
  });

  it('disables animation when animated=false', () => {
    const { container } = render(<Skeleton animated={false} />);
    expect(container.firstElementChild).not.toHaveClass('animate-pulse');
  });
});

describe('Skeleton — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Skeleton />);
    await expectNoA11yViolations(container);
  });
});
