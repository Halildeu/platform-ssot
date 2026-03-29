import type {
  AdvancedFilterModel as AgAdvancedFilterModel,
  IServerSideGetRowsRequest,
  SortModelItem,
  ColumnVO,
} from 'ag-grid-community';

export type EntityGridQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  sort?: string;
  advancedFilter?: string;
  rowGroupCols?: string;
  groupKeys?: string;
  multiSearch?: string;
} & Record<string, unknown>;

export type MapAdvancedFilter = (model: AgAdvancedFilterModel | null | undefined) => Record<string, unknown> | null;

export interface BuildEntityGridQueryParamsOptions {
  request: IServerSideGetRowsRequest;
  quickFilterText?: string;
  mapAdvancedFilter?: MapAdvancedFilter;
  mapFilterModel?: (model: IServerSideGetRowsRequest['filterModel']) => Partial<EntityGridQueryParams>;
  /** Per-column pipe-separated values for backend multiSearch (from gridApi.__multiSearchParams). */
  multiSearchParams?: Record<string, string>;
}

/**
 * AG Grid v34 puts the AdvancedFilterModel inside `filterModel` (not a separate property).
 * AdvancedFilterModel always has a `filterType` field:
 *  - join node: `{ filterType: 'join', type: 'AND'|'OR', conditions: [...] }`
 *  - condition node: `{ filterType: 'text'|'number'|'date'|..., colId: '...', type: '...', filter: '...' }`
 * Regular column FilterModel is a plain Record<colId, filterObj> without a top-level `filterType`.
 */
const isAdvancedFilterModel = (model: unknown): model is AgAdvancedFilterModel => {
  if (!model || typeof model !== 'object') return false;
  return 'filterType' in model;
};

const toSortParam = (sortModel: SortModelItem[] | undefined): string | undefined => {
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
  const { request, quickFilterText = '', mapAdvancedFilter, mapFilterModel, multiSearchParams } = options;
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

  const sortParam = toSortParam((request as { sortModel?: SortModelItem[] }).sortModel);
  if (sortParam) {
    params.sort = sortParam;
  }

  // Server-side grouping: rowGroupCols = columns being grouped, groupKeys = current drill-down path
  const rowGroupCols = (request as { rowGroupCols?: ColumnVO[] }).rowGroupCols;
  const groupKeys = (request as { groupKeys?: string[] }).groupKeys;
  if (Array.isArray(rowGroupCols) && rowGroupCols.length > 0) {
    params.rowGroupCols = rowGroupCols.map((c) => c.id).join(',');
  }
  if (Array.isArray(groupKeys) && groupKeys.length > 0) {
    params.groupKeys = groupKeys.join(',');
  }

  // Server-side aggregation: valueCols = columns with aggFunc
  const valueCols = (request as { valueCols?: ColumnVO[] }).valueCols;
  if (Array.isArray(valueCols) && valueCols.length > 0) {
    params.valueCols = valueCols
      .filter((c) => c.id && (c as any).aggFunc)
      .map((c) => `${c.id}:${(c as any).aggFunc}`)
      .join(',');
  }

  // Server-side pivot
  const pivotCols = (request as { pivotCols?: ColumnVO[] }).pivotCols;
  if ((request as any).pivotMode && Array.isArray(pivotCols) && pivotCols.length > 0) {
    params.pivotMode = 'true';
    params.pivotCols = pivotCols.map((c) => c.id).join(',');
  }

  // AG Grid v34: when enableAdvancedFilter is true, filterModel contains AdvancedFilterModel.
  // When disabled, filterModel contains column FilterModel. Detect and route accordingly.
  const filterModel = request.filterModel;
  if (isAdvancedFilterModel(filterModel)) {
    // Advanced Filter active — route to mapAdvancedFilter
    if (typeof mapAdvancedFilter === 'function') {
      const advanced = mapAdvancedFilter(filterModel);
      if (advanced) {
        try {
          params.advancedFilter = encodeURIComponent(JSON.stringify(advanced));
        } catch {
          // encode errors are ignored; caller may choose to log
        }
      }
    }
  } else {
    // Column filters — route to mapFilterModel
    if (typeof mapFilterModel === 'function') {
      const extras = mapFilterModel(filterModel ?? {});
      Object.assign(params, extras);
    }
  }

  // multiSearch: pipe-separated values from FilterBuilder for 3+ text conditions per column
  if (multiSearchParams && Object.keys(multiSearchParams).length > 0) {
    params.multiSearch = Object.values(multiSearchParams).join('|');
  }

  return params;
};

