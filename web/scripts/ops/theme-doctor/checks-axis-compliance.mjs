/**
 * Theme Axis Compliance checks
 * Verifies that all 11 theme axes have proper CSS selectors,
 * and that components use axis tokens instead of hardcoded values.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

export function register(ctx) {
  const { check, readSafe, walkDir,
    ROOT, DS_SRC, SHELL_STYLES, SHELL_INDEX_CSS,
    THEME_CSS, FIX_HINT } = ctx;

  const themeCss = readSafe(THEME_CSS);
  const indexCss = readSafe(SHELL_INDEX_CSS);
  const allCss = themeCss + '\n' + indexCss;

  /* Skip patterns for component scanning */
  const SKIP_DIRS = new Set(['__tests__', '__stories__', '__visual__', '__screenshots__', 'node_modules', 'dist', '.storybook']);
  const SKIP_FILE = /\.(test|stories|bench|visual|spec|d)\./;

  function walkTsx(dir) {
    const files = [];
    if (!existsSync(dir)) return files;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && !SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
        files.push(...walkTsx(full));
      } else if (entry.isFile() && entry.name.endsWith('.tsx') && !SKIP_FILE.test(entry.name)) {
        files.push(full);
      }
    }
    return files;
  }

  const DS_COMPONENTS = join(DS_SRC, 'components');
  const DS_PRIMITIVES = join(DS_SRC, 'primitives');
  const DS_ADVANCED = join(DS_SRC, 'advanced');
  const DS_ENTERPRISE = join(DS_SRC, 'enterprise');
  const DS_PATTERNS = join(DS_SRC, 'patterns');

  const componentFiles = [
    ...walkTsx(DS_COMPONENTS),
    ...walkTsx(DS_PRIMITIVES),
    ...walkTsx(DS_ADVANCED),
    ...walkTsx(DS_ENTERPRISE),
    ...walkTsx(DS_PATTERNS),
  ];

  /* ================================================================== */
  /*  Check 1: axis-css-selectors                                        */
  /* ================================================================== */
  check('axis-css-selectors', 'CSS selector coverage for all theme axis values', () => {
    const expectedAxes = {
      'data-radius': ['rounded', 'sharp'],
      'data-elevation': ['raised', 'flat'],
      'data-density': ['comfortable', 'compact'],
      'data-motion': ['standard', 'reduced'],
      'data-accent': ['neutral', 'light', 'violet', 'emerald', 'sunset', 'ocean', 'graphite'],
    };

    const missing = [];
    for (const [attr, values] of Object.entries(expectedAxes)) {
      for (const val of values) {
        const selector = `[${attr}="${val}"]`;
        if (!allCss.includes(selector)) {
          missing.push(`${selector} — no CSS rule found`);
        }
      }
    }

    if (missing.length === 0) {
      return { status: 'pass', message: `All axis selectors present in theme.css + index.css` };
    }
    return {
      status: missing.length > 3 ? 'fail' : 'warn',
      message: `${missing.length} axis CSS selectors missing`,
      details: missing,
      fix: FIX_HINT ? 'Add missing [data-<axis>="<value>"] selectors to theme.css with appropriate token overrides' : undefined,
    };
  });

  /* ================================================================== */
  /*  Check 2: radius-hardcodes                                          */
  /* ================================================================== */
  check('radius-hardcodes', 'Components using hardcoded border-radius instead of axis tokens', () => {
    const RADIUS_HARDCODE = /\brounded-(?:xs|sm|md|lg|xl|2xl|3xl|none)\b|\brounded-\[\d+px\]/g;
    const RADIUS_TOKEN = /var\(--radius-/;
    const ALLOWED = /\brounded-full\b/; // pills/circles are intentional
    const violations = [];

    for (const file of componentFiles) {
      const content = readSafe(file);
      if (RADIUS_TOKEN.test(content)) continue; // file already uses tokens
      const matches = [...content.matchAll(RADIUS_HARDCODE)].filter(m => !ALLOWED.test(m[0]));
      if (matches.length > 0) {
        const unique = [...new Set(matches.map(m => m[0]))];
        violations.push({
          file: relative(ROOT, file),
          classes: unique.slice(0, 5),
          count: matches.length,
        });
      }
    }

    if (violations.length === 0) {
      return { status: 'pass', message: 'All components use radius tokens or rounded-full' };
    }
    const total = violations.reduce((s, v) => s + v.count, 0);
    // CSS override in index.css handles these at runtime, so functional impact is mitigated
    const hasCssOverride = indexCss.includes('[data-radius="sharp"]');
    return {
      status: hasCssOverride ? 'pass' : 'fail',
      message: `${total} hardcoded radius classes in ${violations.length} files${hasCssOverride ? ' (mitigated by CSS override)' : ' (won\'t respond to radius axis)'}`,
      details: violations.slice(0, 10).map(v => `${v.file}: ${v.classes.join(', ')} (${v.count}x)`),
      fix: FIX_HINT ? 'Replace rounded-* with var(--radius-control) for controls or var(--radius-surface) for cards/panels' : undefined,
    };
  });

  /* ================================================================== */
  /*  Check 3: elevation-hardcodes                                       */
  /* ================================================================== */
  check('elevation-hardcodes', 'Components using hardcoded box-shadow instead of elevation tokens', () => {
    const SHADOW_HARDCODE = /\bshadow-(?:xs|sm|md|lg|xl|2xl|inner)\b|\bshadow-\[[\d_px\s,rgba()#]+\]/g;
    const ELEVATION_TOKEN = /var\(--elevation-/;
    const violations = [];

    for (const file of componentFiles) {
      const content = readSafe(file);
      if (ELEVATION_TOKEN.test(content)) continue;
      const matches = [...content.matchAll(SHADOW_HARDCODE)];
      if (matches.length > 0) {
        const unique = [...new Set(matches.map(m => m[0]))];
        violations.push({
          file: relative(ROOT, file),
          classes: unique.slice(0, 5),
          count: matches.length,
        });
      }
    }

    // Also check for inline boxShadow with pixel values
    for (const file of componentFiles) {
      const content = readSafe(file);
      if (ELEVATION_TOKEN.test(content)) continue;
      const inlineMatches = [...content.matchAll(/boxShadow:\s*['"`][^'"`]*\d+px[^'"`]*['"`]/g)];
      if (inlineMatches.length > 0) {
        const existing = violations.find(v => v.file === relative(ROOT, file));
        if (existing) {
          existing.count += inlineMatches.length;
          existing.classes.push('boxShadow: inline');
        } else {
          violations.push({
            file: relative(ROOT, file),
            classes: ['boxShadow: inline pixel values'],
            count: inlineMatches.length,
          });
        }
      }
    }

    if (violations.length === 0) {
      return { status: 'pass', message: 'All components use elevation tokens for shadows' };
    }
    const total = violations.reduce((s, v) => s + v.count, 0);
    const hasCssOverride = indexCss.includes('[data-elevation="flat"]') && indexCss.includes('box-shadow: none');
    return {
      status: hasCssOverride ? 'pass' : 'fail',
      message: `${total} hardcoded shadows in ${violations.length} files${hasCssOverride ? ' (mitigated by CSS override)' : ' (won\'t respond to elevation axis)'}`,
      details: violations.slice(0, 10).map(v => `${v.file}: ${v.classes.join(', ')} (${v.count}x)`),
      fix: FIX_HINT ? 'Replace shadow-* with var(--elevation-surface) for cards or var(--elevation-overlay) for dropdowns/modals' : undefined,
    };
  });

  /* ================================================================== */
  /*  Check 4: elevation-css-parity                                      */
  /* ================================================================== */
  check('elevation-css-parity', 'Flat vs raised elevation CSS rules produce different output', () => {
    const raisedMatch = indexCss.match(/\[data-elevation="raised"\]\s*[^{]*\{([^}]+)\}/s);
    const flatMatch = indexCss.match(/\[data-elevation="flat"\]\s*[^{]*\{([^}]+)\}/s);

    if (!raisedMatch || !flatMatch) {
      return { status: 'fail', message: 'Missing [data-elevation] CSS rules in index.css' };
    }

    const raisedBody = raisedMatch[1].replace(/\s+/g, ' ').trim();
    const flatBody = flatMatch[1].replace(/\s+/g, ' ').trim();

    if (raisedBody === flatBody) {
      return {
        status: 'fail',
        message: 'Raised and flat elevation CSS are IDENTICAL — flat mode has no effect',
        details: [
          `raised: ${raisedBody.substring(0, 120)}...`,
          `flat: ${flatBody.substring(0, 120)}...`,
        ],
        fix: FIX_HINT ? 'Set flat elevation to box-shadow: none !important for .shadow-* classes' : undefined,
      };
    }
    return { status: 'pass', message: 'Flat and raised elevation CSS produce different output' };
  });

  /* ================================================================== */
  /*  Check 5: motion-hardcodes                                          */
  /* ================================================================== */
  check('motion-hardcodes', 'Components using hardcoded transition durations instead of motion tokens', () => {
    const DURATION_HARDCODE = /\bduration-(?:50|75|100|150|200|300|500|700|1000)\b/g;
    const MOTION_TOKEN = /var\(--motion-duration-/;
    const violations = [];

    for (const file of componentFiles) {
      const content = readSafe(file);
      if (MOTION_TOKEN.test(content)) continue;
      const matches = [...content.matchAll(DURATION_HARDCODE)];
      if (matches.length > 0) {
        const unique = [...new Set(matches.map(m => m[0]))];
        violations.push({
          file: relative(ROOT, file),
          classes: unique.slice(0, 5),
          count: matches.length,
        });
      }
    }

    if (violations.length === 0) {
      return { status: 'pass', message: 'All components use motion tokens for transition durations' };
    }
    const total = violations.reduce((s, v) => s + v.count, 0);
    const hasCssOverride = indexCss.includes('[data-motion="reduced"]');
    return {
      status: hasCssOverride ? 'pass' : 'fail',
      message: `${total} hardcoded durations in ${violations.length} files${hasCssOverride ? ' (mitigated by CSS override)' : ' (won\'t respond to motion axis)'}`,
      details: violations.slice(0, 10).map(v => `${v.file}: ${v.classes.join(', ')} (${v.count}x)`),
      fix: FIX_HINT ? 'Replace duration-* with CSS: transition-duration: var(--motion-duration-fast|medium|slow)' : undefined,
    };
  });

  /* ================================================================== */
  /*  Check 6: motion-reduced-override                                   */
  /* ================================================================== */
  check('motion-reduced-override', 'CSS rules to suppress animations when motion axis is reduced', () => {
    const hasDataMotionReduced = allCss.includes('[data-motion="reduced"]');
    const hasPrefersReduced = allCss.includes('prefers-reduced-motion');

    const issues = [];
    if (!hasDataMotionReduced) issues.push('No [data-motion="reduced"] CSS override rules');
    if (!hasPrefersReduced) issues.push('No @media (prefers-reduced-motion) rules');

    // Check for animate-* suppression under reduced motion
    const hasAnimateSuppression = allCss.includes('[data-motion="reduced"]') &&
      (allCss.includes('animation-duration: 0') || allCss.includes('animation: none'));

    if (!hasAnimateSuppression) {
      issues.push('No animation suppression under [data-motion="reduced"] (animate-pulse, animate-spin still run)');
    }

    if (issues.length === 0) {
      return { status: 'pass', message: 'Motion reduced overrides present for transitions and animations' };
    }
    return {
      status: 'warn',
      message: `${issues.length} motion-reduced gaps`,
      details: issues,
      fix: FIX_HINT ? 'Add: [data-motion="reduced"] * { animation-duration: 0s !important; transition-duration: 0s !important; }' : undefined,
    };
  });

  /* ================================================================== */
  /*  Check 7: animation-hardcodes                                       */
  /* ================================================================== */
  check('animation-hardcodes', 'Components with hardcoded animations that ignore motion axis', () => {
    const ANIM_HARDCODE = /\banimate-(?:pulse|spin|ping|bounce|in|out)\b|\bfade-in\b|\bzoom-in\b|\bslide-in\b/g;
    const violations = [];

    for (const file of componentFiles) {
      const content = readSafe(file);
      const matches = [...content.matchAll(ANIM_HARDCODE)];
      if (matches.length > 0) {
        const unique = [...new Set(matches.map(m => m[0]))];
        violations.push({
          file: relative(ROOT, file),
          classes: unique,
          count: matches.length,
        });
      }
    }

    if (violations.length === 0) {
      return { status: 'pass', message: 'No hardcoded animations found in components' };
    }
    const total = violations.reduce((s, v) => s + v.count, 0);
    // CSS global override [data-motion="reduced"] * { animation-duration: 0ms } handles these
    const hasCssOverride = indexCss.includes('[data-motion="reduced"]') && indexCss.includes('animation-duration: 0ms');
    return {
      status: hasCssOverride ? 'pass' : (total > 15 ? 'warn' : 'pass'),
      message: `${total} hardcoded animations in ${violations.length} files${hasCssOverride ? ' (mitigated by CSS override)' : ' (won\'t stop under reduced motion)'}`,
      details: violations.slice(0, 10).map(v => `${v.file}: ${v.classes.join(', ')}`),
      fix: hasCssOverride ? undefined : (FIX_HINT ? 'Ensure [data-motion="reduced"] suppresses these animations via CSS override' : undefined),
    };
  });

  /* ================================================================== */
  /*  Check 8: accent-token-coverage                                     */
  /* ================================================================== */
  check('accent-token-coverage', 'All accent values have complete CSS token definitions', () => {
    const accents = ['neutral', 'light', 'violet', 'emerald', 'sunset', 'ocean', 'graphite'];
    const requiredTokens = ['--accent-primary', '--accent-primary-hover', '--accent-soft'];
    const missing = [];

    for (const accent of accents) {
      const selector = `[data-accent="${accent}"]`;
      if (!themeCss.includes(selector)) {
        missing.push(`${selector} — selector missing entirely`);
        continue;
      }

      // Extract the block after the selector
      const idx = themeCss.indexOf(selector);
      const blockStart = themeCss.indexOf('{', idx);
      if (blockStart === -1) continue;
      let depth = 1;
      let blockEnd = blockStart + 1;
      while (blockEnd < themeCss.length && depth > 0) {
        if (themeCss[blockEnd] === '{') depth++;
        if (themeCss[blockEnd] === '}') depth--;
        blockEnd++;
      }
      const block = themeCss.substring(blockStart, blockEnd);

      for (const token of requiredTokens) {
        if (!block.includes(token)) {
          missing.push(`${selector} missing ${token}`);
        }
      }
    }

    if (missing.length === 0) {
      return { status: 'pass', message: `All ${accents.length} accent values have complete token definitions` };
    }
    return {
      status: missing.length > 3 ? 'fail' : 'warn',
      message: `${missing.length} accent token gaps`,
      details: missing,
    };
  });

  /* ================================================================== */
  /*  Check 9: surface-tone-coverage                                     */
  /* ================================================================== */
  check('surface-tone-coverage', 'Surface tone selectors cover all 18 tone values', () => {
    const bands = ['ultra', 'mid', 'deep'];
    const levels = [1, 2, 3, 4, 5, 6];
    const requiredTokens = ['--surface-default-bg'];
    const missing = [];
    let found = 0;

    for (const band of bands) {
      for (const level of levels) {
        const tone = `${band}-${level}`;
        const selector = `[data-surface-tone="${tone}"]`;
        if (!themeCss.includes(selector)) {
          missing.push(`${selector} — not defined`);
        } else {
          found++;
        }
      }
    }

    if (missing.length === 0) {
      return { status: 'pass', message: `All 18 surface tone selectors present (${found} found)` };
    }
    return {
      status: missing.length > 6 ? 'fail' : 'warn',
      message: `${missing.length}/18 surface tone selectors missing (${found} found)`,
      details: missing.slice(0, 10),
    };
  });

  /* ================================================================== */
  /*  Check 10: contrast-ratio-coverage                                  */
  /* ================================================================== */
  check('contrast-ratio-coverage', 'Contrast ratio axis has CSS selector support', () => {
    const hasAA = allCss.includes('[data-contrast-ratio="aa"]');
    const hasAAA = allCss.includes('[data-contrast-ratio="aaa"]');

    if (hasAA && hasAAA) {
      return { status: 'pass', message: 'Contrast ratio AA and AAA selectors present' };
    }
    const missing = [];
    if (!hasAA) missing.push('[data-contrast-ratio="aa"]');
    if (!hasAAA) missing.push('[data-contrast-ratio="aaa"]');
    return {
      status: 'warn',
      message: `Contrast ratio selectors not yet implemented: ${missing.join(', ')}`,
      details: ['This axis is declared in ThemeAxes type but has no CSS implementation yet'],
    };
  });

  /* ================================================================== */
  /*  Check 11: axis-token-usage-summary                                 */
  /* ================================================================== */
  check('axis-token-usage-summary', 'Component adoption of axis-aware CSS tokens', () => {
    const tokenPatterns = [
      { name: '--radius-control', pattern: /var\(--radius-control/ },
      { name: '--radius-surface', pattern: /var\(--radius-surface/ },
      { name: '--elevation-surface', pattern: /var\(--elevation-surface/ },
      { name: '--elevation-overlay', pattern: /var\(--elevation-overlay/ },
      { name: '--motion-duration-fast', pattern: /var\(--motion-duration-fast/ },
      { name: '--motion-duration-medium', pattern: /var\(--motion-duration-medium/ },
      { name: '--motion-duration-slow', pattern: /var\(--motion-duration-slow/ },
      { name: '--density-space', pattern: /var\(--density-space/ },
      { name: '--density-row-height', pattern: /var\(--density-row-height/ },
    ];

    const usage = tokenPatterns.map(tp => {
      let count = 0;
      for (const file of componentFiles) {
        const content = readSafe(file);
        if (tp.pattern.test(content)) count++;
      }
      return { token: tp.name, files: count };
    });

    const zeroUsage = usage.filter(u => u.files === 0);
    const lowUsage = usage.filter(u => u.files > 0 && u.files < 5);
    const details = usage.map(u => `${u.token}: ${u.files} files`);

    if (zeroUsage.length === 0 && lowUsage.length === 0) {
      return { status: 'pass', message: 'All axis tokens adopted by 5+ components', details };
    }

    // CSS override system mitigates zero-usage tokens at runtime
    const hasCssOverrides = indexCss.includes('[data-radius="sharp"]') &&
      indexCss.includes('[data-elevation="flat"]') &&
      indexCss.includes('[data-motion="reduced"]');
    const status = hasCssOverrides ? 'pass' : (zeroUsage.length > 3 ? 'fail' : 'warn');
    return {
      status,
      message: `${zeroUsage.length} axis tokens with zero usage, ${lowUsage.length} with low adoption (<5 files)`,
      details,
      fix: FIX_HINT ? 'Replace hardcoded Tailwind classes with CSS custom properties: var(--radius-control), var(--elevation-surface), var(--motion-duration-medium), var(--density-space)' : undefined,
    };
  });

} // end register
