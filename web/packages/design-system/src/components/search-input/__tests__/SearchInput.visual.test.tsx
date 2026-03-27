/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { SearchInput } from '../SearchInput';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('SearchInput Visual Regression', () => {
  it('empty search input matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 300 }}>
        <SearchInput placeholder="Search..." />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('search input with value matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 300 }}>
        <SearchInput value="hello" onChange={() => {}} onClear={() => {}} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
