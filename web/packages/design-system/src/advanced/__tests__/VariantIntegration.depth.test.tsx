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
vi.mock('../../lib/grid-variants', () => ({
  fetchGridVariants: vi.fn().mockResolvedValue([]),
  createGridVariant: vi.fn().mockResolvedValue({ id: 'new-1' }),
  updateGridVariant: vi.fn().mockResolvedValue({}),
  cloneGridVariant: vi.fn().mockResolvedValue({}),
  deleteGridVariant: vi.fn().mockResolvedValue({}),
  updateVariantPreference: vi.fn().mockResolvedValue({}),
  compareGridVariants: vi.fn().mockReturnValue(0),
}));

import { VariantIntegration } from '../data-grid/VariantIntegration';

afterEach(cleanup);

describe('VariantIntegration — depth', () => {
  const baseProps = { gridId: 'test-grid', gridSchemaVersion: 1, gridApi: null };

  it('renders variant selector with label', () => {
    render(<VariantIntegration {...baseProps} />);
    expect(screen.getByRole('combobox', { name: /grid variant/i })).toBeInTheDocument();
  });

  it('settings button opens variant manager', () => {
    render(<VariantIntegration {...baseProps} />);
    fireEvent.click(screen.getByTitle('Manage variants'));
    expect(screen.getByText('Varyantlar')).toBeInTheDocument();
  });

  it('close button hides variant manager', () => {
    render(<VariantIntegration {...baseProps} />);
    fireEvent.click(screen.getByTitle('Manage variants'));
    fireEvent.click(screen.getByTitle('Kapat'));
    expect(screen.queryByText('Varyantlar')).not.toBeInTheDocument();
  });

  it('disabled — returns empty when access hidden', () => {
    const { container } = render(<VariantIntegration {...baseProps} access="hidden" />);
    expect(container.textContent).toBe('');
  });

  it('error — renders without gridApi safely', () => {
    const { container } = render(<VariantIntegration {...baseProps} gridApi={null} />);
    expect(container.querySelector('[data-component="variant-selector"]')).toBeInTheDocument();
  });

  it('empty state renders selector', () => {
    render(<VariantIntegration {...baseProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
