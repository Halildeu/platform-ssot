/**
 * Conditional Formatting — Applies style rules to cell values.
 *
 * Wraps an existing cellRenderer with conditional style logic.
 * Rules are evaluated in order; first match wins.
 *
 * @example
 * ```ts
 * {
 *   field: 'salary',
 *   columnType: 'number',
 *   conditionalRules: [
 *     { condition: 'gt', value: 50000, style: { textColor: 'var(--state-success-text)' } },
 *     { condition: 'lt', value: 20000, style: { textColor: 'var(--state-danger-text)' } },
 *   ],
 * }
 * ```
 */

import React from 'react';
import { Badge } from '@mfe/design-system';
import type { ConditionalRule, BadgeVariant } from './types';

type CellParams = { value: unknown; data: unknown };
type CellRenderer = (params: CellParams) => React.ReactNode;

/* ------------------------------------------------------------------ */
/*  Rule evaluator                                                     */
/* ------------------------------------------------------------------ */

function evaluateCondition(
  rule: ConditionalRule,
  value: unknown,
): boolean {
  if (value == null) return false;

  const ruleVal = rule.value;

  switch (rule.condition) {
    case 'eq':
      return String(value) === String(ruleVal);
    case 'neq':
      return String(value) !== String(ruleVal);
    case 'contains':
      return String(value).toLowerCase().includes(String(ruleVal).toLowerCase());
    case 'gt': {
      const num = typeof value === 'number' ? value : Number(value);
      return Number.isFinite(num) && num > Number(ruleVal);
    }
    case 'lt': {
      const num = typeof value === 'number' ? value : Number(value);
      return Number.isFinite(num) && num < Number(ruleVal);
    }
    case 'gte': {
      const num = typeof value === 'number' ? value : Number(value);
      return Number.isFinite(num) && num >= Number(ruleVal);
    }
    case 'lte': {
      const num = typeof value === 'number' ? value : Number(value);
      return Number.isFinite(num) && num <= Number(ruleVal);
    }
    default:
      return false;
  }
}

/**
 * Find first matching rule for a cell value.
 */
export function findMatchingRule(
  rules: ConditionalRule[],
  value: unknown,
): ConditionalRule | null {
  for (const rule of rules) {
    if (evaluateCondition(rule, value)) return rule;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Wrap renderer with conditional styling                             */
/* ------------------------------------------------------------------ */

/**
 * Wraps an existing cellRenderer with conditional formatting.
 * If a rule matches, applies style (color, background, or badge variant).
 * If no rules match, renders normally.
 */
export function withConditionalFormatting(
  baseRenderer: CellRenderer | undefined,
  rules: ConditionalRule[],
): CellRenderer {
  return (params: CellParams) => {
    const match = findMatchingRule(rules, params.value);
    const baseContent = baseRenderer
      ? baseRenderer(params)
      : (params.value != null ? String(params.value) : '-');

    if (!match) return baseContent;

    /* Badge variant override */
    if (match.style.badgeVariant) {
      return (
        <Badge variant={match.style.badgeVariant as BadgeVariant}>
          {typeof baseContent === 'string' ? baseContent : params.value != null ? String(params.value) : '-'}
        </Badge>
      );
    }

    /* Text/background color override */
    const style: React.CSSProperties = {};
    if (match.style.textColor) style.color = match.style.textColor;
    if (match.style.bgColor) {
      style.backgroundColor = match.style.bgColor;
      style.borderRadius = '4px';
      style.padding = '1px 6px';
    }

    return <span style={style}>{baseContent}</span>;
  };
}
