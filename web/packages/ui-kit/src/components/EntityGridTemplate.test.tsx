import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { EntityGridTemplate } from './entity-grid/EntityGridTemplate';

const mockSetGridOption = jest.fn();
const mockGetGridOption = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockSetServerDatasource = jest.fn();
const mockAgGridReactProps = jest.fn();
const mockCreateServerSideDatasource = jest.fn();

jest.mock('ag-grid-react', () => {
  const React = require('react');
  return {
    AgGridReact: React.forwardRef((props: Record<string, unknown>, _ref: unknown) => {
      const readyFiredRef = React.useRef(false);
      mockAgGridReactProps(props);
      React.useEffect(() => {
        if (readyFiredRef.current) {
          return;
        }
        readyFiredRef.current = true;
        const api = {
          setGridOption: mockSetGridOption,
          getGridOption: mockGetGridOption,
          refreshServerSideStore: jest.fn(),
          refreshClientSideRowModel: jest.fn(),
          getColumnState: jest.fn(() => []),
          applyColumnState: jest.fn(() => true),
          setFilterModel: jest.fn(),
          getFilterModel: jest.fn(() => null),
          setAdvancedFilterModel: jest.fn(),
          getAdvancedFilterModel: jest.fn(() => null),
          setSortModel: jest.fn(),
          getSortModel: jest.fn(() => []),
          setPivotMode: jest.fn(),
          isPivotMode: jest.fn(() => false),
          onFilterChanged: jest.fn(),
          serverSideExcelExport: jest.fn(),
          exportDataAsExcel: jest.fn(),
          exportDataAsCsv: jest.fn(),
          addEventListener: mockAddEventListener,
          removeEventListener: mockRemoveEventListener,
        };
        props.onGridReady?.({ api, columnApi: {} });
      }, []);
      return React.createElement('div', { 'data-testid': 'mock-entity-grid' });
    }),
  };
});

jest.mock('../lib/grid-variants', () => ({
  useGridVariants: () => ({
    variants: [],
    isLoading: false,
    isFetching: false,
    error: null,
    refetch: jest.fn(),
    createVariant: jest.fn(),
    updateVariant: jest.fn(),
    deleteVariant: jest.fn(),
    cloneVariant: jest.fn(),
    updateVariantPreference: jest.fn(),
    createStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
    cloneStatus: 'idle',
    preferenceStatus: 'idle',
  }),
  compareGridVariants: jest.fn(() => 0),
  toggleVariantDefault: jest.fn(),
}));

jest.mock('../runtime/theme-controller', () => ({
  getThemeAxes: jest.fn(() => ({
    appearance: 'light',
    density: 'comfortable',
    radius: 'rounded',
    elevation: 'raised',
    motion: 'standard',
    tableSurfaceTone: 'normal',
    surfaceTone: 'soft-1',
    accent: 'light',
    overlayIntensity: 10,
    overlayOpacity: 10,
  })),
  subscribeThemeAxes: jest.fn(() => () => undefined),
}));

jest.mock('ag-grid-community', () => ({
  themeQuartz: { id: 'quartz' },
  themeBalham: { id: 'balham' },
  themeAlpine: { id: 'alpine' },
  themeMaterial: { id: 'material' },
}));

jest.mock('ag-grid-enterprise', () => ({
  ServerSideRowModelModule: { moduleName: 'ServerSideRowModelModule' },
  ServerSideRowModelApiModule: { moduleName: 'ServerSideRowModelApiModule' },
}));

describe('EntityGridTemplate', () => {
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    mockSetGridOption.mockReset();
    mockGetGridOption.mockReset();
    mockGetGridOption.mockImplementation((key: string) => {
      if (key === 'rowModelType') {
        return 'clientSide';
      }
      return undefined;
    });
    mockAddEventListener.mockReset();
    mockRemoveEventListener.mockReset();
    mockSetServerDatasource.mockReset();
    mockAgGridReactProps.mockReset();
    mockCreateServerSideDatasource.mockReset();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleDebugSpy.mockRestore();
  });

  test('client mode toolbar ve pagination yuzeyini gosterir', async () => {
    const onEffectiveModeChange = jest.fn();

    render(
      <EntityGridTemplate
        gridId="access-roles"
        gridSchemaVersion={1}
        dataSourceMode="client"
        rowData={[
          { name: 'Admin', status: 'Aktif' },
          { name: 'Reviewer', status: 'Taslak' },
        ]}
        total={2}
        page={1}
        pageSize={25}
        columnDefs={[
          { field: 'name', headerName: 'Rol' },
          { field: 'status', headerName: 'Durum' },
        ]}
        onEffectiveModeChange={onEffectiveModeChange}
      />,
    );

    expect(await screen.findByTestId('mock-entity-grid')).toBeInTheDocument();
    expect(screen.getByText('Tema')).toBeInTheDocument();
    expect(screen.getByText('Filtre')).toBeInTheDocument();
    expect(screen.getByText('Varyant')).toBeInTheDocument();
    expect(screen.getByText('Sayfa boyutu:')).toBeInTheDocument();
    expect(screen.getByTestId('report-variant-select')).toBeInTheDocument();

    await waitFor(() => expect(onEffectiveModeChange).toHaveBeenCalledWith('client'));
  });

  test('server mode datasource baglar', async () => {
    mockGetGridOption.mockImplementation((key: string) => {
      if (key === 'rowModelType') {
        return 'serverSide';
      }
      return undefined;
    });

    const datasource = { getRows: jest.fn() };
    mockCreateServerSideDatasource.mockReturnValue(datasource);
    const onEffectiveModeChange = jest.fn();

    render(
      <EntityGridTemplate
        gridId="audit-events"
        gridSchemaVersion={2}
        dataSourceMode="server"
        total={120}
        page={1}
        pageSize={25}
        columnDefs={[
          { field: 'eventType', headerName: 'Event' },
          { field: 'owner', headerName: 'Owner' },
        ]}
        createServerSideDatasource={mockCreateServerSideDatasource}
        onEffectiveModeChange={onEffectiveModeChange}
      />,
    );

    await waitFor(() => expect(mockCreateServerSideDatasource).toHaveBeenCalled());
    expect(mockSetGridOption).toHaveBeenCalledWith('serverSideDatasource', datasource);
    expect(onEffectiveModeChange).toHaveBeenCalledWith('server');
  });
});
