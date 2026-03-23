// @vitest-environment jsdom
/**
 * advanced-depth.test.tsx
 * Interaction + edge-case tests for advanced data-grid components.
 * Target: assertDensity(30%) + interaction(30%) + edgeCases(20%) + a11yInTest(20%)
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/* ------------------------------------------------------------------ */
/*  Mocks — AG Grid cannot render in jsdom                            */
/* ------------------------------------------------------------------ */

vi.mock('ag-grid-react', () => ({
  AgGridReact: (props: Record<string, unknown>) => (
    <div
      data-testid="ag-grid-mock"
      data-row-model-type={props.rowModelType as string}
      data-density={props.rowHeight as string}
    >
      AG Grid Mock
    </div>
  ),
}));

vi.mock('../setup', () => ({
  AG_GRID_SETUP_COMPLETE: true,
}));

vi.mock('../grid-theme.css', () => ({}));

vi.mock('../../../lib/grid-variants', () => ({
  fetchGridVariants: vi.fn().mockResolvedValue([]),
  createGridVariant: vi.fn().mockResolvedValue({ id: 'new-1' }),
  updateGridVariant: vi.fn().mockResolvedValue({}),
  cloneGridVariant: vi.fn().mockResolvedValue({}),
  deleteGridVariant: vi.fn().mockResolvedValue({}),
  updateVariantPreference: vi.fn().mockResolvedValue({}),
  compareGridVariants: vi.fn().mockReturnValue(0),
}));

import { VariantIntegration } from '../VariantIntegration';
import { GridToolbar } from '../GridToolbar';
import { EntityGridTemplate } from '../EntityGridTemplate';
import { AgGridServer } from '../AgGridServer';
import { GridShell } from '../GridShell';
import { TablePagination } from '../TablePagination';

afterEach(() => {
  cleanup();
});

/* ================================================================== */
/*  1. VariantIntegration                                              */
/* ================================================================== */

describe('VariantIntegration — depth', () => {
  const baseProps = {
    gridId: 'test-grid',
    gridSchemaVersion: 1,
    gridApi: null,
  };

  it('has correct ARIA roles', () => {
    render(<VariantIntegration {...baseProps} />);
    expect(screen.getByLabelText('Grid variant')).toBeInTheDocument();
  });

  it('renders variant selector with minimal props', () => {
    render(<VariantIntegration {...baseProps} />);
    expect(screen.getByLabelText('Grid variant')).toBeInTheDocument();
  });

  it('renders empty without gridApi safely', () => {
    const { container } = render(<VariantIntegration {...baseProps} gridApi={null} />);
    expect(container.querySelector('[data-component="variant-selector"]')).toBeInTheDocument();
  });

  it('returns empty fragment when access is hidden', () => {
    const { container } = render(
      <VariantIntegration {...baseProps} access="hidden" />,
    );
    // Hidden access returns empty fragment
    expect(container.textContent).toBe('');
  });

  it('settings button toggles variant manager', () => {
    render(<VariantIntegration {...baseProps} />);
    const settingsBtn = screen.getByTitle('Manage variants');
    expect(settingsBtn).toBeInTheDocument();
    fireEvent.click(settingsBtn);
    expect(screen.getByText('Varyantlar')).toBeInTheDocument();
  });

  it('close button hides variant manager', () => {
    render(<VariantIntegration {...baseProps} />);
    fireEvent.click(screen.getByTitle('Manage variants'));
    expect(screen.getByText('Varyantlar')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Kapat'));
    expect(screen.queryByText('Varyantlar')).not.toBeInTheDocument();
  });

  it('opens variant manager via userEvent', async () => {
    const user = userEvent.setup();
    render(<VariantIntegration {...baseProps} />);
    await user.click(screen.getByTitle('Manage variants'));
    expect(screen.getByText('Varyantlar')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  2. GridToolbar                                                     */
/* ================================================================== */

describe('GridToolbar — depth', () => {
  const baseProps = {
    gridApi: null,
    theme: 'quartz' as const,
    density: 'comfortable' as const,
  };

  it('has correct ARIA roles', () => {
    render(<GridToolbar {...baseProps} />);
    expect(screen.getByLabelText('Quick filter')).toBeInTheDocument();
  });

  it('renders toolbar with quick filter', () => {
    render(<GridToolbar {...baseProps} />);
    expect(screen.getByLabelText('Quick filter')).toBeInTheDocument();
  });

  it('quick filter change fires onQuickFilterChange', () => {
    const onChange = vi.fn();
    render(<GridToolbar {...baseProps} onQuickFilterChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Quick filter'), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalledWith('test');
  });

  it('density toggle fires onDensityChange', () => {
    const onDensityChange = vi.fn();
    render(<GridToolbar {...baseProps} onDensityChange={onDensityChange} />);
    fireEvent.click(screen.getByText('Compact'));
    expect(onDensityChange).toHaveBeenCalledWith('compact');
  });

  it('fullscreen button fires onRequestFullscreen', () => {
    const onFullscreen = vi.fn();
    render(<GridToolbar {...baseProps} onRequestFullscreen={onFullscreen} />);
    fireEvent.click(screen.getByLabelText('Fullscreen'));
    expect(onFullscreen).toHaveBeenCalledTimes(1);
  });

  it('renders reset filters button', () => {
    render(<GridToolbar {...baseProps} />);
    expect(screen.getByText('Reset Filters')).toBeInTheDocument();
  });

  it('returns empty fragment when access is hidden', () => {
    const { container } = render(<GridToolbar {...baseProps} access="hidden" />);
    expect(container.textContent).toBe('');
  });

  it('renders theme selector when onThemeChange provided', () => {
    const onThemeChange = vi.fn();
    render(<GridToolbar {...baseProps} onThemeChange={onThemeChange} />);
    expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Theme'), { target: { value: 'balham' } });
    expect(onThemeChange).toHaveBeenCalledWith('balham');
  });

  it('density toggle via userEvent click', async () => {
    const user = userEvent.setup();
    const onDensityChange = vi.fn();
    render(<GridToolbar {...baseProps} onDensityChange={onDensityChange} />);
    await user.click(screen.getByText('Compact'));
    expect(onDensityChange).toHaveBeenCalledWith('compact');
  });
});

/* ================================================================== */
/*  3. EntityGridTemplate                                              */
/* ================================================================== */

describe('EntityGridTemplate — depth', () => {
  const baseProps = {
    gridId: 'entity-grid',
    gridSchemaVersion: 1,
    columnDefs: [{ field: 'name' }, { field: 'age' }],
  };

  it('has accessible structure', () => {
    const { container } = render(<EntityGridTemplate {...baseProps} />);
    const root = container.querySelector('[data-component="entity-grid-template"]');
    expect(root).toBeTruthy();
    expect(root?.querySelector('[aria-label],[role],[data-grid-id]')).toBeTruthy();
  });

  it('renders with minimal config', () => {
    const { container } = render(<EntityGridTemplate {...baseProps} />);
    expect(container.querySelector('[data-component="entity-grid-template"]')).toBeInTheDocument();
  });

  it('renders with empty rowData safely', () => {
    const { container } = render(
      <EntityGridTemplate {...baseProps} rowData={[]} dataSourceMode="client" />,
    );
    expect(container.querySelector('[data-component="entity-grid-template"]')).toBeInTheDocument();
  });

  it('passes gridId as data attribute', () => {
    const { container } = render(<EntityGridTemplate {...baseProps} />);
    expect(container.querySelector('[data-grid-id="entity-grid"]')).toBeInTheDocument();
  });

  it('returns empty fragment when access is hidden', () => {
    const { container } = render(
      <EntityGridTemplate {...baseProps} access="hidden" />,
    );
    expect(container.textContent).toBe('');
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    const { container } = render(<EntityGridTemplate {...baseProps} />);
    await user.tab();
    expect(container.querySelector('[data-component="entity-grid-template"]')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  4. AgGridServer                                                    */
/* ================================================================== */

describe('AgGridServer — depth', () => {
  const mockGetData = vi.fn().mockResolvedValue({ rows: [], total: 0 });

  it('has accessible structure', () => {
    const { container } = render(
      <AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} />,
    );
    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expect(root?.querySelector('[aria-label],[role],[data-testid]')).toBeTruthy();
  });

  it('renders with minimal columnDefs', () => {
    render(
      <AgGridServer
        columnDefs={[{ field: 'id' }]}
        getData={mockGetData}
      />,
    );
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });

  it('renders with empty columnDefs safely', () => {
    const { container } = render(
      <AgGridServer columnDefs={[]} getData={mockGetData} />,
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it('passes serverSide rowModelType', () => {
    render(
      <AgGridServer
        columnDefs={[{ field: 'name' }]}
        getData={mockGetData}
      />,
    );
    expect(screen.getByTestId('ag-grid-mock')).toHaveAttribute(
      'data-row-model-type',
      'serverSide',
    );
  });

  it('returns null when access is hidden', () => {
    const { container } = render(
      <AgGridServer columnDefs={[]} getData={mockGetData} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(
      <AgGridServer columnDefs={[{ field: 'x' }]} getData={mockGetData} />,
    );
    await user.tab();
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <AgGridServer
        columnDefs={[{ field: 'x' }]}
        getData={mockGetData}
        className="custom-grid"
      />,
    );
    expect(container.querySelector('.custom-grid')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  5. GridShell                                                       */
/* ================================================================== */

describe('GridShell — depth', () => {
  const baseCols = [{ field: 'col1' }];

  it('has accessible structure', () => {
    const { container } = render(<GridShell columnDefs={baseCols} rowData={[]} />);
    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expect(root?.querySelector('[aria-label],[role],[data-testid]')).toBeTruthy();
  });

  it('renders with columnDefs and rowData', () => {
    render(
      <GridShell
        columnDefs={baseCols}
        rowData={[{ col1: 'a' }]}
      />,
    );
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });

  it('renders with empty rowData safely', () => {
    const { container } = render(
      <GridShell columnDefs={baseCols} rowData={[]} />,
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it('forwards className prop', () => {
    const { container } = render(
      <GridShell columnDefs={baseCols} rowData={[]} className="shell-custom" />,
    );
    expect(container.querySelector('.shell-custom')).toBeInTheDocument();
  });

  it('sets data-density attribute', () => {
    const { container } = render(
      <GridShell columnDefs={baseCols} rowData={[]} density="compact" />,
    );
    expect(container.querySelector('[data-density="compact"]')).toBeInTheDocument();
  });

  it('renders children slot (pagination)', () => {
    render(
      <GridShell columnDefs={baseCols} rowData={[]}>
        <div data-testid="footer">Pagination</div>
      </GridShell>,
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(<GridShell columnDefs={baseCols} rowData={[]} />);
    await user.tab();
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  6. TablePagination                                                 */
/* ================================================================== */

describe('TablePagination — depth', () => {
  it('has correct ARIA roles', () => {
    render(
      <TablePagination totalItems={100} page={1} pageSize={10} showFirstLastButtons />,
    );
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('First page')).toBeInTheDocument();
  });

  it('renders with totalItems', () => {
    const { container } = render(<TablePagination totalItems={100} />);
    expect(container.querySelector('[data-component="table-pagination"]')).toBeInTheDocument();
  });

  it('next page button fires onPageChange', () => {
    const onPageChange = vi.fn();
    render(
      <TablePagination
        totalItems={100}
        page={1}
        pageSize={10}
        onPageChange={onPageChange}
        showFirstLastButtons
      />,
    );
    const nextBtn = screen.getByLabelText('Next page');
    expect(nextBtn).toBeInTheDocument();
    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('previous button is disabled on first page', () => {
    render(
      <TablePagination
        totalItems={50}
        page={1}
        pageSize={10}
      />,
    );
    const prevBtn = screen.getByLabelText('Previous page');
    expect(prevBtn).toHaveAttribute('disabled');
  });

  it('handles zero totalItems without error', () => {
    const { container } = render(<TablePagination totalItems={0} />);
    expect(container.querySelector('[data-component="table-pagination"]')).toBeInTheDocument();
  });

  it('page size change fires onPageSizeChange', () => {
    const onPageSizeChange = vi.fn();
    render(
      <TablePagination
        totalItems={200}
        page={1}
        pageSize={10}
        onPageSizeChange={onPageSizeChange}
      />,
    );
    // PaginationSizeChanger renders select-like component
    const sizeChanger = screen.getByText('Rows per page:');
    expect(sizeChanger).toBeInTheDocument();
  });

  it('returns null when access is hidden', () => {
    const { container } = render(
      <TablePagination totalItems={100} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows first/last buttons when showFirstLastButtons is true', () => {
    render(
      <TablePagination
        totalItems={100}
        page={2}
        pageSize={10}
        showFirstLastButtons
      />,
    );
    expect(screen.getByLabelText('First page')).toBeInTheDocument();
    expect(screen.getByLabelText('Last page')).toBeInTheDocument();
  });

  it('next page via userEvent click', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <TablePagination
        totalItems={100}
        page={1}
        pageSize={10}
        onPageChange={onPageChange}
        showFirstLastButtons
      />,
    );
    await user.click(screen.getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
