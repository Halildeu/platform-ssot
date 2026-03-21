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

  // React act() warnings — expected in Vitest when using Testing Library
  if (msg.includes('act(...)') || msg.includes('act(() =>')) return;

  // AG Charts canvas/Path2D stubs — jsdom has no canvas support
  if (msg.includes('Path2D') || msg.includes('setTransform') || msg.includes('getContext')) return;

  // React unknown event handler warnings — design-system internal props
  if (msg.includes('Unknown event handler property')) return;

  // React DOM prop warnings from design-system internals
  if (msg.includes('React does not recognize') && msg.includes('prop on a DOM element')) return;

  // AG Grid enterprise license warnings
  if (msg.includes('AG Grid') || msg.includes('ag-grid')) return;

  // ReactDOM.render deprecation warning (React 18+)
  if (msg.includes('ReactDOM.render')) return;

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

  // AG Grid / ag-grid warnings
  if (msg.includes('AG Grid') || msg.includes('ag-grid')) return;

  // Deprecated API warnings (selectSize, onValueChange, etc.)
  if (msg.includes('deprecated') || msg.includes('selectSize') || msg.includes('onValueChange')) return;

  // Vite CJS build warnings
  if (msg.includes('Vite CJS')) return;

  originalConsoleWarn.apply(console, args);
};

const originalConsoleLog = console.log;
console.log = (...args: unknown[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : String(args[0] ?? '');

  // AG Grid migration / setup logs — noise in unit tests
  if (msg.startsWith('AG Grid:')) return;

  originalConsoleLog.apply(console, args);
};
