import { describe, expect, it, vi, beforeEach } from 'vitest';

/**
 * Unit tests for the schema context filtering logic.
 * These test the pure filtering functions without React Query.
 */

// Extract the filtering logic for testing
function filterTables(
  allTables: Record<string, { name: string }>,
  sourceTables: string[],
) {
  const tableSet = new Set(sourceTables.map((t) => t.toUpperCase()));
  const result: { name: string }[] = [];
  for (const [name, info] of Object.entries(allTables)) {
    if (tableSet.has(name.toUpperCase())) result.push(info);
  }
  return result;
}

function filterRelationships(
  all: Array<{ fromTable: string; toTable: string }>,
  sourceTables: string[],
  mode: 'both' | 'any',
) {
  const tableSet = new Set(sourceTables.map((t) => t.toUpperCase()));
  return all.filter((r) => {
    const fromMatch = tableSet.has(r.fromTable.toUpperCase());
    const toMatch = tableSet.has(r.toTable.toUpperCase());
    return mode === 'both' ? fromMatch && toMatch : fromMatch || toMatch;
  });
}

describe('schema context filtering', () => {
  const tables = {
    INVOICE: { name: 'INVOICE' },
    COMPANY: { name: 'COMPANY' },
    EMPLOYEE: { name: 'EMPLOYEE' },
    BANK_ACTIONS: { name: 'BANK_ACTIONS' },
  };

  const relationships = [
    { fromTable: 'INVOICE', toTable: 'COMPANY', fromColumn: 'COMP_ID', toColumn: 'ID' },
    { fromTable: 'INVOICE', toTable: 'EMPLOYEE', fromColumn: 'EMP_ID', toColumn: 'ID' },
    { fromTable: 'EMPLOYEE', toTable: 'COMPANY', fromColumn: 'COMP_ID', toColumn: 'ID' },
    { fromTable: 'BANK_ACTIONS', toTable: 'COMPANY', fromColumn: 'COMP_ID', toColumn: 'ID' },
  ];

  describe('filterTables', () => {
    it('sourceTables ile eşleşen tabloları döndürür', () => {
      const result = filterTables(tables, ['INVOICE', 'COMPANY']);
      expect(result).toHaveLength(2);
      expect(result.map((t) => t.name)).toEqual(['INVOICE', 'COMPANY']);
    });

    it('case-insensitive eşleşme', () => {
      const result = filterTables(tables, ['invoice', 'company']);
      expect(result).toHaveLength(2);
    });

    it('boş sourceTables — boş sonuç', () => {
      expect(filterTables(tables, [])).toHaveLength(0);
    });

    it('eşleşmeyen tablo — boş sonuç', () => {
      expect(filterTables(tables, ['NON_EXISTENT'])).toHaveLength(0);
    });
  });

  describe('filterRelationships — both mode', () => {
    it('her iki ucu da sourceTables içinde olan ilişkiler', () => {
      const result = filterRelationships(relationships, ['INVOICE', 'COMPANY'], 'both');
      expect(result).toHaveLength(1);
      expect(result[0].fromTable).toBe('INVOICE');
      expect(result[0].toTable).toBe('COMPANY');
    });

    it('3 tablo — 3 ilişki', () => {
      const result = filterRelationships(relationships, ['INVOICE', 'COMPANY', 'EMPLOYEE'], 'both');
      expect(result).toHaveLength(3);
    });

    it('tek tablo — 0 ilişki (self-join yok)', () => {
      const result = filterRelationships(relationships, ['INVOICE'], 'both');
      expect(result).toHaveLength(0);
    });
  });

  describe('filterRelationships — any mode', () => {
    it('en az bir ucu sourceTables içinde olan ilişkiler', () => {
      const result = filterRelationships(relationships, ['INVOICE'], 'any');
      expect(result).toHaveLength(2); // INVOICE→COMPANY, INVOICE→EMPLOYEE
    });

    it('COMPANY — 3 ilişki (hub table)', () => {
      const result = filterRelationships(relationships, ['COMPANY'], 'any');
      expect(result).toHaveLength(3); // INVOICE→COMPANY, EMPLOYEE→COMPANY, BANK→COMPANY
    });
  });
});
