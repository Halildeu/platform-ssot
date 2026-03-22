import { describe, it, expect, vi } from 'vitest';
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

  it('renders previous and next page buttons', async () => {
    const screen = render(
      <TablePagination totalItems={100} page={2} pageSize={10} />,
    );
    await expect.element(screen.getByLabelText('Previous page')).toBeVisible();
    await expect.element(screen.getByLabelText('Next page')).toBeVisible();
  });

  it('disables previous button on first page', async () => {
    const screen = render(
      <TablePagination totalItems={100} page={1} pageSize={10} />,
    );
    await expect.element(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('renders first/last buttons when showFirstLastButtons is true', async () => {
    const screen = render(
      <TablePagination totalItems={100} page={3} pageSize={10} showFirstLastButtons />,
    );
    await expect.element(screen.getByLabelText('First page')).toBeVisible();
    await expect.element(screen.getByLabelText('Last page')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    const screen = render(
      <TablePagination totalItems={50} page={1} pageSize={10} />,
    );
    const el = screen.container.querySelector('[data-component="table-pagination"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = render(
      <TablePagination totalItems={50} page={1} pageSize={10} access="hidden" />,
    );
    const el = screen.container.querySelector('[data-component="table-pagination"]');
    expect(el).toBeNull();
  });

  it('calls onPageChange when next button is clicked', async () => {
    const onPageChange = vi.fn();
    const screen = render(
      <TablePagination totalItems={100} page={1} pageSize={10} onPageChange={onPageChange} />,
    );
    await screen.getByLabelText('Next page').click();
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
