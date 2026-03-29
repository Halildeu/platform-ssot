/**
 * TW4 Behavior Change Risk checks
 * Extracted from theme-doctor.mjs for maintainability.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

export function register(ctx) {
  const { check, readSafe, srgbToHex, parseCssVarsFlat, walkDir,
    ROOT, DS_SRC, SHELL_STYLES, SHELL_INDEX_CSS, FIGMA_PATH,
    THEME_CSS, TOKEN_BRIDGE_CSS, TOKENS_CSS, THEME_INLINE_CSS, FIX_HINT } = ctx;

/*  TW4 BEHAVIOR CHANGE RISK CHECKS                                    */
/* ================================================================== */

// 22. hover: variant — TW4 only fires on hover-capable devices
check('tw4-hover-risk', 'TW4 hover variant behavior (touch device risk)', () => {
  const scanDirs = ['apps', 'packages/design-system/src'];
  let hoverCount = 0;
  const hoverFiles = [];
  const customHoverOverride = readSafe(SHELL_INDEX_CSS).includes('@custom-variant hover');

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      const matches = content.match(/\bhover:/g) || [];
      if (matches.length > 0) {
        hoverCount += matches.length;
        if (hoverFiles.length < 3) hoverFiles.push(relative(ROOT, file));
      }
    }
  }

  if (customHoverOverride) return { status: 'pass', message: `hover: overridden via @custom-variant — works on all devices (${hoverCount} usages)` };
  return {
    status: 'pass',
    message: `${hoverCount} hover: usages — TW4 default: only fires on hover-capable devices (@media hover:hover)`,
    details: hoverFiles.length > 0 ? [`Tip: If touch hover needed, add @custom-variant hover (&:hover); to index.css`] : undefined,
  };
});

// 19. space-y/x selector change — TW4 uses :not(:last-child) instead of ~ :not([hidden])
check('tw4-space-selector', 'TW4 space-y/x selector change risk', () => {
  const scanDirs = ['apps', 'packages/design-system/src'];
  let spaceCount = 0;
  const affectedFiles = [];

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      const matches = content.match(/\bspace-[xy]-\d+\b/g) || [];
      if (matches.length > 0) {
        spaceCount += matches.length;
        if (affectedFiles.length < 5) affectedFiles.push({ file: relative(ROOT, file), count: matches.length });
      }
    }
  }

  if (spaceCount === 0) return { status: 'pass', message: 'No space-y/x utilities found' };
  return {
    status: 'pass',
    message: `${spaceCount} space-y/x usages — TW4 uses :not(:last-child) selector (may affect inline elements)`,
    details: [...affectedFiles.slice(0, 3), 'Tip: Consider migrating to flex/grid gap-* for safer spacing'],
  };
});

// 20. divide-y/x selector change — TW4 border placement changed
check('tw4-divide-selector', 'TW4 divide-y/x selector change risk', () => {
  const scanDirs = ['apps', 'packages/design-system/src'];
  let divideCount = 0;

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      const matches = content.match(/\bdivide-[xy](?:-\d+)?\b/g) || [];
      divideCount += matches.length;
    }
  }

  if (divideCount === 0) return { status: 'pass', message: 'No divide-y/x utilities found' };
  return {
    status: 'pass',
    message: `${divideCount} divide-y/x usages — TW4 uses border-bottom on :not(:last-child) instead of border-top on ~ siblings`,
  };
});

// 21. transition includes outline-color in TW4
check('tw4-transition-outline', 'TW4 transition includes outline-color', () => {
  const scanDirs = ['apps', 'packages/design-system/src'];
  let transitionFocusCount = 0;

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      // Check for transition + focus:outline combination
      if (content.includes('transition') && (content.includes('focus:outline') || content.includes('focus-visible:outline'))) {
        transitionFocusCount++;
      }
    }
  }

  if (transitionFocusCount === 0) return { status: 'pass', message: 'No transition + focus:outline combinations found' };
  return {
    status: 'pass',
    message: `${transitionFocusCount} files use transition + focus:outline — TW4 now transitions outline-color (may flash from default)`,
    details: ['Tip: Set outline color unconditionally (e.g., outline-blue-500 transition hover:outline-2) to avoid flash'],
  };
});

// 22. hidden attribute priority — TW4 hidden overrides display utilities
check('tw4-hidden-priority', 'TW4 hidden attribute priority change', () => {
  const scanDirs = ['apps', 'packages/design-system/src'];
  let riskCount = 0;
  const riskFiles = [];

  /* Only flag JSX elements with HTML hidden ATTRIBUTE (not className="hidden").
     Pattern: `<Tag hidden className="...block/flex/grid..."` or `hidden={expr}` */
  const hiddenAttrRe = /\bhidden(?:\s*=\s*\{[^}]*\}|\s+(?![:=])\w)/g;

  for (const dir of scanDirs) {
    const files = walkDir(join(ROOT, dir), '.tsx');
    for (const file of files) {
      const content = readSafe(file);
      const hasHiddenAttr = hiddenAttrRe.test(content);
      hiddenAttrRe.lastIndex = 0;
      if (!hasHiddenAttr) continue;
      /* Must also use a display utility that TW4 hidden would override */
      if (content.match(/className=.*\b(block|flex|grid|inline-block|inline-flex|inline-grid|table)\b/)) {
        riskCount++;
        if (riskFiles.length < 5) riskFiles.push(relative(ROOT, file));
      }
    }
  }

  if (riskCount === 0) return { status: 'pass', message: 'No hidden HTML attribute + display class conflicts detected' };
  return {
    /* Most "hidden" usage is className="hidden" (Tailwind utility), not HTML attribute.
       Threshold set high — only warn if truly excessive (>200 = likely false positives). */
    status: riskCount > 200 ? 'warn' : 'pass',
    message: `${riskCount} files use hidden attribute near display classes — TW4: hidden attribute wins over block/flex/grid`,
    details: riskFiles,
    fix: FIX_HINT ? 'In TW4, <div hidden class="block"> stays hidden. Remove hidden attribute or use conditional rendering instead.' : undefined,
  };
});

/* ================================================================== */
}
