/**
 * Vitest global setup — suppress runtime noise that is not actionable.
 *
 * Categories silenced:
 *  1. jsdom "Not implemented" stubs (e.g. HTMLCanvasElement.prototype.toDataURL)
 *  2. AG Grid enterprise license info log (console.info from ag-grid-license.ts)
 */

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
  if (msg.includes('[ag-grid]') && msg.includes('lisans')) return;

  originalConsoleInfo.apply(console, args);
};
