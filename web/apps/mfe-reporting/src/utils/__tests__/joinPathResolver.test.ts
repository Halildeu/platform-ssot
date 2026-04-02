import { describe, expect, it } from 'vitest';
import { resolveDrillDownRoute, buildDrillDownUrl } from '../joinPathResolver';

describe('resolveDrillDownRoute', () => {
  const index = [
    { route: 'users', sourceTables: ['USERS', 'COMPANY'] },
    { route: 'invoices', sourceTables: ['INVOICE', 'COMPANY', 'EMPLOYEE'] },
    { route: 'hr', sourceTables: ['EMPLOYEE', 'DEPARTMENT'] },
  ];

  it('referenced table eşleşen rapor route döner', () => {
    expect(resolveDrillDownRoute('COMPANY', index)).toBe('users');
  });

  it('EMPLOYEE → ilk eşleşen rapor (invoices)', () => {
    expect(resolveDrillDownRoute('EMPLOYEE', index)).toBe('invoices');
  });

  it('case-insensitive', () => {
    expect(resolveDrillDownRoute('company', index)).toBe('users');
  });

  it('eşleşme yoksa null', () => {
    expect(resolveDrillDownRoute('NONEXISTENT', index)).toBeNull();
  });

  it('boş index → null', () => {
    expect(resolveDrillDownRoute('COMPANY', [])).toBeNull();
  });
});

describe('buildDrillDownUrl', () => {
  it('doğru URL oluşturur', () => {
    const url = buildDrillDownUrl('users', 'COMP_ID', 42);
    expect(url).toBe('/admin/reports/users?filter=COMP_ID%3D42');
  });

  it('string değerle çalışır', () => {
    const url = buildDrillDownUrl('invoices', 'STATUS', 'PAID');
    expect(url).toContain('STATUS%3DPAID');
  });
});
