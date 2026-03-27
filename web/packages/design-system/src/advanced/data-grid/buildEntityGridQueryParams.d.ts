import type { AdvancedFilterModel as AgAdvancedFilterModel, IServerSideGetRowsRequest } from 'ag-grid-community';
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
export declare const buildEntityGridQueryParams: (options: BuildEntityGridQueryParamsOptions) => EntityGridQueryParams;
