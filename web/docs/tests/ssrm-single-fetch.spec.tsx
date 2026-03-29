// Sample Vitest + RTL test to verify AG Grid SSRM triggers getRows exactly once
// Notes
// - This is a self-contained example meant to be copied into your frontend repo.
// - Ensure dev tests do NOT enable React.StrictMode around the tested grid, otherwise
//   React 18 will double-invoke effects in dev which can cause a duplicate fetch.
// - Requires: vitest, @testing-library/react, react, react-dom, ag-grid-react, ag-grid-community, ag-grid-enterprise.

import React, { useMemo } from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { AgGridReact } from 'ag-grid-react';
import type { ServerSideDatasource, IServerSideGetRowsParams, GridOptions } from 'ag-grid-community';

// Important: register enterprise features including SSRM
import 'ag-grid-enterprise';

// Re-implement with a module-scoped mock for a clean assertion.
describe('SSRM single fetch (module-scoped mock)', () => {
  const getRowsMock: Mock<(params: IServerSideGetRowsParams) => void> = vi.fn((params) => {
    setTimeout(() => {
      params.success({ rowData: [{ id: 1, name: 'John' }], rowCount: 1 });
    }, 0);
  });

  function GridWithMock() {
    const gridOptions = useMemo<GridOptions>(() => ({
      rowModelType: 'serverSide',
      cacheBlockSize: 50,
      blockLoadDebounceMillis: 25,
      columnDefs: [
        { field: 'id' },
        { field: 'name' },
      ],
      onGridReady: (e) => {
        const ds: ServerSideDatasource = { getRows: getRowsMock };
        e.api.setGridOption('serverSideDatasource', ds);
      },
    }), []);

    return (
      <div data-testid="grid" style={{ width: 600, height: 300 }} className="ag-theme-quartz">
        <AgGridReact {...gridOptions} />
      </div>
    );
  }

  beforeEach(() => getRowsMock.mockClear());

  it('invokes getRows once for initial range', async () => {
    render(<GridWithMock />);
    // Wait until grid requests data and renders it
    await waitFor(() => expect(getRowsMock).toHaveBeenCalled());

    // Assert only one request was made
    expect(getRowsMock).toHaveBeenCalledTimes(1);

    // Optionally assert range is 0..50
    const firstCall = getRowsMock.mock.calls[0][0];
    expect(firstCall.request.startRow).toBe(0);
    expect(firstCall.request.endRow).toBeGreaterThan(0);
  });
});
