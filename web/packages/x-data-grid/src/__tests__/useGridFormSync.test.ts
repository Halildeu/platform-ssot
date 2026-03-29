// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGridFormSync } from '../composition/useGridFormSync';

interface Employee {
  id: string;
  name: string;
  department: string;
}

const initial: Employee[] = [
  { id: '1', name: 'Alice', department: 'Engineering' },
  { id: '2', name: 'Bob', department: 'Marketing' },
];

describe('useGridFormSync', () => {
  it('initialises with provided rows', () => {
    const { result } = renderHook(() =>
      useGridFormSync<Employee>({ initialRows: initial }),
    );
    expect(result.current.rows).toHaveLength(2);
    expect(result.current.editingRow).toBeNull();
  });

  it('addRow appends a new row', () => {
    const onRowAdded = vi.fn();
    const { result } = renderHook(() =>
      useGridFormSync<Employee>({ initialRows: initial, onRowAdded }),
    );

    const newRow: Employee = { id: '3', name: 'Charlie', department: 'Sales' };
    act(() => result.current.addRow(newRow));

    expect(result.current.rows).toHaveLength(3);
    expect(result.current.rows[2]).toEqual(newRow);
    expect(onRowAdded).toHaveBeenCalledWith(newRow);
  });

  it('updateRow patches an existing row', () => {
    const onRowUpdated = vi.fn();
    const { result } = renderHook(() =>
      useGridFormSync<Employee>({ initialRows: initial, onRowUpdated }),
    );

    act(() => result.current.updateRow('1', { department: 'Product' }));

    expect(result.current.rows[0].department).toBe('Product');
    expect(onRowUpdated).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', department: 'Product' }),
    );
  });

  it('deleteRow removes a row', () => {
    const onRowDeleted = vi.fn();
    const { result } = renderHook(() =>
      useGridFormSync<Employee>({ initialRows: initial, onRowDeleted }),
    );

    act(() => result.current.deleteRow('2'));

    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0].id).toBe('1');
    expect(onRowDeleted).toHaveBeenCalledWith('2');
  });

  it('startEdit / cancelEdit toggle editing state', () => {
    const { result } = renderHook(() =>
      useGridFormSync<Employee>({ initialRows: initial }),
    );

    act(() => result.current.startEdit(initial[0]));
    expect(result.current.editingRow).toEqual(initial[0]);

    act(() => result.current.cancelEdit());
    expect(result.current.editingRow).toBeNull();
  });

  it('addRow clears the editing row', () => {
    const { result } = renderHook(() =>
      useGridFormSync<Employee>({ initialRows: initial }),
    );

    act(() => result.current.startEdit(initial[0]));
    expect(result.current.editingRow).not.toBeNull();

    act(() => result.current.addRow({ id: '4', name: 'Diana', department: 'HR' }));
    expect(result.current.editingRow).toBeNull();
  });

  it('deleteRow clears editingRow if the deleted row was being edited', () => {
    const { result } = renderHook(() =>
      useGridFormSync<Employee>({ initialRows: initial }),
    );

    act(() => result.current.startEdit(initial[1]));
    act(() => result.current.deleteRow('2'));

    expect(result.current.editingRow).toBeNull();
  });
});
