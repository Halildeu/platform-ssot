// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

vi.mock('ag-grid-react', () => ({
  AgGridReact: () => <div data-testid="ag-grid-mock">AG Grid Mock</div>,
}));
vi.mock('../data-grid/setup', () => ({ AG_GRID_SETUP_COMPLETE: true }));
vi.mock('../data-grid/grid-theme.css', () => ({}));

import { GridShell } from '../data-grid/GridShell';

afterEach(cleanup);

describe('GridShell — depth', () => {
  const baseCols = [{ field: 'col1' }];

  it('renders grid container with role', () => {
    render(<GridShell columnDefs={baseCols} rowData={[{ col1: 'a' }]} />);
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });

  it('renders with empty rowData safely', () => {
    const { container } = render(<GridShell columnDefs={baseCols} rowData={[]} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('applies className prop', () => {
    const { container } = render(<GridShell columnDefs={baseCols} rowData={[]} className="custom-shell" />);
    expect(container.querySelector('.custom-shell')).toBeInTheDocument();
  });

  it('disabled density attribute', () => {
    const { container } = render(<GridShell columnDefs={baseCols} rowData={[]} density="compact" />);
    expect(container.querySelector('[data-density="compact"]')).toBeInTheDocument();
  });

  it('error — renders with undefined rowData', () => {
    const { container } = render(<GridShell columnDefs={baseCols} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('children slot click interaction', () => {
    const onClick = vi.fn();
    render(
      <GridShell columnDefs={baseCols} rowData={[]}>
        <button role="button" onClick={onClick}>Pagination</button>
      </GridShell>,
    );
    fireEvent.click(screen.getByRole('button', { name: /pagination/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
