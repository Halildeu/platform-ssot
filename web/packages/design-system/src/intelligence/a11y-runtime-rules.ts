/* ------------------------------------------------------------------ */
/*  A11y Runtime Rules — WCAG-based runtime accessibility checks      */
/* ------------------------------------------------------------------ */

import { calculateContrastRatio } from './a11y-guardian';

export interface RuntimeA11yRule {
  id: string;
  name: string;
  severity: 'error' | 'warning' | 'info';
  wcagLevel: 'A' | 'AA' | 'AAA';
  check: (element: Element) => RuntimeViolation | null;
}

export interface RuntimeViolation {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  element: string; // outerHTML snippet (first 100 chars)
  selector: string; // CSS selector path
  message: string;
  fix: string;
  wcagLink: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function snippetOf(el: Element): string {
  return el.outerHTML.slice(0, 100);
}

function selectorOf(el: Element): string {
  const parts: string[] = [];
  let current: Element | null = el;
  while (current && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();
    if (current.id) {
      selector += `#${current.id}`;
      parts.unshift(selector);
      break;
    }
    const parent: Element | null = current.parentElement;
    if (parent) {
      const tag = current.tagName;
      const siblings = Array.from(parent.children).filter(
        (c: Element) => c.tagName === tag,
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }
    parts.unshift(selector);
    current = parent;
  }
  return parts.join(' > ');
}

function rgbStringToHex(rgb: string): string | null {
  const match = rgb.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/,
  );
  if (!match) return null;
  const [, r, g, b] = match;
  return (
    '#' +
    [r, g, b]
      .map((c) => parseInt(c!, 10).toString(16).padStart(2, '0'))
      .join('')
  );
}

function isLargeText(el: Element): boolean {
  const style = window.getComputedStyle(el);
  const fontSize = parseFloat(style.fontSize);
  const fontWeight = parseInt(style.fontWeight, 10) || 400;
  // WCAG: large text is >= 18pt (24px) or >= 14pt (18.66px) bold
  return fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
}

/* ------------------------------------------------------------------ */
/*  Rules                                                              */
/* ------------------------------------------------------------------ */

const dynamicContrastRule: RuntimeA11yRule = {
  id: 'dynamic-contrast',
  name: 'Dynamic Contrast',
  severity: 'error',
  wcagLevel: 'AA',
  check(element: Element): RuntimeViolation | null {
    const style = window.getComputedStyle(element);
    const fg = style.color;
    const bg = style.backgroundColor;
    if (!fg || !bg) return null;

    const fgHex = rgbStringToHex(fg);
    const bgHex = rgbStringToHex(bg);
    if (!fgHex || !bgHex) return null;

    // Skip fully transparent backgrounds
    if (bg.includes('rgba') && bg.endsWith(', 0)')) return null;

    const ratio = calculateContrastRatio(fgHex, bgHex);
    const required = isLargeText(element) ? 3 : 4.5;

    if (ratio >= required) return null;

    return {
      ruleId: 'dynamic-contrast',
      severity: 'error',
      element: snippetOf(element),
      selector: selectorOf(element),
      message: `Contrast ratio ${ratio.toFixed(2)}:1 is below ${required}:1 (WCAG AA)`,
      fix: `Increase contrast between foreground (${fgHex}) and background (${bgHex}) to at least ${required}:1`,
      wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
    };
  },
};

const focusVisibleRule: RuntimeA11yRule = {
  id: 'focus-visible',
  name: 'Focus Visible',
  severity: 'error',
  wcagLevel: 'AA',
  check(element: Element): RuntimeViolation | null {
    const interactiveSelector = 'button, a, input, select, textarea, [tabindex]';
    if (!element.matches(interactiveSelector)) return null;

    const style = window.getComputedStyle(element);
    const outline = style.outline;
    const outlineStyle = style.outlineStyle;
    const boxShadow = style.boxShadow;

    // If outline is explicitly removed and no box-shadow alternative
    if (
      (outlineStyle === 'none' || outline === '0' || outline === 'none') &&
      (!boxShadow || boxShadow === 'none')
    ) {
      return {
        ruleId: 'focus-visible',
        severity: 'error',
        element: snippetOf(element),
        selector: selectorOf(element),
        message: 'Interactive element has no visible focus indicator',
        fix: 'Add outline or box-shadow for :focus-visible state',
        wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html',
      };
    }

    return null;
  },
};

const touchTargetRule: RuntimeA11yRule = {
  id: 'touch-target',
  name: 'Touch Target Size',
  severity: 'warning',
  wcagLevel: 'AA',
  check(element: Element): RuntimeViolation | null {
    if (!element.matches('button, a, [role="button"]')) return null;

    const rect = element.getBoundingClientRect();
    const minSize = 44;

    if (rect.width >= minSize && rect.height >= minSize) return null;
    // Skip hidden elements
    if (rect.width === 0 || rect.height === 0) return null;

    return {
      ruleId: 'touch-target',
      severity: 'warning',
      element: snippetOf(element),
      selector: selectorOf(element),
      message: `Touch target is ${Math.round(rect.width)}x${Math.round(rect.height)}px, minimum is ${minSize}x${minSize}px`,
      fix: `Increase element size or add padding to meet ${minSize}x${minSize}px minimum (WCAG 2.2 Target Size)`,
      wcagLink: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html',
    };
  },
};

const headingOrderRule: RuntimeA11yRule = {
  id: 'heading-order',
  name: 'Heading Order',
  severity: 'warning',
  wcagLevel: 'A',
  check(element: Element): RuntimeViolation | null {
    if (!element.matches('h1, h2, h3, h4, h5, h6')) return null;

    const currentLevel = parseInt(element.tagName[1], 10);
    // Look for the previous heading in document order
    const allHeadings = Array.from(
      (element.getRootNode() as Document | ShadowRoot).querySelectorAll('h1, h2, h3, h4, h5, h6'),
    );
    const idx = allHeadings.indexOf(element);
    if (idx <= 0) return null;

    const prevLevel = parseInt(allHeadings[idx - 1].tagName[1], 10);
    // Skipped level: jumped more than 1 level down (h1 -> h3 skips h2)
    if (currentLevel > prevLevel + 1) {
      return {
        ruleId: 'heading-order',
        severity: 'warning',
        element: snippetOf(element),
        selector: selectorOf(element),
        message: `Heading level skipped: <${allHeadings[idx - 1].tagName.toLowerCase()}> to <${element.tagName.toLowerCase()}>`,
        fix: `Use <h${prevLevel + 1}> instead or add missing intermediate heading levels`,
        wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
      };
    }

    return null;
  },
};

const langAttributeRule: RuntimeA11yRule = {
  id: 'lang-attribute',
  name: 'Language Attribute',
  severity: 'error',
  wcagLevel: 'A',
  check(element: Element): RuntimeViolation | null {
    // Only check on the html element
    if (element !== document.documentElement) return null;

    const lang = document.documentElement.getAttribute('lang');
    if (!lang || lang.trim() === '') {
      return {
        ruleId: 'lang-attribute',
        severity: 'error',
        element: snippetOf(element),
        selector: 'html',
        message: 'Document is missing a lang attribute',
        fix: 'Add lang attribute to <html> element, e.g. <html lang="en">',
        wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
      };
    }

    // Basic validation: should be BCP 47 format (e.g., "en", "en-US", "tr")
    const validLang = /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/;
    if (!validLang.test(lang.trim())) {
      return {
        ruleId: 'lang-attribute',
        severity: 'error',
        element: snippetOf(element),
        selector: 'html',
        message: `Invalid lang attribute value: "${lang}"`,
        fix: 'Use a valid BCP 47 language tag, e.g. "en", "en-US", "tr"',
        wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
      };
    }

    return null;
  },
};

const duplicateIdRule: RuntimeA11yRule = {
  id: 'duplicate-id',
  name: 'Duplicate ID',
  severity: 'error',
  wcagLevel: 'A',
  check(element: Element): RuntimeViolation | null {
    const id = element.getAttribute('id');
    if (!id) return null;

    const matches = document.querySelectorAll(`[id="${CSS.escape(id)}"]`);
    if (matches.length <= 1) return null;

    // Only report on the second+ occurrence to avoid double-reporting
    if (matches[0] === element) return null;

    return {
      ruleId: 'duplicate-id',
      severity: 'error',
      element: snippetOf(element),
      selector: selectorOf(element),
      message: `Duplicate id="${id}" found (${matches.length} elements share this ID)`,
      fix: 'Ensure each id attribute value is unique within the document',
      wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/parsing.html',
    };
  },
};

const positiveTabindexRule: RuntimeA11yRule = {
  id: 'positive-tabindex',
  name: 'Positive Tabindex',
  severity: 'warning',
  wcagLevel: 'A',
  check(element: Element): RuntimeViolation | null {
    const tabindex = element.getAttribute('tabindex');
    if (tabindex === null) return null;

    const value = parseInt(tabindex, 10);
    if (isNaN(value) || value <= 0) return null;

    return {
      ruleId: 'positive-tabindex',
      severity: 'warning',
      element: snippetOf(element),
      selector: selectorOf(element),
      message: `Element has tabindex="${value}" — positive tabindex disrupts natural tab order`,
      fix: 'Use tabindex="0" for focusable elements or tabindex="-1" for programmatic focus. Rely on DOM order for tab sequence.',
      wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html',
    };
  },
};

const autoplayMediaRule: RuntimeA11yRule = {
  id: 'autoplay-media',
  name: 'Autoplay Media',
  severity: 'error',
  wcagLevel: 'A',
  check(element: Element): RuntimeViolation | null {
    if (!element.matches('video, audio')) return null;

    const hasAutoplay = element.hasAttribute('autoplay');
    const isMuted = element.hasAttribute('muted');

    if (!hasAutoplay || isMuted) return null;

    return {
      ruleId: 'autoplay-media',
      severity: 'error',
      element: snippetOf(element),
      selector: selectorOf(element),
      message: 'Media element autoplays without being muted',
      fix: 'Add muted attribute to autoplay media, or remove autoplay and let users control playback',
      wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html',
    };
  },
};

/* ------------------------------------------------------------------ */
/*  Exports                                                            */
/* ------------------------------------------------------------------ */

export const runtimeA11yRules: RuntimeA11yRule[] = [
  dynamicContrastRule,
  focusVisibleRule,
  touchTargetRule,
  headingOrderRule,
  langAttributeRule,
  duplicateIdRule,
  positiveTabindexRule,
  autoplayMediaRule,
];

export function getRuleById(id: string): RuntimeA11yRule | undefined {
  return runtimeA11yRules.find((r) => r.id === id);
}
