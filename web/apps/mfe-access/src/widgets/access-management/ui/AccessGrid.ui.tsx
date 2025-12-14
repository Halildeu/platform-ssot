import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { AgGridReact as AgGridReactType } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
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
  formatDate: (value: Date | number, options?: Intl.DateTimeFormatOptions) => string;
}

const defaultColumnDef: ColDef = {
  resizable: true,
  sortable: true,
  flex: 1,
  minWidth: 150
};

const AccessGrid: React.FC<AccessGridProps> = ({
  rows,
  columns,
  onSelect,
  selectedRoleIds,
  onSelectionChange,
  t,
  formatDate,
}) => {
  const gridRef = React.useRef<AgGridReactType<AccessRole>>(null);

  const columnDefs = React.useMemo<ColDef[]>(() => {
    const selectionCol: ColDef = {
      ...defaultColumnDef,
      headerName: '',
      field: '__selection__',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 48,
      minWidth: 48,
      maxWidth: 64,
      pinned: 'left',
      suppressMenu: true,
      sortable: false,
      resizable: false,
      flex: undefined
    };

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

    return [selectionCol, ...mappedCols];
  }, [columns, formatDate, t]);

  React.useEffect(() => {
    if (!gridRef.current?.api) {
      return;
    }
    gridRef.current.api.forEachNode((node) => {
      if (!node?.data) {
        return;
      }
      const shouldSelect = selectedRoleIds.includes(node.data.id);
      if (node.isSelected() !== shouldSelect) {
        node.setSelected(shouldSelect);
      }
    });
  }, [rows, selectedRoleIds]);

  return (
    <div className="ag-theme-quartz" style={{ width: '100%', height: 520 }}>
      <AgGridReact
        ref={gridRef}
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDef={defaultColumnDef}
        rowSelection="multiple"
        rowMultiSelectWithClick={false}
        suppressRowClickSelection
        onSelectionChanged={(event) => {
          const ids = event.api
            .getSelectedNodes()
            .filter((node) => Boolean(node.data))
            .map((node) => (node.data as AccessRole).id);
          onSelectionChange(ids);
        }}
        onRowClicked={(event) => onSelect(event.data as AccessRole)}
      />
    </div>
  );
};

export default AccessGrid;
