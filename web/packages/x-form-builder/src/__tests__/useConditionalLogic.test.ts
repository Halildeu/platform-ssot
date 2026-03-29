// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useConditionalLogic } from '../useConditionalLogic';
import type { ConditionalRule, FormValues } from '../types';

describe('useConditionalLogic', () => {
  it('isVisible returns true when no rules affect field', () => {
    const rules: ConditionalRule[] = [];
    const values: FormValues = {};

    const { result } = renderHook(() => useConditionalLogic(rules, values));

    expect(result.current.isVisible('someField')).toBe(true);
  });

  it('isVisible returns false when hide rule matches', () => {
    const rules: ConditionalRule[] = [
      {
        id: 'r1',
        conditions: [{ field: 'type', operator: 'equals', value: 'personal' }],
        logic: 'and',
        actions: [{ type: 'hide', target: 'company' }],
      },
    ];
    const values: FormValues = { type: 'personal' };

    const { result } = renderHook(() => useConditionalLogic(rules, values));

    expect(result.current.isVisible('company')).toBe(false);
  });

  it('isEnabled returns false when disable rule matches', () => {
    const rules: ConditionalRule[] = [
      {
        id: 'r1',
        conditions: [{ field: 'status', operator: 'equals', value: 'locked' }],
        logic: 'and',
        actions: [{ type: 'disable', target: 'email' }],
      },
    ];
    const values: FormValues = { status: 'locked' };

    const { result } = renderHook(() => useConditionalLogic(rules, values));

    expect(result.current.isEnabled('email')).toBe(false);
  });

  it('isRequired returns true when setRequired rule matches', () => {
    const rules: ConditionalRule[] = [
      {
        id: 'r1',
        conditions: [{ field: 'subscribe', operator: 'equals', value: true }],
        logic: 'and',
        actions: [{ type: 'setRequired', target: 'email' }],
      },
    ];
    const values: FormValues = { subscribe: true };

    const { result } = renderHook(() => useConditionalLogic(rules, values));

    expect(result.current.isRequired('email')).toBe(true);
  });

  it('getComputedValue returns setValue action value', () => {
    const rules: ConditionalRule[] = [
      {
        id: 'r1',
        conditions: [{ field: 'country', operator: 'equals', value: 'US' }],
        logic: 'and',
        actions: [{ type: 'setValue', target: 'currency', value: 'USD' }],
      },
    ];
    const values: FormValues = { country: 'US' };

    const { result } = renderHook(() => useConditionalLogic(rules, values));

    expect(result.current.getComputedValue('currency')).toBe('USD');
  });

  it('evaluates AND logic (all conditions must match)', () => {
    const rules: ConditionalRule[] = [
      {
        id: 'r1',
        conditions: [
          { field: 'age', operator: 'greaterThan', value: 18 },
          { field: 'country', operator: 'equals', value: 'US' },
        ],
        logic: 'and',
        actions: [{ type: 'show', target: 'ssn' }],
      },
    ];

    // Only one condition matches -> rule does NOT fire
    const values1: FormValues = { age: 20, country: 'UK' };
    const { result: result1 } = renderHook(() => useConditionalLogic(rules, values1));
    expect(result1.current.activeRules).toHaveLength(0);

    // Both conditions match -> rule fires
    const values2: FormValues = { age: 20, country: 'US' };
    const { result: result2 } = renderHook(() => useConditionalLogic(rules, values2));
    expect(result2.current.activeRules).toHaveLength(1);
  });

  it('evaluates OR logic (any condition matches)', () => {
    const rules: ConditionalRule[] = [
      {
        id: 'r1',
        conditions: [
          { field: 'role', operator: 'equals', value: 'admin' },
          { field: 'role', operator: 'equals', value: 'superadmin' },
        ],
        logic: 'or',
        actions: [{ type: 'show', target: 'adminPanel' }],
      },
    ];

    const values: FormValues = { role: 'admin' };
    const { result } = renderHook(() => useConditionalLogic(rules, values));

    expect(result.current.activeRules).toHaveLength(1);
  });

  it('handles equals operator', () => {
    const rules: ConditionalRule[] = [
      {
        id: 'r1',
        conditions: [{ field: 'status', operator: 'equals', value: 'active' }],
        logic: 'and',
        actions: [{ type: 'hide', target: 'reactivateBtn' }],
      },
    ];

    const values: FormValues = { status: 'active' };
    const { result } = renderHook(() => useConditionalLogic(rules, values));

    expect(result.current.isVisible('reactivateBtn')).toBe(false);
  });

  it('handles notEquals operator', () => {
    const rules: ConditionalRule[] = [
      {
        id: 'r1',
        conditions: [{ field: 'status', operator: 'notEquals', value: 'active' }],
        logic: 'and',
        actions: [{ type: 'show', target: 'reactivateBtn' }],
      },
    ];

    const values: FormValues = { status: 'inactive' };
    const { result } = renderHook(() => useConditionalLogic(rules, values));

    expect(result.current.activeRules).toHaveLength(1);
  });

  it('handles contains operator', () => {
    const rules: ConditionalRule[] = [
      {
        id: 'r1',
        conditions: [{ field: 'tags', operator: 'contains', value: 'urgent' }],
        logic: 'and',
        actions: [{ type: 'show', target: 'priorityBadge' }],
      },
    ];

    // String contains
    const values1: FormValues = { tags: 'urgent-task' };
    const { result: result1 } = renderHook(() => useConditionalLogic(rules, values1));
    expect(result1.current.activeRules).toHaveLength(1);

    // Array contains
    const values2: FormValues = { tags: ['urgent', 'bug'] };
    const { result: result2 } = renderHook(() => useConditionalLogic(rules, values2));
    expect(result2.current.activeRules).toHaveLength(1);
  });

  it('handles isEmpty/isNotEmpty operators', () => {
    const rules: ConditionalRule[] = [
      {
        id: 'r1',
        conditions: [{ field: 'notes', operator: 'isEmpty' }],
        logic: 'and',
        actions: [{ type: 'hide', target: 'notesPreview' }],
      },
      {
        id: 'r2',
        conditions: [{ field: 'name', operator: 'isNotEmpty' }],
        logic: 'and',
        actions: [{ type: 'show', target: 'greeting' }],
      },
    ];

    const values: FormValues = { notes: '', name: 'Alice' };
    const { result } = renderHook(() => useConditionalLogic(rules, values));

    // notes is empty -> hide notesPreview
    expect(result.current.isVisible('notesPreview')).toBe(false);
    // name is not empty -> rule r2 fires
    expect(result.current.activeRules).toHaveLength(2);
  });
});
