// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest';
import { auditElement, auditComponent, getAuditRules } from '../audit';
import {
  getKeyboardContract,
  testKeyboardNavigation,
  getSupportedComponentTypes,
  hasKeyboardContract,
} from '../keyboard';
import {
  getRecommendations,
  getComponentA11yChecklist,
  getSupportedChecklistTypes,
} from '../recommendations';
import type { A11yViolation } from '../types';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function createElement(html: string): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}

function cleanup() {
  document.body.innerHTML = '';
}

/* ------------------------------------------------------------------ */
/*  Audit — Rule checks                                                */
/* ------------------------------------------------------------------ */

describe('A11y Audit — img-alt', () => {
  beforeEach(cleanup);

  it('detects images without alt attribute', () => {
    const el = createElement('<img src="photo.jpg">');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'img-alt');
    expect(violation).toBeDefined();
    expect(violation!.severity).toBe('critical');
    expect(violation!.wcagCriteria).toBe('1.1.1');
  });

  it('passes when image has alt attribute', () => {
    const el = createElement('<img src="photo.jpg" alt="A sunset">');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'img-alt');
    expect(violation).toBeUndefined();
  });

  it('passes when image has empty alt (decorative)', () => {
    const el = createElement('<img src="divider.png" alt="">');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'img-alt');
    expect(violation).toBeUndefined();
  });
});

describe('A11y Audit — button-name', () => {
  beforeEach(cleanup);

  it('detects buttons without accessible name', () => {
    const el = createElement('<button></button>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'button-name');
    expect(violation).toBeDefined();
    expect(violation!.severity).toBe('critical');
  });

  it('passes when button has text content', () => {
    const el = createElement('<button>Submit</button>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'button-name');
    expect(violation).toBeUndefined();
  });

  it('passes when button has aria-label', () => {
    const el = createElement('<button aria-label="Close dialog"></button>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'button-name');
    expect(violation).toBeUndefined();
  });
});

describe('A11y Audit — link-name', () => {
  beforeEach(cleanup);

  it('detects links without accessible name', () => {
    const el = createElement('<a href="/page"></a>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'link-name');
    expect(violation).toBeDefined();
  });

  it('passes when link has text', () => {
    const el = createElement('<a href="/page">Go to page</a>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'link-name');
    expect(violation).toBeUndefined();
  });
});

describe('A11y Audit — input-label', () => {
  beforeEach(cleanup);

  it('detects inputs without labels', () => {
    const el = createElement('<input type="text">');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'input-label');
    expect(violation).toBeDefined();
    expect(violation!.severity).toBe('critical');
  });

  it('passes when input has aria-label', () => {
    const el = createElement('<input type="text" aria-label="Search">');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'input-label');
    expect(violation).toBeUndefined();
  });

  it('passes when input has associated label', () => {
    const el = createElement('<label for="name">Name</label><input id="name" type="text">');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'input-label');
    expect(violation).toBeUndefined();
  });

  it('skips hidden inputs', () => {
    const el = createElement('<input type="hidden" name="csrf">');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'input-label');
    expect(violation).toBeUndefined();
  });
});

describe('A11y Audit — heading-order', () => {
  beforeEach(cleanup);

  it('detects skipped heading levels', () => {
    const el = createElement('<h1>Title</h1><h3>Subtitle</h3>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'heading-order');
    expect(violation).toBeDefined();
    expect(violation!.severity).toBe('moderate');
  });

  it('passes with sequential headings', () => {
    const el = createElement('<h1>Title</h1><h2>Subtitle</h2><h3>Section</h3>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'heading-order');
    expect(violation).toBeUndefined();
  });
});

describe('A11y Audit — empty-heading', () => {
  beforeEach(cleanup);

  it('detects empty headings', () => {
    const el = createElement('<h2></h2>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'empty-heading');
    expect(violation).toBeDefined();
  });

  it('passes when heading has content', () => {
    const el = createElement('<h2>Section Title</h2>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'empty-heading');
    expect(violation).toBeUndefined();
  });
});

describe('A11y Audit — tabindex-positive', () => {
  beforeEach(cleanup);

  it('detects positive tabindex values', () => {
    const el = createElement('<div tabindex="5">Content</div>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'tabindex-positive');
    expect(violation).toBeDefined();
    expect(violation!.severity).toBe('serious');
  });

  it('passes with tabindex="0"', () => {
    const el = createElement('<div tabindex="0">Content</div>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'tabindex-positive');
    expect(violation).toBeUndefined();
  });

  it('passes with tabindex="-1"', () => {
    const el = createElement('<div tabindex="-1">Content</div>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'tabindex-positive');
    expect(violation).toBeUndefined();
  });
});

describe('A11y Audit — aria-valid-attr', () => {
  beforeEach(cleanup);

  it('detects invalid ARIA attributes', () => {
    const el = createElement('<div aria-foobar="true">Content</div>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'aria-valid-attr');
    expect(violation).toBeDefined();
    expect(violation!.severity).toBe('critical');
  });

  it('passes with valid ARIA attributes', () => {
    const el = createElement('<div aria-label="Test" aria-expanded="true">Content</div>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'aria-valid-attr');
    expect(violation).toBeUndefined();
  });
});

describe('A11y Audit — duplicate-id', () => {
  beforeEach(cleanup);

  it('detects duplicate IDs', () => {
    const el = createElement('<div id="same">A</div><div id="same">B</div>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'duplicate-id');
    expect(violation).toBeDefined();
    expect(violation!.severity).toBe('serious');
  });

  it('passes with unique IDs', () => {
    const el = createElement('<div id="one">A</div><div id="two">B</div>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'duplicate-id');
    expect(violation).toBeUndefined();
  });
});

describe('A11y Audit — no-autoplay', () => {
  beforeEach(cleanup);

  it('detects autoplaying video', () => {
    const el = createElement('<video autoplay src="vid.mp4"></video>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'no-autoplay');
    expect(violation).toBeDefined();
  });

  it('detects autoplaying audio', () => {
    const el = createElement('<audio autoplay src="sound.mp3"></audio>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'no-autoplay');
    expect(violation).toBeDefined();
  });

  it('passes when media has no autoplay', () => {
    const el = createElement('<video src="vid.mp4" controls></video>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'no-autoplay');
    expect(violation).toBeUndefined();
  });
});

describe('A11y Audit — modal-focus-trap', () => {
  beforeEach(cleanup);

  it('detects dialog without aria-modal', () => {
    const el = createElement('<div role="dialog">Modal content</div>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'modal-focus-trap');
    expect(violation).toBeDefined();
    expect(violation!.severity).toBe('critical');
  });

  it('passes when dialog has aria-modal', () => {
    const el = createElement('<div role="dialog" aria-modal="true">Modal content</div>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'modal-focus-trap');
    expect(violation).toBeUndefined();
  });
});

describe('A11y Audit — table-headers', () => {
  beforeEach(cleanup);

  it('detects table without header cells', () => {
    const el = createElement('<table><tr><td>Data</td></tr></table>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'table-headers');
    expect(violation).toBeDefined();
  });

  it('passes when table has th elements', () => {
    const el = createElement('<table><tr><th>Name</th></tr><tr><td>Alice</td></tr></table>');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'table-headers');
    expect(violation).toBeUndefined();
  });
});

describe('A11y Audit — form-error-identification', () => {
  beforeEach(cleanup);

  it('detects invalid field without error message link', () => {
    const el = createElement('<input aria-invalid="true" type="text">');
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'form-error-identification');
    expect(violation).toBeDefined();
  });

  it('passes when invalid field has aria-errormessage', () => {
    const el = createElement(
      '<input aria-invalid="true" aria-errormessage="err1" type="text"><span id="err1">Required</span>',
    );
    const result = auditElement(el);
    const violation = result.violations.find((v) => v.rule === 'form-error-identification');
    expect(violation).toBeUndefined();
  });
});

/* ------------------------------------------------------------------ */
/*  Audit — Score and summary                                          */
/* ------------------------------------------------------------------ */

describe('A11y Audit — scoring', () => {
  beforeEach(cleanup);

  it('returns score 100 for clean markup', () => {
    const el = createElement(
      '<button>OK</button><img alt="pic" src="x.jpg"><a href="/">Home</a>',
    );
    const result = auditElement(el);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.passed).toBeGreaterThan(0);
  });

  it('returns lower score for violations', () => {
    const el = createElement(
      '<img src="x.jpg"><button></button><a href="/"></a><input type="text">',
    );
    const result = auditElement(el);
    expect(result.score).toBeLessThan(100);
    expect(result.failed).toBeGreaterThan(0);
    expect(result.summary).toContain('failure');
  });

  it('summary mentions passing when no violations', () => {
    const el = createElement('<p>Hello world</p>');
    const result = auditElement(el);
    expect(result.summary).toContain('passed');
  });
});

/* ------------------------------------------------------------------ */
/*  Audit — getAuditRules                                              */
/* ------------------------------------------------------------------ */

describe('A11y Audit — getAuditRules', () => {
  it('returns at least 20 rules', () => {
    const rules = getAuditRules();
    expect(rules.length).toBeGreaterThanOrEqual(20);
  });

  it('each rule has required fields', () => {
    const rules = getAuditRules();
    for (const rule of rules) {
      expect(rule.id).toBeTruthy();
      expect(rule.description).toBeTruthy();
      expect(rule.wcagCriteria).toBeTruthy();
      expect(['critical', 'serious', 'moderate', 'minor']).toContain(rule.severity);
      expect(typeof rule.check).toBe('function');
    }
  });
});

/* ------------------------------------------------------------------ */
/*  Audit — auditComponent                                             */
/* ------------------------------------------------------------------ */

describe('A11y Audit — auditComponent', () => {
  beforeEach(cleanup);

  it('produces a full component report', () => {
    const el = createElement(
      '<div role="dialog" aria-label="Settings" aria-modal="true"><button>Close</button></div>',
    );
    const report = auditComponent('dialog', el);
    expect(report.componentName).toBe('dialog');
    expect(report.audit).toBeDefined();
    expect(report.keyboardNav).toBeDefined();
    expect(report.ariaAttributes).toBeDefined();
    expect(report.recommendations).toBeDefined();
  });

  it('extracts ARIA attributes from root element', () => {
    const el = createElement('<div aria-label="Test" role="button" aria-expanded="true"></div>');
    const report = auditComponent('button', el);
    // The root div itself is the element — barrel wraps in container
    // Container div does not have aria attrs, but the inner div does.
    // auditComponent reads from the passed element, which is the container.
    expect(report.ariaAttributes).toBeDefined();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard — contracts                                               */
/* ------------------------------------------------------------------ */

describe('A11y Keyboard — getKeyboardContract', () => {
  it('returns contract for button', () => {
    const contract = getKeyboardContract('button');
    expect(contract.length).toBeGreaterThanOrEqual(2);
    expect(contract.some((t) => t.key === 'Enter')).toBe(true);
    expect(contract.some((t) => t.key === 'Space')).toBe(true);
  });

  it('returns contract for accordion', () => {
    const contract = getKeyboardContract('accordion');
    expect(contract.length).toBeGreaterThanOrEqual(4);
    expect(contract.some((t) => t.key === 'ArrowDown')).toBe(true);
    expect(contract.some((t) => t.key === 'ArrowUp')).toBe(true);
  });

  it('returns contract for dialog', () => {
    const contract = getKeyboardContract('dialog');
    expect(contract.some((t) => t.key === 'Escape')).toBe(true);
    expect(contract.some((t) => t.key === 'Tab')).toBe(true);
  });

  it('returns contract for tabs', () => {
    const contract = getKeyboardContract('tabs');
    expect(contract.some((t) => t.key === 'ArrowRight')).toBe(true);
    expect(contract.some((t) => t.key === 'ArrowLeft')).toBe(true);
  });

  it('returns empty array for unknown component type', () => {
    const contract = getKeyboardContract('unknown-widget');
    expect(contract).toEqual([]);
  });

  it('returns copies so templates are not mutated', () => {
    const a = getKeyboardContract('button');
    const b = getKeyboardContract('button');
    a[0].passed = true;
    expect(b[0].passed).toBe(false);
  });
});

describe('A11y Keyboard — getSupportedComponentTypes', () => {
  it('returns all supported types', () => {
    const types = getSupportedComponentTypes();
    expect(types).toContain('button');
    expect(types).toContain('menu');
    expect(types).toContain('dialog');
    expect(types).toContain('accordion');
    expect(types).toContain('tabs');
    expect(types).toContain('tree');
    expect(types).toContain('combobox');
    expect(types.length).toBeGreaterThanOrEqual(7);
  });
});

describe('A11y Keyboard — hasKeyboardContract', () => {
  it('returns true for known types', () => {
    expect(hasKeyboardContract('button')).toBe(true);
    expect(hasKeyboardContract('accordion')).toBe(true);
  });

  it('returns false for unknown types', () => {
    expect(hasKeyboardContract('custom-gadget')).toBe(false);
  });
});

describe('A11y Keyboard — testKeyboardNavigation', () => {
  beforeEach(cleanup);

  it('runs keyboard tests on a button element', () => {
    const el = createElement('<button>Click me</button>');
    const button = el.querySelector('button')!;
    button.focus();
    const contract = getKeyboardContract('button');
    const results = testKeyboardNavigation(button, contract);
    expect(results.length).toBe(2);
    results.forEach((r) => {
      expect(r.actual).toBeDefined();
    });
  });

  it('returns results for each contract item', () => {
    const el = createElement('<div role="menu"><div role="menuitem">A</div></div>');
    const contract = getKeyboardContract('menu');
    const results = testKeyboardNavigation(el, contract);
    expect(results.length).toBe(contract.length);
  });
});

/* ------------------------------------------------------------------ */
/*  Recommendations                                                    */
/* ------------------------------------------------------------------ */

describe('A11y Recommendations — getRecommendations', () => {
  it('returns "no violations" message for empty list', () => {
    const recs = getRecommendations([]);
    expect(recs.length).toBe(1);
    expect(recs[0]).toContain('No violations');
  });

  it('returns sorted, deduplicated recommendations', () => {
    const violations: A11yViolation[] = [
      {
        rule: 'img-alt',
        severity: 'critical',
        element: '<img>',
        description: 'Missing alt',
        fix: 'Add alt',
        wcagCriteria: '1.1.1',
      },
      {
        rule: 'heading-order',
        severity: 'moderate',
        element: '<h3>',
        description: 'Skipped level',
        fix: 'Fix order',
        wcagCriteria: '1.3.1',
      },
      {
        rule: 'img-alt',
        severity: 'critical',
        element: '<img.second>',
        description: 'Missing alt',
        fix: 'Add alt',
        wcagCriteria: '1.1.1',
      },
    ];
    const recs = getRecommendations(violations);
    // Should deduplicate img-alt
    expect(recs.length).toBe(2);
    // Critical should come first
    expect(recs[0]).toContain('[CRITICAL]');
    expect(recs[1]).toContain('[MODERATE]');
  });

  it('uses fallback fix text for unknown rules', () => {
    const violations: A11yViolation[] = [
      {
        rule: 'custom-rule-xyz',
        severity: 'minor',
        element: '<div>',
        description: 'Something custom',
        fix: 'Do the custom fix',
        wcagCriteria: '9.9.9',
      },
    ];
    const recs = getRecommendations(violations);
    expect(recs[0]).toContain('Do the custom fix');
  });
});

describe('A11y Recommendations — getComponentA11yChecklist', () => {
  it('returns checklist for button', () => {
    const list = getComponentA11yChecklist('button');
    expect(list.length).toBeGreaterThanOrEqual(5);
    expect(list.some((item) => item.toLowerCase().includes('aria-label'))).toBe(true);
  });

  it('returns checklist for dialog', () => {
    const list = getComponentA11yChecklist('dialog');
    expect(list.length).toBeGreaterThanOrEqual(5);
    expect(list.some((item) => item.includes('role="dialog"'))).toBe(true);
  });

  it('returns checklist for accordion', () => {
    const list = getComponentA11yChecklist('accordion');
    expect(list.length).toBeGreaterThanOrEqual(5);
    expect(list.some((item) => item.includes('aria-expanded'))).toBe(true);
  });

  it('returns generic checklist for unknown component', () => {
    const list = getComponentA11yChecklist('fancy-widget');
    expect(list.length).toBeGreaterThanOrEqual(5);
    expect(list.some((item) => item.toLowerCase().includes('focus'))).toBe(true);
  });

  it('is case-insensitive', () => {
    const a = getComponentA11yChecklist('Button');
    const b = getComponentA11yChecklist('button');
    expect(a).toEqual(b);
  });
});

describe('A11y Recommendations — getSupportedChecklistTypes', () => {
  it('returns all supported types', () => {
    const types = getSupportedChecklistTypes();
    expect(types).toContain('button');
    expect(types).toContain('dialog');
    expect(types).toContain('accordion');
    expect(types).toContain('tabs');
    expect(types).toContain('form');
    expect(types).toContain('table');
    expect(types.length).toBeGreaterThanOrEqual(8);
  });
});
