import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { TablePagination } from '../TablePagination';

describe('TablePagination Visual Regression', () => {
  it('pagination bar matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 600 }}>
        <TablePagination totalItems={100} page={1} pageSize={10} showFirstLastButtons />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
