// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../Pagination';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

/* ------------------------------------------------------------------ */
/*  Pagination contract                                                */
/* ------------------------------------------------------------------ */

describe('Pagination contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Pagination.displayName).toBe('Pagination');
  });

  /* ---- Renders with required props ---- */
  it('renders with required props', () => {
    render(<Pagination total={100} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
  });

  /* ---- Accepts className ---- */
  it('merges custom className', () => {
    render(<Pagination total={100} className="custom-pagination" />);
    expect(screen.getByRole('navigation')).toHaveClass('custom-pagination');
  });

  /* ---- data-testid support ---- */
  it('renders nav with aria-label for test targeting', () => {
    render(<Pagination total={100} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  /* ---- Controlled value ---- */
  it('respects controlled current page', () => {
    render(<Pagination total={50} pageSize={10} current={3} />);
    expect(screen.getByText('3')).toHaveAttribute('aria-current', 'page');
  });

  /* ---- onChange callback ---- */
  it('fires onChange when a page button is clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Pagination total={50} pageSize={10} current={1} onChange={handler} />);
    await user.click(screen.getByText('3'));
    expect(handler).toHaveBeenCalledWith(3);
  });

  it('fires onChange on next button click', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Pagination total={50} pageSize={10} current={1} onChange={handler} />);
    await user.click(screen.getByLabelText('Next page'));
    expect(handler).toHaveBeenCalledWith(2);
  });

  it('fires onChange on previous button click', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Pagination total={50} pageSize={10} current={3} onChange={handler} />);
    await user.click(screen.getByLabelText('Previous page'));
    expect(handler).toHaveBeenCalledWith(2);
  });

  /* ---- Renders all items ---- */
  it('renders all page buttons for small total', () => {
    render(<Pagination total={50} pageSize={10} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  /* ---- Keyboard navigation ---- */
  it('page buttons are focusable via keyboard', async () => {
    const user = userEvent.setup();
    render(<Pagination total={30} pageSize={10} current={2} />);
    await user.tab(); // Previous page (enabled when current > 1)
    await user.tab(); // Page 1
    expect(screen.getByText('1')).toHaveFocus();
  });

  /* ---- Access control: disabled ---- */
  it('disables Previous button on first page', () => {
    render(<Pagination total={50} pageSize={10} current={1} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<Pagination total={50} pageSize={10} current={5} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  /* ---- Access control: hidden ---- */
  it('renders single page when total fits in one page', () => {
    const { container } = render(<Pagination total={5} pageSize={10} />);
    // Only page 1 should render, no other page buttons
    const buttons = container.querySelectorAll('button');
    // prev + page 1 + next = 3 buttons
    expect(buttons).toHaveLength(3);
  });
});

describe('Pagination — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Pagination total={100} />);
    await expectNoA11yViolations(container);
  });
});
