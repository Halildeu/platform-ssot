// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TablePagination } from '../data-grid/TablePagination';

afterEach(cleanup);

describe('TablePagination — depth', () => {
  it('renders pagination container', () => {
    const { container } = render(<TablePagination totalItems={100} />);
    expect(container.querySelector('[data-component="table-pagination"]')).toBeInTheDocument();
  });

  it('next page button fires onPageChange', () => {
    const onPageChange = vi.fn();
    render(
      <TablePagination totalItems={100} page={1} pageSize={10} onPageChange={onPageChange} showFirstLastButtons />,
    );
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disabled — previous button disabled on first page', () => {
    render(<TablePagination totalItems={50} page={1} pageSize={10} />);
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
  });

  it('error — zero totalItems renders safely', () => {
    const { container } = render(<TablePagination totalItems={0} />);
    expect(container.querySelector('[data-component="table-pagination"]')).toBeInTheDocument();
  });

  it('empty — returns null when access hidden', () => {
    const { container } = render(<TablePagination totalItems={100} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('shows first/last buttons when enabled', () => {
    render(<TablePagination totalItems={100} page={2} pageSize={10} showFirstLastButtons />);
    expect(screen.getByRole('button', { name: /first page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /last page/i })).toBeInTheDocument();
  });

  it('next page via userEvent click', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <TablePagination totalItems={100} page={1} pageSize={10} onPageChange={onPageChange} showFirstLastButtons />,
    );
    await user.click(screen.getByRole('button', { name: /next page/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
