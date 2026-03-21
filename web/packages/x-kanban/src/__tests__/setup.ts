import '@testing-library/jest-dom/vitest';

// ---------------------------------------------------------------------------
// Suppress known non-actionable warnings in test environment
// ---------------------------------------------------------------------------
const SUPPRESSED_PATTERNS = [
  'AG Grid',
  'ag-grid',
  'AG Charts',
  'ag-charts',
  'deprecated',
  'selectSize',
  'onValueChange',
  'Unknown event handler',
  'act(...)',
  'act(() =>',
  'ReactDOM.render',
  'Vite CJS',
  'Path2D',
  'setTransform',
  'content layer',
  'tailwind',
  'canvas',
  'getContext',
  'not implemented',
  'Not implemented',
  'Error: Not implemented',
  'Could not parse CSS',
  'React does not recognize',
];

const isSuppressed = (args: unknown[]): boolean => {
  const msg = typeof args[0] === 'string' ? args[0] : String(args[0] ?? '');
  return SUPPRESSED_PATTERNS.some((p) => msg.includes(p));
};

const origWarn = console.warn;
const origError = console.error;
const origInfo = console.info;
const origLog = console.log;

console.warn = (...args: unknown[]) => {
  if (isSuppressed(args)) return;
  origWarn.apply(console, args);
};
console.error = (...args: unknown[]) => {
  if (isSuppressed(args)) return;
  origError.apply(console, args);
};
console.info = (...args: unknown[]) => {
  if (isSuppressed(args)) return;
  origInfo.apply(console, args);
};
console.log = (...args: unknown[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : String(args[0] ?? '');
  if (msg.startsWith('AG Grid:')) return;
  origLog.apply(console, args);
};
