/* Design Review Engine — automated design system usage quality analysis */

export type ReviewSeverity = 'error' | 'warning' | 'info';

export interface ReviewIssue {
  rule: string;
  severity: ReviewSeverity;
  message: string;
  line?: number;
  fix?: string;
}

export interface ReviewResult {
  score: number; // 0-100
  issues: ReviewIssue[];
  summary: string;
}

/** Anti-pattern detection rules */
const RULES: Array<{ id: string; severity: ReviewSeverity; pattern: RegExp; message: string; fix: string }> = [
  { id: 'hardcoded-color', severity: 'error', pattern: /#[0-9a-fA-F]{3,8}\b/g, message: 'Hardcoded color detected', fix: 'Use CSS variable: var(--surface-*) or var(--text-*)' },
  { id: 'hardcoded-px', severity: 'warning', pattern: /(?<!\w)(\d+)px(?!\w)/g, message: 'Hardcoded pixel value', fix: 'Use spacing token or Tailwind utility' },
  { id: 'inline-style-color', severity: 'error', pattern: /style=\{[^}]*color\s*:/g, message: 'Inline style with color property', fix: 'Use className with CSS variable' },
  { id: 'no-aria-label', severity: 'warning', pattern: /<(button|a|input|select)(?![^>]*aria-label)(?![^>]*aria-labelledby)[^>]*>/g, message: 'Interactive element may be missing accessible label', fix: 'Add aria-label or aria-labelledby prop' },
  { id: 'ant-import', severity: 'error', pattern: /from ['"]antd['"]/g, message: 'Ant Design import detected — use @mfe/design-system', fix: 'Replace with @mfe/design-system equivalent' },
  { id: 'mui-import', severity: 'error', pattern: /from ['"]@mui\//g, message: 'MUI import detected — use @mfe/design-system', fix: 'Replace with @mfe/design-system equivalent' },
  { id: 'physical-css', severity: 'warning', pattern: /\b(ml-|mr-|pl-|pr-|text-left|text-right|border-l-|border-r-)\d/g, message: 'Physical CSS property (not RTL-safe)', fix: 'Use logical properties: ms-/me-/ps-/pe-/text-start/text-end/border-s-/border-e-' },
  { id: 'missing-access-control', severity: 'info', pattern: /<(Button|Input|Select|Switch|Checkbox)(?![^>]*access=)[^>]*>/g, message: 'Component may benefit from access control prop', fix: 'Consider adding access prop for permission-aware rendering' },
  { id: 'raw-html-input', severity: 'warning', pattern: /<input(?![^>]*className)[^>]*>/g, message: 'Raw HTML <input> — use design-system Input component', fix: 'Replace with <Input /> from @mfe/design-system' },
  { id: 'raw-html-button', severity: 'warning', pattern: /<button(?![^>]*className)[^>]*>/g, message: 'Raw HTML <button> — use design-system Button component', fix: 'Replace with <Button /> from @mfe/design-system' },
];

/**
 * Review source code for design system usage quality.
 * Returns a score (0-100) and list of issues found.
 */
export function reviewCode(source: string, filePath = 'unknown'): ReviewResult {
  const issues: ReviewIssue[] = [];

  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = rule.pattern.exec(source)) !== null) {
      const lineNumber = source.substring(0, match.index).split('\n').length;
      issues.push({
        rule: rule.id,
        severity: rule.severity,
        message: `${rule.message}: "${match[0]}"`,
        line: lineNumber,
        fix: rule.fix,
      });
    }
  }

  // Score: start at 100, subtract per issue
  const errorPenalty = issues.filter(i => i.severity === 'error').length * 10;
  const warningPenalty = issues.filter(i => i.severity === 'warning').length * 5;
  const infoPenalty = issues.filter(i => i.severity === 'info').length * 1;
  const score = Math.max(0, 100 - errorPenalty - warningPenalty - infoPenalty);

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;

  return {
    score,
    issues,
    summary: issues.length === 0
      ? `${filePath}: Clean — no design system issues found (score: 100/100)`
      : `${filePath}: ${errorCount} errors, ${warningCount} warnings (score: ${score}/100)`,
  };
}

/** Get list of rule IDs for documentation. */
export function getReviewRules(): Array<{ id: string; severity: ReviewSeverity; description: string }> {
  return RULES.map(r => ({ id: r.id, severity: r.severity, description: r.message }));
}
