import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { AgGridServer } from '../layout/AgGridServer';

const mockSetGridOption = jest.fn();
const mockAgGridReactProps = jest.fn();

jest.mock('ag-grid-react', () => {
  const ReactModule = jest.requireActual<typeof import('react')>('react');
  return {
    AgGridReact: ReactModule.forwardRef(function MockAgGridReact(
      props: Record<string, unknown>,
      ref: unknown,
    ) {
      void ref;
      const readyFiredRef = ReactModule.useRef(false);
      mockAgGridReactProps(props);
      ReactModule.useEffect(() => {
        if (readyFiredRef.current) {
          return;
        }
        readyFiredRef.current = true;
        const api = {
          setGridOption: mockSetGridOption,
        };
        props.onGridReady?.({ api });
      }, []);
      return ReactModule.createElement('div', { 'data-testid': 'mock-ag-grid-react' });
    }),
  };
});

describe('AgGridServer', () => {
  beforeEach(() => {
    mockSetGridOption.mockReset();
    mockAgGridReactProps.mockReset();
  });

  test('server-side datasource baglar ve veri sonucunu success ile iletir', async () => {
    const getData = jest.fn().mockResolvedValue({
      rows: [{ id: 'SRC-001', name: 'Risk source' }],
      total: 12,
    });

    render(
      <AgGridServer
        height={320}
        columnDefs={[{ field: 'id', headerName: 'ID' }]}
        getData={getData}
      />,
    );

    expect(screen.getByTestId('mock-ag-grid-react')).toBeInTheDocument();

    await waitFor(() => expect(mockSetGridOption).toHaveBeenCalledWith('serverSideDatasource', expect.any(Object)));

    const datasource = mockSetGridOption.mock.calls[0][1];
    const success = jest.fn();
    const fail = jest.fn();

    await act(async () => {
      await datasource.getRows({
        request: { startRow: 0, endRow: 100, sortModel: [], filterModel: {} },
        success,
        fail,
      });
    });

    expect(getData).toHaveBeenCalledWith({
      startRow: 0,
      endRow: 100,
      sortModel: [],
      filterModel: {},
    });
    expect(success).toHaveBeenCalledWith({
      rowData: [{ id: 'SRC-001', name: 'Risk source' }],
      rowCount: 12,
    });
    expect(fail).not.toHaveBeenCalled();
    expect(mockAgGridReactProps).toHaveBeenCalled();
    expect(mockAgGridReactProps.mock.calls[0][0].gridOptions).toMatchObject({
      rowModelType: 'serverSide',
      cacheBlockSize: 100,
    });
  });

  test('pending getRows sirasinda loading overlay gorunur', async () => {
    let resolveRequest: ((value: { rows: unknown[]; total: number }) => void) | undefined;
    const getData = jest.fn(
      () =>
        new Promise<{ rows: unknown[]; total: number }>((resolve) => {
          resolveRequest = resolve;
        }),
    );

    render(
      <AgGridServer
        columnDefs={[{ field: 'name', headerName: 'Kaynak' }]}
        getData={getData}
      />,
    );

    await waitFor(() => expect(mockSetGridOption).toHaveBeenCalledWith('serverSideDatasource', expect.any(Object)));
    const datasource = mockSetGridOption.mock.calls[0][1];

    await act(async () => {
      void datasource.getRows({
        request: { startRow: 0, endRow: 50 },
        success: jest.fn(),
        fail: jest.fn(),
      });
    });

    expect(screen.getByText('Yükleniyor...')).toBeInTheDocument();

    await act(async () => {
      resolveRequest?.({ rows: [], total: 0 });
    });

    await waitFor(() => expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument());
  });

  test('getRows hatasinda fail cagirir', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const getData = jest.fn().mockRejectedValue(new Error('network down'));

    render(
      <AgGridServer
        columnDefs={[{ field: 'owner', headerName: 'Owner' }]}
        getData={getData}
      />,
    );

    await waitFor(() => expect(mockSetGridOption).toHaveBeenCalledWith('serverSideDatasource', expect.any(Object)));
    const datasource = mockSetGridOption.mock.calls[0][1];
    const fail = jest.fn();

    await act(async () => {
      await datasource.getRows({
        request: { startRow: 0, endRow: 25 },
        success: jest.fn(),
        fail,
      });
    });

    expect(fail).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
