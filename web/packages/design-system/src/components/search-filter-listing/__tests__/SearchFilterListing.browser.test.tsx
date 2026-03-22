import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { SearchFilterListing } from '../SearchFilterListing';

describe('SearchFilterListing (Browser)', () => {
  it('renders title', async () => {
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

  it('renders description', async () => {
    const screen = render(
      <SearchFilterListing title="Products" description="All available products" />,
    );
    await expect.element(screen.getByText('All available products')).toBeVisible();
  });

  it('renders actions slot', async () => {
    const screen = render(
      <SearchFilterListing title="Items" actions={<button>Add Item</button>} />,
    );
    await expect.element(screen.getByText('Add Item')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    const screen = render(<SearchFilterListing title="Test" />);
    const el = screen.container.querySelector('[data-component="search-filter-listing"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = render(<SearchFilterListing title="Hidden" access="hidden" />);
    expect(screen.container.querySelector('[data-component="search-filter-listing"]')).toBeNull();
  });

  it('renders filters slot', async () => {
    const screen = render(
      <SearchFilterListing title="Items" filters={<span>Status filter</span>} />,
    );
    await expect.element(screen.getByText('Status filter')).toBeVisible();
  });

  it('renders summary strip items', async () => {
    const screen = render(
      <SearchFilterListing
        title="Dashboard"
        summaryItems={[{ key: 'total', label: 'Total', value: '42' }]}
      />,
    );
    await expect.element(screen.getByText('Total')).toBeVisible();
    await expect.element(screen.getByText('42')).toBeVisible();
  });
});
