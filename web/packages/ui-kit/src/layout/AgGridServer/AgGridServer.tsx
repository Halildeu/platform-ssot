import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { AgGridReact } from 'ag-grid-react';
import { AgGridReact as AgGridReactComponent } from 'ag-grid-react';
import type {
  ColDef,
  ColGroupDef,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  GridOptions,
  IServerSideGetRowsRequest,
} from 'ag-grid-community';

export type ServerSideDataRequest = IServerSideGetRowsRequest;

export type ServerSideDataResult = {
  rows: unknown[];
  total?: number;
};

export type FetchServerSideData = (request: ServerSideDataRequest) => Promise<ServerSideDataResult>;

export interface AgGridServerProps {
  columnDefs: (ColDef | ColGroupDef)[];
  defaultColDef?: ColDef;
  className?: string;
  height?: number | string;
  getData: FetchServerSideData;
  gridOptions?: GridOptions;
}

export const AgGridServer: React.FC<AgGridServerProps> = ({
  columnDefs,
  defaultColDef,
  className,
  height = 600,
  getData,
  gridOptions,
}) => {
  const gridRef = useRef<AgGridReact<unknown>>(null);
  const [loading, setLoading] = useState(false);

  const datasource = useMemo<IServerSideDatasource>(() => ({
    getRows: async (params: IServerSideGetRowsParams) => {
      setLoading(true);
      try {
        const { rows, total } = await getData(params.request);
        params.success({ rowData: rows, rowCount: total ?? rows.length });
      } catch (error) {
        params.fail?.();
        if (process.env.NODE_ENV !== 'production') {
          console.error('[AgGridServer] getRows failed', error);
        }
      } finally {
        setLoading(false);
      }
    },
  }), [getData]);

  const handleGridReady = useCallback((event: GridReadyEvent) => {
    event.api.setServerSideDatasource(datasource);
  }, [datasource]);

  const combinedOptions: GridOptions = useMemo(() => ({
    suppressAggFuncInHeader: true,
    rowModelType: 'serverSide',
    animateRows: false,
    cacheBlockSize: 100,
    ...gridOptions,
  }), [gridOptions]);

  return (
    <div
      className={['mfe-ag-grid-server ag-theme-quartz', className].filter(Boolean).join(' ')}
      style={{ height, width: '100%' }}
    >
      {loading && <div className="mfe-ag-grid-server__overlay">Yükleniyor...</div>}
      <AgGridReactComponent
        ref={gridRef}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={handleGridReady}
        gridOptions={combinedOptions}
        suppressInfiniteScroll
      />
    </div>
  );
};

export default AgGridServer;
