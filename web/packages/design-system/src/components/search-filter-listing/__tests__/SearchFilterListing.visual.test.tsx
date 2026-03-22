import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { SearchFilterListing } from '../SearchFilterListing';

describe('SearchFilterListing Visual Regression', () => {
  it('empty state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 600 }}>
        <SearchFilterListing title="Products" description="All products" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
