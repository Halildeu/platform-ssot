import type { IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';

export interface ServerDataSourceConfig<TRow = unknown, TFilter = Record<string, unknown>> {
  fetchRows: (params: {
    startRow: number;
    endRow: number;
    sortModel: Array<{ colId: string; sort: 'asc' | 'desc' }>;
    filterModel: TFilter;
  }) => Promise<{ rows: TRow[]; totalCount: number }>;
  cacheBlockSize?: number;
}

export function ServerDataSource<TRow = unknown, TFilter = Record<string, unknown>>(
  config: ServerDataSourceConfig<TRow, TFilter>,
): IServerSideDatasource {
  return {
    getRows(params: IServerSideGetRowsParams) {
      const { startRow = 0, endRow = 100, sortModel = [], filterModel = {} } = params.request;

      config
        .fetchRows({
          startRow,
          endRow,
          sortModel: sortModel as Array<{ colId: string; sort: 'asc' | 'desc' }>,
          filterModel: filterModel as TFilter,
        })
        .then(({ rows, totalCount }) => {
          params.success({ rowData: rows, rowCount: totalCount });
        })
        .catch((error) => {
          console.error('[X-Data-Grid] ServerDataSource fetch error:', error);
          params.fail();
        });
    },
  };
}
