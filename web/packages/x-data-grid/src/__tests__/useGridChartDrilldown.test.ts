// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGridChartDrilldown } from '../composition/useGridChartDrilldown';

interface SaleRow {
  id: string;
  region: string;
  amount: number;
  product: string;
}

const sampleRows: SaleRow[] = [
  { id: '1', region: 'North', amount: 100, product: 'Widget' },
  { id: '2', region: 'South', amount: 200, product: 'Gadget' },
  { id: '3', region: 'North', amount: 150, product: 'Gadget' },
];

describe('useGridChartDrilldown', () => {
  it('starts with no selection', () => {
    const { result } = renderHook(() => useGridChartDrilldown<SaleRow>());
    expect(result.current.selectedRow).toBeNull();
    expect(result.current.chartFilter).toBeNull();
  });

  it('selects a row on click', () => {
    const { result } = renderHook(() =>
      useGridChartDrilldown<SaleRow>({ filterKeys: ['region'] }),
    );

    act(() => {
      result.current.onRowClick(sampleRows[0]);
    });

    expect(result.current.selectedRow).toEqual(sampleRows[0]);
    expect(result.current.chartFilter).toEqual({ region: 'North' });
  });

  it('toggle-deselects on clicking the same row', () => {
    const { result } = renderHook(() => useGridChartDrilldown<SaleRow>());

    act(() => result.current.onRowClick(sampleRows[0]));
    act(() => result.current.onRowClick(sampleRows[0]));

    expect(result.current.selectedRow).toBeNull();
    expect(result.current.chartFilter).toBeNull();
  });

  it('does not toggle-deselect when toggleSelect is false', () => {
    const { result } = renderHook(() =>
      useGridChartDrilldown<SaleRow>({ toggleSelect: false }),
    );

    act(() => result.current.onRowClick(sampleRows[0]));
    act(() => result.current.onRowClick(sampleRows[0]));

    expect(result.current.selectedRow).toEqual(sampleRows[0]);
  });

  it('filterData narrows data by the active filter', () => {
    const { result } = renderHook(() =>
      useGridChartDrilldown<SaleRow>({ filterKeys: ['region'] }),
    );

    act(() => result.current.onRowClick(sampleRows[0]));

    const filtered = result.current.filterData(sampleRows, 'region');
    expect(filtered).toHaveLength(2);
    expect(filtered.every((r) => r.region === 'North')).toBe(true);
  });

  it('filterData returns all data when no selection', () => {
    const { result } = renderHook(() => useGridChartDrilldown<SaleRow>());
    const filtered = result.current.filterData(sampleRows, 'region');
    expect(filtered).toHaveLength(3);
  });

  it('clearSelection resets state', () => {
    const { result } = renderHook(() => useGridChartDrilldown<SaleRow>());

    act(() => result.current.onRowClick(sampleRows[1]));
    expect(result.current.selectedRow).not.toBeNull();

    act(() => result.current.clearSelection());
    expect(result.current.selectedRow).toBeNull();
    expect(result.current.chartFilter).toBeNull();
  });

  it('supports custom transformFilter', () => {
    const { result } = renderHook(() =>
      useGridChartDrilldown<SaleRow>({
        transformFilter: (row) => ({ regionUpper: row.region.toUpperCase() }),
      }),
    );

    act(() => result.current.onRowClick(sampleRows[0]));
    expect(result.current.chartFilter).toEqual({ regionUpper: 'NORTH' });
  });
});
