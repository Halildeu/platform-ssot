import { describe, expect, it } from 'vitest';
import { buildColDefs } from '../transformer';
import type { ColumnMeta } from '../types';

const t = (key: string) => {
  const map: Record<string, string> = {
    'col.name': 'Ad Soyad',
    'col.email': 'E-posta',
    'col.role': 'Rol',
    'col.status': 'Durum',
    'col.date': 'Tarih',
    'col.amount': 'Tutar',
    'col.active': 'Aktif mi',
    'col.score': 'Puan',
    'shared.status.active': 'Aktif',
    'shared.status.inactive': 'Pasif',
    'shared.role.admin': 'Yönetici',
    'shared.role.user': 'Kullanıcı',
    'shared.boolean.yes': 'Evet',
    'shared.boolean.no': 'Hayır',
  };
  return map[key] ?? key;
};

describe('buildColDefs', () => {
  it('text sütunu — headerName çözülür, filter agTextColumnFilter', () => {
    const meta: ColumnMeta[] = [
      { field: 'email', headerNameKey: 'col.email', columnType: 'text', flex: 1.6 },
    ];
    const result = buildColDefs(meta, t);
    expect(result).toHaveLength(1);
    expect(result[0].headerName).toBe('E-posta');
    expect(result[0].field).toBe('email');
    expect(result[0].flex).toBe(1.6);
    expect(result[0].filter).toBe('agTextColumnFilter');
  });

  it('bold-text sütunu — cellRenderer tanımlı', () => {
    const meta: ColumnMeta[] = [
      { field: 'fullName', headerNameKey: 'col.name', columnType: 'bold-text', minWidth: 180 },
    ];
    const result = buildColDefs(meta, t);
    expect(result[0].headerName).toBe('Ad Soyad');
    expect(result[0].minWidth).toBe(180);
    expect(result[0].cellRenderer).toBeDefined();
  });

  it('badge sütunu — set filter + cellRenderer', () => {
    const meta: ColumnMeta[] = [
      {
        field: 'role', headerNameKey: 'col.role', columnType: 'badge', width: 140,
        variantMap: { ADMIN: 'danger', USER: 'info' },
        defaultVariant: 'info',
        filterValues: ['ADMIN', 'USER'],
      },
    ];
    const result = buildColDefs(meta, t);
    expect(result[0].filter).toBe('agSetColumnFilter');
    expect(result[0].filterParams).toMatchObject({
      values: ['ADMIN', 'USER'],
      suppressSyncValuesAfterDataChange: true,
    });
    expect(result[0].filterParams?.valueFormatter).toBeDefined();
    expect(result[0].cellRenderer).toBeDefined();
  });

  it('status sütunu — statusMap keys → set filter values', () => {
    const meta: ColumnMeta[] = [
      {
        field: 'status', headerNameKey: 'col.status', columnType: 'status', width: 140,
        statusMap: {
          ACTIVE: { variant: 'success', labelKey: 'shared.status.active' },
          INACTIVE: { variant: 'muted', labelKey: 'shared.status.inactive' },
        },
      },
    ];
    const result = buildColDefs(meta, t);
    expect(result[0].filter).toBe('agSetColumnFilter');
    expect(result[0].filterParams).toMatchObject({
      values: ['ACTIVE', 'INACTIVE'],
      suppressSyncValuesAfterDataChange: true,
    });
    expect(result[0].filterParams?.valueFormatter).toBeDefined();
    expect(result[0].cellRenderer).toBeDefined();
  });

  it('date sütunu — agDateColumnFilter', () => {
    const meta: ColumnMeta[] = [
      { field: 'createdAt', headerNameKey: 'col.date', columnType: 'date', width: 180 },
    ];
    const result = buildColDefs(meta, t);
    expect(result[0].filter).toBe('agDateColumnFilter');
    expect(result[0].cellRenderer).toBeDefined();
  });

  it('number sütunu — agNumberColumnFilter', () => {
    const meta: ColumnMeta[] = [
      { field: 'amount', headerNameKey: 'col.amount', columnType: 'number', width: 120, suffix: 'dk' },
    ];
    const result = buildColDefs(meta, t);
    expect(result[0].filter).toBe('agNumberColumnFilter');
    expect(result[0].cellRenderer).toBeDefined();
  });

  it('currency sütunu — agNumberColumnFilter', () => {
    const meta: ColumnMeta[] = [
      { field: 'total', headerNameKey: 'col.amount', columnType: 'currency', currencyCode: 'TRY' },
    ];
    const result = buildColDefs(meta, t);
    expect(result[0].filter).toBe('agNumberColumnFilter');
    expect(result[0].cellRenderer).toBeDefined();
  });

  it('boolean sütunu — set filter [true, false]', () => {
    const meta: ColumnMeta[] = [
      { field: 'isActive', headerNameKey: 'col.active', columnType: 'boolean' },
    ];
    const result = buildColDefs(meta, t);
    expect(result[0].filter).toBe('agSetColumnFilter');
    expect(result[0].filterParams).toMatchObject({
      values: ['true', 'false'],
      suppressSyncValuesAfterDataChange: true,
    });
    expect(result[0].filterParams?.valueFormatter).toBeDefined();
  });

  it('percent sütunu — agNumberColumnFilter', () => {
    const meta: ColumnMeta[] = [
      { field: 'score', headerNameKey: 'col.score', columnType: 'percent', showBar: true },
    ];
    const result = buildColDefs(meta, t);
    expect(result[0].filter).toBe('agNumberColumnFilter');
    expect(result[0].cellRenderer).toBeDefined();
  });

  it('actions sütunu — filter false, pinned right', () => {
    const meta: ColumnMeta[] = [
      { field: 'actions', headerNameKey: 'İşlemler', columnType: 'actions', actions: [] },
    ];
    const result = buildColDefs(meta, t);
    expect(result[0].filter).toBe(false);
    expect(result[0].pinned).toBe('right');
    expect(result[0].sortable).toBe(false);
  });

  it('requiredPermission — sütun filtrelenir', () => {
    const meta: ColumnMeta[] = [
      { field: 'salary', headerNameKey: 'Maaş', columnType: 'currency', requiredPermission: 'HR_ADMIN' },
      { field: 'name', headerNameKey: 'col.name', columnType: 'text' },
    ];
    const result = buildColDefs(meta, t, 'tr-TR', ['VIEW_USERS']);
    expect(result).toHaveLength(1);
    expect(result[0].field).toBe('name');
  });

  it('requiredPermission — permission varsa sütun dahil', () => {
    const meta: ColumnMeta[] = [
      { field: 'salary', headerNameKey: 'Maaş', columnType: 'currency', requiredPermission: 'HR_ADMIN' },
    ];
    const result = buildColDefs(meta, t, 'tr-TR', ['HR_ADMIN']);
    expect(result).toHaveLength(1);
    expect(result[0].field).toBe('salary');
  });

  it('birden fazla sütun — sıra korunur', () => {
    const meta: ColumnMeta[] = [
      { field: 'name', headerNameKey: 'col.name', columnType: 'bold-text' },
      { field: 'email', headerNameKey: 'col.email', columnType: 'text' },
      { field: 'role', headerNameKey: 'col.role', columnType: 'badge', variantMap: { A: 'danger' } },
      { field: 'date', headerNameKey: 'col.date', columnType: 'date' },
    ];
    const result = buildColDefs(meta, t);
    expect(result).toHaveLength(4);
    expect(result.map((c) => c.field)).toEqual(['name', 'email', 'role', 'date']);
  });

  it('boş meta — boş sonuç', () => {
    expect(buildColDefs([], t)).toEqual([]);
  });

  it('plain string headerNameKey — direkt kullanılır (dynamic report)', () => {
    const meta: ColumnMeta[] = [
      { field: 'col1', headerNameKey: 'Sütun Adı', columnType: 'text' },
    ];
    const result = buildColDefs(meta, t);
    expect(result[0].headerName).toBe('Sütun Adı');
  });
});
