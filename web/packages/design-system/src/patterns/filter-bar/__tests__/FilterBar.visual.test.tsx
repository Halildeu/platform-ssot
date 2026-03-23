/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { FilterBar } from '../FilterBar';

describe('FilterBar Visual Regression', () => {
  it('filter bar with controls matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', width: 600 }}>
        <FilterBar>
          <span>Status</span>
          <span>Category</span>
        </FilterBar>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
