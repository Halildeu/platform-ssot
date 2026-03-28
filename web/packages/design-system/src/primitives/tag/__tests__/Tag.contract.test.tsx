// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tag } from '../Tag';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Tag contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Tag.displayName).toBe('Tag');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(<Tag>Label</Tag>);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(<Tag className="custom-tag">Label</Tag>);
    expect(container.firstElementChild).toHaveClass('custom-tag');
  });

  /* ---- data-component attribute ---- */
  it('has data-component="tag"', () => {
    const { container } = render(<Tag>Label</Tag>);
    expect(container.querySelector('[data-component="tag"]')).toBeInTheDocument();
  });

  /* ---- Variants ---- */
  it.each(['default', 'primary', 'success', 'warning', 'error', 'info', 'danger'] as const)(
    'renders variant=%s without crash',
    (variant) => {
      const { container } = render(<Tag variant={variant}>V</Tag>);
      expect(container.querySelector('span')).toBeInTheDocument();
    },
  );

  /* ---- Closable ---- */
  it('shows close button when closable', () => {
    render(<Tag closable>Label</Tag>);
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('fires onClose when close button clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Tag closable onClose={handler}>Label</Tag>);
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(handler).toHaveBeenCalledOnce();
  });

  /* ---- Access control: hidden ---- */
  it('returns null when access=hidden', () => {
    const { container } = render(<Tag access="hidden">Label</Tag>);
    expect(container.firstElementChild).toBeNull();
  });

  /* ---- Access control: disabled ---- */
  it('renders disabled state when access=disabled', () => {
    const { container } = render(<Tag access="disabled">Label</Tag>);
    expect(container.querySelector('[data-component="tag"]')).toBeInTheDocument();
  });
});

describe('Tag — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Tag>Label</Tag>);
    await expectNoA11yViolations(container);
  });
});
