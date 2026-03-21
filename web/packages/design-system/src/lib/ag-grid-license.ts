import { LicenseManager } from 'ag-grid-enterprise';

type EnvRecord = Record<string, string | undefined>;

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

const isAsteriskBanner = (value: string) => /^\*{10,}\s*$/.test(value);

const isAgGridLicenseMessage = (value: string) => {
  const normalized = value.toLowerCase();
  if (normalized.includes('ag grid enterprise license')) return true;
  if (normalized.includes('license key not found')) return true;
  if (normalized.includes('info@ag-grid.com')) return true;
  if (normalized.includes('enterprise features are unlocked for trial')) return true;
  return false;
};

const suppressAgGridLicenseConsoleNoise = () => {
  if (suppressedConsole) return;
  if (typeof console === 'undefined' || typeof console.error !== 'function') return;
  const original = console.error.bind(console);

  console.error = (...args: unknown[]) => {
    const first = args[0];
    const text = typeof first === 'string' ? first : '';
    if (text && (isAsteriskBanner(text) || isAgGridLicenseMessage(text))) {
      return;
    }
    original(...args);
  };

  suppressedConsole = true;
  if (!warnedOnce) {
    console.info(
      '[ag-grid] Enterprise lisans anahtarı tanımlı değil; geliştirme modunda lisans uyarıları console.error’dan filtrelendi.',
    );
    warnedOnce = true;
  }
};

export const setupAgGridLicense = (): boolean => {
  // Skip license validation entirely in test environment
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return false;
  }

  const nextKey = resolveAgGridLicenseKey();
  if (!nextKey) {
    const isProd = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';
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
