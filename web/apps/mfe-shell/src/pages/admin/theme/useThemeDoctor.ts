import { useCallback, useState } from 'react';
import { getThemeAxes } from '@mfe/design-system';

export type DoctorCheckStatus = 'pass' | 'warn' | 'fail';

export type DoctorCheck = {
  id: string;
  label: string;
  status: DoctorCheckStatus;
  expected: string;
  actual: string;
  detail?: string;
};

export type DoctorReport = {
  timestamp: string;
  checks: DoctorCheck[];
  summary: { pass: number; warn: number; fail: number };
};

/* ------------------------------------------------------------------ */
/*  CSS variable existence + value checks                              */
/* ------------------------------------------------------------------ */

const RADIUS_VARS = ['--radius-xs', '--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl', '--radius-3xl', '--radius-full'];
const COLOR_VARS = [
  '--surface-default-bg', '--surface-panel-bg', '--surface-muted-bg', '--surface-page-bg',
  '--text-primary', '--text-secondary', '--text-subtle',
  '--border-default', '--border-subtle',
  '--action-primary', '--action-primary-text',
];

function checkCssVar(name: string, root: CSSStyleDeclaration): DoctorCheck {
  const value = root.getPropertyValue(name).trim();
  return {
    id: `css-var:${name}`,
    label: name,
    status: value ? 'pass' : 'fail',
    expected: 'defined',
    actual: value || '(undefined)',
  };
}

/* ------------------------------------------------------------------ */
/*  DOM attribute checks                                               */
/* ------------------------------------------------------------------ */

function checkAttribute(el: Element, attr: string, validValues: string[]): DoctorCheck {
  const value = el.getAttribute(attr);
  const isValid = value !== null && validValues.includes(value);
  return {
    id: `attr:${attr}`,
    label: `<html> ${attr}`,
    status: value === null ? 'fail' : isValid ? 'pass' : 'warn',
    expected: validValues.join(' | '),
    actual: value ?? '(missing)',
  };
}

/* ------------------------------------------------------------------ */
/*  Radius consistency check — sample elements                         */
/* ------------------------------------------------------------------ */

function checkRadiusConsistency(axes: ReturnType<typeof getThemeAxes>): DoctorCheck[] {
  const checks: DoctorCheck[] = [];
  const isSharp = axes.radius === 'sharp';

  const selectors = [
    { sel: '.rounded-2xl', varName: '--radius-2xl', label: 'rounded-2xl elements' },
    { sel: '.rounded-xl', varName: '--radius-xl', label: 'rounded-xl elements' },
    { sel: '.rounded-lg', varName: '--radius-lg', label: 'rounded-lg elements' },
    { sel: '.rounded-md', varName: '--radius-md', label: 'rounded-md elements' },
  ];

  for (const { sel, label } of selectors) {
    const els = document.querySelectorAll(sel);
    if (els.length === 0) continue;
    const sample = els[0] as HTMLElement;
    const br = parseFloat(getComputedStyle(sample).borderRadius);
    const threshold = isSharp ? 8 : 0;
    const status: DoctorCheckStatus = isSharp
      ? br <= threshold ? 'pass' : 'fail'
      : br > 0 ? 'pass' : 'warn';

    checks.push({
      id: `radius:${sel}`,
      label: `${label} (${els.length} adet)`,
      status,
      expected: isSharp ? `≤${threshold}px` : '>0px',
      actual: `${br}px`,
      detail: isSharp && br > threshold ? 'CSS variable override uygulanmamış olabilir' : undefined,
    });
  }

  return checks;
}

/* ------------------------------------------------------------------ */
/*  Dark mode consistency                                              */
/* ------------------------------------------------------------------ */

function checkDarkModeConsistency(axes: ReturnType<typeof getThemeAxes>): DoctorCheck {
  const isDark = axes.appearance === 'dark';
  const bgColor = getComputedStyle(document.body).backgroundColor;
  // Parse rgb to check if actually dark
  const match = bgColor.match(/\d+/g);
  const avg = match ? (Number(match[0]) + Number(match[1]) + Number(match[2])) / 3 : 128;
  const looksLight = avg > 128;

  if (isDark && looksLight) {
    return {
      id: 'darkmode:body-bg',
      label: 'Dark mode body arka plan',
      status: 'fail',
      expected: 'Koyu arka plan (avg < 128)',
      actual: `${bgColor} (avg=${Math.round(avg)})`,
      detail: 'data-theme=dark ama body hala açık renk — CSS variable binding eksik olabilir',
    };
  }

  return {
    id: 'darkmode:body-bg',
    label: 'Dark mode body arka plan',
    status: 'pass',
    expected: isDark ? 'Koyu' : 'Açık',
    actual: `avg=${Math.round(avg)}`,
  };
}

/* ------------------------------------------------------------------ */
/*  Accent consistency                                                 */
/* ------------------------------------------------------------------ */

function checkAccentApplied(axes: ReturnType<typeof getThemeAxes>): DoctorCheck {
  const dataAccent = document.documentElement.getAttribute('data-accent');
  return {
    id: 'accent:data-attr',
    label: 'Accent data attribute',
    status: dataAccent === axes.accent ? 'pass' : 'fail',
    expected: axes.accent,
    actual: dataAccent ?? '(missing)',
  };
}

/* ------------------------------------------------------------------ */
/*  Inline override leak check                                         */
/* ------------------------------------------------------------------ */

function checkInlineOverrides(): DoctorCheck {
  const root = document.documentElement;
  const count = root.style.length;
  const overrides: string[] = [];
  for (let i = 0; i < count; i++) {
    const p = root.style[i];
    if (p.startsWith('--radius') || p.startsWith('--surface') || p.startsWith('--text')) {
      overrides.push(p);
    }
  }

  return {
    id: 'inline:root-overrides',
    label: 'Root inline CSS overrides',
    status: overrides.length > 10 ? 'warn' : 'pass',
    expected: '≤10 override',
    actual: `${overrides.length} override${overrides.length > 0 ? ': ' + overrides.slice(0, 5).join(', ') : ''}`,
    detail: overrides.length > 10 ? 'Çok fazla inline override — tema binding eksik olabilir' : undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  Main hook                                                          */
/* ------------------------------------------------------------------ */

export function useThemeDoctor() {
  const [report, setReport] = useState<DoctorReport | null>(null);
  const [running, setRunning] = useState(false);

  const runDiagnostics = useCallback(() => {
    setRunning(true);

    // Small delay so UI updates first
    requestAnimationFrame(() => {
      const axes = getThemeAxes();
      const rootStyle = getComputedStyle(document.documentElement);
      const checks: DoctorCheck[] = [];

      // 1. DOM attribute checks
      checks.push(checkAttribute(document.documentElement, 'data-theme', ['light', 'dark']));
      checks.push(checkAttribute(document.documentElement, 'data-accent', ['neutral', 'light', 'violet', 'emerald', 'sunset', 'ocean', 'graphite']));
      checks.push(checkAttribute(document.documentElement, 'data-density', ['comfortable', 'compact']));
      checks.push(checkAttribute(document.documentElement, 'data-radius', ['rounded', 'sharp']));
      checks.push(checkAttribute(document.documentElement, 'data-elevation', ['raised', 'flat']));
      checks.push(checkAttribute(document.documentElement, 'data-motion', ['standard', 'reduced']));

      // 2. CSS variable checks — colors
      for (const v of COLOR_VARS) {
        checks.push(checkCssVar(v, rootStyle));
      }

      // 3. CSS variable checks — radius
      for (const v of RADIUS_VARS) {
        checks.push(checkCssVar(v, rootStyle));
      }

      // 4. Radius consistency
      checks.push(...checkRadiusConsistency(axes));

      // 5. Dark mode consistency
      checks.push(checkDarkModeConsistency(axes));

      // 6. Accent applied
      checks.push(checkAccentApplied(axes));

      // 7. Inline override leak
      checks.push(checkInlineOverrides());

      const summary = {
        pass: checks.filter((c) => c.status === 'pass').length,
        warn: checks.filter((c) => c.status === 'warn').length,
        fail: checks.filter((c) => c.status === 'fail').length,
      };

      setReport({ timestamp: new Date().toISOString(), checks, summary });
      setRunning(false);
    });
  }, []);

  return { report, running, runDiagnostics };
}
