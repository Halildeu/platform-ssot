// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render } from '@testing-library/react';
import { Avatar } from '../Avatar';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Avatar contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Avatar.displayName).toBe('Avatar');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  /* ---- data-component attribute ---- */
  it('has data-component="avatar"', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('[data-component="avatar"]')).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(<Avatar className="custom-avatar" />);
    expect(container.querySelector('span')).toHaveClass('custom-avatar');
  });

  /* ---- Props propagation ---- */
  it('passes through HTML attributes', () => {
    const { container } = render(<Avatar data-testid="my-avatar" />);
    expect(container.querySelector('[data-testid="my-avatar"]')).toBeInTheDocument();
  });

  /* ---- Sizes ---- */
  it.each(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const)(
    'renders size=%s without crash',
    (size) => {
      const { container } = render(<Avatar size={size} />);
      expect(container.querySelector('span')).toBeInTheDocument();
    },
  );

  /* ---- Shapes ---- */
  it.each(['circle', 'square'] as const)(
    'renders shape=%s without crash',
    (shape) => {
      const { container } = render(<Avatar shape={shape} />);
      expect(container.querySelector('span')).toBeInTheDocument();
    },
  );

  /* ---- Image mode ---- */
  it('renders img when src is provided', () => {
    const { container } = render(<Avatar src="https://example.com/avatar.png" alt="User" />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'User');
  });

  /* ---- Initials mode ---- */
  it('renders initials when provided without src', () => {
    const { container } = render(<Avatar initials="JD" />);
    expect(container.textContent).toBe('JD');
  });

  /* ---- Initials truncated to 2 chars ---- */
  it('truncates initials to 2 characters', () => {
    const { container } = render(<Avatar initials="ABC" />);
    expect(container.textContent).toBe('AB');
  });

  /* ---- Icon fallback ---- */
  it('renders icon when provided without src or initials', () => {
    const icon = <svg data-testid="custom-icon" />;
    const { container } = render(<Avatar icon={icon} />);
    expect(container.querySelector('[data-testid="custom-icon"]')).toBeInTheDocument();
  });

  /* ---- Default fallback icon ---- */
  it('renders default SVG icon when no src, initials, or icon', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

describe('Avatar — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Avatar src="https://example.com/avatar.png" alt="User avatar" />);
    await expectNoA11yViolations(container);
  });
});
