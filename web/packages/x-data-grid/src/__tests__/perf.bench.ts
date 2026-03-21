import { describe, bench } from 'vitest';

describe('useColumnBuilder perf', () => {
  bench('builds 50 columns', () => {
    const columns = Array.from({ length: 50 }, (_, i) => ({
      field: `field_${i}`,
      headerName: `Column ${i}`,
      sortable: true,
      filter: true,
      flex: 1,
    }));
    columns.length; // force materialization
  });
});

describe('useGridState perf', () => {
  bench('serialize/deserialize 100 columns state', () => {
    const state = {
      columnState: Array.from({ length: 100 }, (_, i) => ({
        colId: `col_${i}`,
        width: 150 + i,
        hide: i % 10 === 0,
        sort: i === 0 ? 'asc' : null,
      })),
      filterModel: { status: { type: 'set', values: ['active'] } },
      sortModel: [{ colId: 'col_0', sort: 'asc' }],
    };
    const serialized = JSON.stringify(state);
    JSON.parse(serialized);
  });
});
