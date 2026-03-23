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

import { GridToolbar } from '../data-grid/GridToolbar';

afterEach(cleanup);

describe('GridToolbar — depth', () => {
  const baseProps = { gridApi: null, theme: 'quartz' as const, density: 'comfortable' as const };

  it('renders toolbar with quick filter input', () => {
    render(<GridToolbar {...baseProps} />);
    expect(screen.getByRole('textbox', { name: /quick filter/i })).toBeInTheDocument();
  });

  it('quick filter fires onChange', () => {
    const onChange = vi.fn();
    render(<GridToolbar {...baseProps} onQuickFilterChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox', { name: /quick filter/i }), { target: { value: 'search' } });
    expect(onChange).toHaveBeenCalledWith('search');
  });

  it('density toggle fires onDensityChange', () => {
    const onDensity = vi.fn();
    render(<GridToolbar {...baseProps} onDensityChange={onDensity} />);
    fireEvent.click(screen.getByText('Compact'));
    expect(onDensity).toHaveBeenCalledWith('compact');
  });

  it('disabled state — returns empty when access hidden', () => {
    const { container } = render(<GridToolbar {...baseProps} access="hidden" />);
    expect(container.textContent).toBe('');
  });

  it('error resilience — renders without gridApi', () => {
    const { container } = render(<GridToolbar {...baseProps} gridApi={null} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('empty toolbar renders reset button', () => {
    render(<GridToolbar {...baseProps} />);
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });
});
