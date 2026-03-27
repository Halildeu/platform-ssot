/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { SearchFilterListing } from '../SearchFilterListing';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('SearchFilterListing Visual Regression', () => {
  it('empty state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 600 }}>
        <SearchFilterListing title="Products" description="All products" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
