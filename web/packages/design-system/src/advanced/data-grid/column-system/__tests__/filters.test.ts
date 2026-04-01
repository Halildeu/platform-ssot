import { describe, expect, it } from 'vitest';
import { buildFilterConfig } from '../filters';
import type { ColumnMeta } from '../types';

describe('buildFilterConfig', () => {
  it('text → agTextColumnFilter', () => {
    const meta: ColumnMeta = { field: 'name', headerNameKey: 'n', columnType: 'text' };
    expect(buildFilterConfig(meta)?.filter).toBe('agTextColumnFilter');
  });

  it('bold-text → agTextColumnFilter', () => {
    const meta: ColumnMeta = { field: 'name', headerNameKey: 'n', columnType: 'bold-text' };
    expect(buildFilterConfig(meta)?.filter).toBe('agTextColumnFilter');
  });

  it('badge → agSetColumnFilter with variantMap keys', () => {
    const meta: ColumnMeta = {
      field: 'role', headerNameKey: 'r', columnType: 'badge',
      variantMap: { ADMIN: 'danger', USER: 'info' },
    };
    const cfg = buildFilterConfig(meta);
    expect(cfg?.filter).toBe('agSetColumnFilter');
    expect(cfg?.filterParams).toEqual({
      values: ['ADMIN', 'USER'],
      suppressSyncValuesAfterDataChange: true,
    });
  });

  it('badge filterValues override → filterValues kullanılır', () => {
    const meta: ColumnMeta = {
      field: 'role', headerNameKey: 'r', columnType: 'badge',
      variantMap: { ADMIN: 'danger', USER: 'info', EDITOR: 'warning' },
      filterValues: ['ADMIN', 'USER'],
    };
    const cfg = buildFilterConfig(meta);
    expect(cfg?.filterParams).toEqual({
      values: ['ADMIN', 'USER'],
      suppressSyncValuesAfterDataChange: true,
    });
  });

  it('status → agSetColumnFilter with statusMap keys', () => {
    const meta: ColumnMeta = {
      field: 'status', headerNameKey: 's', columnType: 'status',
      statusMap: {
        ACTIVE: { variant: 'success', labelKey: 'active' },
        INACTIVE: { variant: 'muted', labelKey: 'inactive' },
      },
    };
    const cfg = buildFilterConfig(meta);
    expect(cfg?.filter).toBe('agSetColumnFilter');
    expect(cfg?.filterParams).toEqual({
      values: ['ACTIVE', 'INACTIVE'],
      suppressSyncValuesAfterDataChange: true,
    });
  });

  it('date → agDateColumnFilter', () => {
    const meta: ColumnMeta = { field: 'd', headerNameKey: 'd', columnType: 'date' };
    expect(buildFilterConfig(meta)?.filter).toBe('agDateColumnFilter');
  });

  it('number → agNumberColumnFilter', () => {
    const meta: ColumnMeta = { field: 'n', headerNameKey: 'n', columnType: 'number' };
    expect(buildFilterConfig(meta)?.filter).toBe('agNumberColumnFilter');
  });

  it('currency → agNumberColumnFilter', () => {
    const meta: ColumnMeta = { field: 'c', headerNameKey: 'c', columnType: 'currency' };
    expect(buildFilterConfig(meta)?.filter).toBe('agNumberColumnFilter');
  });

  it('percent → agNumberColumnFilter', () => {
    const meta: ColumnMeta = { field: 'p', headerNameKey: 'p', columnType: 'percent' };
    expect(buildFilterConfig(meta)?.filter).toBe('agNumberColumnFilter');
  });

  it('boolean → agSetColumnFilter [true, false]', () => {
    const meta: ColumnMeta = { field: 'b', headerNameKey: 'b', columnType: 'boolean' };
    const cfg = buildFilterConfig(meta);
    expect(cfg?.filter).toBe('agSetColumnFilter');
    expect(cfg?.filterParams).toEqual({
      values: ['true', 'false'],
      suppressSyncValuesAfterDataChange: true,
    });
  });

  it('enum → agSetColumnFilter with labelMap keys', () => {
    const meta: ColumnMeta = {
      field: 'e', headerNameKey: 'e', columnType: 'enum',
      labelMap: { A: 'Seçenek A', B: 'Seçenek B' },
    };
    const cfg = buildFilterConfig(meta);
    expect(cfg?.filter).toBe('agSetColumnFilter');
    expect(cfg?.filterParams).toEqual({
      values: ['A', 'B'],
      suppressSyncValuesAfterDataChange: true,
    });
  });

  it('actions → filter false', () => {
    const meta: ColumnMeta = { field: 'a', headerNameKey: 'a', columnType: 'actions', actions: [] };
    const cfg = buildFilterConfig(meta);
    expect(cfg?.filter).toBe(false);
    expect(cfg?.floatingFilter).toBe(false);
  });

  it('filterable: false → filter false', () => {
    const meta: ColumnMeta = { field: 'x', headerNameKey: 'x', columnType: 'text', filterable: false };
    const cfg = buildFilterConfig(meta);
    expect(cfg?.filter).toBe(false);
  });
});
