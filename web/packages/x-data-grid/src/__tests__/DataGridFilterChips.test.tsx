// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataGridFilterChips, type ActiveFilter } from '../DataGridFilterChips';

function makeFilter(overrides: Partial<ActiveFilter> & { key: string }): ActiveFilter {
  return {
    label: 'Status',
    value: 'Active',
    onRemove: vi.fn(),
    ...overrides,
  };
}

describe('DataGridFilterChips', () => {
  it('renders filter chips from filters array', () => {
    const filters: ActiveFilter[] = [
      makeFilter({ key: 'status', label: 'Status', value: 'Active' }),
      makeFilter({ key: 'role', label: 'Role', value: 'Admin' }),
    ];

    render(<DataGridFilterChips filters={filters} />);

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('calls onRemove when chip X button clicked', () => {
    const onRemove = vi.fn();
    const filters: ActiveFilter[] = [
      makeFilter({ key: 'status', label: 'Status', value: 'Active', onRemove }),
    ];

    render(<DataGridFilterChips filters={filters} />);

    fireEvent.click(screen.getByRole('button', { name: 'Remove Status filter' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('calls onClearAll when clear all button clicked', () => {
    const onClearAll = vi.fn();
    const filters: ActiveFilter[] = [
      makeFilter({ key: 'status', label: 'Status', value: 'Active' }),
      makeFilter({ key: 'role', label: 'Role', value: 'Admin' }),
    ];

    render(<DataGridFilterChips filters={filters} onClearAll={onClearAll} />);

    fireEvent.click(screen.getByText('Clear all'));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when no filters (returns null)', () => {
    const { container } = render(<DataGridFilterChips filters={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('applies className prop', () => {
    const filters: ActiveFilter[] = [
      makeFilter({ key: 'status' }),
    ];

    const { container } = render(
      <DataGridFilterChips filters={filters} className="custom-class" />,
    );

    expect(container.firstElementChild).toHaveClass('custom-class');
  });

  it('shows correct filter labels', () => {
    const filters: ActiveFilter[] = [
      makeFilter({ key: 'city', label: 'City', value: 'Istanbul' }),
      makeFilter({ key: 'country', label: 'Country', value: 'Turkey' }),
    ];

    render(<DataGridFilterChips filters={filters} />);

    expect(screen.getByText('City:')).toBeInTheDocument();
    expect(screen.getByText('Istanbul')).toBeInTheDocument();
    expect(screen.getByText('Country:')).toBeInTheDocument();
    expect(screen.getByText('Turkey')).toBeInTheDocument();
  });

  it('does not render clear all button when only one filter exists', () => {
    const onClearAll = vi.fn();
    const filters: ActiveFilter[] = [
      makeFilter({ key: 'status' }),
    ];

    render(<DataGridFilterChips filters={filters} onClearAll={onClearAll} />);

    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
  });

  it('does not render clear all button when onClearAll is not provided', () => {
    const filters: ActiveFilter[] = [
      makeFilter({ key: 'a' }),
      makeFilter({ key: 'b' }),
    ];

    render(<DataGridFilterChips filters={filters} />);

    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
  });

  it('uses custom clearAllLabel', () => {
    const filters: ActiveFilter[] = [
      makeFilter({ key: 'a' }),
      makeFilter({ key: 'b' }),
    ];

    render(
      <DataGridFilterChips filters={filters} onClearAll={vi.fn()} clearAllLabel="Reset" />,
    );

    expect(screen.getByText('Reset')).toBeInTheDocument();
  });
});
