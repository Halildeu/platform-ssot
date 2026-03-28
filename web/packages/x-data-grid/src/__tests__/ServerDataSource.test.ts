import { describe, it, expect, vi } from 'vitest';
import { ServerDataSource, type ServerDataSourceConfig } from '../ServerDataSource';

function createMockParams(requestOverrides: Record<string, unknown> = {}) {
  return {
    request: {
      startRow: 0,
      endRow: 100,
      sortModel: [],
      filterModel: {},
      ...requestOverrides,
    },
    success: vi.fn(),
    fail: vi.fn(),
  } as any;
}

describe('ServerDataSource', () => {
  it('creates a valid IServerSideDatasource with getRows method', () => {
    const config: ServerDataSourceConfig = {
      fetchRows: vi.fn().mockResolvedValue({ rows: [], totalCount: 0 }),
    };

    const ds = ServerDataSource(config);

    expect(ds).toHaveProperty('getRows');
    expect(typeof ds.getRows).toBe('function');
  });

  it('calls fetchRows with correct params', async () => {
    const fetchRows = vi.fn().mockResolvedValue({ rows: [{ id: 1 }], totalCount: 1 });
    const ds = ServerDataSource({ fetchRows });

    const params = createMockParams({
      startRow: 10,
      endRow: 50,
      sortModel: [{ colId: 'name', sort: 'asc' }],
      filterModel: { status: { type: 'equals', filter: 'active' } },
    });

    ds.getRows(params);

    // Wait for the promise to resolve
    await vi.waitFor(() => {
      expect(fetchRows).toHaveBeenCalledWith({
        startRow: 10,
        endRow: 50,
        sortModel: [{ colId: 'name', sort: 'asc' }],
        filterModel: { status: { type: 'equals', filter: 'active' } },
      });
    });
  });

  it('calls params.success with rowData and rowCount on successful fetch', async () => {
    const rows = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
    const fetchRows = vi.fn().mockResolvedValue({ rows, totalCount: 42 });
    const ds = ServerDataSource({ fetchRows });

    const params = createMockParams();
    ds.getRows(params);

    await vi.waitFor(() => {
      expect(params.success).toHaveBeenCalledWith({
        rowData: rows,
        rowCount: 42,
      });
    });
  });

  it('handles errors gracefully by calling params.fail', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchRows = vi.fn().mockRejectedValue(new Error('Network failure'));
    const ds = ServerDataSource({ fetchRows });

    const params = createMockParams();
    ds.getRows(params);

    await vi.waitFor(() => {
      expect(params.fail).toHaveBeenCalledTimes(1);
    });

    expect(errorSpy).toHaveBeenCalledWith(
      '[X-Data-Grid] ServerDataSource fetch error:',
      expect.any(Error),
    );
    errorSpy.mockRestore();
  });

  it('passes cache config through the config object', () => {
    const config: ServerDataSourceConfig = {
      fetchRows: vi.fn().mockResolvedValue({ rows: [], totalCount: 0 }),
      cacheBlockSize: 50,
    };

    // cacheBlockSize is a config property available for consumers to read
    expect(config.cacheBlockSize).toBe(50);

    // The datasource itself is still created successfully
    const ds = ServerDataSource(config);
    expect(ds).toHaveProperty('getRows');
  });

  it('uses defaults when request fields are missing', async () => {
    const fetchRows = vi.fn().mockResolvedValue({ rows: [], totalCount: 0 });
    const ds = ServerDataSource({ fetchRows });

    const params = {
      request: {},
      success: vi.fn(),
      fail: vi.fn(),
    } as any;

    ds.getRows(params);

    await vi.waitFor(() => {
      expect(fetchRows).toHaveBeenCalledWith({
        startRow: 0,
        endRow: 100,
        sortModel: [],
        filterModel: {},
      });
    });
  });

  it('does not call success when fetch rejects', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchRows = vi.fn().mockRejectedValue(new Error('fail'));
    const ds = ServerDataSource({ fetchRows });

    const params = createMockParams();
    ds.getRows(params);

    await vi.waitFor(() => {
      expect(params.fail).toHaveBeenCalled();
    });

    expect(params.success).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});
