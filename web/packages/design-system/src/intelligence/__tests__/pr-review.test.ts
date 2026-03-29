import { describe, it, expect } from 'vitest';
import { reviewCode, getReviewRules } from '../design-review';

/* ------------------------------------------------------------------ */
/*  Helper: run reviewCode and find issues by rule id                  */
/* ------------------------------------------------------------------ */

function findIssues(source: string, ruleId: string) {
  const result = reviewCode(source, 'test.tsx');
  return result.issues.filter(i => i.rule === ruleId);
}

/* ================================================================== */
/*  Rule 1: hardcoded-color                                            */
/* ================================================================== */

describe('hardcoded-color', () => {
  it('detects hex color in JSX', () => {
    const issues = findIssues('<div style={{ color: "#ff5500" }} />', 'hardcoded-color');
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe('error');
  });

  it('detects short hex color', () => {
    const issues = findIssues('<div style={{ color: "#f00" }} />', 'hardcoded-color');
    expect(issues.length).toBeGreaterThanOrEqual(1);
  });

  it('ignores CSS variables', () => {
    const issues = findIssues('var(--surface-primary)', 'hardcoded-color');
    expect(issues.length).toBe(0);
  });
});

/* ================================================================== */
/*  Rule 2: hardcoded-px                                               */
/* ================================================================== */

describe('hardcoded-px', () => {
  it('detects hardcoded pixel values', () => {
    const issues = findIssues('<div style={{ width: "200px" }} />', 'hardcoded-px');
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe('warning');
  });

  it('detects px in className', () => {
    const issues = findIssues('<div className="w-[100px]" />', 'hardcoded-px');
    expect(issues.length).toBeGreaterThanOrEqual(1);
  });
});

/* ================================================================== */
/*  Rule 3: inline-style-color                                         */
/* ================================================================== */

describe('inline-style-color', () => {
  it('detects inline style color', () => {
    const issues = findIssues('<div style={{ color: "red" }} />', 'inline-style-color');
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe('error');
  });

  it('does not flag className usage', () => {
    const issues = findIssues('<div className="text-primary" />', 'inline-style-color');
    expect(issues.length).toBe(0);
  });
});

/* ================================================================== */
/*  Rule 4: no-aria-label                                              */
/* ================================================================== */

describe('no-aria-label', () => {
  it('detects missing aria-label on button', () => {
    const issues = findIssues('<button>Click</button>', 'no-aria-label');
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe('warning');
  });

  it('passes when aria-label is present', () => {
    const issues = findIssues('<button aria-label="Submit">Click</button>', 'no-aria-label');
    expect(issues.length).toBe(0);
  });

  it('detects missing aria-label on input', () => {
    const issues = findIssues('<input type="text" />', 'no-aria-label');
    expect(issues.length).toBeGreaterThanOrEqual(1);
  });
});

/* ================================================================== */
/*  Rule 5: ant-import                                                 */
/* ================================================================== */

describe('ant-import', () => {
  it('detects antd import', () => {
    const issues = findIssues("import { Button } from 'antd';", 'ant-import');
    expect(issues.length).toBe(1);
    expect(issues[0].severity).toBe('error');
  });

  it('ignores design system import', () => {
    const issues = findIssues("import { Button } from '@mfe/design-system';", 'ant-import');
    expect(issues.length).toBe(0);
  });
});

/* ================================================================== */
/*  Rule 6: mui-import                                                 */
/* ================================================================== */

describe('mui-import', () => {
  it('detects MUI import', () => {
    const issues = findIssues("import { TextField } from '@mui/material';", 'mui-import');
    expect(issues.length).toBe(1);
    expect(issues[0].severity).toBe('error');
  });
});

/* ================================================================== */
/*  Rule 7: physical-css                                               */
/* ================================================================== */

describe('physical-css', () => {
  it('detects physical margin class', () => {
    const issues = findIssues('<div className="ml-4" />', 'physical-css');
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe('warning');
  });

  it('detects text-left', () => {
    const issues = findIssues('<div className="text-left1" />', 'physical-css');
    expect(issues.length).toBeGreaterThanOrEqual(1);
  });

  it('does not flag logical properties', () => {
    const issues = findIssues('<div className="ms-4 me-2 ps-2 pe-3" />', 'physical-css');
    expect(issues.length).toBe(0);
  });
});

/* ================================================================== */
/*  Rule 8: missing-access-control                                     */
/* ================================================================== */

describe('missing-access-control', () => {
  it('detects Button without access prop', () => {
    const issues = findIssues('<Button variant="primary">Save</Button>', 'missing-access-control');
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe('info');
  });

  it('passes when access prop present', () => {
    const issues = findIssues('<Button access="admin">Save</Button>', 'missing-access-control');
    expect(issues.length).toBe(0);
  });
});

/* ================================================================== */
/*  Rule 9: raw-html-input                                             */
/* ================================================================== */

describe('raw-html-input', () => {
  it('detects raw <input> without className', () => {
    const issues = findIssues('<input type="text" />', 'raw-html-input');
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe('warning');
  });

  it('passes when className present', () => {
    const issues = findIssues('<input className="custom" type="text" />', 'raw-html-input');
    expect(issues.length).toBe(0);
  });
});

/* ================================================================== */
/*  Rule 10: raw-html-button                                           */
/* ================================================================== */

describe('raw-html-button', () => {
  it('detects raw <button> without className', () => {
    const issues = findIssues('<button>Click</button>', 'raw-html-button');
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe('warning');
  });

  it('passes when className present', () => {
    const issues = findIssues('<button className="btn">Click</button>', 'raw-html-button');
    expect(issues.length).toBe(0);
  });
});

/* ================================================================== */
/*  Rule 11: missing-forward-ref                                       */
/* ================================================================== */

describe('missing-forward-ref', () => {
  it('detects exported function component without forwardRef', () => {
    const code = `export const MyButton = (props) => { return <button>OK</button>; }`;
    const issues = findIssues(code, 'missing-forward-ref');
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe('info');
  });

  it('skips when forwardRef is used', () => {
    const code = `export const MyButton = forwardRef((props, ref) => { return <button ref={ref}>OK</button>; })`;
    const issues = findIssues(code, 'missing-forward-ref');
    expect(issues.length).toBe(0);
  });
});

/* ================================================================== */
/*  Rule 12: missing-locale-text                                       */
/* ================================================================== */

describe('missing-locale-text', () => {
  it('detects hardcoded Turkish text in JSX', () => {
    const code = `<h1> Bu bir uzun Turkce test cumlesidir </h1>`;
    const issues = findIssues(code, 'missing-locale-text');
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe('info');
  });

  it('detects hardcoded English text in JSX', () => {
    const code = `<p> This is a long hardcoded English text string </p>`;
    const issues = findIssues(code, 'missing-locale-text');
    expect(issues.length).toBeGreaterThanOrEqual(1);
  });

  it('does not flag short text', () => {
    const code = `<span>OK</span>`;
    const issues = findIssues(code, 'missing-locale-text');
    expect(issues.length).toBe(0);
  });

  it('does not flag translated text', () => {
    const code = `<span>{t('some_key')}</span>`;
    const issues = findIssues(code, 'missing-locale-text');
    expect(issues.length).toBe(0);
  });
});

/* ================================================================== */
/*  Rule 13: missing-error-boundary                                    */
/* ================================================================== */

describe('missing-error-boundary', () => {
  it('detects useEffect with fetch but no try/catch', () => {
    const code = `useEffect(() => { fetch('/api/data').then(r => r.json()); }, []);`;
    const issues = findIssues(code, 'missing-error-boundary');
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe('warning');
  });

  it('detects useEffect with await but no try/catch', () => {
    const code = `useEffect(async () => { const d = await fetchData(); }, []);`;
    const issues = findIssues(code, 'missing-error-boundary');
    expect(issues.length).toBeGreaterThanOrEqual(1);
  });
});

/* ================================================================== */
/*  Rule 14: excessive-rerender-risk                                   */
/* ================================================================== */

describe('excessive-rerender-risk', () => {
  it('detects inline object literal in JSX prop', () => {
    const code = `<MyComponent config={{ key: 'value' }} />`;
    const issues = findIssues(code, 'excessive-rerender-risk');
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe('warning');
  });

  it('detects inline array literal in JSX prop', () => {
    const code = `<MyComponent items={[ 1, 2, 3 ]} />`;
    const issues = findIssues(code, 'excessive-rerender-risk');
    expect(issues.length).toBeGreaterThanOrEqual(1);
  });

  it('does not flag variable reference in prop', () => {
    const code = `<MyComponent config={myConfig} />`;
    const issues = findIssues(code, 'excessive-rerender-risk');
    expect(issues.length).toBe(0);
  });
});

/* ================================================================== */
/*  Rule 15: missing-display-name                                      */
/* ================================================================== */

describe('missing-display-name', () => {
  it('detects forwardRef without displayName', () => {
    const code = `const MyComp = forwardRef((props, ref) => <div ref={ref} />);`;
    const issues = findIssues(code, 'missing-display-name');
    expect(issues.length).toBeGreaterThanOrEqual(1);
    expect(issues[0].severity).toBe('info');
  });

  it('skips when displayName is set', () => {
    const code = `const MyComp = forwardRef((props, ref) => <div ref={ref} />);\nMyComp.displayName = 'MyComp';`;
    const issues = findIssues(code, 'missing-display-name');
    expect(issues.length).toBe(0);
  });
});

/* ================================================================== */
/*  Score calculation                                                  */
/* ================================================================== */

describe('score calculation', () => {
  it('returns 100 for clean code', () => {
    const result = reviewCode('<div className="p-4">OK</div>', 'clean.tsx');
    expect(result.score).toBe(100);
    expect(result.issues.length).toBe(0);
  });

  it('subtracts 10 per error', () => {
    const result = reviewCode("import { X } from 'antd'; import { Y } from 'antd';", 'test.tsx');
    const errorCount = result.issues.filter(i => i.severity === 'error').length;
    expect(errorCount).toBe(2);
    expect(result.score).toBe(100 - errorCount * 10);
  });

  it('subtracts 5 per warning', () => {
    const result = reviewCode('<button>A</button>\n<button>B</button>', 'test.tsx');
    const warningCount = result.issues.filter(i => i.severity === 'warning').length;
    expect(warningCount).toBeGreaterThanOrEqual(2);
  });

  it('subtracts 1 per info', () => {
    const code = `export const A = (props) => <div />`;
    const result = reviewCode(code, 'test.tsx');
    const infoCount = result.issues.filter(i => i.severity === 'info').length;
    expect(infoCount).toBeGreaterThanOrEqual(1);
  });

  it('never goes below 0', () => {
    // Multiple errors to push score below 0
    const code = Array(20).fill("import { X } from 'antd';").join('\n');
    const result = reviewCode(code, 'test.tsx');
    expect(result.score).toBe(0);
  });
});

/* ================================================================== */
/*  Summary / report                                                   */
/* ================================================================== */

describe('summary and report', () => {
  it('includes file path in summary', () => {
    const result = reviewCode('<div />', 'my-component.tsx');
    expect(result.summary).toContain('my-component.tsx');
  });

  it('shows clean message for no issues', () => {
    const result = reviewCode('<div className="p-4" />', 'clean.tsx');
    expect(result.summary).toContain('Clean');
    expect(result.summary).toContain('100/100');
  });

  it('shows error/warning count in summary', () => {
    const result = reviewCode("import { X } from 'antd';\n<button>A</button>", 'test.tsx');
    expect(result.summary).toMatch(/\d+ errors/);
    expect(result.summary).toMatch(/\d+ warnings/);
  });

  it('includes line numbers in issues', () => {
    const code = "line1\nimport { X } from 'antd';\nline3";
    const result = reviewCode(code, 'test.tsx');
    const antIssue = result.issues.find(i => i.rule === 'ant-import');
    expect(antIssue?.line).toBe(2);
  });

  it('includes fix suggestion in issues', () => {
    const result = reviewCode("import { X } from 'antd';", 'test.tsx');
    const antIssue = result.issues.find(i => i.rule === 'ant-import');
    expect(antIssue?.fix).toBeTruthy();
    expect(antIssue?.fix).toContain('@mfe/design-system');
  });
});

/* ================================================================== */
/*  getReviewRules                                                     */
/* ================================================================== */

describe('getReviewRules', () => {
  it('returns all 15 rules', () => {
    const rules = getReviewRules();
    expect(rules.length).toBe(15);
  });

  it('each rule has id, severity, description', () => {
    const rules = getReviewRules();
    for (const rule of rules) {
      expect(rule.id).toBeTruthy();
      expect(['error', 'warning', 'info']).toContain(rule.severity);
      expect(rule.description).toBeTruthy();
    }
  });

  it('includes all new rule IDs', () => {
    const rules = getReviewRules();
    const ids = rules.map(r => r.id);
    expect(ids).toContain('missing-forward-ref');
    expect(ids).toContain('missing-locale-text');
    expect(ids).toContain('missing-error-boundary');
    expect(ids).toContain('excessive-rerender-risk');
    expect(ids).toContain('missing-display-name');
  });
});
