// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { evaluateConditionalRules, type ConditionalRule } from '../useConditionalLogic';

describe('evaluateConditionalRules', () => {
  it('hides field when condition matches (AND)', () => {
    const rules: ConditionalRule[] = [{
      conditions: [{ field: 'type', operator: 'equals', value: 'simple' }],
      logic: 'and',
      actions: [{ type: 'hide', target: 'advancedOptions' }],
    }];
    const result = evaluateConditionalRules(rules, { type: 'simple' });
    expect(result.isVisible('advancedOptions')).toBe(false);
  });

  it('shows field when condition does not match', () => {
    const rules: ConditionalRule[] = [{
      conditions: [{ field: 'type', operator: 'equals', value: 'simple' }],
      logic: 'and',
      actions: [{ type: 'hide', target: 'advancedOptions' }],
    }];
    const result = evaluateConditionalRules(rules, { type: 'advanced' });
    expect(result.isVisible('advancedOptions')).toBe(true);
  });

  it('OR logic: any condition triggers action', () => {
    const rules: ConditionalRule[] = [{
      conditions: [
        { field: 'role', operator: 'equals', value: 'admin' },
        { field: 'role', operator: 'equals', value: 'superadmin' },
      ],
      logic: 'or',
      actions: [{ type: 'show', target: 'permissions' }],
    }];
    const result = evaluateConditionalRules(rules, { role: 'superadmin' });
    expect(result.isVisible('permissions')).toBe(true);
  });

  it('disables field', () => {
    const rules: ConditionalRule[] = [{
      conditions: [{ field: 'locked', operator: 'equals', value: true }],
      logic: 'and',
      actions: [{ type: 'disable', target: 'name' }],
    }];
    const result = evaluateConditionalRules(rules, { locked: true });
    expect(result.isEnabled('name')).toBe(false);
  });

  it('sets computed value', () => {
    const rules: ConditionalRule[] = [{
      conditions: [{ field: 'country', operator: 'equals', value: 'TR' }],
      logic: 'and',
      actions: [{ type: 'setValue', target: 'currency', value: 'TRY' }],
    }];
    const result = evaluateConditionalRules(rules, { country: 'TR' });
    expect(result.computedValues.currency).toBe('TRY');
  });

  it('setRequired makes field required', () => {
    const rules: ConditionalRule[] = [{
      conditions: [{ field: 'hasNotes', operator: 'equals', value: true }],
      logic: 'and',
      actions: [{ type: 'setRequired', target: 'notes' }],
    }];
    const result = evaluateConditionalRules(rules, { hasNotes: true });
    expect(result.isRequired('notes')).toBe(true);
  });

  it('isEmpty operator works', () => {
    const rules: ConditionalRule[] = [{
      conditions: [{ field: 'email', operator: 'isEmpty' }],
      logic: 'and',
      actions: [{ type: 'hide', target: 'emailConfirm' }],
    }];
    const result = evaluateConditionalRules(rules, { email: '' });
    expect(result.isVisible('emailConfirm')).toBe(false);
  });

  it('isNotEmpty operator works', () => {
    const rules: ConditionalRule[] = [{
      conditions: [{ field: 'email', operator: 'isNotEmpty' }],
      logic: 'and',
      actions: [{ type: 'show', target: 'emailConfirm' }],
    }];
    const result = evaluateConditionalRules(rules, { email: 'test@test.com' });
    expect(result.isVisible('emailConfirm')).toBe(true);
  });

  it('greaterThan operator works', () => {
    const rules: ConditionalRule[] = [{
      conditions: [{ field: 'age', operator: 'greaterThan', value: 18 }],
      logic: 'and',
      actions: [{ type: 'show', target: 'drivingLicense' }],
    }];
    const result = evaluateConditionalRules(rules, { age: 25 });
    expect(result.isVisible('drivingLicense')).toBe(true);
  });

  it('contains operator works', () => {
    const rules: ConditionalRule[] = [{
      conditions: [{ field: 'tags', operator: 'contains', value: 'vip' }],
      logic: 'and',
      actions: [{ type: 'show', target: 'vipPerks' }],
    }];
    const result = evaluateConditionalRules(rules, { tags: 'vip,gold' });
    expect(result.isVisible('vipPerks')).toBe(true);
  });

  it('handles empty rules', () => {
    const result = evaluateConditionalRules([], { any: 'value' });
    expect(result.isVisible('anything')).toBe(true);
    expect(result.isEnabled('anything')).toBe(true);
  });

  it('multiple rules compose correctly', () => {
    const rules: ConditionalRule[] = [
      { conditions: [{ field: 'a', operator: 'equals', value: 1 }], logic: 'and', actions: [{ type: 'hide', target: 'x' }] },
      { conditions: [{ field: 'b', operator: 'equals', value: 2 }], logic: 'and', actions: [{ type: 'disable', target: 'y' }] },
    ];
    const result = evaluateConditionalRules(rules, { a: 1, b: 2 });
    expect(result.isVisible('x')).toBe(false);
    expect(result.isEnabled('y')).toBe(false);
    expect(result.isVisible('y')).toBe(true); // not hidden, just disabled
  });
});
