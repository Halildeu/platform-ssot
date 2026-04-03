/**
 * Expression Parser — Validates and parses calculated field expressions.
 *
 * Supports: field references, basic arithmetic (+, -, *, /), parentheses,
 * and simple functions (ROUND, ABS, IF).
 */

/** Extract field names from an expression */
export function extractExpressionFields(expression: string): string[] {
  const matches = expression.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) ?? [];
  const reserved = new Set(['ROUND', 'ABS', 'IF', 'THEN', 'ELSE', 'AND', 'OR', 'NOT', 'NULL', 'TRUE', 'FALSE']);
  return [...new Set(matches.filter((m) => !reserved.has(m.toUpperCase()) && !/^\d/.test(m)))];
}

/** Validate expression syntax */
export function validateExpression(expression: string, availableFields: string[]): string[] {
  const errors: string[] = [];

  if (!expression.trim()) {
    errors.push('İfade boş olamaz');
    return errors;
  }

  const openParens = (expression.match(/\(/g) ?? []).length;
  const closeParens = (expression.match(/\)/g) ?? []).length;
  if (openParens !== closeParens) {
    errors.push('Parantezler dengesiz');
  }

  const fields = extractExpressionFields(expression);
  const fieldSet = new Set(availableFields.map((f) => f.toUpperCase()));
  for (const field of fields) {
    if (!fieldSet.has(field.toUpperCase())) {
      errors.push(`Bilinmeyen alan: ${field}`);
    }
  }

  return errors;
}

/** Simple client-side expression evaluator (for preview only) */
export function evaluateExpression(
  expression: string,
  rowData: Record<string, unknown>,
): number | null {
  try {
    let expr = expression;
    const fields = extractExpressionFields(expression);
    for (const field of fields) {
      const val = rowData[field];
      const num = typeof val === 'number' ? val : Number(val);
      if (!Number.isFinite(num)) return null;
      expr = expr.replace(new RegExp(`\\b${field}\\b`, 'g'), String(num));
    }
    /* Safe eval — only arithmetic */
    if (/[^0-9+\-*/().eE\s]/.test(expr)) return null;
    const result = new Function(`return (${expr})`)();
    return typeof result === 'number' && Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}
