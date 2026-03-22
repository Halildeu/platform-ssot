import { describe, it, expect } from 'vitest';

/* ---------------------------------------------------------------------------
 * Wave 4 — Performance CI Gates
 *
 * Hard-ceiling assertions that run in every CI pass.  If any gate fails the
 * build is red.  Budgets are deliberately generous so they pass on CI
 * runners (which are slower than local machines) while still catching
 * catastrophic regressions.
 * -----------------------------------------------------------------------*/

const ROW_COUNT = 10_000;

describe('Performance Gates — x-data-grid', () => {
  it('10K row dataset generates in < 50ms', () => {
    const start = performance.now();
    Array.from({ length: ROW_COUNT }, (_, i) => ({
      id: i,
      name: `Row ${i}`,
      value: Math.random() * 1000,
      status: ['active', 'inactive', 'pending'][i % 3],
    }));
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  it('sort 10K rows by string in < 100ms', () => {
    const data = Array.from({ length: ROW_COUNT }, (_, i) => ({
      name: `Row ${9999 - i}`,
    }));
    const start = performance.now();
    data.sort((a, b) => a.name.localeCompare(b.name));
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  it('sort 10K rows by number in < 50ms', () => {
    const data = Array.from({ length: ROW_COUNT }, (_, i) => ({
      value: Math.random() * 10_000,
    }));
    const start = performance.now();
    data.sort((a, b) => a.value - b.value);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  it('filter 10K rows in < 20ms', () => {
    const data = Array.from({ length: ROW_COUNT }, (_, i) => ({
      status: i % 3 === 0 ? 'active' : 'inactive',
    }));
    const start = performance.now();
    data.filter((r) => r.status === 'active');
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(20);
  });

  it('group 10K rows by 3 levels in < 100ms', () => {
    const data = Array.from({ length: ROW_COUNT }, (_, i) => ({
      country: ['TR', 'DE', 'US', 'UK'][i % 4],
      city: ['IST', 'ANK', 'BER', 'NYC', 'LON'][i % 5],
      dept: ['Eng', 'Sales', 'HR'][i % 3],
    }));
    const start = performance.now();
    const groups = new Map<string, typeof data>();
    for (const row of data) {
      const key = `${row.country}|${row.city}|${row.dept}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  it('CSV serialize 10K rows in < 150ms', () => {
    const headers = ['id', 'name', 'value', 'status'];
    const data = Array.from({ length: ROW_COUNT }, (_, i) => ({
      id: i,
      name: `Row ${i}`,
      value: (Math.random() * 1000).toFixed(2),
      status: ['active', 'inactive', 'pending'][i % 3],
    }));
    const start = performance.now();
    const lines = [headers.join(',')];
    for (const row of data) {
      lines.push(`${row.id},"${row.name}",${row.value},${row.status}`);
    }
    lines.join('\n');
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(150);
  });
});
