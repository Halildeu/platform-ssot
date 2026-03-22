import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { FilterBar } from '../FilterBar';

describe('FilterBar (Browser)', () => {
  it('renders children filters', async () => {
    render(
      <FilterBar>
        <span>Status filter</span>
        <span>Date filter</span>
      </FilterBar>,
    );
    await expect.element(screen.getByText('Status filter')).toBeVisible();
    await expect.element(screen.getByText('Date filter')).toBeVisible();
  });

  it('renders more filters toggle button', async () => {
    render(
      <FilterBar moreFilters={<span>Advanced</span>}>
        <span>Basic</span>
      </FilterBar>,
    );
    await expect.element(screen.getByText('More filters')).toBeVisible();
  });

  it('reveals more filters when toggle is clicked', async () => {
    render(
      <FilterBar moreFilters={<span>Advanced filter</span>}>
        <span>Basic</span>
      </FilterBar>,
    );
    await screen.getByText('More filters').click();
    await expect.element(screen.getByText('Advanced filter')).toBeVisible();
  });

  it('renders search slot', async () => {
    render(
      <FilterBar search={<input placeholder="Search..." />}>
        <span>Filters</span>
      </FilterBar>,
    );
    await expect.element(screen.getByPlaceholder('Search...')).toBeVisible();
  });

  it('renders actions slot', async () => {
    render(
      <FilterBar actions={<button>Apply</button>}>
        <span>Filter</span>
      </FilterBar>,
    );
    await expect.element(screen.getByText('Apply')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    render(
      <FilterBar><span>F</span></FilterBar>,
    );
    const el = document.querySelector('[data-component="filter-bar"]');
    expect(el).not.toBeNull();
  });

  it('renders active filter count badge', async () => {
    render(
      <FilterBar activeCount={3} moreFilters={<span>More</span>}>
        <span>Basic</span>
      </FilterBar>,
    );
    await expect.element(screen.getByText('3')).toBeVisible();
  });
});
