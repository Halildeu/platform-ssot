// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { reviewCode, getReviewRules } from '../design-review';
import { detectPatterns, predictBundleImpact } from '../pattern-detection';
import { calculateContrastRatio, checkContrast, suggestContrastFix } from '../a11y-guardian';

describe('Design Review', () => {
  it('detects hardcoded colors', () => {
    const result = reviewCode('const color = "#ff0000";');
    expect(result.issues.some(i => i.rule === 'hardcoded-color')).toBe(true);
    expect(result.score).toBeLessThan(100);
  });

  it('detects antd imports', () => {
    const result = reviewCode("import { Button } from 'antd';");
    expect(result.issues.some(i => i.rule === 'ant-import')).toBe(true);
  });

  it('detects physical CSS properties', () => {
    const result = reviewCode('className="ml-4 text-left"');
    expect(result.issues.some(i => i.rule === 'physical-css')).toBe(true);
  });

  it('returns score 100 for clean code', () => {
    const result = reviewCode('import { Button } from "@mfe/design-system";\n<Button access="full" variant="primary">OK</Button>');
    expect(result.score).toBe(100);
  });

  it('getReviewRules returns all rules', () => {
    const rules = getReviewRules();
    expect(rules.length).toBeGreaterThanOrEqual(8);
  });

  it('includes line numbers', () => {
    const result = reviewCode('line1\n#ff0000\nline3');
    const colorIssue = result.issues.find(i => i.rule === 'hardcoded-color');
    expect(colorIssue?.line).toBe(2);
  });
});

describe('Pattern Detection', () => {
  it('detects CRUD pattern', () => {
    const predictions = detectPatterns(['EntityGridTemplate', 'FilterBar', 'Button']);
    expect(predictions.length).toBeGreaterThan(0);
    expect(predictions[0].pattern).toBe('CRUD List Page');
  });

  it('suggests missing components', () => {
    const predictions = detectPatterns(['EntityGridTemplate', 'FilterBar']);
    const crud = predictions.find(p => p.pattern === 'CRUD List Page');
    expect(crud?.suggestedComponents.length).toBeGreaterThan(0);
  });

  it('returns empty for no matches', () => {
    const predictions = detectPatterns(['Spinner']);
    expect(predictions).toEqual([]);
  });

  it('sorts by confidence', () => {
    const predictions = detectPatterns(['Input', 'Select', 'Button', 'Card', 'SmartDashboard']);
    for (let i = 1; i < predictions.length; i++) {
      expect(predictions[i].confidence).toBeLessThanOrEqual(predictions[i - 1].confidence);
    }
  });

  it('predictBundleImpact returns KB breakdown', () => {
    const impact = predictBundleImpact(['Button', 'Input', 'DatePicker']);
    expect(impact.totalKB).toBeGreaterThan(0);
    expect(Object.keys(impact.breakdown).length).toBe(3);
  });
});

describe('A11y Guardian', () => {
  it('calculates contrast ratio correctly', () => {
    // Black on white = 21:1
    const ratio = calculateContrastRatio('#000000', '#ffffff');
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('white on white = 1:1', () => {
    const ratio = calculateContrastRatio('#ffffff', '#ffffff');
    expect(ratio).toBeCloseTo(1, 0);
  });

  it('checkContrast passes for good contrast', () => {
    const issue = checkContrast('#000000', '#ffffff', 'AA');
    expect(issue).toBeNull();
  });

  it('checkContrast fails for poor contrast', () => {
    const issue = checkContrast('#cccccc', '#ffffff', 'AA');
    expect(issue).not.toBeNull();
    expect(issue?.ratio).toBeLessThan(4.5);
  });

  it('suggestContrastFix returns valid hex color', () => {
    const fixed = suggestContrastFix('#cccccc', '#ffffff', 'AA');
    expect(fixed).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('suggested fix meets contrast requirement', () => {
    const fixed = suggestContrastFix('#cccccc', '#ffffff', 'AA');
    const ratio = calculateContrastRatio(fixed, '#ffffff');
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
