type RuntimeEnvRecord = Record<string, string | undefined>;

const readWindowEnv = (key: string): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const runtimeWindow = window as Window & {
    __env__?: RuntimeEnvRecord;
    __ENV__?: RuntimeEnvRecord;
  };
  const candidate = runtimeWindow.__env__?.[key] ?? runtimeWindow.__ENV__?.[key];
  return typeof candidate === 'string' ? candidate : undefined;
};

export const readRuntimeEnv = (key: string, fallback = ''): string => {
  if (typeof process !== 'undefined' && typeof process.env?.[key] === 'string') {
    return process.env[key] as string;
  }
  const windowValue = readWindowEnv(key);
  if (typeof windowValue === 'string') {
    return windowValue;
  }
  return fallback;
};

export const isRuntimeDev = (): boolean => {
  const nodeEnv = readRuntimeEnv('NODE_ENV', '');
  if (nodeEnv.length > 0) {
    return nodeEnv !== 'production';
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '::1';
  }
  return false;
};
