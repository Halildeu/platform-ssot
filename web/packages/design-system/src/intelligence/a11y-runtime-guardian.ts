/* ------------------------------------------------------------------ */
/*  A11y Runtime Guardian — MutationObserver-based a11y monitoring    */
/* ------------------------------------------------------------------ */

import type { RuntimeViolation } from './a11y-runtime-rules';
import { runtimeA11yRules } from './a11y-runtime-rules';

export interface A11yGuardianOptions {
  root?: HTMLElement;
  debounceMs?: number; // Default: 300
  maxChecksPerSecond?: number; // Default: 5
  checkContrast?: boolean; // Default: true
  checkAria?: boolean; // Default: true
  logToConsole?: boolean; // Default: true
  onViolation?: (violation: RuntimeViolation) => void;
}

export interface A11yGuardian {
  start(): void;
  stop(): void;
  check(): RuntimeViolation[];
  getViolations(): RuntimeViolation[];
  onViolation(callback: (v: RuntimeViolation) => void): () => void;
  isRunning(): boolean;
}

const SEVERITY_BADGE: Record<RuntimeViolation['severity'], string> = {
  error: '\u{1F534}',
  warning: '\u{1F7E1}',
  info: '\u{1F535}',
};

function scheduleIdleCallback(cb: () => void): number {
  if (typeof requestIdleCallback === 'function') {
    return requestIdleCallback(cb) as unknown as number;
  }
  return setTimeout(cb, 16) as unknown as number;
}

function cancelIdleCallbackCompat(id: number): void {
  if (typeof cancelIdleCallback === 'function') {
    cancelIdleCallback(id as unknown as ReturnType<typeof requestIdleCallback>);
  } else {
    clearTimeout(id);
  }
}

export function createA11yGuardian(options?: A11yGuardianOptions): A11yGuardian {
  const opts: Required<A11yGuardianOptions> = {
    root: undefined as unknown as HTMLElement,
    debounceMs: 300,
    maxChecksPerSecond: 5,
    checkContrast: true,
    checkAria: true,
    logToConsole: true,
    onViolation: () => {},
    ...options,
  };

  let running = false;
  let observer: MutationObserver | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let idleCallbackId: number | null = null;
  let isChecking = false; // Guard against infinite loops

  // Rate limiting
  let checkTimestamps: number[] = [];

  // Violation storage: keyed by element (WeakMap) + flat list
  const violationsByElement = new WeakMap<Element, RuntimeViolation[]>();
  const allViolations: RuntimeViolation[] = [];

  // Checked elements cache (reset on each check cycle)
  const checkedElements = new WeakSet<Element>();

  // Subscriber callbacks
  const subscribers: Array<(v: RuntimeViolation) => void> = [];
  if (opts.onViolation) {
    subscribers.push(opts.onViolation);
  }

  function getRoot(): HTMLElement {
    return opts.root || document.body;
  }

  function canCheck(): boolean {
    const now = Date.now();
    // Remove timestamps older than 1 second
    checkTimestamps = checkTimestamps.filter((t) => now - t < 1000);
    return checkTimestamps.length < opts.maxChecksPerSecond;
  }

  function recordCheck(): void {
    checkTimestamps.push(Date.now());
  }

  function getEnabledRules() {
    return runtimeA11yRules.filter((rule) => {
      if (!opts.checkContrast && rule.id === 'dynamic-contrast') return false;
      return true;
    });
  }

  function logViolation(v: RuntimeViolation): void {
    if (!opts.logToConsole) return;
    const badge = SEVERITY_BADGE[v.severity];
     
    console.warn(
      `${badge} [a11y-guardian] ${v.ruleId}: ${v.message}\n` +
        `  Selector: ${v.selector}\n` +
        `  Fix: ${v.fix}\n` +
        `  WCAG: ${v.wcagLink}`,
    );
  }

  function addViolation(v: RuntimeViolation, element: Element): void {
    // Deduplicate: don't add if same ruleId + selector already exists
    const existing = allViolations.find(
      (ev) => ev.ruleId === v.ruleId && ev.selector === v.selector,
    );
    if (existing) return;

    allViolations.push(v);

    const elementViolations = violationsByElement.get(element) || [];
    elementViolations.push(v);
    violationsByElement.set(element, elementViolations);

    logViolation(v);

    for (const cb of subscribers) {
      try {
        cb(v);
      } catch {
        // Ignore subscriber errors
      }
    }
  }

  function checkElement(element: Element): RuntimeViolation[] {
    if (checkedElements.has(element)) return [];
    checkedElements.add(element);

    const violations: RuntimeViolation[] = [];
    const rules = getEnabledRules();

    for (const rule of rules) {
      try {
        const violation = rule.check(element);
        if (violation) {
          violations.push(violation);
          addViolation(violation, element);
        }
      } catch {
        // Ignore rule execution errors
      }
    }

    return violations;
  }

  function checkSubtree(root: Element): RuntimeViolation[] {
    const violations: RuntimeViolation[] = [];

    // Check the root element itself
    violations.push(...checkElement(root));

    // Check all descendants
    const elements = root.querySelectorAll('*');
    for (let i = 0; i < elements.length; i++) {
      violations.push(...checkElement(elements[i]));
    }

    return violations;
  }

  function runCheck(): void {
    if (!running || isChecking) return;
    if (!canCheck()) return;

    isChecking = true;
    recordCheck();

    try {
      checkSubtree(getRoot());
    } finally {
      isChecking = false;
    }
  }

  function scheduleCheck(): void {
    if (!running || isChecking) return;

    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      // Use requestIdleCallback for heavy checks
      if (idleCallbackId !== null) {
        cancelIdleCallbackCompat(idleCallbackId);
      }
      idleCallbackId = scheduleIdleCallback(() => {
        idleCallbackId = null;
        runCheck();
      });
    }, opts.debounceMs);
  }

  function handleMutations(): void {
    scheduleCheck();
  }

  const guardian: A11yGuardian = {
    start(): void {
      if (process.env.NODE_ENV === 'production') return;
      if (running) return;

      running = true;

      observer = new MutationObserver(handleMutations);
      observer.observe(getRoot(), {
        childList: true,
        subtree: true,
        attributes: true,
      });

      // Run initial check
      scheduleCheck();
    },

    stop(): void {
      running = false;

      if (observer) {
        observer.disconnect();
        observer = null;
      }

      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }

      if (idleCallbackId !== null) {
        cancelIdleCallbackCompat(idleCallbackId);
        idleCallbackId = null;
      }

      checkTimestamps = [];
    },

    check(): RuntimeViolation[] {
      // Manual check: bypass debounce and rate limiting
      const _prevChecked = new WeakSet<Element>();
      isChecking = true;
      try {
        return checkSubtree(getRoot());
      } finally {
        isChecking = false;
      }
    },

    getViolations(): RuntimeViolation[] {
      return [...allViolations];
    },

    onViolation(callback: (v: RuntimeViolation) => void): () => void {
      subscribers.push(callback);
      return () => {
        const idx = subscribers.indexOf(callback);
        if (idx >= 0) subscribers.splice(idx, 1);
      };
    },

    isRunning(): boolean {
      return running;
    },
  };

  return guardian;
}
