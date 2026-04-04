/**
 * Contract Tests: GridAdapter + AGGridAdapter + autoMapColumns
 *
 * @see contract P4 DoD
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AGGridAdapter } from '../grid-adapter/AGGridAdapter';
import type { AGGridApi } from '../grid-adapter/AGGridAdapter';
import { autoMapColumns } from '../grid-adapter/useChartGridLink';
import type { GridColumnDef, GridFilterEntry } from '../grid-adapter/types';

/* ------------------------------------------------------------------ */
/*  Mock AG Grid API                                                   */
/* ------------------------------------------------------------------ */

function createMockApi(overrides?: Partial<AGGridApi>): AGGridApi {
  return {
    setGridOption: vi.fn(),
    getFilterModel: vi.fn().mockReturnValue({}),
    setFilterModel: vi.fn(),
    getColumnDefs: vi.fn().mockReturnValue([
      { field: 'name', headerName: 'Name', type: 'textColumn', sortable: true, filter: true },
      { field: 'age', headerName: 'Age', type: 'numericColumn', sortable: true, filter: true },
      { field: 'date', headerName: 'Date', type: 'dateColumn' },
    ]),
    getSelectedRows: vi.fn().mockReturnValue([]),
    forEachNode: vi.fn(),
    deselectAll: vi.fn(),
    refreshServerSide: vi.fn(),
    refreshCells: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    ...overrides,
  };
}

/* ================================================================== */
/*  AGGridAdapter                                                      */
/* ================================================================== */

describe('AGGridAdapter', () => {
  let api: AGGridApi;
  let adapter: ReturnType<typeof createAdapter>;

  function createAdapter(id = 'test-grid') {
    api = createMockApi();
    return new AGGridAdapter(id, api);
  }

  beforeEach(() => {
    adapter = createAdapter();
  });

  it('has correct id', () => {
    expect(adapter.id).toBe('test-grid');
  });

  it('setData calls setGridOption with rowData', () => {
    const rows = [{ id: '1', name: 'Alice' }];
    adapter.setData(rows);
    expect(api.setGridOption).toHaveBeenCalledWith('rowData', rows);
  });

  it('getSelectedRows delegates to AG Grid', () => {
    const rows = [{ id: '1' }];
    (api.getSelectedRows as ReturnType<typeof vi.fn>).mockReturnValue(rows);
    expect(adapter.getSelectedRows()).toEqual(rows);
  });

  it('getColumnDefs maps AG Grid columns to GridColumnDef', () => {
    const defs = adapter.getColumnDefs();
    expect(defs).toHaveLength(3);
    expect(defs[0]).toEqual({ field: 'name', headerName: 'Name', type: 'string', sortable: true, filterable: true, colId: undefined });
    expect(defs[1].type).toBe('number');
    expect(defs[2].type).toBe('date');
  });

  it('applyExternalFilter converts entries to AG Grid filter model', () => {
    const filters: GridFilterEntry[] = [
      { field: 'name', operator: 'eq', value: 'Alice' },
      { field: 'tags', operator: 'in', value: ['a', 'b'] },
    ];
    adapter.applyExternalFilter(filters);
    expect(api.setFilterModel).toHaveBeenCalledWith({
      name: { filterType: 'text', type: 'equals', filter: 'Alice' },
      tags: { filterType: 'set', values: ['a', 'b'] },
    });
    expect(api.refreshServerSide).toHaveBeenCalledWith({ purge: true });
  });

  it('getFilterModel converts AG Grid filter to entries', () => {
    (api.getFilterModel as ReturnType<typeof vi.fn>).mockReturnValue({
      name: { filterType: 'text', type: 'equals', filter: 'Bob' },
      score: { filterType: 'number', type: 'greaterThan', filter: 50 },
    });
    const entries = adapter.getFilterModel();
    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual({ field: 'name', operator: 'eq', value: 'Bob' });
    expect(entries[1]).toEqual({ field: 'score', operator: 'gt', value: 50 });
  });

  it('onFilterChange registers and fires callback', () => {
    const cb = vi.fn();
    adapter.onFilterChange(cb);

    // Simulate AG Grid filterChanged event
    const handler = (api.addEventListener as ReturnType<typeof vi.fn>).mock.calls.find(
      (c: unknown[]) => c[0] === 'filterChanged',
    )?.[1] as () => void;
    expect(handler).toBeDefined();
    handler();
    expect(cb).toHaveBeenCalled();
  });

  it('onFilterChange returns unsubscribe function', () => {
    const cb = vi.fn();
    const unsub = adapter.onFilterChange(cb);
    unsub();
    // After unsub, callback should not fire
    const handler = (api.addEventListener as ReturnType<typeof vi.fn>).mock.calls.find(
      (c: unknown[]) => c[0] === 'filterChanged',
    )?.[1] as () => void;
    handler();
    expect(cb).not.toHaveBeenCalled();
  });

  it('onSelectionChange fires with row data', () => {
    const cb = vi.fn();
    adapter.onSelectionChange(cb);

    (api.getSelectedRows as ReturnType<typeof vi.fn>).mockReturnValue([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ]);

    const handler = (api.addEventListener as ReturnType<typeof vi.fn>).mock.calls.find(
      (c: unknown[]) => c[0] === 'selectionChanged',
    )?.[1] as () => void;
    handler();

    expect(cb).toHaveBeenCalledWith({
      selectedRows: [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }],
      selectedRowIds: ['1', '2'],
    });
  });

  it('highlightRows selects matching nodes', () => {
    const nodes = [
      { data: { id: '1' }, setSelected: vi.fn(), id: '1' },
      { data: { id: '2' }, setSelected: vi.fn(), id: '2' },
      { data: { id: '3' }, setSelected: vi.fn(), id: '3' },
    ];
    (api.forEachNode as ReturnType<typeof vi.fn>).mockImplementation((cb: (n: unknown) => void) => {
      nodes.forEach(cb);
    });

    adapter.highlightRows(['1', '3']);
    expect(api.deselectAll).toHaveBeenCalled();
    expect(nodes[0].setSelected).toHaveBeenCalledWith(true);
    expect(nodes[1].setSelected).not.toHaveBeenCalled();
    expect(nodes[2].setSelected).toHaveBeenCalledWith(true);
  });

  it('clearHighlights deselects all', () => {
    adapter.clearHighlights();
    expect(api.deselectAll).toHaveBeenCalled();
  });

  it('refresh calls refreshCells', () => {
    adapter.refresh();
    expect(api.refreshCells).toHaveBeenCalledWith({ force: true });
  });

  it('destroy removes event listeners', () => {
    adapter.destroy();
    expect(api.removeEventListener).toHaveBeenCalledTimes(3);
    expect(api.removeEventListener).toHaveBeenCalledWith('filterChanged', expect.any(Function));
    expect(api.removeEventListener).toHaveBeenCalledWith('sortChanged', expect.any(Function));
    expect(api.removeEventListener).toHaveBeenCalledWith('selectionChanged', expect.any(Function));
  });

  it('destroy is idempotent', () => {
    adapter.destroy();
    adapter.destroy();
    expect(api.removeEventListener).toHaveBeenCalledTimes(3); // not 6
  });

  it('range filter translation', () => {
    const filters: GridFilterEntry[] = [
      { field: 'price', operator: 'range', value: { min: 10, max: 100 } },
    ];
    adapter.applyExternalFilter(filters);
    expect(api.setFilterModel).toHaveBeenCalledWith({
      price: { filterType: 'number', type: 'inRange', filter: 10, filterTo: 100 },
    });
  });

  it('contains filter translation', () => {
    const filters: GridFilterEntry[] = [
      { field: 'name', operator: 'contains', value: 'Ali' },
    ];
    adapter.applyExternalFilter(filters);
    expect(api.setFilterModel).toHaveBeenCalledWith({
      name: { filterType: 'text', type: 'contains', filter: 'Ali' },
    });
  });
});

/* ================================================================== */
/*  autoMapColumns                                                     */
/* ================================================================== */

describe('autoMapColumns', () => {
  const columns: GridColumnDef[] = [
    { field: 'category', headerName: 'Category', type: 'string' },
    { field: 'department', headerName: 'Department', type: 'string' },
    { field: 'revenue', headerName: 'Revenue', type: 'number' },
    { field: 'count', headerName: 'Count', type: 'number' },
    { field: 'date', headerName: 'Date', type: 'date' },
  ];

  it('maps first string to x, first number to y', () => {
    const result = autoMapColumns(columns);
    expect(result.x).toBe('category');
    expect(result.y).toBe('revenue');
  });

  it('maps second number to size', () => {
    expect(autoMapColumns(columns).size).toBe('count');
  });

  it('maps second string to color', () => {
    expect(autoMapColumns(columns).color).toBe('department');
  });

  it('respects explicit overrides', () => {
    const result = autoMapColumns(columns, [
      { gridField: 'department', chartChannel: 'x', chartType: 'nominal' },
    ]);
    expect(result.x).toBe('department');
    expect(result.y).toBe('revenue'); // auto-filled
  });

  it('handles empty columns', () => {
    const result = autoMapColumns([]);
    expect(result).toEqual({});
  });

  it('handles only numbers', () => {
    const nums: GridColumnDef[] = [
      { field: 'a', headerName: 'A', type: 'number' },
      { field: 'b', headerName: 'B', type: 'number' },
    ];
    const result = autoMapColumns(nums);
    expect(result.y).toBe('a');
    expect(result.size).toBe('b');
    expect(result.x).toBeUndefined();
  });
});
