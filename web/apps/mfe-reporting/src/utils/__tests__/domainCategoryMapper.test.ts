import { describe, expect, it } from 'vitest';
import { suggestCategoryFromDomains } from '../domainCategoryMapper';

describe('suggestCategoryFromDomains', () => {
  const domains: Record<string, string[]> = {
    Finance: ['INVOICE', 'PAYMENT', 'BUDGET'],
    HR: ['EMPLOYEE', 'DEPARTMENT', 'SALARY'],
    IT: ['SERVER', 'NETWORK', 'BACKUP'],
    Audit: ['AUDIT_EVENTS', 'AUDIT_LOG'],
    Dashboard: ['KPI_SUMMARY'],
  };

  it('Finance tabloları → business', () => {
    expect(suggestCategoryFromDomains(['INVOICE', 'PAYMENT'], domains)).toBe('business');
  });

  it('HR tabloları → business', () => {
    expect(suggestCategoryFromDomains(['EMPLOYEE', 'DEPARTMENT'], domains)).toBe('business');
  });

  it('IT tabloları → system', () => {
    expect(suggestCategoryFromDomains(['SERVER', 'NETWORK'], domains)).toBe('system');
  });

  it('Audit tabloları → system', () => {
    expect(suggestCategoryFromDomains(['AUDIT_EVENTS'], domains)).toBe('system');
  });

  it('Dashboard tabloları → executive', () => {
    expect(suggestCategoryFromDomains(['KPI_SUMMARY'], domains)).toBe('executive');
  });

  it('en çok overlap olan domain kazanır', () => {
    // 2 Finance + 1 HR → business (Finance has more overlap)
    expect(suggestCategoryFromDomains(['INVOICE', 'PAYMENT', 'EMPLOYEE'], domains)).toBe('business');
  });

  it('eşleşme yoksa undefined', () => {
    expect(suggestCategoryFromDomains(['UNKNOWN_TABLE'], domains)).toBeUndefined();
  });

  it('boş sourceTables → undefined', () => {
    expect(suggestCategoryFromDomains([], domains)).toBeUndefined();
  });

  it('boş domains → undefined', () => {
    expect(suggestCategoryFromDomains(['INVOICE'], {})).toBeUndefined();
  });

  it('case-insensitive tablo eşleşme', () => {
    expect(suggestCategoryFromDomains(['invoice', 'payment'], domains)).toBe('business');
  });
});
