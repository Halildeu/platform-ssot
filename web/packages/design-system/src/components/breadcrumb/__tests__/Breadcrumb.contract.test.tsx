// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Breadcrumb, type BreadcrumbItem } from '../Breadcrumb';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const makeItems = (count = 3): BreadcrumbItem[] =>
  Array.from({ length: count }, (_, i) => ({
    label: `Item ${i}`,
    onClick: vi.fn(),
  }));

/* ------------------------------------------------------------------ */
/*  Breadcrumb contract                                                */
/* ------------------------------------------------------------------ */

describe('Breadcrumb contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Breadcrumb.displayName).toBe('Breadcrumb');
  });

  /* ---- Renders with required props ---- */
  it('renders with required props', () => {
    render(<Breadcrumb items={makeItems()} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  /* ---- Accepts className ---- */
  it('merges custom className', () => {
    render(<Breadcrumb items={makeItems()} className="custom-breadcrumb" />);
    expect(screen.getByRole('navigation')).toHaveClass('custom-breadcrumb');
  });

  /* ---- data-testid support ---- */
  it('renders nav with aria-label for test targeting', () => {
    render(<Breadcrumb items={makeItems()} />);
    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' }),
    ).toBeInTheDocument();
  });

  /* ---- Last item is current page ---- */
  it('marks last item as current page', () => {
    render(<Breadcrumb items={makeItems()} />);
    expect(screen.getByText('Item 2')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  /* ---- onClick callback ---- */
  it('fires onClick when a breadcrumb item is clicked', async () => {
    const items = makeItems();
    const user = userEvent.setup();
    render(<Breadcrumb items={items} />);
    // Non-last items render as buttons
    await user.click(screen.getByText('Item 0'));
    expect(items[0].onClick).toHaveBeenCalled();
  });

  /* ---- Renders all items ---- */
  it('renders all breadcrumb items', () => {
    render(<Breadcrumb items={makeItems()} />);
    expect(screen.getByText('Item 0')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  /* ---- Keyboard navigation ---- */
  it('breadcrumb links are focusable via keyboard', async () => {
    const user = userEvent.setup();
    render(<Breadcrumb items={makeItems()} />);
    await user.tab();
    // First breadcrumb button should receive focus
    expect(screen.getByText('Item 0')).toHaveFocus();
  });

  /* ---- Access control: disabled (maxItems collapse) ---- */
  it('collapses middle items when maxItems is set', () => {
    const items = makeItems(5);
    render(<Breadcrumb items={items} maxItems={3} />);
    // First item and last 2 items visible, middle collapsed to "..."
    expect(screen.getByText('Item 0')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
    expect(screen.getByText('Item 4')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });

  /* ---- Access control: hidden ---- */
  it('last item renders as span, not as interactive button', () => {
    render(<Breadcrumb items={makeItems()} />);
    const lastItem = screen.getByText('Item 2');
    // Last item is a span (non-interactive), not a button
    expect(lastItem.tagName).not.toBe('BUTTON');
    expect(lastItem.closest('button')).toBeNull();
  });
});

describe('Breadcrumb — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Breadcrumb items={makeItems()} />);
    await expectNoA11yViolations(container);
  });
});
