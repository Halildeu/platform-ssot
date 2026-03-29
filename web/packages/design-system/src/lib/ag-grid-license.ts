 
import { LicenseManager } from 'ag-grid-enterprise';

type EnvRecord = Record<string, string | undefined>;
type ConsoleMethod = (...args: unknown[]) => void;

type ConsolePatchState = {
  error: ConsoleMethod;
  warn: ConsoleMethod;
  info: ConsoleMethod;
  log: ConsoleMethod;
} | null;

const getEnvValue = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && typeof process.env?.[key] === 'string') {
    return process.env[key];
  }
  if (typeof window !== 'undefined') {
    const win = window as Window & {
      __env__?: EnvRecord;
      __ENV__?: EnvRecord;
    };
    const candidate = win.__env__?.[key] ?? win.__ENV__?.[key];
    if (typeof candidate === 'string') {
      return candidate;
    }
  }
  return undefined;
};

const resolveAgGridLicenseKey = (): string | undefined => {
  const candidate = getEnvValue('VITE_AG_GRID_LICENSE_KEY') ?? getEnvValue('AG_GRID_LICENSE_KEY');
  const normalized = candidate?.trim();
  return normalized ? normalized : undefined;
};

let appliedKey: string | null = null;
let suppressedConsole = false;
let warnedOnce = false;
let originalConsole: ConsolePatchState = null;

const isAsteriskBanner = (value: string) => /^\*{10,}\s*$/.test(value);

const toConsoleText = (args: unknown[]) =>
  args
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
      if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
      if (arg == null) return '';
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    })
    .join(' ');

const isAgGridLicenseMessage = (value: string) => {
  const normalized = value.toLowerCase();
  if (normalized.includes('ag grid: error #257')) return true;
  if (normalized.includes('ag grid enterprise license')) return true;
  if (normalized.includes('license key not found')) return true;
  if (normalized.includes('info@ag-grid.com')) return true;
  if (normalized.includes('enterprise features are unlocked for trial')) return true;
  if (normalized.includes('trial only')) return true;
  if (normalized.includes('ag-grid-enterprise')) return true;
  return false;
};

const suppressAgGridLicenseConsoleNoise = () => {
  if (suppressedConsole) return;
  if (
    typeof console === 'undefined' ||
    typeof console.error !== 'function' ||
    typeof console.warn !== 'function' ||
    typeof console.info !== 'function' ||
    typeof console.log !== 'function'
  ) {
    return;
  }

  originalConsole ??= {
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    info: console.info.bind(console),
    log: console.log.bind(console),
  };

  const shouldSuppress = (args: unknown[]) => {
    const text = toConsoleText(args);
    if (!text) return false;
    return isAsteriskBanner(text) || isAgGridLicenseMessage(text);
  };

  console.error = (...args: unknown[]) => {
    if (shouldSuppress(args)) return;
    originalConsole?.error(...args);
  };
  console.warn = (...args: unknown[]) => {
    if (shouldSuppress(args)) return;
    originalConsole?.warn(...args);
  };
  console.info = (...args: unknown[]) => {
    if (shouldSuppress(args)) return;
    originalConsole?.info(...args);
  };
  console.log = (...args: unknown[]) => {
    if (shouldSuppress(args)) return;
    originalConsole?.log(...args);
  };

  suppressedConsole = true;
  if (!warnedOnce) {
    console.info(
      '[ag-grid] Enterprise lisans anahtarı tanımlı değil; geliştirme/test modunda lisans gürültüsü filtrelendi.',
    );
    warnedOnce = true;
  }
};

export const setupAgGridLicense = (): boolean => {
  const nodeEnv = typeof process !== 'undefined' ? process.env?.NODE_ENV : undefined;
  const isProd = nodeEnv === 'production';

  const nextKey = resolveAgGridLicenseKey();
  if (typeof window !== 'undefined' && !(window as unknown as Record<string, unknown>).__agLicenseDebugDone) {
    (window as unknown as Record<string, unknown>).__agLicenseDebugDone = true;
     
    console.debug('[ag-grid-license] resolved key:', nextKey ? `found (${nextKey.length} chars)` : 'NOT FOUND',
      '| window.__env__:', typeof (window as unknown as Record<string, unknown>).__env__,
      '| process.env:', typeof process !== 'undefined' ? 'defined' : 'undefined');
  }
  if (!nextKey) {
    if (!isProd) {
      suppressAgGridLicenseConsoleNoise();
    }
    return false;
  }
  if (appliedKey === nextKey) {
    return true;
  }
  if (typeof LicenseManager.setLicenseKey === 'function') {
    LicenseManager.setLicenseKey(nextKey);
  }
  appliedKey = nextKey;
  return true;
};
