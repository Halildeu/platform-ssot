import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useColumnBuilder } from '../useColumnBuilder';

interface TestRow {
  id: number;
  name: string;
  amount: number;
  createdAt: string;
  isActive: boolean;
}

describe('useColumnBuilder', () => {
  it('creates text column with defaults', () => {
    const { result } = renderHook(() => useColumnBuilder<TestRow>());

    const col = result.current.col({
      field: 'name',
      headerName: 'Name',
    });

    expect(col.field).toBe('name');
    expect(col.headerName).toBe('Name');
    expect(col.sortable).toBe(true);
    expect(col.filter).toBe(true);
  });

  it('creates number column with formatter', () => {
    const { result } = renderHook(() => useColumnBuilder<TestRow>());

    const formatter = vi.fn((params) => `$${params.value}`);
    const col = result.current.col({
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      valueFormatter: formatter,
    });

    expect(col.filter).toBe('agNumberColumnFilter');
    expect(col.type).toBe('numericColumn');
    expect(col.valueFormatter).toBe(formatter);
  });

  it('creates date column with date filter', () => {
    const { result } = renderHook(() => useColumnBuilder<TestRow>());

    const col = result.current.col({
      field: 'createdAt',
      headerName: 'Created At',
      type: 'date',
    });

    expect(col.filter).toBe('agDateColumnFilter');
    expect(col.sortable).toBe(true);
  });

  it('creates boolean column with set filter and default width', () => {
    const { result } = renderHook(() => useColumnBuilder<TestRow>());

    const col = result.current.col({
      field: 'isActive',
      headerName: 'Active',
      type: 'boolean',
    });

    expect(col.filter).toBe('agSetColumnFilter');
    expect(col.width).toBe(100);
  });

  it('creates action column with cell renderer', () => {
    const { result } = renderHook(() => useColumnBuilder<TestRow>());

    const renderer = () => null;
    const col = result.current.col({
      field: 'id',
      headerName: '',
      type: 'actions',
      cellRenderer: renderer,
    });

    expect(col.sortable).toBe(false);
    expect(col.filter).toBe(false);
    expect(col.pinned).toBe('right');
    expect(col.width).toBe(80);
    expect(col.suppressMenu).toBe(true);
    expect(col.cellRenderer).toBe(renderer);
  });

  it('chain builds multiple columns with cols()', () => {
    const { result } = renderHook(() => useColumnBuilder<TestRow>());

    const columns = result.current.cols([
      { field: 'name', headerName: 'Name' },
      { field: 'amount', headerName: 'Amount', type: 'number' },
      { field: 'isActive', headerName: 'Active', type: 'boolean' },
    ]);

    expect(columns).toHaveLength(3);
    expect(columns[0].field).toBe('name');
    expect(columns[1].filter).toBe('agNumberColumnFilter');
    expect(columns[2].filter).toBe('agSetColumnFilter');
  });

  it('applies custom colDef overrides', () => {
    const { result } = renderHook(() => useColumnBuilder<TestRow>());

    const col = result.current.col({
      field: 'name',
      headerName: 'Name',
      width: 250,
      pinned: 'left',
      sortable: false,
      filter: false,
      editable: true,
      flex: 2,
    });

    expect(col.width).toBe(250);
    expect(col.pinned).toBe('left');
    expect(col.sortable).toBe(false);
    expect(col.filter).toBe(false);
    expect(col.editable).toBe(true);
    expect(col.flex).toBe(2);
  });

  it('respects custom width on boolean column', () => {
    const { result } = renderHook(() => useColumnBuilder<TestRow>());

    const col = result.current.col({
      field: 'isActive',
      headerName: 'Active',
      type: 'boolean',
      width: 150,
    });

    expect(col.width).toBe(150);
  });

  it('respects custom pinned on action column', () => {
    const { result } = renderHook(() => useColumnBuilder<TestRow>());

    const col = result.current.col({
      field: 'id',
      headerName: '',
      type: 'actions',
      pinned: 'left',
    });

    expect(col.pinned).toBe('left');
  });
});
