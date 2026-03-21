import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import type { AccessRole } from '../../../features/access-management/model/access.types';

test('AccessGrid grid selection, row click ve pagination wiring akisini surdurur', async () => {
  const require = createRequire(import.meta.url);
  (require.extensions as Record<string, () => void>)['.css'] = () => {};
  const { default: AccessGrid } = await import('./AccessGrid.ui');
  const rows: AccessRole[] = [
    {
      id: 'role-admin',
      name: 'Admin',
      description: 'Core administrators',
      memberCount: 5,
      policies: [
        {
          moduleKey: 'erp.users',
          moduleLabel: 'Users',
          level: 'MANAGE',
          lastUpdatedAt: new Date().toISOString(),
          updatedBy: 'system',
        },
      ],
      permissions: ['perm.manage'],
      lastModifiedAt: new Date().toISOString(),
      lastModifiedBy: 'system',
    },
    {
      id: 'role-viewer',
      name: 'Viewer',
      description: 'Read only',
      memberCount: 2,
      policies: [
        {
          moduleKey: 'erp.audit',
          moduleLabel: 'Audit',
          level: 'VIEW',
          lastUpdatedAt: new Date().toISOString(),
          updatedBy: 'system',
        },
      ],
      permissions: ['perm.view'],
      lastModifiedAt: new Date().toISOString(),
      lastModifiedBy: 'system',
    },
  ];

  const selectedIds = new Set<string>();
  const setGridOptionCalls: Array<[string, unknown]> = [];
  let goToFirstPageCount = 0;
  const selectionChanges: string[][] = [];
  const clickedRows: string[] = [];

  const gridApi = {
    paginationGetCurrentPage: () => 0,
    paginationGetTotalPages: () => 1,
    paginationGetRowCount: () => rows.length,
    paginationGoToPage: () => undefined,
    paginationGoToFirstPage: () => {
      goToFirstPageCount += 1;
    },
    setGridOption: (key: string, value: unknown) => {
      setGridOptionCalls.push([key, value]);
    },
    getDisplayedRowCount: () => rows.length,
    forEachNode: (callback: (node: { data: AccessRole; isSelected: () => boolean; setSelected: (next: boolean) => void }) => void) => {
      rows.forEach((row) => {
        callback({
          data: row,
          isSelected: () => selectedIds.has(row.id),
          setSelected: (next: boolean) => {
            if (next) {
              selectedIds.add(row.id);
            } else {
              selectedIds.delete(row.id);
            }
          },
        });
      });
    },
    getSelectedNodes: () =>
      rows
        .filter((row) => selectedIds.has(row.id))
        .map((row) => ({ data: row })),
  };

  const FakeGrid = React.forwardRef<unknown, Record<string, unknown>>(function FakeGrid(props, _ref) {
    const didInitRef = React.useRef(false);

    React.useEffect(() => {
      if (didInitRef.current) {
        return;
      }
      didInitRef.current = true;
      const onGridReady = props.onGridReady as ((event: { api: typeof gridApi }) => void) | undefined;
      onGridReady?.({ api: gridApi });
    }, [props]);

    return (
      <div data-testid="access-grid-fake">
        <button
          type="button"
          data-testid="access-grid-select-role-admin"
          onClick={() => {
            selectedIds.clear();
            selectedIds.add('role-admin');
            const onSelectionChanged = props.onSelectionChanged as ((event: { api: typeof gridApi }) => void) | undefined;
            onSelectionChanged?.({ api: gridApi });
          }}
        >
          select-admin
        </button>
        <button
          type="button"
          data-testid="access-grid-click-role-viewer"
          onClick={() => {
            const onRowClicked = props.onRowClicked as ((event: { data: AccessRole }) => void) | undefined;
            onRowClicked?.({ data: rows[1] });
          }}
        >
          click-viewer
        </button>
      </div>
    );
  });

  const renderer = TestRenderer.create(
    <AccessGrid
      GridComponent={FakeGrid as never}
      rows={rows}
      columns={[
        { key: 'name', headerName: 'Name', field: 'name' },
        { key: 'moduleSummary', headerName: 'Summary', field: 'moduleSummary' },
      ]}
      onSelect={(role) => clickedRows.push(role.id)}
      selectedRoleIds={['role-admin']}
      onSelectionChange={(roleIds) => selectionChanges.push(roleIds)}
      t={(key) => key}
      formatNumber={(value) => String(value)}
      formatDate={(value) => new Date(value).toISOString()}
    />,
  );

  await act(async () => {
    await Promise.resolve();
  });

  let root = renderer.root;
  const tablePagination = root.find(
    (node) => node.props.pageSizeOptions != null && node.props.onPageSizeChange != null,
  );
  assert.equal(tablePagination.props.pageSize, 10);
  assert.equal(typeof tablePagination.props.onPageSizeChange, 'function');

  const selectAdminButton = root.findByProps({ 'data-testid': 'access-grid-select-role-admin' });
  await act(async () => {
    selectAdminButton.props.onClick();
  });

  assert.deepEqual(selectionChanges.at(-1), ['role-admin']);

  const clickViewerButton = root.findByProps({ 'data-testid': 'access-grid-click-role-viewer' });
  await act(async () => {
    clickViewerButton.props.onClick();
  });

  assert.deepEqual(clickedRows, ['role-viewer']);
});
