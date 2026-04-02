import { describe, expect, it } from 'vitest';
import { buildReportTableIndex, findRelatedReports } from '../reportTableIndex';

const modules = [
  { id: 'users', titleKey: 'Kullanıcılar', route: 'users', sourceTables: ['USERS', 'COMPANY'] },
  { id: 'audit', titleKey: 'Denetim', route: 'audit', sourceTables: ['AUDIT_EVENTS', 'USERS'] },
  { id: 'invoices', titleKey: 'Faturalar', route: 'invoices', sourceTables: ['INVOICE', 'COMPANY', 'EMPLOYEE'] },
  { id: 'hr', titleKey: 'İK', route: 'hr', sourceTables: ['EMPLOYEE', 'COMPANY'] },
  { id: 'no-tables', titleKey: 'Boş', route: 'empty' }, // no sourceTables
];

describe('buildReportTableIndex', () => {
  it('sourceTables olan modülleri index eder', () => {
    const index = buildReportTableIndex(modules);
    expect(index).toHaveLength(4); // no-tables excluded
  });

  it('sourceTables olmayan modülleri atlar', () => {
    const index = buildReportTableIndex(modules);
    expect(index.find((e) => e.reportId === 'no-tables')).toBeUndefined();
  });

  it('tablo adlarını uppercase normalize eder', () => {
    const index = buildReportTableIndex(modules);
    expect(index[0].sourceTables).toEqual(['USERS', 'COMPANY']);
  });
});

describe('findRelatedReports', () => {
  const index = buildReportTableIndex(modules);

  it('ortak tablosu olan raporları bulur', () => {
    const related = findRelatedReports('users', ['USERS', 'COMPANY'], index);
    expect(related.length).toBeGreaterThan(0);
  });

  it('kendini dahil etmez', () => {
    const related = findRelatedReports('users', ['USERS', 'COMPANY'], index);
    expect(related.find((r) => r.reportId === 'users')).toBeUndefined();
  });

  it('ortak tablo sayısına göre sıralar (en çok → en az)', () => {
    const related = findRelatedReports('users', ['USERS', 'COMPANY'], index);
    for (let i = 1; i < related.length; i++) {
      expect(related[i - 1].sharedTableCount).toBeGreaterThanOrEqual(related[i].sharedTableCount);
    }
  });

  it('COMPANY tablosu ile invoices ve hr eşleşir', () => {
    const related = findRelatedReports('users', ['COMPANY'], index);
    const ids = related.map((r) => r.reportId);
    expect(ids).toContain('invoices');
    expect(ids).toContain('hr');
  });

  it('ortak tablo yoksa boş döner', () => {
    const related = findRelatedReports('users', ['NONEXISTENT'], index);
    expect(related).toHaveLength(0);
  });

  it('boş currentTables — boş döner', () => {
    expect(findRelatedReports('users', [], index)).toHaveLength(0);
  });

  it('sharedTables doğru listelenir', () => {
    const related = findRelatedReports('users', ['USERS', 'COMPANY'], index);
    const audit = related.find((r) => r.reportId === 'audit');
    expect(audit?.sharedTables).toContain('USERS');
  });
});
