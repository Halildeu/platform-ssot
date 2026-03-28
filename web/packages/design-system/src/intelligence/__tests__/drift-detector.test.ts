// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { detectDrift } from '../drift-detector';
import type { DriftReport } from '../drift-detector';

/* ------------------------------------------------------------------ */
/*  Token drift tests                                                  */
/* ------------------------------------------------------------------ */

describe('Token drift detection', () => {
  it('detects hardcoded hex colors', () => {
    const report = detectDrift('const color = "var(--state-danger-text)";');
    const tokenViolations = report.violations.filter((v) => v.type === 'token');
    expect(tokenViolations.length).toBeGreaterThan(0);
    expect(tokenViolations[0].message).toContain('hex color');
  });

  it('detects 3-digit hex colors', () => {
    const report = detectDrift('background: var(--state-danger-text);');
    const tokenViolations = report.violations.filter(
      (v) => v.type === 'token' && v.message.includes('hex color'),
    );
    expect(tokenViolations.length).toBeGreaterThan(0);
  });

  it('ignores hex colors inside var() context', () => {
    const report = detectDrift('color: var(--color-primary));');
    const hexViolations = report.violations.filter(
      (v) => v.type === 'token' && v.message.includes('hex color'),
    );
    expect(hexViolations).toHaveLength(0);
  });

  it('detects hardcoded spacing px values', () => {
    const report = detectDrift('margin: 16px;');
    const spacingViolations = report.violations.filter(
      (v) => v.type === 'token' && v.message.includes('spacing'),
    );
    expect(spacingViolations.length).toBeGreaterThan(0);
  });

  it('detects hardcoded padding', () => {
    const report = detectDrift('padding-left: 8px;');
    const spacingViolations = report.violations.filter(
      (v) => v.type === 'token' && v.message.includes('spacing'),
    );
    expect(spacingViolations.length).toBeGreaterThan(0);
  });

  it('detects hardcoded border-radius', () => {
    const report = detectDrift('border-radius: 4px;');
    const violations = report.violations.filter(
      (v) => v.type === 'token' && v.message.includes('border-radius'),
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it('detects hardcoded font-size', () => {
    const report = detectDrift('font-size: 14px;');
    const violations = report.violations.filter(
      (v) => v.type === 'token' && v.message.includes('font-size'),
    );
    expect(violations.length).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Pattern drift tests                                                */
/* ------------------------------------------------------------------ */

describe('Pattern drift detection', () => {
  it('detects raw <input> element', () => {
    const report = detectDrift('<input type="text" />');
    const patternViolations = report.violations.filter(
      (v) => v.type === 'pattern' && v.message.includes('<input>'),
    );
    expect(patternViolations.length).toBeGreaterThan(0);
  });

  it('does not flag <Input> (PascalCase)', () => {
    const report = detectDrift('<Input type="text" />');
    const patternViolations = report.violations.filter(
      (v) => v.type === 'pattern' && v.message.includes('<input>'),
    );
    expect(patternViolations).toHaveLength(0);
  });

  it('detects raw <button> element', () => {
    const report = detectDrift('<button onClick={fn}>Click</button>');
    const violations = report.violations.filter(
      (v) => v.type === 'pattern' && v.message.includes('<button>'),
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it('detects raw <select> element', () => {
    const report = detectDrift('<select name="opt"></select>');
    const violations = report.violations.filter(
      (v) => v.type === 'pattern' && v.message.includes('<select>'),
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it('detects raw <table> element', () => {
    const report = detectDrift('<table><tr><td>Cell</td></tr></table>');
    const violations = report.violations.filter(
      (v) => v.type === 'pattern' && v.message.includes('<table>'),
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it('detects antd import', () => {
    const report = detectDrift("import { Button } from 'antd';");
    const violations = report.violations.filter(
      (v) => v.type === 'pattern' && v.message.includes('antd'),
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it('detects @mui import', () => {
    const report = detectDrift("import { Box } from '@mui/material';");
    const violations = report.violations.filter(
      (v) => v.type === 'pattern' && v.message.includes('MUI'),
    );
    expect(violations.length).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/*  API drift tests                                                    */
/* ------------------------------------------------------------------ */

describe('API drift detection', () => {
  it('detects deprecated onChange prop on component', () => {
    const report = detectDrift('<Select onChange={handleChange} />');
    const apiViolations = report.violations.filter(
      (v) => v.type === 'api' && v.message.includes('onChange'),
    );
    expect(apiViolations.length).toBeGreaterThan(0);
  });

  it('detects deprecated isDisabled prop', () => {
    const report = detectDrift('<Button isDisabled={true} />');
    const violations = report.violations.filter(
      (v) => v.type === 'api' && v.message.includes('isDisabled'),
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it('detects missing access prop on interactive components', () => {
    const report = detectDrift('<Button variant="primary">Click</Button>');
    const violations = report.violations.filter(
      (v) => v.type === 'api' && v.message.includes('access'),
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it('does not flag component with access prop', () => {
    const report = detectDrift('<Button access="full" variant="primary">Click</Button>');
    const violations = report.violations.filter(
      (v) => v.type === 'api' && v.message.includes('access'),
    );
    expect(violations).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Style drift tests                                                  */
/* ------------------------------------------------------------------ */

describe('Style drift detection', () => {
  it('detects inline style with color values', () => {
    const report = detectDrift('style={{ color: "red", padding: 16 }}');
    const violations = report.violations.filter(
      (v) => v.type === 'style' && v.message.includes('Inline style'),
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it('detects !important usage', () => {
    const report = detectDrift('.override { color: red !important; }');
    const violations = report.violations.filter(
      (v) => v.type === 'style' && v.message.includes('!important'),
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it('detects Tailwind color utilities overriding tokens', () => {
    const report = detectDrift('<div className="bg-action-primary text-text-inverse" />');
    const violations = report.violations.filter(
      (v) => v.type === 'style' && v.message.includes('Tailwind'),
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it('detects multiple Tailwind violations on one line', () => {
    const report = detectDrift('<div className="bg-state-danger-text text-state-success-text border-border-subtle" />');
    const violations = report.violations.filter(
      (v) => v.type === 'style' && v.message.includes('Tailwind'),
    );
    expect(violations.length).toBeGreaterThanOrEqual(3);
  });
});

/* ------------------------------------------------------------------ */
/*  Score and report structure tests                                   */
/* ------------------------------------------------------------------ */

describe('Drift report', () => {
  it('returns score 100 for clean code', () => {
    const report = detectDrift(
      'import { Button } from "@mfe/design-system";\n<Button access="full" variant="primary">OK</Button>',
    );
    expect(report.score).toBe(100);
    expect(report.totalViolations).toBe(0);
  });

  it('returns correct summary breakdown', () => {
    const report = detectDrift(
      'color: var(--state-danger-text);\n<input type="text" />\nonChange={fn}\n!important;',
    );
    expect(report.summary.token).toBeGreaterThan(0);
    expect(report.summary.pattern).toBeGreaterThan(0);
    expect(report.summary.api).toBeGreaterThan(0);
    expect(report.summary.style).toBeGreaterThan(0);
  });

  it('totalViolations matches violations array length', () => {
    const report = detectDrift('var(--surface-default);\nmargin: 8px;\n<button>Click</button>');
    expect(report.totalViolations).toBe(report.violations.length);
  });

  it('score decreases with more violations', () => {
    const clean = detectDrift('const x = 1;');
    const dirty = detectDrift(
      'var(--state-danger-text);\nvar(--state-success-text);\nvar(--action-primary);\nmargin: 16px;\npadding: 8px;\nborder-radius: 4px;\nfont-size: 14px;',
    );
    expect(dirty.score).toBeLessThan(clean.score);
  });

  it('includes file name in violations when provided', () => {
    const report = detectDrift('var(--state-danger-text);', { fileName: 'App.tsx' });
    const hexViolation = report.violations.find((v) => v.message.includes('hex'));
    expect(hexViolation?.file).toBe('App.tsx');
  });

  it('includes line numbers in violations', () => {
    const report = detectDrift('line1\nvar(--state-danger-text);\nline3');
    const hexViolation = report.violations.find((v) => v.message.includes('hex'));
    expect(hexViolation?.line).toBe(2);
  });

  it('score is between 0 and 100', () => {
    const report = detectDrift(
      Array(50).fill('var(--state-danger-text);\nmargin: 16px;\n<button>X</button>').join('\n'),
    );
    expect(report.score).toBeGreaterThanOrEqual(0);
    expect(report.score).toBeLessThanOrEqual(100);
  });
});
