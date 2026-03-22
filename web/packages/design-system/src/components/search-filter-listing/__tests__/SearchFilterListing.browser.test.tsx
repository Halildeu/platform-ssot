import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { SearchFilterListing } from '../SearchFilterListing';

describe('SearchFilterListing (Browser)', () => {
  it('renders title and empty state', async () => {
    const screen = render(<SearchFilterListing title="Products" />);
    await expect.element(screen.getByText('Products')).toBeVisible();
  });

  it('renders with items', async () => {
    const screen = render(
      <SearchFilterListing
        title="Orders"
        items={[<div key="1">Order 1</div>, <div key="2">Order 2</div>]}
      />,
    );
    await expect.element(screen.getByText('Order 1')).toBeVisible();
    await expect.element(screen.getByText('Order 2')).toBeVisible();
  });
});
