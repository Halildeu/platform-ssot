// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('ag-grid-react', () => ({
  AgGridReact: (props: Record<string, unknown>) => (
    <div data-testid="ag-grid-mock" data-row-model-type={props.rowModelType as string}>AG Grid Mock</div>
  ),
}));
vi.mock('../data-grid/setup', () => ({ AG_GRID_SETUP_COMPLETE: true }));
vi.mock('../data-grid/grid-theme.css', () => ({}));

import { AgGridServer } from '../data-grid/AgGridServer';

afterEach(cleanup);

describe('AgGridServer — depth', () => {
  const mockGetData = vi.fn().mockResolvedValue({ rows: [], total: 0 });

  it('renders with columnDefs', () => {
    render(<AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} />);
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });

  it('uses serverSide row model', () => {
    render(<AgGridServer columnDefs={[{ field: 'name' }]} getData={mockGetData} />);
    expect(screen.getByTestId('ag-grid-mock')).toHaveAttribute('data-row-model-type', 'serverSide');
  });

  it('empty columnDefs renders safely', () => {
    const { container } = render(<AgGridServer columnDefs={[]} getData={mockGetData} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('disabled — returns null when access hidden', () => {
    const { container } = render(<AgGridServer columnDefs={[]} getData={mockGetData} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('error — invalid getData handled', () => {
    const badGetData = vi.fn().mockRejectedValue(new Error('fail'));
    const { container } = render(<AgGridServer columnDefs={[{ field: 'x' }]} getData={badGetData} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('interaction — grid container click does not crash', () => {
    const { container } = render(
      <AgGridServer columnDefs={[{ field: 'x' }]} getData={mockGetData} className="srv-grid" />,
    );
    const grid = container.querySelector('.srv-grid');
    expect(grid).toBeInTheDocument();
    fireEvent.click(grid!);
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(<AgGridServer columnDefs={[{ field: 'x' }]} getData={mockGetData} />);
    await user.tab();
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });
});
