/**
 * Vitest global setup
 *  - jest-dom matchers (toBeInTheDocument, toHaveAttribute, etc.)
 *  - suppress runtime noise that is not actionable
 */
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

const originalConsoleError = console.error;
const originalConsoleInfo = console.info;

console.error = (...args: unknown[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : String(args[0] ?? '');

  // jsdom "Not implemented" stubs — not actionable in unit tests
  if (msg.includes('Not implemented')) return;

  originalConsoleError.apply(console, args);
};

console.info = (...args: unknown[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : String(args[0] ?? '');

  // AG Grid license info log — expected in dev/test without a license key
  if (msg.includes('AG Grid') && (msg.includes('license') || msg.includes('License') || msg.includes('lisans'))) return;

  originalConsoleInfo.apply(console, args);
};

const originalConsoleWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : String(args[0] ?? '');

  // AG Grid license / evaluation warnings — not actionable in unit tests
  if (msg.includes('AG Grid:') && (msg.includes('license') || msg.includes('License') || msg.includes('lisans'))) return;

  // Design-system deprecated prop warnings — emitted by backward-compat shims
  // and tested explicitly in individual component test suites.
  if (msg.startsWith('[DesignSystem]') && msg.includes('is deprecated')) return;

  originalConsoleWarn.apply(console, args);
};

const originalConsoleLog = console.log;
console.log = (...args: unknown[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : String(args[0] ?? '');

  // AG Grid migration / setup logs — noise in unit tests
  if (msg.startsWith('AG Grid:')) return;

  originalConsoleLog.apply(console, args);
};
