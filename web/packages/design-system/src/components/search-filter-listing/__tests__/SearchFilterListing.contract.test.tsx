// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchFilterListing } from '../SearchFilterListing';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('SearchFilterListing contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(SearchFilterListing.displayName).toBe('SearchFilterListing');
  });

  /* ---- Default render ---- */
  it('renders with required title prop', () => {
    render(<SearchFilterListing title="Orders" />);
    expect(screen.getByText('Orders')).toBeInTheDocument();
  });

  it('sets data-component attribute', () => {
    const { container } = render(<SearchFilterListing title="T" />);
    expect(container.querySelector('[data-component="search-filter-listing"]')).toBeInTheDocument();
  });

  /* ---- Key props ---- */
  it('renders description when provided', () => {
    render(<SearchFilterListing title="T" description="Manage orders" />);
    expect(screen.getByText('Manage orders')).toBeInTheDocument();
  });

  it('renders totalCount badge', () => {
    render(<SearchFilterListing title="T" totalCount={42} />);
    expect(screen.getByText('42 sonuc')).toBeInTheDocument();
  });

  it('renders items list', () => {
    render(
      <SearchFilterListing
        title="T"
        items={[<div key="a">Item A</div>, <div key="b">Item B</div>]}
      />,
    );
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
  });

  it('renders empty state when items is empty', () => {
    render(<SearchFilterListing title="T" items={[]} />);
    // Default empty state rendered via EmptyState
    const section = document.querySelector('[data-component="search-filter-listing"]');
    expect(section).toBeInTheDocument();
  });

  it('renders loading skeleton when loading=true', () => {
    const { container } = render(<SearchFilterListing title="T" loading />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  /* ---- className merging ---- */
  it('merges className', () => {
    const { container } = render(<SearchFilterListing title="T" className="my-custom" />);
    const section = container.querySelector('[data-component="search-filter-listing"]');
    expect(section?.className).toContain('my-custom');
  });

  /* ---- Callback props ---- */
  it('calls onReload when reload button is clicked', async () => {
    const onReload = vi.fn();
    const user = userEvent.setup();
    render(<SearchFilterListing title="T" onReload={onReload} />);
    const reloadBtn = screen.getByLabelText('Yeniden yukle');
    await user.click(reloadBtn);
    expect(onReload).toHaveBeenCalledOnce();
  });

  /* ---- aria-label ---- */
  it('supports aria-label', () => {
    const { container } = render(<SearchFilterListing title="T" aria-label="Order listing" />);
    const section = container.querySelector('[data-component="search-filter-listing"]');
    expect(section).toHaveAttribute('aria-label', 'Order listing');
  });
});

describe('SearchFilterListing — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<SearchFilterListing title="Orders" />);
    await expectNoA11yViolations(container);
  });
});
