import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGridExport } from '../useGridExport';

function createMockGridApi() {
  return {
    exportDataAsExcel: vi.fn(),
    exportDataAsCsv: vi.fn(),
  } as any;
}

describe('useGridExport', () => {
  it('exportExcel calls gridApi.exportDataAsExcel', () => {
    const mockApi = createMockGridApi();
    const { result } = renderHook(() => useGridExport(mockApi));

    act(() => {
      result.current.exportExcel({ fileName: 'test-file' });
    });

    expect(mockApi.exportDataAsExcel).toHaveBeenCalledWith(
      expect.objectContaining({ fileName: 'test-file' }),
    );
  });

  it('exportCsv calls gridApi.exportDataAsCsv', () => {
    const mockApi = createMockGridApi();
    const { result } = renderHook(() => useGridExport(mockApi));

    act(() => {
      result.current.exportCsv({ fileName: 'test-csv' });
    });

    expect(mockApi.exportDataAsCsv).toHaveBeenCalledWith(
      expect.objectContaining({ fileName: 'test-csv' }),
    );
  });

  it('handles null gridApi gracefully for exportExcel', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { result } = renderHook(() => useGridExport(null));

    act(() => {
      result.current.exportExcel();
    });

    expect(warnSpy).toHaveBeenCalledWith(
      '[X-Data-Grid] useGridExport: gridApi is not available',
    );
    warnSpy.mockRestore();
  });

  it('handles null gridApi gracefully for exportCsv', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { result } = renderHook(() => useGridExport(null));

    act(() => {
      result.current.exportCsv();
    });

    expect(warnSpy).toHaveBeenCalledWith(
      '[X-Data-Grid] useGridExport: gridApi is not available',
    );
    warnSpy.mockRestore();
  });

  it('exportVisibleExcel passes onlySelected: false and filteredAndSorted', () => {
    const mockApi = createMockGridApi();
    const { result } = renderHook(() => useGridExport(mockApi));

    act(() => {
      result.current.exportVisibleExcel();
    });

    expect(mockApi.exportDataAsExcel).toHaveBeenCalledWith({
      fileName: 'export-visible',
      onlySelected: false,
      exportedRows: 'filteredAndSorted',
    });
  });

  it('exportAllExcel passes allColumns: true', () => {
    const mockApi = createMockGridApi();
    const { result } = renderHook(() => useGridExport(mockApi));

    act(() => {
      result.current.exportAllExcel();
    });

    expect(mockApi.exportDataAsExcel).toHaveBeenCalledWith({
      fileName: 'export-all',
      allColumns: true,
    });
  });

  it('exportVisibleCsv passes filteredAndSorted', () => {
    const mockApi = createMockGridApi();
    const { result } = renderHook(() => useGridExport(mockApi));

    act(() => {
      result.current.exportVisibleCsv();
    });

    expect(mockApi.exportDataAsCsv).toHaveBeenCalledWith({
      fileName: 'export-visible',
      exportedRows: 'filteredAndSorted',
    });
  });

  it('exportAllCsv passes allColumns: true', () => {
    const mockApi = createMockGridApi();
    const { result } = renderHook(() => useGridExport(mockApi));

    act(() => {
      result.current.exportAllCsv();
    });

    expect(mockApi.exportDataAsCsv).toHaveBeenCalledWith({
      fileName: 'export-all',
      allColumns: true,
    });
  });

  it('uses default fileName "export" when no options provided', () => {
    const mockApi = createMockGridApi();
    const { result } = renderHook(() => useGridExport(mockApi));

    act(() => {
      result.current.exportExcel();
    });

    expect(mockApi.exportDataAsExcel).toHaveBeenCalledWith(
      expect.objectContaining({ fileName: 'export' }),
    );
  });

  it('does not throw when null gridApi and exportVisibleExcel called', () => {
    const { result } = renderHook(() => useGridExport(null));

    expect(() => {
      act(() => {
        result.current.exportVisibleExcel();
      });
    }).not.toThrow();
  });
});
