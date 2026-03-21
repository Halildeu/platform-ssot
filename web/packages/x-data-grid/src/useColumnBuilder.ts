import type { ColDef, ValueFormatterParams } from 'ag-grid-community';

type ColumnType = 'text' | 'number' | 'date' | 'boolean' | 'actions';

interface ColumnBuilderOptions<TRow> {
  field: keyof TRow & string;
  headerName: string;
  type?: ColumnType;
  width?: number;
  minWidth?: number;
  flex?: number;
  pinned?: 'left' | 'right';
  sortable?: boolean;
  filter?: boolean;
  hide?: boolean;
  editable?: boolean;
  cellRenderer?: ColDef<TRow>['cellRenderer'];
  valueFormatter?: (params: ValueFormatterParams<TRow>) => string;
}

export function useColumnBuilder<TRow>() {
  function col(options: ColumnBuilderOptions<TRow>): ColDef<TRow> {
    const { type = 'text', ...rest } = options;

    const base: ColDef<TRow> = {
      ...rest,
      sortable: rest.sortable ?? true,
      filter: rest.filter ?? true,
    };

    switch (type) {
      case 'number':
        return { ...base, filter: 'agNumberColumnFilter', type: 'numericColumn' };
      case 'date':
        return { ...base, filter: 'agDateColumnFilter' };
      case 'boolean':
        return { ...base, filter: 'agSetColumnFilter', width: rest.width ?? 100 };
      case 'actions':
        return { ...base, sortable: false, filter: false, pinned: rest.pinned ?? 'right', width: rest.width ?? 80, suppressMenu: true };
      default:
        return base;
    }
  }

  function cols(definitions: ColumnBuilderOptions<TRow>[]): ColDef<TRow>[] {
    return definitions.map(col);
  }

  return { col, cols };
}
