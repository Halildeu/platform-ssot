import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { AgGridReact as AgGridReactType } from 'ag-grid-react';
import {
  TablePagination,
  useAgGridTablePagination,
  type AgGridTablePaginationApi,
} from '@mfe/design-system/advanced/data-grid/TablePagination';
import type { ColDef, SelectionColumnDef } from 'ag-grid-community';
import type { AccessRole, AccessLevel } from '../../../features/access-management/model/access.types';

export interface AccessGridColumn {
  key: string;
  headerName: string;
  field: string;
  width?: number;
  flex?: number;
}

interface AccessGridProps {
  rows: AccessRole[];
  columns: AccessGridColumn[];
  onSelect: (role: AccessRole) => void;
  selectedRoleIds: string[];
  onSelectionChange: (roleIds: string[]) => void;
  t: (key: string, params?: Record<string, unknown>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date | number, options?: Intl.DateTimeFormatOptions) => string;
  GridComponent?: typeof AgGridReact;
}

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const defaultColumnDef: ColDef = {
  resizable: true,
  sortable: true,
  flex: 1,
  minWidth: 150
};

const selectionColumnDef: SelectionColumnDef = {
  width: 48,
  minWidth: 48,
  maxWidth: 64,
  pinned: 'left',
  sortable: false,
  resizable: false,
  suppressHeaderMenuButton: true,
  suppressHeaderContextMenu: true,
};

const AccessGrid: React.FC<AccessGridProps> = ({
  rows,
  columns,
  onSelect,
  selectedRoleIds,
  onSelectionChange,
  t,
  formatNumber,
  formatDate,
  GridComponent,
}) => {
  const gridRef = React.useRef<AgGridReactType<AccessRole>>(null);
  const ResolvedGridComponent = GridComponent ?? AgGridReact;
  const {
    gridApi,
    pageSize,
    paginationSnapshot,
    registerGridApi,
    refreshPaginationSnapshot,
    handlePageChange,
    handlePageSizeChange,
  } = useAgGridTablePagination<AccessRole>({
    initialPageSize: DEFAULT_PAGE_SIZE,
    totalItems: rows.length,
  });

  const columnDefs = React.useMemo<ColDef[]>(() => {
    const mappedCols = columns.map((column) => ({
      ...defaultColumnDef,
      headerName: column.headerName,
      field: column.field,
      width: column.width,
      flex: column.flex ?? defaultColumnDef.flex,
      valueGetter: (params) => {
        if (column.field === 'moduleSummary') {
          return params.data.policies
            .map((policy) => {
              const level = String(policy.level).toLowerCase() as Lowercase<AccessLevel>;
              const levelLabel = t(`access.filter.level.${level}`) ?? t('access.filter.level.none');
              return `${policy.moduleLabel}: ${levelLabel}`;
            })
            .join(', ');
        }
        if (column.field === 'displayLastModified') {
          const { lastModifiedAt, lastModifiedBy } = params.data as AccessRole;
          const timestamp = new Date(lastModifiedAt);
          return `${lastModifiedBy} · ${formatDate(timestamp, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}`;
        }
        const rawValue = params.data?.[column.field as keyof AccessRole];
        return typeof rawValue === 'undefined' ? '' : rawValue;
      }
    }));

    return mappedCols;
  }, [columns, formatDate, t]);

  React.useEffect(() => {
    const api =
      gridApi
      ?? (gridRef.current?.api as AgGridTablePaginationApi<AccessRole> | null);
    if (!api) {
      return;
    }
    api.forEachNode((node) => {
      if (!node?.data) {
        return;
      }
      const shouldSelect = selectedRoleIds.includes(node.data.id);
      if (node.isSelected() !== shouldSelect) {
        node.setSelected(shouldSelect);
      }
    });
  }, [gridApi, rows, selectedRoleIds]);

  const paginationLocaleText = React.useMemo(
    () => ({
      rowsPerPageLabel: t('access.grid.pagination.rowsPerPage'),
      rangeLabel: (start: number, end: number, totalItems: number) =>
        `${t('access.grid.pagination.range', {
          start: formatNumber(start),
          end: formatNumber(end),
          total: formatNumber(totalItems),
        })} · ${t('access.grid.pagination.pageIndicator', {
          currentPage: formatNumber(paginationSnapshot.page),
          pageCount: formatNumber(paginationSnapshot.totalPages),
        })}`,
    }),
    [formatNumber, paginationSnapshot.page, paginationSnapshot.totalPages, t],
  );

  return (
    <div data-testid="access-grid" className="flex flex-col rounded-[24px] border border-border-subtle bg-surface-default shadow-xs">
      <div className="ag-theme-quartz" style={{ width: '100%', height: 520 }}>
        <ResolvedGridComponent
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColumnDef}
          selectionColumnDef={selectionColumnDef}
          pagination
          paginationPageSize={pageSize}
          suppressPaginationPanel
          rowSelection={{
            mode: 'multiRow',
            enableClickSelection: false,
            enableSelectionWithoutKeys: false,
            checkboxes: true,
            headerCheckbox: true,
          }}
          onGridReady={(event) => {
            registerGridApi(event.api as AgGridTablePaginationApi<AccessRole>);
          }}
          onPaginationChanged={() => refreshPaginationSnapshot()}
          onModelUpdated={() => refreshPaginationSnapshot()}
          onSelectionChanged={(event) => {
            const ids = event.api
              .getSelectedNodes()
              .filter((node) => Boolean(node.data))
              .map((node) => (node.data as AccessRole).id);
            onSelectionChange(ids);
          }}
          onRowClicked={(event) => {
            const role = event.data as AccessRole;
            onSelect(role);
            const node = event.node;
            if (node) {
              node.setSelected(!node.isSelected());
            }
          }}
        />
      </div>
      <div className="border-t border-border-subtle p-4">
        <TablePagination
          totalItems={paginationSnapshot.totalItems}
          page={paginationSnapshot.page}
          pageSize={paginationSnapshot.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          showFirstLastButtons
          access={gridApi ? 'full' : 'disabled'}
          className="w-full justify-between rounded-none border-0 bg-transparent p-0 shadow-none"
          localeText={paginationLocaleText}
        />
      </div>
    </div>
  );
};

export default AccessGrid;
