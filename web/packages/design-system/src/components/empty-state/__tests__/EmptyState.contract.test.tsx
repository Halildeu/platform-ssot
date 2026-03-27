// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('EmptyState contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(EmptyState.displayName).toBe('EmptyState');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(<EmptyState title="No data" />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(
      <EmptyState title="Empty" className="custom-empty" />,
    );
    expect(container.firstElementChild).toHaveClass('custom-empty');
  });

  /* ---- Title and description ---- */
  it('renders title and description', () => {
    render(
      <EmptyState title="No results" description="Try a different search" />,
    );
    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByText('Try a different search')).toBeInTheDocument();
  });

  /* ---- Icon ---- */
  it('renders icon when provided', () => {
    render(
      <EmptyState
        title="No data"
        icon={<svg data-testid="empty-icon" />}
      />,
    );
    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
  });

  /* ---- Action slots ---- */
  it('renders action and secondaryAction', () => {
    render(
      <EmptyState
        title="Empty"
        action={<button>Add Item</button>}
        secondaryAction={<button>Learn More</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Learn More' })).toBeInTheDocument();
  });

  /* ---- Compact mode ---- */
  it('renders compact variant', () => {
    const { container } = render(<EmptyState title="No data" compact />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  /* ---- Access control: hidden ---- */
  it('returns null when access=hidden', () => {
    const { container } = render(
      <EmptyState title="No data" access="hidden" />,
    );
    expect(container.firstElementChild).toBeNull();
  });
});

describe('EmptyState — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(
      <EmptyState title="No data" description="Nothing here" />,
    );
    await expectNoA11yViolations(container);
  });
});
