import { describe, expect, it } from 'vitest';
import { generateReportConfig, validateReportConfig } from '../utils/generateReportConfig';
import type { BuilderState } from '../hooks/useBuilderState';

const baseState: BuilderState = {
  step: 7,
  dataSourceId: '',
  schema: 'workcube_mikrolink',
  primaryTable: 'INVOICE',
  availableColumns: [],
  selectedColumns: [
    { field: 'ID', headerName: 'ID', columnType: 'number', included: true },
    { field: 'AMOUNT', headerName: 'Tutar', columnType: 'currency', included: true },
    { field: 'CREATED_AT', headerName: 'Tarih', columnType: 'date', included: true },
  ],
  relatedTables: ['COMPANY'],
  joins: [{ fromTable: 'INVOICE', fromColumn: 'COMP_ID', toTable: 'COMPANY', toColumn: 'ID', joinType: 'left' }],
  lookups: [{ fkColumn: 'COMP_ID', lookupTable: 'COMPANY', lookupPk: 'ID', displayColumn: 'NAME' }],
  filters: [{ field: 'AMOUNT', type: 'number', label: 'Tutar' }],
  reportTitle: 'Fatura Raporu',
  reportDescription: 'Aylık fatura detayları',
  reportCategory: 'Finans',
  isDirty: true,
};

describe('generateReportConfig', () => {
  it('doğru ReportDefinition üretir', () => {
    const config = generateReportConfig(baseState);
    expect(config.title).toBe('Fatura Raporu');
    expect(config.sourceSchema).toBe('workcube_mikrolink');
    expect(config.sourceTables).toEqual(['INVOICE', 'COMPANY']);
    expect(config.columns).toHaveLength(3);
    expect(config.joins).toHaveLength(1);
    expect(config.filters).toHaveLength(1);
    expect(config.lookups).toHaveLength(1);
    expect(config.version).toBe(1);
  });

  it('boş title → "Yeni Rapor"', () => {
    const config = generateReportConfig({ ...baseState, reportTitle: '' });
    expect(config.title).toBe('Yeni Rapor');
  });

  it('boş relatedTables → sadece primaryTable', () => {
    const config = generateReportConfig({ ...baseState, relatedTables: [] });
    expect(config.sourceTables).toEqual(['INVOICE']);
  });
});

describe('validateReportConfig', () => {
  it('valid config — 0 hata', () => {
    const config = generateReportConfig(baseState);
    expect(validateReportConfig(config)).toEqual([]);
  });

  it('boş title — hata', () => {
    const config = generateReportConfig({ ...baseState, reportTitle: '' });
    config.title = '';
    expect(validateReportConfig(config)).toContain('Rapor başlığı gerekli');
  });

  it('boş sütun — hata', () => {
    const config = generateReportConfig({ ...baseState, selectedColumns: [] });
    expect(validateReportConfig(config)).toContain('En az bir sütun seçilmeli');
  });

  it('boş tablo — hata', () => {
    const config = generateReportConfig({ ...baseState, primaryTable: '', relatedTables: [] });
    expect(validateReportConfig(config)).toContain('En az bir tablo seçilmeli');
  });

  it('join referenced table sourceTables dışında — hata', () => {
    const config = generateReportConfig(baseState);
    config.sourceTables = ['INVOICE']; // COMPANY removed
    const errors = validateReportConfig(config);
    expect(errors.some((e) => e.includes('COMPANY'))).toBe(true);
  });

  it('duplicate sütun — hata', () => {
    const config = generateReportConfig(baseState);
    config.columns.push({ ...config.columns[0] }); // duplicate
    const errors = validateReportConfig(config);
    expect(errors.some((e) => e.includes('Tekrarlayan'))).toBe(true);
  });
});
