export type DynamicReportFilters = {
  search: string;
};

export type DynamicReportRow = Record<string, unknown>;

export type ReportColumnMeta = {
  field: string;
  headerName: string;
  type: 'text' | 'number' | 'date';
  width: number;
  sensitive: boolean;
};

export type ReportListItem = {
  key: string;
  title: string;
  description: string;
  category: string;
};

export type ReportMetadata = {
  key: string;
  title: string;
  description: string;
  category: string;
  columns: ReportColumnMeta[];
  defaultSort: string;
  defaultSortDirection: string;
};

export type ReportCategory = {
  name: string;
  count: number;
};
