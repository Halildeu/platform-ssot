/* ------------------------------------------------------------------ */
/*  Design Drift Detector                                              */
/*                                                                     */
/*  Detects deviation from design system conventions in source code:   */
/*  hardcoded tokens, wrong patterns, deprecated APIs, style drift.    */
/* ------------------------------------------------------------------ */

export type DriftType = 'token' | 'pattern' | 'api' | 'style';
export type DriftSeverity = 'error' | 'warning' | 'info';

export interface DriftViolation {
  type: DriftType;
  severity: DriftSeverity;
  file?: string;
  line?: number;
  code: string;
  message: string;
  suggestion: string;
}

export interface DriftReport {
  totalViolations: number;
  score: number; // 0-100 (100 = no drift)
  violations: DriftViolation[];
  summary: {
    token: number;
    pattern: number;
    api: number;
    style: number;
  };
}

/* ------------------------------------------------------------------ */
/*  Token drift rules (error)                                          */
/* ------------------------------------------------------------------ */

interface DriftRule {
  type: DriftType;
  severity: DriftSeverity;
  pattern: RegExp;
  message: string;
  suggestion: string;
  /** Optional: skip match if this predicate returns true */
  skip?: (match: RegExpExecArray, line: string) => boolean;
}

const tokenDriftRules: DriftRule[] = [
  {
    type: 'token',
    severity: 'error',
    pattern: /#[0-9a-fA-F]{3,8}\b/g,
    message: 'Hardcoded hex color found',
    suggestion: 'Replace with design token, e.g. var(--color-primary) or theme color',
    skip: (_match, line) => {
      // Allow hex colors inside var() declarations, CSS variable definitions,
      // or in token/theme definition files
      return (
        line.includes('var(') ||
        line.includes('--') ||
        line.includes('palette') ||
        line.includes('token')
      );
    },
  },
  {
    type: 'token',
    severity: 'error',
    // Match spacing properties with hardcoded px values
    pattern: /(?:margin|padding|gap)(?:-(?:top|right|bottom|left|inline|block))?\s*:\s*\d+px/g,
    message: 'Hardcoded pixel value for spacing',
    suggestion: 'Replace with spacing token, e.g. var(--spacing-4) or spacing utility',
  },
  {
    type: 'token',
    severity: 'error',
    pattern: /border-radius\s*:\s*\d+px/g,
    message: 'Hardcoded border-radius',
    suggestion: 'Replace with radius token, e.g. var(--radius-md) or radius utility',
  },
  {
    type: 'token',
    severity: 'error',
    pattern: /font-size\s*:\s*\d+px/g,
    message: 'Hardcoded font-size',
    suggestion: 'Replace with typography token, e.g. var(--font-size-md) or text utility',
  },
];

/* ------------------------------------------------------------------ */
/*  Pattern drift rules (warning)                                      */
/* ------------------------------------------------------------------ */

const patternDriftRules: DriftRule[] = [
  {
    type: 'pattern',
    severity: 'warning',
    pattern: /<input[\s/>]/g,
    message: 'Raw <input> element used instead of design system component',
    suggestion: 'Replace with <Input> or <ConnectedInput> from design system',
    skip: (_match, line) => {
      // Allow if it's already a design system component (PascalCase)
      return /<Input[\s/>]/.test(line) || /<ConnectedInput/.test(line);
    },
  },
  {
    type: 'pattern',
    severity: 'warning',
    pattern: /<button[\s/>]/g,
    message: 'Raw <button> element used instead of design system component',
    suggestion: 'Replace with <Button> from design system',
    skip: (_match, line) => /<Button[\s/>]/.test(line),
  },
  {
    type: 'pattern',
    severity: 'warning',
    pattern: /<select[\s/>]/g,
    message: 'Raw <select> element used instead of design system component',
    suggestion: 'Replace with <Select> from design system',
    skip: (_match, line) => /<Select[\s/>]/.test(line),
  },
  {
    type: 'pattern',
    severity: 'warning',
    pattern: /<table[\s/>]/g,
    message: 'Raw <table> element used instead of design system component',
    suggestion: 'Replace with <TableSimple> or <AgGridServer> from design system',
    skip: (_match, line) => /<TableSimple/.test(line) || /<AgGridServer/.test(line),
  },
  {
    type: 'pattern',
    severity: 'warning',
    pattern: /from\s+['"]antd['"]/g,
    message: 'Direct antd import detected',
    suggestion: 'Use design system components instead of importing directly from antd',
  },
  {
    type: 'pattern',
    severity: 'warning',
    pattern: /from\s+['"]@mui\//g,
    message: 'Direct MUI import detected',
    suggestion: 'Use design system components instead of importing directly from @mui',
  },
];

/* ------------------------------------------------------------------ */
/*  API drift rules (info)                                             */
/* ------------------------------------------------------------------ */

const DEPRECATED_PROPS: Record<string, string> = {
  onChange: 'onValueChange',
  isDisabled: 'disabled',
  isLoading: 'loading',
  isOpen: 'open',
  defaultIsOpen: 'defaultOpen',
  onClose: 'onOpenChange',
};

const apiDriftRules: DriftRule[] = [
  ...Object.entries(DEPRECATED_PROPS).map(
    ([oldProp, newProp]): DriftRule => ({
      type: 'api',
      severity: 'info',
      // Match prop usage in JSX: onChange={...} or onChange="..."
      pattern: new RegExp(`\\b${oldProp}\\s*[={]`, 'g'),
      message: `Deprecated prop "${oldProp}" used`,
      suggestion: `Use "${newProp}" instead of "${oldProp}"`,
      skip: (_match, line) => {
        // Don't flag onChange on standard HTML form elements or event handlers
        if (oldProp === 'onChange') {
          return (
            line.includes('addEventListener') ||
            line.includes('HTMLInputElement') ||
            line.includes('React.ChangeEvent')
          );
        }
        return false;
      },
    }),
  ),
  {
    type: 'api',
    severity: 'info',
    // Match interactive components missing access prop
    pattern: /<(?:Button|Input|Select|Checkbox|Radio|Switch|Toggle)(?:\s[^>]*)?>/g,
    message: 'Interactive component may be missing "access" prop',
    suggestion: 'Add access="full" or appropriate access level to interactive components',
    skip: (_match, line) => line.includes('access=') || line.includes('access '),
  },
];

/* ------------------------------------------------------------------ */
/*  Style drift rules (warning)                                        */
/* ------------------------------------------------------------------ */

const styleDriftRules: DriftRule[] = [
  {
    type: 'style',
    severity: 'warning',
    // Match inline style with color or spacing values
    pattern: /style\s*=\s*\{\s*\{[^}]*(?:color|margin|padding|background|border|fontSize|gap)\s*:/g,
    message: 'Inline style with design token values',
    suggestion: 'Use design tokens or component props instead of inline styles',
  },
  {
    type: 'style',
    severity: 'warning',
    pattern: /!important/g,
    message: '!important usage detected',
    suggestion: 'Avoid !important — use proper CSS specificity or component props',
  },
  {
    type: 'style',
    severity: 'warning',
    // Tailwind color utilities that override design tokens
    pattern: /\b(?:bg|text|border)-(?:red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d{2,3}\b/g,
    message: 'Tailwind utility overriding design tokens',
    suggestion: 'Use semantic design token classes, e.g. bg-action-primary instead of bg-action-primary',
  },
];

/* ------------------------------------------------------------------ */
/*  Scoring                                                            */
/* ------------------------------------------------------------------ */

const SEVERITY_WEIGHT: Record<DriftSeverity, number> = {
  error: 5,
  warning: 3,
  info: 1,
};

function calculateScore(violations: DriftViolation[], totalLines: number): number {
  if (violations.length === 0) return 100;
  const totalWeight = violations.reduce(
    (sum, v) => sum + SEVERITY_WEIGHT[v.severity],
    0,
  );
  // Deduct points relative to code size, capped at 0
  const deduction = Math.min(100, (totalWeight / Math.max(totalLines, 1)) * 100);
  return Math.max(0, Math.round(100 - deduction));
}

/* ------------------------------------------------------------------ */
/*  Main detector                                                      */
/* ------------------------------------------------------------------ */

export function detectDrift(
  code: string,
  options?: { fileName?: string },
): DriftReport {
  const fileName = options?.fileName;
  const lines = code.split('\n');
  const violations: DriftViolation[] = [];

  const allRules: DriftRule[] = [
    ...tokenDriftRules,
    ...patternDriftRules,
    ...apiDriftRules,
    ...styleDriftRules,
  ];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const lineNum = lineIdx + 1;

    for (const rule of allRules) {
      // Reset regex lastIndex for global patterns
      rule.pattern.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = rule.pattern.exec(line)) !== null) {
        if (rule.skip && rule.skip(match, line)) continue;

        violations.push({
          type: rule.type,
          severity: rule.severity,
          file: fileName,
          line: lineNum,
          code: match[0],
          message: rule.message,
          suggestion: rule.suggestion,
        });
      }
    }
  }

  const summary = {
    token: violations.filter((v) => v.type === 'token').length,
    pattern: violations.filter((v) => v.type === 'pattern').length,
    api: violations.filter((v) => v.type === 'api').length,
    style: violations.filter((v) => v.type === 'style').length,
  };

  return {
    totalViolations: violations.length,
    score: calculateScore(violations, lines.length),
    violations,
    summary,
  };
}
