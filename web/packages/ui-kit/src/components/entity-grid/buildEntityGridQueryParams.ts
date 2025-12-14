import type {
  AdvancedFilterModel as AgAdvancedFilterModel,
  IServerSideGetRowsRequest,
  ISortModelItem,
} from 'ag-grid-community';

export type EntityGridQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  sort?: string;
  advancedFilter?: string;
} & Record<string, unknown>;

export type MapAdvancedFilter = (model: AgAdvancedFilterModel | null | undefined) => Record<string, unknown> | null;

export interface BuildEntityGridQueryParamsOptions {
  request: IServerSideGetRowsRequest;
  quickFilterText?: string;
  mapAdvancedFilter?: MapAdvancedFilter;
  mapFilterModel?: (model: IServerSideGetRowsRequest['filterModel']) => Partial<EntityGridQueryParams>;
}

const toSortParam = (sortModel: ISortModelItem[] | undefined): string | undefined => {
  if (!Array.isArray(sortModel) || sortModel.length === 0) {
    return undefined;
  }
  const parts = sortModel
    .filter((item) => item && item.colId && item.sort)
    .map((item) => `${item.colId},${item.sort}`);
  return parts.length > 0 ? parts.join(';') : undefined;
};

export const buildEntityGridQueryParams = (
  options: BuildEntityGridQueryParamsOptions,
): EntityGridQueryParams => {
  const { request, quickFilterText = '', mapAdvancedFilter, mapFilterModel } = options;
  const blockSize = Math.max(1, (request.endRow ?? 0) - (request.startRow ?? 0));
  const startRow = request.startRow ?? 0;
  const page = Math.floor(startRow / blockSize) + 1;
  const pageSize = blockSize;

  const params: EntityGridQueryParams = {
    page,
    pageSize,
  };

  const normalizedQuick = typeof quickFilterText === 'string' ? quickFilterText.trim() : '';
  if (normalizedQuick.length > 0) {
    params.search = normalizedQuick;
  }

  const sortParam = toSortParam((request as { sortModel?: ISortModelItem[] }).sortModel);
  if (sortParam) {
    params.sort = sortParam;
  }

  if (typeof mapFilterModel === 'function') {
    const extras = mapFilterModel(request.filterModel ?? {});
    Object.assign(params, extras);
  }

  if (typeof mapAdvancedFilter === 'function') {
    const model = (request as { advancedFilterModel?: AgAdvancedFilterModel | null }).advancedFilterModel ?? null;
    const advanced = mapAdvancedFilter(model);
    if (advanced) {
      try {
        params.advancedFilter = encodeURIComponent(JSON.stringify(advanced));
      } catch {
        // encode errors are ignored; caller may choose to log
      }
    }
  }

  return params;
};

