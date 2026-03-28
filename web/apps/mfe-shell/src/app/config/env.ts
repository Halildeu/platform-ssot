/* ------------------------------------------------------------------ */
/*  Environment variable helpers                                       */
/* ------------------------------------------------------------------ */

export const readEnv = (key: string, fallback: string): string => {
  if (typeof process !== "undefined" && process?.env?.[key]) {
    return process.env[key] as string;
  }
  if (typeof window !== "undefined") {
    const w = window as Window & { __env__?: Record<string, string> };
    if (w.__env__?.[key]) {
      return w.__env__[key] as string;
    }
  }
  return fallback;
};

export const readEnvBoolean = (key: string, fallback = false): boolean => {
  const value = readEnv(key, fallback ? "1" : "");
  const normalized = value.trim().toLowerCase();
  return (
    normalized === "1" ||
    normalized === "true" ||
    normalized === "yes" ||
    normalized === "on"
  );
};
