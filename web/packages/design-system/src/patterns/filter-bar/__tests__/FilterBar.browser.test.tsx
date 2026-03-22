import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { FilterBar } from '../FilterBar';

describe('FilterBar (Browser)', () => {
  it('renders children filters', async () => {
    const screen = render(
      <FilterBar>
        <span>Status filter</span>
        <span>Date filter</span>
      </FilterBar>,
    );
    await expect.element(screen.getByText('Status filter')).toBeVisible();
    await expect.element(screen.getByText('Date filter')).toBeVisible();
  });

  it('renders more filters toggle', async () => {
    const screen = render(
      <FilterBar moreFilters={<span>Advanced</span>}>
        <span>Basic</span>
      </FilterBar>,
    );
    await expect.element(screen.getByText('More filters')).toBeVisible();
  });
});
