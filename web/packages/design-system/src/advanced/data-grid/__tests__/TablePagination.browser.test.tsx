import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { TablePagination } from '../TablePagination';

describe('TablePagination (Browser)', () => {
  it('renders pagination with page info', async () => {
    const screen = render(
      <TablePagination totalItems={100} page={1} pageSize={10} />,
    );
    await expect.element(screen.getByText('1-10 of 100')).toBeVisible();
  });

  it('renders rows per page label', async () => {
    const screen = render(
      <TablePagination totalItems={50} page={1} pageSize={20} />,
    );
    await expect.element(screen.getByText('Rows per page:')).toBeVisible();
  });
});
