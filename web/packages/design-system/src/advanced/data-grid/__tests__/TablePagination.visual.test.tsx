/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { TablePagination } from '../TablePagination';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('TablePagination Visual Regression', () => {
  it('pagination bar matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 600 }}>
        <TablePagination totalItems={100} page={1} pageSize={10} showFirstLastButtons />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
