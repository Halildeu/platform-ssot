import { describe, expect, it } from 'vitest';
import { enrichColumnsWithSchema } from '../enrichColumnsWithSchema';
import type { ColumnMeta } from '@mfe/design-system/advanced/data-grid';
import type { SchemaTableInfo, SchemaRelationship } from '@mfe/shared-types';

const tables: SchemaTableInfo[] = [
  {
    name: 'INVOICE',
    schema: 'dbo',
    columns: [
      { name: 'ID', dataType: 'int', maxLength: 4, nullable: false, identity: true, pk: true, ordinal: 1 },
      { name: 'AMOUNT', dataType: 'decimal(18,2)', maxLength: 9, nullable: false, identity: false, pk: false, ordinal: 2 },
      { name: 'COMP_ID', dataType: 'int', maxLength: 4, nullable: false, identity: false, pk: false, ordinal: 3 },
      { name: 'CREATED_AT', dataType: 'datetime2', maxLength: 8, nullable: true, identity: false, pk: false, ordinal: 4 },
      { name: 'NOTES', dataType: 'nvarchar(500)', maxLength: 1000, nullable: true, identity: false, pk: false, ordinal: 5 },
      { name: 'IS_PAID', dataType: 'bit', maxLength: 1, nullable: false, identity: false, pk: false, ordinal: 6 },
    ],
    rowCount: 5000,
    columnCount: 6,
  },
];

const relationships: SchemaRelationship[] = [
  {
    fromTable: 'INVOICE', fromColumn: 'COMP_ID',
    toTable: 'COMPANY', toColumn: 'ID',
    confidence: 0.92, source: 'common_fk', multiSource: false,
  },
];

describe('enrichColumnsWithSchema', () => {
  it('eşleşen sütunlara schemaLineage ekler', () => {
    const columns: ColumnMeta[] = [
      { field: 'AMOUNT', headerNameKey: 'Tutar', columnType: 'number' },
    ];
    const result = enrichColumnsWithSchema(columns, tables, relationships);
    expect(result[0].schemaLineage).toEqual({
      sourceTable: 'INVOICE',
      sourceColumn: 'AMOUNT',
      sqlDataType: 'decimal(18,2)',
      isNullable: false,
      isPrimaryKey: false,
      isForeignKey: false,
      referencedTable: undefined,
      referencedColumn: undefined,
    });
  });

  it('FK sütunu isForeignKey=true + referencedTable', () => {
    const columns: ColumnMeta[] = [
      { field: 'COMP_ID', headerNameKey: 'Şirket', columnType: 'text' },
    ];
    const result = enrichColumnsWithSchema(columns, tables, relationships);
    expect(result[0].schemaLineage?.isForeignKey).toBe(true);
    expect(result[0].schemaLineage?.referencedTable).toBe('COMPANY');
    expect(result[0].schemaLineage?.referencedColumn).toBe('ID');
  });

  it('PK sütunu isPrimaryKey=true', () => {
    const columns: ColumnMeta[] = [
      { field: 'ID', headerNameKey: 'ID', columnType: 'text' },
    ];
    const result = enrichColumnsWithSchema(columns, tables, relationships);
    expect(result[0].schemaLineage?.isPrimaryKey).toBe(true);
  });

  it('explicit columnType override edilmez', () => {
    const columns: ColumnMeta[] = [
      { field: 'AMOUNT', headerNameKey: 'Tutar', columnType: 'currency', currencyCode: 'TRY', decimals: 2 } as ColumnMeta,
    ];
    const result = enrichColumnsWithSchema(columns, tables, relationships);
    expect(result[0].columnType).toBe('currency'); // NOT overridden to 'number'
  });

  it('text columnType + number SQL tipi → number infer', () => {
    const columns: ColumnMeta[] = [
      { field: 'AMOUNT', headerNameKey: 'Tutar', columnType: 'text' },
    ];
    const result = enrichColumnsWithSchema(columns, tables, relationships);
    expect(result[0].columnType).toBe('number'); // inferred from decimal
  });

  it('text columnType + datetime SQL tipi → date infer', () => {
    const columns: ColumnMeta[] = [
      { field: 'CREATED_AT', headerNameKey: 'Tarih', columnType: 'text' },
    ];
    const result = enrichColumnsWithSchema(columns, tables, relationships);
    expect(result[0].columnType).toBe('date');
  });

  it('text columnType + bit SQL tipi → boolean infer', () => {
    const columns: ColumnMeta[] = [
      { field: 'IS_PAID', headerNameKey: 'Ödendi', columnType: 'text' },
    ];
    const result = enrichColumnsWithSchema(columns, tables, relationships);
    expect(result[0].columnType).toBe('boolean');
  });

  it('text columnType + nvarchar SQL tipi → text kalır (no change)', () => {
    const columns: ColumnMeta[] = [
      { field: 'NOTES', headerNameKey: 'Notlar', columnType: 'text' },
    ];
    const result = enrichColumnsWithSchema(columns, tables, relationships);
    expect(result[0].columnType).toBe('text');
  });

  it('eşleşmeyen sütun değişmez', () => {
    const columns: ColumnMeta[] = [
      { field: 'UNKNOWN_FIELD', headerNameKey: 'Bilinmeyen', columnType: 'text' },
    ];
    const result = enrichColumnsWithSchema(columns, tables, relationships);
    expect(result[0].schemaLineage).toBeUndefined();
    expect(result[0].columnType).toBe('text');
  });

  it('boş tablo listesi — sütunlar değişmez', () => {
    const columns: ColumnMeta[] = [
      { field: 'AMOUNT', headerNameKey: 'Tutar', columnType: 'number' },
    ];
    const result = enrichColumnsWithSchema(columns, [], []);
    expect(result).toEqual(columns);
  });

  it('input mutate edilmez', () => {
    const columns: ColumnMeta[] = [
      { field: 'AMOUNT', headerNameKey: 'Tutar', columnType: 'text' },
    ];
    const original = { ...columns[0] };
    enrichColumnsWithSchema(columns, tables, relationships);
    expect(columns[0]).toEqual(original); // original not mutated
  });
});
