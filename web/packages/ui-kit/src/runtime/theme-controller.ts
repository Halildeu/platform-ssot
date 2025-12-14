import tokens from '../../../../design-tokens/figma.tokens.json';

export type ThemeAppearance = 'light' | 'dark' | 'high-contrast';
export type ThemeAccent = string;
export type ThemeDensity = 'comfortable' | 'compact';
export type ThemeRadius = 'rounded' | 'sharp';
export type ThemeElevation = 'raised' | 'flat';
export type ThemeMotion = 'standard' | 'reduced';
export type TableSurfaceTone = 'soft' | 'normal' | 'strong';
export type ThemeSurfaceTone = string;

type TokenValue = { value?: string | number };
type ModeToken = { modes?: Record<string, TokenValue> };
type ThemeTokens = {
  semantic?: {
    theme?: {
      palette?: Record<string, Record<string, TokenValue>>;
      accent?: Record<string, Record<string, TokenValue>>;
    };
    color?: {
      surface?: { default?: { bg?: ModeToken } };
      overlay?: {
        intensity?: { min?: ModeToken; max?: ModeToken; default?: ModeToken };
        opacity?: { default?: ModeToken };
      };
    };
  };
  meta?: {
    surfaceTone?: {
      default?: string;
      options?: { id: string; label?: string }[];
    };
  };
};

const tokenTree = tokens as ThemeTokens;

const STORAGE_KEY = 'themeAxes';

export type ThemeAxes = {
  appearance: ThemeAppearance;
  density: ThemeDensity;
  radius: ThemeRadius;
  elevation: ThemeElevation;
  motion: ThemeMotion;
  tableSurfaceTone: TableSurfaceTone;
  surfaceTone: ThemeSurfaceTone;
  accent: ThemeAccent;
  overlayIntensity: number;
  overlayOpacity: number;
};

const defaultAccentFromTokens = (() => {
  const accentRoot = tokenTree.semantic?.theme?.accent ?? {};
  const palette = tokenTree.semantic?.theme?.palette ?? {};
  const keys = Object.keys(accentRoot).length > 0 ? Object.keys(accentRoot) : Object.keys(palette);
  const preferred = ['light', 'neutral'];
  const pick = preferred.find((k) => keys.includes(k)) ?? keys[0];
  return (pick as ThemeAccent) || ('light' as ThemeAccent);
})();

const appearanceModes = tokenTree.semantic?.color?.surface?.default?.bg?.modes ?? {};
const appearanceKeys = Object.keys(appearanceModes);
const fallbackAppearanceKey = appearanceKeys[0] ?? 'serban-light';

const pickAppearanceMode = (...candidates: string[]) => {
  for (const candidate of candidates) {
    if (candidate && appearanceModes[candidate]) {
      return candidate;
    }
  }
  return fallbackAppearanceKey;
};

const appearanceToTheme: Record<ThemeAppearance, string | undefined> = {
  light: pickAppearanceMode('serban-light', 'light'),
  dark: pickAppearanceMode('serban-dark', 'dark'),
  'high-contrast': pickAppearanceMode('serban-hc', 'high-contrast', 'hc'),
};

const compactTheme = pickAppearanceMode('serban-compact', 'compact') ?? appearanceToTheme.light ?? fallbackAppearanceKey;
const fallbackTheme = appearanceToTheme.light ?? compactTheme ?? fallbackAppearanceKey;

const DEFAULT_ACCENT: ThemeAccent = defaultAccentFromTokens;
const surfaceToneMeta = tokenTree.meta?.surfaceTone ?? {};
const surfaceToneOptions =
  surfaceToneMeta.options?.map((option) => option.id) ??
  Object.keys(tokenTree.semantic?.color?.surface?.tones ?? {});
const DEFAULT_SURFACE_TONE: ThemeSurfaceTone = surfaceToneMeta.default ?? surfaceToneOptions[0] ?? 'soft-1';

const overlayFromTokens = getOverlayConfigFromTokens(appearanceToTheme.light ?? fallbackAppearanceKey);
const defaultAxes: ThemeAxes = {
  appearance: 'light',
  density: 'comfortable',
  radius: 'rounded',
  elevation: 'raised',
  motion: 'standard',
  tableSurfaceTone: 'normal',
  surfaceTone: DEFAULT_SURFACE_TONE,
  accent: DEFAULT_ACCENT,
  overlayIntensity: overlayFromTokens.intensity.default,
  overlayOpacity: overlayFromTokens.opacity.default,
};

type ThemeListener = (axes: ThemeAxes) => void;

const listeners = new Set<ThemeListener>();
const getRoot = () => (typeof document !== 'undefined' ? document.documentElement : null);

const attributeMap: Record<keyof ThemeAxes, string> = {
  appearance: 'data-appearance',
  density: 'data-density',
  radius: 'data-radius',
  elevation: 'data-elevation',
  motion: 'data-motion',
  tableSurfaceTone: 'data-table-surface-tone',
  surfaceTone: 'data-surface-tone',
  accent: 'data-accent',
  overlayIntensity: 'data-overlay-intensity',
  overlayOpacity: 'data-overlay-opacity',
};

const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function getOverlayConfigFromTokens(preferredAppearance?: string) {
  const intensityNode = tokenTree.semantic?.color?.overlay?.intensity;
  const opacityNode = tokenTree.semantic?.color?.overlay?.opacity;

  const pickValue = (node: ModeToken | undefined, fallback: number): number => {
    const modes = node?.modes;
    if (modes && Object.keys(modes).length > 0) {
      const candidate =
        (preferredAppearance && modes[preferredAppearance]) ?? modes[fallbackAppearanceKey] ?? Object.values(modes)[0];
      const raw = candidate?.value;
      const num = typeof raw === 'number' ? raw : Number.parseFloat(String(raw ?? ''));
      if (Number.isFinite(num)) {
        return num;
      }
    }
    return fallback;
  };

  const min = pickValue(intensityNode?.min, 0);
  const max = pickValue(intensityNode?.max, 60);
  const defaultIntensity = pickValue(intensityNode?.default, 10);
  const defaultOpacity = pickValue(opacityNode?.default, 10);

  return {
    intensity: { min, max, default: defaultIntensity },
    opacity: { default: defaultOpacity },
  };
}

const overlayIntensityRange = {
  min: overlayFromTokens.intensity.min,
  max: overlayFromTokens.intensity.max,
};

const overlayOpacityRange = {
  min: 0,
  max: 100,
};

const resolveThemeAttr = (axes: ThemeAxes): string => {
  if (axes.appearance === 'high-contrast' && appearanceToTheme['high-contrast']) {
    return appearanceToTheme['high-contrast'] as string;
  }
  if (axes.appearance === 'dark' && appearanceToTheme.dark) {
    return appearanceToTheme.dark as string;
  }
  if (axes.density === 'compact' && compactTheme) {
    return compactTheme;
  }
  return fallbackTheme;
};

const loadStoredAxes = (): Partial<ThemeAxes> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<ThemeAxes>;
    return {
      appearance: parsed.appearance,
      density: parsed.density,
      radius: parsed.radius,
      elevation: parsed.elevation,
      motion: parsed.motion,
      tableSurfaceTone: parsed.tableSurfaceTone as TableSurfaceTone | undefined,
      surfaceTone: parsed.surfaceTone as ThemeSurfaceTone | undefined,
      accent: parsed.accent as ThemeAccent | undefined,
      overlayIntensity: typeof parsed.overlayIntensity === 'number' ? parsed.overlayIntensity : undefined,
      overlayOpacity: typeof parsed.overlayOpacity === 'number' ? parsed.overlayOpacity : undefined,
    };
  } catch {
    return {};
  }
};

const persistAxes = (axes: ThemeAxes) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(axes));
  } catch {
    // ignore storage errors
  }
};

const storedAxes = loadStoredAxes();

let currentAxes: ThemeAxes = {
  ...defaultAxes,
  ...storedAxes,
  overlayIntensity: clampNumber(
    storedAxes.overlayIntensity ?? defaultAxes.overlayIntensity,
    overlayIntensityRange.min,
    overlayIntensityRange.max,
  ),
  overlayOpacity: clampNumber(
    storedAxes.overlayOpacity ?? defaultAxes.overlayOpacity,
    overlayOpacityRange.min,
    overlayOpacityRange.max,
  ),
  tableSurfaceTone: (storedAxes.tableSurfaceTone ?? defaultAxes.tableSurfaceTone) as TableSurfaceTone,
};

export const getThemeAxes = (): ThemeAxes => {
  return currentAxes;
};

const applyAxes = (axes: ThemeAxes) => {
  const root = getRoot();
  if (!root) {
    return;
  }
  root.setAttribute(attributeMap.appearance, axes.appearance);
  root.setAttribute('data-mode', axes.appearance === 'dark' ? 'dark' : 'light');
  root.setAttribute(attributeMap.density, axes.density);
  root.setAttribute(attributeMap.radius, axes.radius);
  root.setAttribute(attributeMap.elevation, axes.elevation);
  root.setAttribute(attributeMap.motion, axes.motion);
  root.setAttribute(attributeMap.tableSurfaceTone, axes.tableSurfaceTone);
  root.setAttribute(attributeMap.surfaceTone, axes.surfaceTone);
  root.setAttribute(attributeMap.accent, axes.accent);
  root.setAttribute(attributeMap.overlayIntensity, String(axes.overlayIntensity));
  root.setAttribute(attributeMap.overlayOpacity, String(axes.overlayOpacity));
  root.style.setProperty('--overlay-intensity', String(axes.overlayIntensity));
  root.style.setProperty('--overlay-opacity', (axes.overlayOpacity / 100).toString());
  root.setAttribute('data-theme', resolveThemeAttr(axes));
};

const notify = () => {
  listeners.forEach((listener) => listener(currentAxes));
};

export const updateThemeAxes = (patch: Partial<ThemeAxes>) => {
  const next: ThemeAxes = {
    ...currentAxes,
    ...patch,
    overlayIntensity: clampNumber(
      patch.overlayIntensity ?? currentAxes.overlayIntensity,
      overlayIntensityRange.min,
      overlayIntensityRange.max,
    ),
    overlayOpacity: clampNumber(
      patch.overlayOpacity ?? currentAxes.overlayOpacity,
      overlayOpacityRange.min,
      overlayOpacityRange.max,
    ),
    tableSurfaceTone: (patch.tableSurfaceTone ?? currentAxes.tableSurfaceTone) as TableSurfaceTone,
    surfaceTone: (patch.surfaceTone ?? currentAxes.surfaceTone) as ThemeSurfaceTone,
  };
  currentAxes = next;
  applyAxes(next);
  persistAxes(next);
  notify();
  return next;
};

export const setAppearance = (appearance: ThemeAppearance) => updateThemeAxes({ appearance });
export const setDensity = (density: ThemeDensity) => updateThemeAxes({ density });
export const setRadius = (radius: ThemeRadius) => updateThemeAxes({ radius });
export const setElevation = (elevation: ThemeElevation) => updateThemeAxes({ elevation });
export const setMotion = (motion: ThemeMotion) => updateThemeAxes({ motion });
export const setTableSurfaceTone = (tableSurfaceTone: TableSurfaceTone) =>
  updateThemeAxes({ tableSurfaceTone });
export const setSurfaceTone = (surfaceTone: ThemeSurfaceTone) => updateThemeAxes({ surfaceTone });
export const setOverlayIntensity = (overlayIntensity: number) =>
  updateThemeAxes({ overlayIntensity });
export const setOverlayOpacity = (overlayOpacity: number) =>
  updateThemeAxes({ overlayOpacity });

export const subscribeThemeAxes = (listener: ThemeListener) => {
  listeners.add(listener);
  listener(getThemeAxes());
  return () => {
    listeners.delete(listener);
  };
};

// İlk yüklemede aksları DOM'a yansıt
applyAxes(currentAxes);

export const THEME_APPEARANCE_OPTIONS: ThemeAppearance[] = (['light', 'dark', 'high-contrast'] as ThemeAppearance[]).filter(
  (option) => {
    if (option === 'light') return Boolean(appearanceToTheme.light);
    if (option === 'dark') return Boolean(appearanceToTheme.dark);
    return Boolean(appearanceToTheme['high-contrast']);
  },
);
export const THEME_DENSITY_OPTIONS: ThemeDensity[] = ['comfortable', 'compact'];
export const THEME_RADIUS_OPTIONS: ThemeRadius[] = ['rounded', 'sharp'];
export const THEME_ELEVATION_OPTIONS: ThemeElevation[] = ['raised', 'flat'];
export const THEME_MOTION_OPTIONS: ThemeMotion[] = ['standard', 'reduced'];
