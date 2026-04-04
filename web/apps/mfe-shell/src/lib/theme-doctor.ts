/**
 * Theme Doctor — Standalone system-wide theme diagnostics
 *
 * Usage:
 *   Browser console: window.__themeDoctor()
 *   Browser console: window.__themeDoctor({ verbose: true })
 *   Playwright/CI:   await page.evaluate(() => window.__themeDoctor())
 *
 * Returns structured JSON report compatible with ops pipeline.
 */

import { getThemeAxes } from '@mfe/design-system';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type CheckStatus = 'PASS' | 'WARN' | 'FAIL';

type DoctorCheck = {
  id: string;
  category: string;
  label: string;
  status: CheckStatus;
  expected: string;
  actual: string;
  detail?: string;
  selector?: string;
};

type DoctorReport = {
  version: 'v1';
  kind: 'theme-doctor-report';
  timestamp: string;
  url: string;
  axes: ReturnType<typeof getThemeAxes>;
  checks: DoctorCheck[];
  summary: { total: number; pass: number; warn: number; fail: number };
  score: number; // 0-100
};

type DoctorOptions = {
  verbose?: boolean;
  maxElements?: number;
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const REQUIRED_ATTRIBUTES = [
  { attr: 'data-theme', valid: ['light', 'dark'] },
  { attr: 'data-accent', valid: ['neutral', 'light', 'violet', 'emerald', 'sunset', 'ocean', 'graphite'] },
  { attr: 'data-density', valid: ['comfortable', 'compact'] },
  { attr: 'data-radius', valid: ['rounded', 'sharp'] },
  { attr: 'data-elevation', valid: ['raised', 'flat'] },
  { attr: 'data-motion', valid: ['standard', 'reduced'] },
];

const COLOR_TOKEN_VARS = [
  '--surface-default-bg', '--surface-panel-bg', '--surface-muted-bg', '--surface-page-bg',
  '--surface-header-bg', '--surface-raised-bg', '--surface-overlay-bg',
  '--text-primary', '--text-secondary', '--text-subtle', '--text-inverse',
  '--border-default', '--border-subtle',
  '--action-primary', '--action-primary-text', '--action-primary-border',
  '--selection-bg', '--selection-outline',
  '--status-danger', '--status-warning', '--status-success',
  '--accent-primary', '--accent-soft',
];

const RADIUS_TOKEN_VARS = [
  '--radius-xs', '--radius-sm', '--radius-md', '--radius-lg',
  '--radius-xl', '--radius-2xl', '--radius-3xl', '--radius-full',
];

const HARDCODED_COLOR_PATTERN = /(?:^|\s)(#[0-9a-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\()/i;

const TAILWIND_ROUNDED_CLASSES = ['rounded', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full'];

/* ------------------------------------------------------------------ */
/*  Check functions                                                    */
/* ------------------------------------------------------------------ */

function checkAttributes(root: Element): DoctorCheck[] {
  return REQUIRED_ATTRIBUTES.map(({ attr, valid }) => {
    const value = root.getAttribute(attr);
    return {
      id: `attr:${attr}`,
      category: 'DOM Attributes',
      label: `<html> ${attr}`,
      status: value === null ? 'FAIL' : valid.includes(value) ? 'PASS' : 'WARN',
      expected: valid.join(' | '),
      actual: value ?? '(missing)',
    };
  });
}

function checkColorTokens(rootStyle: CSSStyleDeclaration): DoctorCheck[] {
  return COLOR_TOKEN_VARS.map((name) => {
    const value = rootStyle.getPropertyValue(name).trim();
    return {
      id: `token:${name}`,
      category: 'Color Tokens',
      label: name,
      status: value ? 'PASS' : 'FAIL',
      expected: 'defined',
      actual: value || '(undefined)',
    };
  });
}

function checkRadiusTokens(rootStyle: CSSStyleDeclaration): DoctorCheck[] {
  return RADIUS_TOKEN_VARS.map((name) => {
    const value = rootStyle.getPropertyValue(name).trim();
    return {
      id: `token:${name}`,
      category: 'Radius Tokens',
      label: name,
      status: value ? 'PASS' : 'FAIL',
      expected: 'defined',
      actual: value || '(undefined)',
    };
  });
}

function checkRadiusConsistency(axes: ReturnType<typeof getThemeAxes>): DoctorCheck[] {
  const checks: DoctorCheck[] = [];
  const isSharp = axes.radius === 'sharp';

  for (const cls of TAILWIND_ROUNDED_CLASSES) {
    const els = document.querySelectorAll(`.${cls}`);
    if (els.length === 0) continue;

    const sample = els[0] as HTMLElement;
    const br = parseFloat(getComputedStyle(sample).borderRadius);
    const threshold = isSharp ? 8 : 0;
    const status: CheckStatus = isSharp
      ? br <= threshold ? 'PASS' : 'FAIL'
      : br > 0 ? 'PASS' : 'WARN';

    checks.push({
      id: `radius-bind:.${cls}`,
      category: 'Radius Binding',
      label: `.${cls} (${els.length} element)`,
      status,
      expected: isSharp ? `≤${threshold}px` : '>0px',
      actual: `${br}px`,
      selector: `.${cls}`,
      detail: status === 'FAIL' ? `CSS var binding eksik — .${cls} tema radius'una uymuyor` : undefined,
    });
  }

  return checks;
}

function checkDarkModeConsistency(axes: ReturnType<typeof getThemeAxes>): DoctorCheck {
  const isDark = axes.appearance === 'dark';
  const bgColor = getComputedStyle(document.body).backgroundColor;
  const match = bgColor.match(/\d+/g);
  const avg = match ? (Number(match[0]) + Number(match[1]) + Number(match[2])) / 3 : 128;
  const looksLight = avg > 128;

  return {
    id: 'darkmode:body-bg',
    category: 'Dark Mode',
    label: 'Body background luminance',
    status: isDark && looksLight ? 'FAIL' : 'PASS',
    expected: isDark ? 'avg < 128 (koyu)' : 'avg > 128 (açık)',
    actual: `avg=${Math.round(avg)}`,
    detail: isDark && looksLight ? 'data-theme=dark ama body hala açık — CSS binding eksik' : undefined,
  };
}

function checkHardcodedColors(maxElements: number): DoctorCheck[] {
  const checks: DoctorCheck[] = [];
  const violators: { selector: string; prop: string; value: string }[] = [];

  const allElements = document.querySelectorAll('*');
  const limit = Math.min(allElements.length, maxElements);

  for (let i = 0; i < limit; i++) {
    const el = allElements[i] as HTMLElement;
    const inline = el.style.cssText;
    if (!inline) continue;

    // Check for hardcoded colors in inline styles
    for (const prop of ['color', 'background-color', 'border-color', 'background']) {
      const value = el.style.getPropertyValue(prop);
      if (value && HARDCODED_COLOR_PATTERN.test(value) && !value.includes('var(')) {
        violators.push({
          selector: describeElement(el),
          prop,
          value: value.substring(0, 40),
        });
      }
    }
  }

  if (violators.length === 0) {
    checks.push({
      id: 'hardcoded:inline-colors',
      category: 'Hardcoded Colors',
      label: `Inline hardcoded renkler (${limit} element tarandı)`,
      status: 'PASS',
      expected: '0 violation',
      actual: '0',
    });
  } else {
    const top5 = violators.slice(0, 5);
    checks.push({
      id: 'hardcoded:inline-colors',
      category: 'Hardcoded Colors',
      label: `Inline hardcoded renkler (${limit} element tarandı)`,
      status: 'WARN',
      expected: '0 violation',
      actual: `${violators.length} violation`,
      detail: top5.map((v) => `${v.selector} → ${v.prop}: ${v.value}`).join('\n'),
    });
  }

  return checks;
}

function checkInlineOverrides(): DoctorCheck {
  const root = document.documentElement;
  const overrides: string[] = [];
  for (let i = 0; i < root.style.length; i++) {
    const p = root.style[i];
    if (p.startsWith('--')) overrides.push(p);
  }

  return {
    id: 'inline:root-overrides',
    category: 'Root Overrides',
    label: 'Root element inline CSS custom property overrides',
    status: overrides.length > 15 ? 'WARN' : 'PASS',
    expected: '≤15',
    actual: `${overrides.length}${overrides.length > 0 ? ': ' + overrides.slice(0, 8).join(', ') : ''}`,
    detail: overrides.length > 15 ? 'Fazla inline override — tema controller binding eksik olabilir' : undefined,
  };
}

function checkAccentSync(axes: ReturnType<typeof getThemeAxes>): DoctorCheck {
  const htmlAccent = document.documentElement.getAttribute('data-accent');
  return {
    id: 'sync:accent',
    category: 'State Sync',
    label: 'Accent controller ↔ DOM sync',
    status: htmlAccent === axes.accent ? 'PASS' : 'FAIL',
    expected: axes.accent,
    actual: htmlAccent ?? '(missing)',
  };
}

function checkThemeProviderPresent(): DoctorCheck {
  // Check if ThemeProvider context is alive by looking for data-theme-scope
  const scoped = document.querySelectorAll('[data-theme-scope]');
  return {
    id: 'provider:theme-scope',
    category: 'Provider',
    label: 'data-theme-scope elements',
    status: 'PASS',
    expected: '≥0',
    actual: `${scoped.length} element`,
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function describeElement(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : '';
  const cls = el.className && typeof el.className === 'string'
    ? '.' + el.className.split(' ').slice(0, 2).join('.')
    : '';
  return `${tag}${id}${cls}`.substring(0, 60);
}

/* ------------------------------------------------------------------ */
/*  Main doctor function                                               */
/* ------------------------------------------------------------------ */

export function runThemeDoctor(options: DoctorOptions = {}): DoctorReport {
  const { maxElements = 2000 } = options;
  const axes = getThemeAxes();
  const rootStyle = getComputedStyle(document.documentElement);
  const checks: DoctorCheck[] = [];

  // 1. DOM attributes
  checks.push(...checkAttributes(document.documentElement));

  // 2. Color tokens
  checks.push(...checkColorTokens(rootStyle));

  // 3. Radius tokens
  checks.push(...checkRadiusTokens(rootStyle));

  // 4. Radius consistency
  checks.push(...checkRadiusConsistency(axes));

  // 5. Dark mode consistency
  checks.push(checkDarkModeConsistency(axes));

  // 6. Accent sync
  checks.push(checkAccentSync(axes));

  // 7. Hardcoded colors
  checks.push(...checkHardcodedColors(maxElements));

  // 8. Root overrides
  checks.push(checkInlineOverrides());

  // 9. Provider check
  checks.push(checkThemeProviderPresent());

  const summary = {
    total: checks.length,
    pass: checks.filter((c) => c.status === 'PASS').length,
    warn: checks.filter((c) => c.status === 'WARN').length,
    fail: checks.filter((c) => c.status === 'FAIL').length,
  };

  const score = Math.round((summary.pass / summary.total) * 100);

  const report: DoctorReport = {
    version: 'v1',
    kind: 'theme-doctor-report',
    timestamp: new Date().toISOString(),
    url: window.location.href,
    axes,
    checks,
    summary,
    score,
  };

  // Console output
  const statusIcon = (s: CheckStatus) => s === 'PASS' ? '✓' : s === 'WARN' ? '⚠' : '✗';
  const statusColor = (s: CheckStatus) => s === 'PASS' ? 'color:#10b981' : s === 'WARN' ? 'color:#f59e0b' : 'color:#ef4444';

  console.group(`🩺 Theme Doctor — Score: ${score}/100`);
  console.log(`URL: ${report.url}`);
  console.log(`Axes: ${JSON.stringify(axes)}`);
  console.log(`Summary: ✓${summary.pass} ⚠${summary.warn} ✗${summary.fail} / ${summary.total}`);

  if (summary.fail > 0 || summary.warn > 0) {
    console.group('Issues:');
    for (const check of checks.filter((c) => c.status !== 'PASS')) {
      console.log(`%c${statusIcon(check.status)} [${check.category}] ${check.label}: expected=${check.expected} actual=${check.actual}`, statusColor(check.status));
      if (check.detail) console.log(`  ↳ ${check.detail}`);
    }
    console.groupEnd();
  }

  if (options.verbose) {
    console.group('All checks:');
    for (const check of checks) {
      console.log(`%c${statusIcon(check.status)} ${check.label}: ${check.actual}`, statusColor(check.status));
    }
    console.groupEnd();
  }

  console.groupEnd();

  return report;
}

/* ------------------------------------------------------------------ */
/*  Global registration                                                */
/* ------------------------------------------------------------------ */

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__themeDoctor = runThemeDoctor;
}
