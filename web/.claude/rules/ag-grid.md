# AG Grid Rules — v34.3.1 (Enterprise)

## Versions (PINNED — do NOT upgrade without explicit approval)
- ag-grid-community: 34.3.1
- ag-grid-enterprise: 34.3.1
- ag-grid-react: 34.3.1
- ag-charts-enterprise: 12.3.1

## Module System (v34 breaking change from v31)
AG Grid v34 uses **modular registration**. Every feature requires its module registered in
`packages/design-system/src/advanced/data-grid/setup.ts` — the SINGLE canonical registration point.

**NEVER** use `AllEnterpriseModule` — it bundles ~40 modules. Register individually.

```ts
// CORRECT — v34
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllCommunityModule, RowGroupingModule]);

// WRONG — v31 style (removed in v34)
import { LicenseManager } from "ag-grid-enterprise";
LicenseManager.setLicenseKey("...");
```

### Currently Registered Modules
```
AllCommunityModule, CsvExportModule, InfiniteRowModelModule,
ServerSideRowModelModule, ServerSideRowModelApiModule,
AdvancedFilterModule, SetFilterModule,
SideBarModule, ColumnsToolPanelModule, FiltersToolPanelModule,
MenuModule, ColumnMenuModule,
ExcelExportModule, ClipboardModule,
RowGroupingModule, RowGroupingPanelModule,
PivotModule, StatusBarModule, RangeSelectionModule,
FindModule, RowNumbersModule, PinnedRowModule, SparklinesModule,
MasterDetailModule, RichSelectModule, HighlightChangesModule, GridStateModule,
IntegratedChartsModule
```

## API Changes (v31 → v34)

### GridApi (REMOVED methods)
```ts
// WRONG — v31 (removed)
gridApi.setColumnDefs(colDefs);
gridApi.setRowData(data);
gridApi.setDatasource(ds);
gridApi.getFilterModel();
gridApi.setFilterModel(model);
gridApi.setSortModel(model);
gridApi.paginationSetPageSize(size);

// CORRECT — v34
gridApi.setGridOption('columnDefs', colDefs);
gridApi.setGridOption('rowData', data);
gridApi.setGridOption('serverSideDatasource', ds);
gridApi.getColumnFilterModel(colId);
gridApi.setColumnFilterModel(colId, model);
gridApi.applyColumnState({ state: [{colId, sort: 'asc'}] });
gridApi.setGridOption('paginationPageSize', size);
```

### Column API (REMOVED — merged into GridApi)
```ts
// WRONG — v31 (ColumnApi removed entirely)
columnApi.setColumnVisible('col', false);
columnApi.getColumnState();
columnApi.applyColumnState({state});

// CORRECT — v34 (all on GridApi)
gridApi.setColumnsVisible(['col'], false);
gridApi.getColumnState();
gridApi.applyColumnState({state});
```

### Quick Filter
```ts
// WRONG — v31
gridApi.setQuickFilter('text');

// CORRECT — v34
gridApi.setGridOption('quickFilterText', 'text');
```

### Row Model Types
```ts
// v34 rowModelType values:
'clientSide'   // default, all data in browser
'serverSide'   // SSRM — lazy load from server (Enterprise)
'infinite'     // legacy infinite scroll
// 'viewport' removed in v34
```

### SSRM (Server-Side Row Model)
```ts
// v34 SSRM datasource
const datasource: IServerSideDatasource = {
  getRows: (params: IServerSideGetRowsParams) => {
    // params.request contains:
    //   startRow, endRow, sortModel, filterModel,
    //   rowGroupCols, groupKeys, pivotCols, pivotMode, valueCols

    // SUCCESS — v34 (modern)
    params.success({ rowData: items, rowCount: total });

    // SUCCESS — v34 (legacy, still works)
    params.successCallback(items, total);

    // FAIL
    params.fail();
  }
};

// Attach datasource — v34
gridApi.setGridOption('serverSideDatasource', datasource);

// WRONG — v31
gridApi.setServerSideDatasource(datasource);
```

### SSRM Grouping
```ts
// Server-side grouping requires:
// 1. rowGroupPanelShow: 'always' (or 'onlyWhenGrouping')
// 2. Columns with enableRowGroup: true
// 3. Backend handling request.rowGroupCols + request.groupKeys

// Group level request (rowGroupCols=['role'], groupKeys=[]):
//   → server returns distinct role values with counts
// Leaf level request (rowGroupCols=['role'], groupKeys=['ADMIN']):
//   → server returns rows WHERE role='ADMIN'

// DO NOT use isServerSideGroup/getServerSideGroupKey for Row Grouping.
// Those are for Tree Data mode only.
```

### SSRM Aggregation
```ts
// Server must return aggregate values in group-level responses.
// AG Grid does NOT compute aggregation client-side in SSRM.
// The response for group rows should include aggData or column values.
```

### enableAdvancedFilter vs Context Menu
```ts
// CONFLICT: enableAdvancedFilter DISABLES the right-click context menu.
// This is an AG Grid limitation (v34.3.1).
// Use floating filters + set filters instead.
// Our GridShell has enableAdvancedFilter DISABLED for this reason.
```

## React Integration (v34)
```tsx
// CORRECT — v34 with ag-grid-react
import { AgGridReact } from 'ag-grid-react';

<AgGridReact<RowData>
  rowData={data}
  columnDefs={colDefs}
  defaultColDef={defaultColDef}
  rowModelType="clientSide"
  onGridReady={(e) => { /* e.api is GridApi */ }}
  // NO columnApi prop — removed in v34
/>
```

## Default Column Definition (our standard)
```ts
const DEFAULT_COL_DEF: ColDef = {
  sortable: true,
  filter: "agMultiColumnFilter",
  floatingFilter: true,
  resizable: true,
  enableRowGroup: true,
  enablePivot: true,
  enableValue: true,
  minWidth: 120,
  flex: 1,
  menuTabs: ["generalMenuTab", "filterMenuTab", "columnsMenuTab"],
};
```

## Theme (v34)
```ts
// v34 themes are CSS-based, not JS objects
// Our themes: 'ag-theme-quartz', 'ag-theme-alpine', 'ag-theme-balham', 'ag-theme-material'
// Applied as className on the grid container div
// Custom theme overrides via chart-theme-bridge.ts
```

## Export
```ts
// Excel export — v34
gridApi.exportDataAsExcel({
  fileName: 'export.xlsx',
  sheetName: 'Sheet1',
  processCellCallback: (params) => params.value,
});

// CSV export — v34
gridApi.exportDataAsCsv({
  fileName: 'export.csv',
  columnSeparator: ';',
});
```

## License
License key is resolved from `window.__env__.VITE_AG_GRID_LICENSE_KEY` or `process.env.VITE_AG_GRID_LICENSE_KEY`.
Setup in `packages/design-system/src/lib/ag-grid-license.ts`.

## File Locations
- Module setup: `packages/design-system/src/advanced/data-grid/setup.ts`
- GridShell: `packages/design-system/src/advanced/data-grid/GridShell.tsx`
- EntityGridTemplate: `packages/design-system/src/advanced/data-grid/EntityGridTemplate.tsx`
- GridToolbar: `packages/design-system/src/advanced/data-grid/GridToolbar.tsx`
- VariantIntegration: `packages/design-system/src/advanced/data-grid/VariantIntegration.tsx`
- Query builder: `packages/design-system/src/advanced/data-grid/buildEntityGridQueryParams.ts`
- Chart theme bridge: `packages/design-system/src/advanced/data-grid/chart-theme-bridge.ts`
- License: `packages/design-system/src/lib/ag-grid-license.ts`
