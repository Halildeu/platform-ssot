import { describe, expect, it } from 'vitest';
import { inferColumnType, findSourceColumn } from '../schemaColumnMapper';

describe('inferColumnType', () => {
  // Number types
  it.each([
    'int', 'bigint', 'smallint', 'tinyint', 'decimal', 'numeric',
    'float', 'real', 'money', 'smallmoney', 'integer', 'serial', 'bigserial', 'double',
  ])('%s → number', (sqlType) => {
    expect(inferColumnType(sqlType)).toBe('number');
  });

  // Boolean types
  it.each(['bit', 'boolean', 'bool'])('%s → boolean', (sqlType) => {
    expect(inferColumnType(sqlType)).toBe('boolean');
  });

  // Date types
  it.each([
    'date', 'datetime', 'datetime2', 'smalldatetime', 'datetimeoffset',
    'time', 'timestamp',
  ])('%s → date', (sqlType) => {
    expect(inferColumnType(sqlType)).toBe('date');
  });

  // Text types → undefined
  it.each([
    'nvarchar', 'varchar', 'char', 'nchar', 'text', 'ntext', 'xml', 'uniqueidentifier',
  ])('%s → undefined (text default)', (sqlType) => {
    expect(inferColumnType(sqlType)).toBeUndefined();
  });

  it('nvarchar(255) → undefined (strips size)', () => {
    expect(inferColumnType('nvarchar(255)')).toBeUndefined();
  });

  it('decimal(18,2) → number (strips precision)', () => {
    expect(inferColumnType('decimal(18,2)')).toBe('number');
  });

  it('bilinmeyen tip → undefined', () => {
    expect(inferColumnType('geometry')).toBeUndefined();
  });

  it('case insensitive', () => {
    expect(inferColumnType('INT')).toBe('number');
    expect(inferColumnType('DateTime2')).toBe('date');
  });
});

describe('findSourceColumn', () => {
  const tables = [
    {
      name: 'INVOICE',
      columns: [
        { name: 'ID', dataType: 'int', pk: true, nullable: false },
        { name: 'AMOUNT', dataType: 'decimal(18,2)', pk: false, nullable: false },
        { name: 'CREATED_AT', dataType: 'datetime2', pk: false, nullable: true },
      ],
    },
    {
      name: 'COMPANY',
      columns: [
        { name: 'ID', dataType: 'int', pk: true, nullable: false },
        { name: 'NAME', dataType: 'nvarchar(255)', pk: false, nullable: false },
      ],
    },
  ];

  it('field eşleşirse tablo ve sütun bilgisi döner', () => {
    const result = findSourceColumn('AMOUNT', tables);
    expect(result).toEqual({
      table: 'INVOICE',
      column: 'AMOUNT',
      dataType: 'decimal(18,2)',
      pk: false,
      nullable: false,
    });
  });

  it('case-insensitive eşleşme', () => {
    const result = findSourceColumn('amount', tables);
    expect(result?.table).toBe('INVOICE');
  });

  it('PK sütun doğru işaretlenir', () => {
    const result = findSourceColumn('ID', tables);
    expect(result?.pk).toBe(true);
  });

  it('eşleşme yoksa undefined', () => {
    expect(findSourceColumn('NON_EXISTENT', tables)).toBeUndefined();
  });

  it('ilk eşleşen tablo döner (ID her tabloda var)', () => {
    const result = findSourceColumn('ID', tables);
    expect(result?.table).toBe('INVOICE'); // first match
  });
});
