import themeContractJson from '../../../../design-tokens/generated/theme-contract.json';

export type ThemeContract = {
  version: string;
  defaultMode: string;
  allowedModes?: string[];
  modes: Record<
    string,
    {
      label?: string;
      appearance?: string;
      isHighContrast?: boolean;
    }
  >;
  aliases?: {
    appearance?: Record<string, string>;
    density?: Record<string, string>;
  };
  coerce?: Array<{
    when: Partial<{ appearance: string; density: string }>;
    mode: string;
  }>;
};

const contract = themeContractJson as ThemeContract;

export const getThemeContract = (): ThemeContract => contract;

const normalizeKey = (value: unknown): string => String(value ?? '').trim().toLowerCase();

const isAllowedMode = (modeKey: string): boolean => {
  const allowed = contract.allowedModes && contract.allowedModes.length > 0 ? contract.allowedModes : undefined;
  if (allowed) {
    return allowed.includes(modeKey);
  }
  return Boolean(contract.modes?.[modeKey]);
};

const applyCoerceRules = (current: string, axes: { appearance?: string; density?: string }): string => {
  const rules = Array.isArray(contract.coerce) ? contract.coerce : [];
  if (rules.length === 0) return current;

  let next = current;
  for (const rule of rules) {
    if (!rule || typeof rule !== 'object') continue;
    const when = rule.when ?? {};
    const matchAppearance = when.appearance ? when.appearance === axes.appearance : true;
    const matchDensity = when.density ? when.density === axes.density : true;
    if (matchAppearance && matchDensity && rule.mode && typeof rule.mode === 'string') {
      next = rule.mode;
    }
  }
  return next;
};

export const resolveThemeModeKey = (axes?: {
  appearance?: unknown;
  density?: unknown;
  modeKey?: unknown;
}): string => {
  const explicit = normalizeKey(axes?.modeKey);
  if (explicit && isAllowedMode(explicit)) {
    return explicit;
  }

  const appearance = normalizeKey(axes?.appearance);
  const density = normalizeKey(axes?.density);

  const densityAlias = contract.aliases?.density?.[density];
  const appearanceAlias = contract.aliases?.appearance?.[appearance];

  let candidate = densityAlias ?? appearanceAlias ?? contract.defaultMode;
  candidate = applyCoerceRules(candidate, { appearance, density });

  if (!isAllowedMode(candidate)) {
    return contract.defaultMode;
  }

  return candidate;
};

