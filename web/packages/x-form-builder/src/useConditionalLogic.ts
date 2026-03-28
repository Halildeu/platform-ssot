import { useMemo } from 'react';
import type { ConditionalRule, FormValues } from './types';

/* ------------------------------------------------------------------ */
/*  useConditionalLogic — Evaluate conditional rules against form data */
/* ------------------------------------------------------------------ */

/** Evaluate a single condition against the current form values. */
function evaluateCondition(
  condition: ConditionalRule['conditions'][number],
  values: FormValues,
): boolean {
  const current = values[condition.field];

  switch (condition.operator) {
    case 'equals':
      return current === condition.value;
    case 'notEquals':
      return current !== condition.value;
    case 'contains':
      return typeof current === 'string'
        ? current.includes(String(condition.value))
        : Array.isArray(current) && current.includes(condition.value);
    case 'greaterThan':
      return Number(current) > Number(condition.value);
    case 'lessThan':
      return Number(current) < Number(condition.value);
    case 'isEmpty':
      return current === undefined || current === null || current === '' || (Array.isArray(current) && current.length === 0);
    case 'isNotEmpty':
      return current !== undefined && current !== null && current !== '' && !(Array.isArray(current) && current.length === 0);
    default:
      return true;
  }
}

/** Evaluate all conditions of a rule using AND/OR logic. */
function evaluateRule(rule: ConditionalRule, values: FormValues): boolean {
  const results = rule.conditions.map((c) => evaluateCondition(c, values));
  return rule.logic === 'and' ? results.every(Boolean) : results.some(Boolean);
}

export interface ConditionalLogicResult {
  /** Whether a field should be visible (not hidden by a rule). */
  isVisible: (fieldId: string) => boolean;
  /** Whether a field should be enabled (not disabled by a rule). */
  isEnabled: (fieldId: string) => boolean;
  /** Whether a field is required due to a conditional rule. */
  isRequired: (fieldId: string) => boolean;
  /** Get a computed value for a field if a setValue action is active. */
  getComputedValue: (fieldId: string) => unknown | undefined;
  /** Rules whose conditions currently evaluate to true. */
  activeRules: ConditionalRule[];
}

export function useConditionalLogic(
  rules: ConditionalRule[],
  values: FormValues,
): ConditionalLogicResult {
  const { activeRules, hiddenFields, disabledFields, requiredFields, computedValues } =
    useMemo(() => {
      const active: ConditionalRule[] = [];
      const hidden = new Set<string>();
      const disabled = new Set<string>();
      const required = new Set<string>();
      const computed = new Map<string, unknown>();

      for (const rule of rules) {
        if (!evaluateRule(rule, values)) continue;

        active.push(rule);

        for (const action of rule.actions) {
          switch (action.type) {
            case 'show':
              // Explicitly show — remove from hidden if previously hidden
              hidden.delete(action.target);
              break;
            case 'hide':
              hidden.add(action.target);
              break;
            case 'enable':
              disabled.delete(action.target);
              break;
            case 'disable':
              disabled.add(action.target);
              break;
            case 'setValue':
              computed.set(action.target, action.value);
              break;
            case 'setRequired':
              required.add(action.target);
              break;
          }
        }
      }

      return {
        activeRules: active,
        hiddenFields: hidden,
        disabledFields: disabled,
        requiredFields: required,
        computedValues: computed,
      };
    }, [rules, values]);

  const isVisible = useMemo(
    () => (fieldId: string) => !hiddenFields.has(fieldId),
    [hiddenFields],
  );

  const isEnabled = useMemo(
    () => (fieldId: string) => !disabledFields.has(fieldId),
    [disabledFields],
  );

  const isRequired = useMemo(
    () => (fieldId: string) => requiredFields.has(fieldId),
    [requiredFields],
  );

  const getComputedValue = useMemo(
    () => (fieldId: string) => computedValues.get(fieldId),
    [computedValues],
  );

  return { isVisible, isEnabled, isRequired, getComputedValue, activeRules };
}
