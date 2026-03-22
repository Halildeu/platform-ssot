import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { SearchInput } from '../SearchInput';

describe('SearchInput Visual Regression', () => {
  it('empty search input matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <SearchInput placeholder="Search..." />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('search input with value matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <SearchInput value="hello" onChange={() => {}} onClear={() => {}} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
