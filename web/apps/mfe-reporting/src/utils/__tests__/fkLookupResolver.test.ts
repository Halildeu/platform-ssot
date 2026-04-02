import { describe, expect, it } from 'vitest';
import {
  findDisplayColumn,
  buildFkLookupConfigs,
  collectLookupIds,
} from '../fkLookupResolver';
import type { SchemaTableInfo } from '@mfe/shared-types';
import type { ColumnMeta } from '@mfe/design-system/advanced/data-grid';

const companyTable: SchemaTableInfo = {
  name: 'COMPANY',
  schema: 'dbo',
  columns: [
    { name: 'ID', dataType: 'int', maxLength: 4, nullable: false, identity: true, pk: true, ordinal: 1 },
    { name: 'NAME', dataType: 'nvarchar(255)', maxLength: 510, nullable: false, identity: false, pk: false, ordinal: 2 },
    { name: 'TAX_NO', dataType: 'varchar(20)', maxLength: 20, nullable: true, identity: false, pk: false, ordinal: 3 },
  ],
  rowCount: 100,
  columnCount: 3,
};

const employeeTable: SchemaTableInfo = {
  name: 'EMPLOYEE',
  schema: 'dbo',
  columns: [
    { name: 'ID', dataType: 'int', maxLength: 4, nullable: false, identity: true, pk: true, ordinal: 1 },
    { name: 'AD', dataType: 'nvarchar(100)', maxLength: 200, nullable: false, identity: false, pk: false, ordinal: 2 },
    { name: 'DEPT_ID', dataType: 'int', maxLength: 4, nullable: true, identity: false, pk: false, ordinal: 3 },
  ],
  rowCount: 500,
  columnCount: 3,
};

const noPkTable: SchemaTableInfo = {
  name: 'LOG_TABLE',
  schema: 'dbo',
  columns: [
    { name: 'LOG_ID', dataType: 'int', maxLength: 4, nullable: false, identity: false, pk: false, ordinal: 1 },
    { name: 'MESSAGE', dataType: 'nvarchar(max)', maxLength: -1, nullable: true, identity: false, pk: false, ordinal: 2 },
  ],
  rowCount: 10000,
  columnCount: 2,
};

describe('findDisplayColumn', () => {
  it('NAME sütunu bulur', () => {
    expect(findDisplayColumn(companyTable)).toBe('NAME');
  });

  it('AD sütunu bulur (Türkçe)', () => {
    expect(findDisplayColumn(employeeTable)).toBe('AD');
  });

  it('heuristic eşleşmezse ilk text sütun', () => {
    expect(findDisplayColumn(noPkTable)).toBe('MESSAGE');
  });

  it('sadece PK int sütunu olan tablo → undefined', () => {
    const onlyPk: SchemaTableInfo = {
      name: 'CODES', schema: 'dbo',
      columns: [{ name: 'ID', dataType: 'int', maxLength: 4, nullable: false, identity: true, pk: true, ordinal: 1 }],
      rowCount: 10, columnCount: 1,
    };
    expect(findDisplayColumn(onlyPk)).toBeUndefined();
  });
});

describe('buildFkLookupConfigs', () => {
  const allTables = { COMPANY: companyTable, EMPLOYEE: employeeTable };

  it('FK sütunları için lookup config üretir', () => {
    const columns: ColumnMeta[] = [
      {
        field: 'COMP_ID', headerNameKey: 'Şirket', columnType: 'text',
        schemaLineage: {
          sourceTable: 'INVOICE', sourceColumn: 'COMP_ID', sqlDataType: 'int',
          isNullable: false, isPrimaryKey: false, isForeignKey: true,
          referencedTable: 'COMPANY', referencedColumn: 'ID',
        },
      },
    ];
    const configs = buildFkLookupConfigs(columns, allTables);
    expect(configs).toHaveLength(1);
    expect(configs[0]).toEqual({
      field: 'COMP_ID',
      lookupTable: 'COMPANY',
      lookupPkColumn: 'ID',
      displayColumn: 'NAME',
    });
  });

  it('FK olmayan sütunları atlar', () => {
    const columns: ColumnMeta[] = [
      { field: 'AMOUNT', headerNameKey: 'Tutar', columnType: 'number' },
    ];
    expect(buildFkLookupConfigs(columns, allTables)).toHaveLength(0);
  });

  it('referenced table snapshot\'ta yoksa atlar', () => {
    const columns: ColumnMeta[] = [
      {
        field: 'DEPT_ID', headerNameKey: 'Departman', columnType: 'text',
        schemaLineage: {
          sourceTable: 'EMPLOYEE', sourceColumn: 'DEPT_ID', sqlDataType: 'int',
          isNullable: true, isPrimaryKey: false, isForeignKey: true,
          referencedTable: 'DEPARTMENT', // not in allTables
        },
      },
    ];
    expect(buildFkLookupConfigs(columns, allTables)).toHaveLength(0);
  });
});

describe('collectLookupIds', () => {
  it('satırlardan unique ID toplar', () => {
    const configs = [
      { field: 'COMP_ID', lookupTable: 'COMPANY', lookupPkColumn: 'ID', displayColumn: 'NAME' },
    ];
    const rows = [
      { COMP_ID: 1, AMOUNT: 100 },
      { COMP_ID: 2, AMOUNT: 200 },
      { COMP_ID: 1, AMOUNT: 300 }, // duplicate
      { COMP_ID: null, AMOUNT: 400 }, // null
    ];
    const result = collectLookupIds(configs, rows);
    const companyIds = result.get('COMPANY');
    expect(companyIds?.size).toBe(2);
    expect(companyIds?.has('1')).toBe(true);
    expect(companyIds?.has('2')).toBe(true);
  });

  it('boş rows → boş set', () => {
    const configs = [
      { field: 'COMP_ID', lookupTable: 'COMPANY', lookupPkColumn: 'ID', displayColumn: 'NAME' },
    ];
    const result = collectLookupIds(configs, []);
    expect(result.get('COMPANY')?.size).toBe(0);
  });
});
