import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataGridSelectionBar } from '../DataGridSelectionBar';

describe('DataGridSelectionBar', () => {
  it('renders with selected count', () => {
    render(<DataGridSelectionBar selectedCount={5} />);

    expect(screen.getByText('5 items selected')).toBeInTheDocument();
  });

  it('shows selection bar when selectedCount > 0', () => {
    const { container } = render(<DataGridSelectionBar selectedCount={3} />);

    expect(container.firstElementChild).toBeTruthy();
    expect(screen.getByText('3 items selected')).toBeInTheDocument();
  });

  it('hides when selectedCount is 0', () => {
    const { container } = render(<DataGridSelectionBar selectedCount={0} />);

    expect(container.innerHTML).toBe('');
  });

  it('calls onClearSelection on clear button click', () => {
    const onClearSelection = vi.fn();

    render(
      <DataGridSelectionBar selectedCount={2} onClearSelection={onClearSelection} />,
    );

    fireEvent.click(screen.getByText('Clear selection'));
    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });

  it('renders children (action buttons)', () => {
    render(
      <DataGridSelectionBar selectedCount={1}>
        <button type="button">Delete</button>
        <button type="button">Export</button>
      </DataGridSelectionBar>,
    );

    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('displays correct selected label text', () => {
    render(
      <DataGridSelectionBar selectedCount={7} selectedLabel="rows selected" />,
    );

    expect(screen.getByText('7 rows selected')).toBeInTheDocument();
  });

  it('displays the count in the badge', () => {
    render(<DataGridSelectionBar selectedCount={12} />);

    // The badge contains just the number
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('uses custom clearLabel', () => {
    render(
      <DataGridSelectionBar
        selectedCount={3}
        onClearSelection={vi.fn()}
        clearLabel="Deselect all"
      />,
    );

    expect(screen.getByText('Deselect all')).toBeInTheDocument();
  });

  it('does not render clear button when onClearSelection is not provided', () => {
    render(<DataGridSelectionBar selectedCount={3} />);

    expect(screen.queryByText('Clear selection')).not.toBeInTheDocument();
  });

  it('applies className prop', () => {
    const { container } = render(
      <DataGridSelectionBar selectedCount={1} className="my-bar" />,
    );

    expect(container.firstElementChild).toHaveClass('my-bar');
  });
});
