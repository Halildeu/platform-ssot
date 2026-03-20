// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { FilterBar } from '../FilterBar';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Contract: Default render                                           */
/* ------------------------------------------------------------------ */

describe('FilterBar contract — default render', () => {
  it('renders children as primary filters', () => {
    render(
      <FilterBar>
        <select data-testid="status-filter"><option>All</option></select>
      </FilterBar>,
    );
    expect(screen.getByTestId('status-filter')).toBeInTheDocument();
  });

  it('renders with data-component attribute', () => {
    const { container } = render(<FilterBar><span>Filter</span></FilterBar>);
    expect(container.querySelector('[data-component="filter-bar"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Key props                                                */
/* ------------------------------------------------------------------ */

describe('FilterBar contract — key props', () => {
  it('renders search slot', () => {
    render(
      <FilterBar search={<input data-testid="search-input" placeholder="Search..." />}>
        <span>Filters</span>
      </FilterBar>,
    );
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(
      <FilterBar actions={<button data-testid="apply-btn">Apply</button>}>
        <span>Filters</span>
      </FilterBar>,
    );
    expect(screen.getByTestId('apply-btn')).toBeInTheDocument();
  });

  it('applies compact padding when compact=true', () => {
    const { container } = render(
      <FilterBar compact>
        <span>Filters</span>
      </FilterBar>,
    );
    const row = container.querySelector('.px-4.py-2');
    expect(row).toBeInTheDocument();
  });

  it('applies standard padding by default', () => {
    const { container } = render(
      <FilterBar>
        <span>Filters</span>
      </FilterBar>,
    );
    const row = container.querySelector('.px-6.py-3');
    expect(row).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: More filters toggle                                      */
/* ------------------------------------------------------------------ */

describe('FilterBar contract — more filters', () => {
  it('renders more filters toggle button when moreFilters provided', () => {
    render(
      <FilterBar moreFilters={<span>Advanced</span>}>
        <span>Filters</span>
      </FilterBar>,
    );
    expect(screen.getByText('More filters')).toBeInTheDocument();
  });

  it('shows more filters panel on toggle click', () => {
    render(
      <FilterBar moreFilters={<span data-testid="advanced">Advanced filter</span>}>
        <span>Filters</span>
      </FilterBar>,
    );
    expect(screen.queryByTestId('advanced')).toBeNull();
    fireEvent.click(screen.getByText('More filters'));
    expect(screen.getByTestId('advanced')).toBeInTheDocument();
  });

  it('renders custom moreLabel', () => {
    render(
      <FilterBar moreFilters={<span>Extra</span>} moreLabel="Show advanced">
        <span>Filters</span>
      </FilterBar>,
    );
    expect(screen.getByText('Show advanced')).toBeInTheDocument();
  });

  it('renders active count badge', () => {
    render(
      <FilterBar moreFilters={<span>Extra</span>} activeCount={3}>
        <span>Filters</span>
      </FilterBar>,
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: className merging                                        */
/* ------------------------------------------------------------------ */

describe('FilterBar contract — className merging', () => {
  it('merges custom className onto root', () => {
    const { container } = render(
      <FilterBar className="my-filter-bar">
        <span>Filters</span>
      </FilterBar>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('my-filter-bar');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Accessibility                                            */
/* ------------------------------------------------------------------ */

describe('FilterBar — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <FilterBar>
        <span>Status</span>
      </FilterBar>,
    );
    await expectNoA11yViolations(container);
  });
});
