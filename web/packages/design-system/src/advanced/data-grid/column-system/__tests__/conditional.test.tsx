import { describe, expect, it } from 'vitest';
import { findMatchingRule, withConditionalFormatting } from '../conditional';
import type { ConditionalRule } from '../types';

describe('findMatchingRule', () => {
  const rules: ConditionalRule[] = [
    { condition: 'gt', value: 50000, style: { textColor: 'green' } },
    { condition: 'lt', value: 20000, style: { textColor: 'red' } },
  ];

  it('gt koşulu — eşleşir', () => {
    expect(findMatchingRule(rules, 60000)).toEqual(rules[0]);
  });

  it('lt koşulu — eşleşir', () => {
    expect(findMatchingRule(rules, 10000)).toEqual(rules[1]);
  });

  it('arada — eşleşmez', () => {
    expect(findMatchingRule(rules, 30000)).toBeNull();
  });

  it('null değer — eşleşmez', () => {
    expect(findMatchingRule(rules, null)).toBeNull();
  });

  it('eq koşulu', () => {
    const eqRules: ConditionalRule[] = [
      { condition: 'eq', value: 'CRITICAL', style: { textColor: 'red' } },
    ];
    expect(findMatchingRule(eqRules, 'CRITICAL')).toEqual(eqRules[0]);
    expect(findMatchingRule(eqRules, 'INFO')).toBeNull();
  });

  it('neq koşulu', () => {
    const neqRules: ConditionalRule[] = [
      { condition: 'neq', value: 'OK', style: { textColor: 'red' } },
    ];
    expect(findMatchingRule(neqRules, 'FAIL')).toEqual(neqRules[0]);
    expect(findMatchingRule(neqRules, 'OK')).toBeNull();
  });

  it('gte koşulu', () => {
    const gteRules: ConditionalRule[] = [
      { condition: 'gte', value: 100, style: { textColor: 'green' } },
    ];
    expect(findMatchingRule(gteRules, 100)).toEqual(gteRules[0]);
    expect(findMatchingRule(gteRules, 99)).toBeNull();
  });

  it('lte koşulu', () => {
    const lteRules: ConditionalRule[] = [
      { condition: 'lte', value: 0, style: { bgColor: 'red' } },
    ];
    expect(findMatchingRule(lteRules, 0)).toEqual(lteRules[0]);
    expect(findMatchingRule(lteRules, 1)).toBeNull();
  });

  it('contains koşulu', () => {
    const containsRules: ConditionalRule[] = [
      { condition: 'contains', value: 'error', style: { textColor: 'red' } },
    ];
    expect(findMatchingRule(containsRules, 'Network error occurred')).toEqual(containsRules[0]);
    expect(findMatchingRule(containsRules, 'Success')).toBeNull();
  });

  it('ilk eşleşen kural kazanır', () => {
    const ordered: ConditionalRule[] = [
      { condition: 'gt', value: 90, style: { textColor: 'gold' } },
      { condition: 'gt', value: 50, style: { textColor: 'green' } },
    ];
    expect(findMatchingRule(ordered, 95)).toEqual(ordered[0]);
  });
});

describe('withConditionalFormatting', () => {
  it('kural eşleşmezse base renderer döner', () => {
    const base = (params: { value: unknown }) => String(params.value);
    const rules: ConditionalRule[] = [
      { condition: 'gt', value: 100, style: { textColor: 'red' } },
    ];
    const wrapped = withConditionalFormatting(base, rules);
    const result = wrapped({ value: 50, data: undefined });
    expect(result).toBe('50');
  });

  it('kural eşleşirse style wrap eder', () => {
    const base = (params: { value: unknown }) => String(params.value);
    const rules: ConditionalRule[] = [
      { condition: 'gt', value: 100, style: { textColor: 'red' } },
    ];
    const wrapped = withConditionalFormatting(base, rules);
    const result = wrapped({ value: 150, data: undefined });
    expect(result).toBeTruthy();
    expect(result).not.toBe('150'); // wrapped in span
  });

  it('badgeVariant kuralı — Badge döndürür', () => {
    const rules: ConditionalRule[] = [
      { condition: 'eq', value: 'FAIL', style: { badgeVariant: 'danger' } },
    ];
    const wrapped = withConditionalFormatting(undefined, rules);
    const result = wrapped({ value: 'FAIL', data: undefined });
    expect(result).toBeTruthy();
  });

  it('base renderer undefined — ham değer gösterir', () => {
    const rules: ConditionalRule[] = [];
    const wrapped = withConditionalFormatting(undefined, rules);
    const result = wrapped({ value: 'hello', data: undefined });
    expect(result).toBe('hello');
  });
});
