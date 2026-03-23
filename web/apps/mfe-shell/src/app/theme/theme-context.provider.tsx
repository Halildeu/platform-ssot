import React, { createContext, useContext, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import figmaTokens from '../../../../../design-tokens/figma.tokens.json';
import { api, conditionalGet, resolveAuthToken } from '@mfe/shared-http';
import {
  updateThemeAxes,
  getThemeAxes,
  subscribeThemeAxes,
  type ThemeAxes,
  type ThemeAppearance,
  type ThemeDensity,
  type ThemeRadius,
  type ThemeElevation,
  type ThemeMotion,
  type TableSurfaceTone,
  type ThemeAccent,
  setTableSurfaceTone,
  setOverlayIntensity,
  type ThemeSurfaceTone,
  getThemeContract,
  resolveThemeModeKey,
} from '@mfe/design-system';
import { clampRgba, parseAnyColor, type RgbaColor } from './color-utils';
import { useAppSelector } from '../store/store.hooks';
import { isPermitAllMode } from '../auth/auth-config';

export type ThemeKey = string;

type ThemeConfig = {
  key: ThemeKey;
  label: string;
  description: string;
  accent: ThemeAccent;
  lightTokens: {
    colorBgLayout: string;
    colorText: string;
    colorHeading: string;
  };
  antTokens: {
    colorPrimary: string;
    colorBgBase: string;
    colorTextBase: string;
  };
};

type ThemeRuntimeConfig = ThemeConfig & {
  isDarkMode: boolean;
  colors: {
    background: string;
    text: string;
    heading: string;
  };
};

type TokenValue = { value?: string | number };
type ModeToken = { modes?: Record<string, TokenValue> };
type ThemePalette = Record<string, Record<string, TokenValue>>;
type ThemeAccentMap = Record<string, Record<string, TokenValue>>;
type SurfaceToneOption = { id: string; label?: string; color: string; preview?: string; group?: string };
type SurfaceToneGroup = { id: string; label?: string; tones: string[] };
type FigmaTokenTree = {
  semantic?: {
    theme?: {
      palette?: ThemePalette;
      accent?: ThemeAccentMap;
    };
    color?: {
      surface?: { default?: { bg?: ModeToken } };
      text?: { primary?: ModeToken };
      action?: { primary?: { bg?: ModeToken } };
    };
  };
  meta?: {
    surfaceTone?: {
      default?: string;
      presets?: string[];
      options?: { id: string; label?: string; group?: string; preview?: string }[];
      groups?: { id: string; label?: string; tones?: string[] }[];
    };
  };
};

type ResolvedThemeResponse = {
  themeId: string;
  type: 'GLOBAL' | 'USER';
  version?: string | null;
  updatedAt?: string | null;
  appearance: ThemeAppearance | string;
  surfaceTone?: string | null;
  axes?: {
    accent?: ThemeAccent | string;
    density?: ThemeDensity | string;
    radius?: ThemeRadius | string;
    elevation?: ThemeElevation | string;
    motion?: ThemeMotion | string;
  };
  tokens?: Record<string, string>;
};

type ThemeRegistryEntry = {
  key: string;
  cssVars?: string[];
};

const tokens = figmaTokens as FigmaTokenTree;
const themeContract = getThemeContract();
const RESOLVED_THEME_CACHE_KEY_PREFIX = 'mfe.theme.resolved.v1';
const RESOLVED_THEME_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type ResolvedThemeCacheEntry = {
  cachedAt: number;
  etag?: string;
  data: ResolvedThemeResponse;
};

type UniversalGlobal = typeof globalThis & { Buffer?: typeof Buffer };

const getUniversalGlobal = (): UniversalGlobal | undefined => {
  if (typeof globalThis !== 'undefined') {
    return globalThis as UniversalGlobal;
  }
  if (typeof window !== 'undefined') {
    return window as unknown as UniversalGlobal;
  }
  if (typeof self !== 'undefined') {
    return self as unknown as UniversalGlobal;
  }
  return undefined;
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const segments = token.split('.');
    if (segments.length < 2) {
      return null;
    }
    const normalized = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + (4 - (normalized.length % 4 || 4)) % 4, '=');
    let decoded: string | null = null;
    const globalScope = getUniversalGlobal();
    if (globalScope && typeof globalScope.atob === 'function') {
      decoded = globalScope.atob(padded);
    } else if (globalScope?.Buffer) {
      decoded = globalScope.Buffer.from(padded, 'base64').toString('utf-8');
    }
    if (!decoded) {
      return null;
    }
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const resolveResolvedThemeCacheKey = (token?: string | null): string | null => {
  const resolvedToken = token ?? resolveAuthToken();
  if (!resolvedToken) {
    return null;
  }
  const payload = decodeJwtPayload(resolvedToken);
  const sub = payload?.sub;
  const userKey = typeof sub === 'string' || typeof sub === 'number' ? String(sub) : null;
  if (!userKey) {
    return null;
  }
  return `${RESOLVED_THEME_CACHE_KEY_PREFIX}:${userKey}`;
};

const readResolvedThemeCache = (storageKey: string): ResolvedThemeCacheEntry | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<ResolvedThemeCacheEntry> | null;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    if (!parsed.data || typeof parsed.data !== 'object') {
      return null;
    }
    const cachedAt = typeof parsed.cachedAt === 'number' ? parsed.cachedAt : 0;
    if (cachedAt > 0 && Date.now() - cachedAt > RESOLVED_THEME_CACHE_TTL_MS) {
      return null;
    }
    return parsed as ResolvedThemeCacheEntry;
  } catch {
    return null;
  }
};

const writeResolvedThemeCache = (storageKey: string, entry: ResolvedThemeCacheEntry) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(entry));
  } catch {
    // ignore storage errors
  }
};

const paletteTokens = tokens.semantic?.theme?.palette ?? {};
const accentTokens = tokens.semantic?.theme?.accent ?? {};
const surfaceToneTokens = (tokens.semantic?.color?.surface as Record<string, unknown>)?.tones as Record<string, Record<string, Record<string, { value?: string }>>> ?? {};
const paletteKeys = Object.keys(paletteTokens) as ThemeKey[];
const defaultAppearanceMode = themeContract.defaultMode;
const hasHighContrastAppearance = Boolean(themeContract.aliases?.appearance?.['high-contrast']);
const fallbackPalette = paletteTokens.light ?? paletteTokens.dark ?? (paletteKeys[0] ? paletteTokens[paletteKeys[0]] : {});
const surfaceToneMeta = tokens.meta?.surfaceTone ?? {};
const surfaceToneOptions =
  surfaceToneMeta.options?.map((opt: { id: string; label?: string; group?: string; preview?: string }) => ({
    id: opt.id,
    label: opt.label,
    group: opt.group,
    preview: opt.preview,
  })) ??
  Object.keys(surfaceToneTokens).map((id) => ({ id, label: toTitleCase(id), preview: undefined, group: undefined }));
const surfaceTonePresetIds =
  (surfaceToneMeta.presets && surfaceToneMeta.presets.length > 0 ? surfaceToneMeta.presets : undefined) ??
  surfaceToneOptions.slice(0, 6).map((opt) => opt.id);
const surfaceToneGroups: SurfaceToneGroup[] =
  surfaceToneMeta.groups?.map((group) => ({
    id: group.id,
    label: group.label,
    tones: group.tones ?? [],
  })) ?? [];

const toTitleCase = (value: string) =>
  value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const lookupTokenPath = (root: unknown, segments: string[]): unknown => {
  return segments.reduce<unknown>((node, key) => {
    if (!isRecord(node) || !(key in node)) {
      return undefined;
    }
    return (node as Record<string, unknown>)[key];
  }, root);
};

const resolveTokenValue = (raw: unknown): string => {
  if (raw === null || typeof raw === 'undefined') {
    return '';
  }
  if (typeof raw === 'number') {
    return String(raw);
  }
  if (typeof raw !== 'string') {
    return String(raw);
  }
  const trimmed = raw.trim();
  const refMatch = trimmed.match(/^\{([^}]+)\}$/);
  if (refMatch) {
    const refPath = refMatch[1].split('.');
    const resolved = lookupTokenPath(tokens, refPath);
    if (isRecord(resolved) && 'value' in resolved) {
      return resolveTokenValue((resolved as { value?: unknown }).value);
    }
    if (typeof resolved === 'string' || typeof resolved === 'number') {
      return String(resolved);
    }
    return '';
  }
  return trimmed;
};

const resolvePaletteValue = (palette: Record<string, TokenValue> | undefined, key: string): string =>
  resolveTokenValue(palette?.[key]?.value ?? fallbackPalette?.[key]?.value ?? '');

const resolveSemanticModeValue = (path: string[], modeKey: string): string => {
  const node = lookupTokenPath(tokens, path);
  const modes = isRecord(node) && 'modes' in node && isRecord((node as { modes?: unknown }).modes)
    ? (node as { modes: Record<string, TokenValue> }).modes
    : {};
  const target = modes[modeKey] ?? modes[defaultAppearanceMode];
  return resolveTokenValue(target?.value);
};

const hexToRgb = (value: string) => {
  const hex = value.replace('#', '');
  if (hex.length !== 6 && hex.length !== 3) {
    return null;
  }
  const normalized = hex.length === 3 ? hex.split('').map((ch) => ch + ch).join('') : hex;
  const int = Number.parseInt(normalized, 16);
  if (Number.isNaN(int)) {
    return null;
  }
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
};

const isDarkColor = (value: string): boolean => {
  const rgb = hexToRgb(value);
  if (!rgb) {
    return false;
  }
  const luma = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return luma < 0.5;
};

const defaultAccent: ThemeAccent = Object.keys(accentTokens)[0] ?? 'light';

const deriveAppearanceForPalette = (key: ThemeKey, palette: Record<string, TokenValue> | undefined): ThemeAppearance => {
  if (key === 'high-contrast') return 'high-contrast';
  if (String(key).toLowerCase().includes('dark')) return 'dark';
  const baseColor = resolvePaletteValue(palette, 'colorBgBase') || resolvePaletteValue(palette, 'colorBgLayout');
  return isDarkColor(baseColor) ? 'dark' : 'light';
};

const buildThemeConfig = (key: ThemeKey, palette: Record<string, TokenValue> | undefined): ThemeConfig => {
  const accent: ThemeAccent = accentTokens[key] ? (key as ThemeAccent) : defaultAccent;
  return {
    key,
    label: toTitleCase(key),
    description: '',
    accent,
    lightTokens: {
      colorBgLayout: resolvePaletteValue(palette, 'colorBgLayout'),
      colorText: resolvePaletteValue(palette, 'colorText'),
      colorHeading: resolvePaletteValue(palette, 'colorHeading'),
    },
    antTokens: {
      colorPrimary: resolvePaletteValue(palette, 'colorPrimary'),
      colorBgBase: resolvePaletteValue(palette, 'colorBgBase'),
      colorTextBase: resolvePaletteValue(palette, 'colorTextBase'),
    },
  };
};

const baseThemesFromTokens: ThemeConfig[] = paletteKeys.map((key) => buildThemeConfig(key, paletteTokens[key]));

const buildHighContrastThemeConfig = (): ThemeConfig | null => {
  const modeKey = resolveThemeModeKey({ appearance: 'high-contrast', density: 'comfortable' }) || defaultAppearanceMode;
  const bg = resolveSemanticModeValue(['semantic', 'color', 'surface', 'default', 'bg'], modeKey);
  const text = resolveSemanticModeValue(['semantic', 'color', 'text', 'primary'], modeKey);
  const accent = resolveSemanticModeValue(['semantic', 'color', 'action', 'primary', 'bg'], modeKey);

  if (!bg || !text || !accent) {
    return null;
  }

  return {
    key: 'high-contrast',
    label: toTitleCase('high-contrast'),
    description: '',
    accent: defaultAccent,
    lightTokens: {
      colorBgLayout: bg,
      colorText: text,
      colorHeading: text,
    },
    antTokens: {
      colorPrimary: accent,
      colorBgBase: bg,
      colorTextBase: text,
    },
  };
};

const BASE_THEMES: ThemeConfig[] =
  baseThemesFromTokens.length > 0
    ? [
        ...baseThemesFromTokens,
        ...(hasHighContrastAppearance && !baseThemesFromTokens.find((theme) => theme.key === 'high-contrast')
          ? [buildHighContrastThemeConfig()]
          : []),
      ].filter((theme): theme is ThemeConfig => Boolean(theme))
    : [buildThemeConfig('light', fallbackPalette)];

const DEFAULT_THEME_KEY: ThemeKey = BASE_THEMES[0]?.key ?? 'light';

const THEME_PRESETS: Record<ThemeKey, { appearance: ThemeAppearance; accent: ThemeAccent }> = BASE_THEMES.reduce(
  (acc, theme) => {
    acc[theme.key] = {
      appearance: deriveAppearanceForPalette(theme.key, paletteTokens?.[theme.key]),
      accent: theme.accent,
    };
    return acc;
  },
  {} as Record<ThemeKey, { appearance: ThemeAppearance; accent: ThemeAccent }>,
);

const deriveThemeKeyFromAxes = (axes: ThemeAxes): ThemeKey => {
  const match = (Object.entries(THEME_PRESETS) as [ThemeKey, { appearance: ThemeAppearance; accent: ThemeAccent }][])
    .find(([, preset]) => preset.appearance === axes.appearance && preset.accent === axes.accent);
  return (match ? match[0] : undefined) ?? DEFAULT_THEME_KEY;
};

export type ThemeContextValue = {
  themeKey: ThemeKey;
  setThemeKey: (key: ThemeKey) => void;
  currentThemeId: string | null;
  setThemeId: (themeId: string | null) => Promise<void>;
  refreshResolvedTheme: (options?: { force?: boolean }) => Promise<void>;
  cycleTheme: () => void;
  options: ThemeConfig[];
  currentTheme: ThemeRuntimeConfig;
  axes: ThemeAxes;
  setAppearance: (appearance: ThemeAppearance) => void;
  setAccent: (accent: ThemeAccent) => void;
  setDensity: (density: ThemeDensity) => void;
  setRadius: (radius: ThemeRadius) => void;
  setElevation: (elevation: ThemeElevation) => void;
  setMotion: (motion: ThemeMotion) => void;
  setOverlayOpacity: (opacity: number) => void;
  setTableSurfaceTone?: (tone: TableSurfaceTone) => void;
  setOverlayIntensity?: (intensity: number) => void;
  surfaceTone: ThemeSurfaceTone;
  setSurfaceTone: (tone: ThemeSurfaceTone) => void;
  surfaceToneOptions: { id: string; label?: string }[];
  surfaceToneSwatches: SurfaceToneOption[];
  surfaceTonePresets: SurfaceToneOption[];
  surfaceTonePalette: { id: string; label?: string; tones: SurfaceToneOption[] }[];
  surfaceToneSelection: ThemeSurfaceTone | null;
  surfaceColor: RgbaColor;
  setSurfaceColor: (color: RgbaColor) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const initialAxes = getThemeAxes();
  const { token: authToken, initialized: authInitialized } = useAppSelector((state) => state.auth);
  const [axes, setAxes] = useState<ThemeAxes>(initialAxes);
  const [themeKey, setThemeKeyState] = useState<ThemeKey>(() => deriveThemeKeyFromAxes(initialAxes));
  const [surfaceColor, setSurfaceColorState] = useState<RgbaColor>({ r: 255, g: 255, b: 255, a: 1 });
  const surfaceColorRef = useRef<RgbaColor>(surfaceColor);
  const [surfaceToneSelection, setSurfaceToneSelection] = useState<string | null>(initialAxes.surfaceTone ?? null);
  const [currentThemeId, setCurrentThemeId] = useState<string | null>(null);
  const [registryByKey, setRegistryByKey] = useState<Record<string, string[]>>({});
  const mountedRef = useRef(true);
  const appliedRegistryVarsRef = useRef<Set<string>>(new Set());
  const lastResolvedTokensRef = useRef<Record<string, string>>({});
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  useEffect(() => {
    surfaceColorRef.current = surfaceColor;
  }, [surfaceColor]);
  const currentThemeAttr = useMemo(() => {
    return resolveThemeModeKey(axes);
  }, [axes.appearance, axes.density]);
  const surfaceToneSwatches: SurfaceToneOption[] = useMemo(() => {
    return surfaceToneOptions.map((opt) => {
      const modes = surfaceToneTokens?.[opt.id]?.modes ?? {} as Record<string, { value?: string }>;
      const raw =
        opt.preview ??
        (modes[currentThemeAttr] as { value?: string } | undefined)?.value ??
        (modes[defaultAppearanceMode] as { value?: string } | undefined)?.value ??
        (Object.values(modes)[0] as { value?: string } | undefined)?.value ??
        '';
      return {
        ...opt,
        color: resolveTokenValue(raw),
      };
    });
  }, [surfaceToneOptions, surfaceToneTokens, currentThemeAttr, defaultAppearanceMode]);
  const surfaceTonePresetSwatches = useMemo(() => {
    const presetSet = new Set(surfaceTonePresetIds);
    const filtered = surfaceToneSwatches.filter((opt) => presetSet.has(opt.id));
    if (filtered.length > 0) return filtered;
    return surfaceToneSwatches.slice(0, 6);
  }, [surfaceToneSwatches, surfaceTonePresetIds]);

  const surfaceTonePalette = useMemo(() => {
    if (surfaceToneGroups.length > 0) {
      return surfaceToneGroups.map((group) => ({
        id: group.id,
        label: group.label,
        tones: group.tones
          .map((toneId) => surfaceToneSwatches.find((swatch) => swatch.id === toneId))
          .filter((tone): tone is SurfaceToneOption => Boolean(tone)),
      }));
    }
    return [{ id: 'all', label: undefined, tones: surfaceToneSwatches }];
  }, [surfaceToneGroups, surfaceToneSwatches]);

  const applyRegistryOverrides = useCallback(
    (tokens: Record<string, string> | undefined) => {
      if (typeof document === 'undefined') return;
      const root = document.documentElement;
      const scopedElements = Array.from(document.querySelectorAll('[data-theme-scope]')).filter(
        (element) => !element.closest('[data-theme-preview]'),
      );
      const targets = [root, ...scopedElements];

      const nextAppliedVars = new Set<string>();

      if (tokens) {
        for (const [key, rawValue] of Object.entries(tokens)) {
          const value = rawValue?.trim?.() ?? '';
          if (!value) continue;

          const cssVars = registryByKey[key] ?? [];
          for (const cssVar of cssVars) {
            nextAppliedVars.add(cssVar);
            targets.forEach((element) => (element as HTMLElement).style.setProperty(cssVar, value));
          }
        }
      }

      appliedRegistryVarsRef.current.forEach((cssVar) => {
        if (nextAppliedVars.has(cssVar)) return;
        targets.forEach((element) => (element as HTMLElement).style.removeProperty(cssVar));
      });

      appliedRegistryVarsRef.current = nextAppliedVars;
    },
    [registryByKey],
  );

  const readSurfaceColorFromCss = useCallback((): RgbaColor => {
    if (typeof window === 'undefined') return surfaceColorRef.current;
    const computed = getComputedStyle(document.documentElement).getPropertyValue('--surface-panel-bg').trim();
    const parsed = parseAnyColor(computed);
    return parsed ?? surfaceColorRef.current;
  }, []);

  const applyResolvedTheme = useCallback(
    (resolved: ResolvedThemeResponse) => {
      lastResolvedTokensRef.current = resolved.tokens ?? {};
      const patch: Partial<ThemeAxes> = {};
      if (resolved.appearance) {
        patch.appearance = resolved.appearance as ThemeAppearance;
      }
      if (resolved.surfaceTone) {
        patch.surfaceTone = resolved.surfaceTone as ThemeSurfaceTone;
      }
      if (resolved.axes?.accent) {
        patch.accent = resolved.axes.accent as ThemeAccent;
      }
      if (resolved.axes?.density) {
        patch.density = resolved.axes.density as ThemeDensity;
      }
      if (resolved.axes?.radius) {
        patch.radius = resolved.axes.radius as ThemeRadius;
      }
      if (resolved.axes?.elevation) {
        patch.elevation = resolved.axes.elevation as ThemeElevation;
      }
      if (resolved.axes?.motion) {
        patch.motion = resolved.axes.motion as ThemeMotion;
      }

      const nextAxes = updateThemeAxes(patch);
      setAxes(nextAxes);
      setThemeKeyState(deriveThemeKeyFromAxes(nextAxes));
      setSurfaceToneSelection(nextAxes.surfaceTone ?? null);
      setCurrentThemeId(resolved.themeId ?? null);

      const surfaceOverride = resolved.tokens?.['surface.default.bg'];
      if (surfaceOverride) {
        const parsed = parseAnyColor(surfaceOverride);
        if (parsed) {
          const clamped = clampRgba(parsed);
          setSurfaceColorState(clamped);
          setSurfaceToneSelection(null);
        }
      }

      applyRegistryOverrides(resolved.tokens);
      setSurfaceColorState(readSurfaceColorFromCss());
    },
    [applyRegistryOverrides, readSurfaceColorFromCss],
  );

  const refreshResolvedTheme = useCallback(
    async (options?: { force?: boolean }) => {
      if (typeof window === 'undefined') {
        return;
      }
      if (isPermitAllMode()) {
        return;
      }
      if (!authInitialized || !authToken) {
        return;
      }

      try {
        const cacheKey = resolveResolvedThemeCacheKey(authToken);
        const force = options?.force === true;
        const cached = !force && cacheKey ? readResolvedThemeCache(cacheKey) : null;

        if (cached?.data) {
          applyResolvedTheme(cached.data);
        }

        const response = force
          ? await api.get<ResolvedThemeResponse>('/v1/me/theme/resolved')
          : await conditionalGet<ResolvedThemeResponse>('/v1/me/theme/resolved', { etag: cached?.etag });

        if (!mountedRef.current) {
          return;
        }

        if (!force && response.status === 304) {
          if (cacheKey && cached) {
            writeResolvedThemeCache(cacheKey, { ...cached, cachedAt: Date.now() });
          }
          return;
        }

        applyResolvedTheme(response.data as ResolvedThemeResponse);
        if (cacheKey) {
          const etag = typeof response.headers?.etag === 'string' ? response.headers.etag : undefined;
          writeResolvedThemeCache(cacheKey, { cachedAt: Date.now(), etag, data: response.data as ResolvedThemeResponse });
        }
      } catch {
        // Backend tema profili zorunlu değil; local varsayılanlar kullanılmaya devam eder.
      }
    },
    [applyResolvedTheme, authInitialized, authToken],
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    let cancelled = false;

    const fetchRegistry = async () => {
      try {
        const response = await api.get<ThemeRegistryEntry[]>('/v1/theme-registry');
        if (cancelled) return;
        const next: Record<string, string[]> = {};
        (response.data ?? []).forEach((entry) => {
          next[entry.key] = Array.isArray(entry.cssVars) ? entry.cssVars.filter((v) => typeof v === 'string' && v.length > 0) : [];
        });
        setRegistryByKey(next);
      } catch {
        // Registry zorunlu değil; yalnızca override uygulama için kullanılır.
      }
    };

    fetchRegistry();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    applyRegistryOverrides(lastResolvedTokensRef.current);
  }, [applyRegistryOverrides]);

  useEffect(() => {
    const unsubscribe = subscribeThemeAxes((nextAxes) => {
      setAxes(nextAxes);
      setThemeKeyState(deriveThemeKeyFromAxes(nextAxes));
      setSurfaceToneSelection(nextAxes.surfaceTone ?? null);
      if (nextAxes.surfaceTone) {
        // Keep surface color in sync with current token-driven background when using preset tones.
        const cssColor = readSurfaceColorFromCss();
        setSurfaceColorState(cssColor);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [readSurfaceColorFromCss]);

  const applyPreset = (key: ThemeKey) => {
    const preset = THEME_PRESETS[key] ?? THEME_PRESETS[DEFAULT_THEME_KEY];
    updateThemeAxes({ appearance: preset.appearance, accent: preset.accent });
  };

  const handleAppearanceChange = (appearance: ThemeAppearance) => {
    updateThemeAxes({ appearance });
  };

  const handleAccentChange = (accent: ThemeAccent) => {
    updateThemeAxes({ accent });
  };

  const handleDensityChange = (density: ThemeDensity) => {
    updateThemeAxes({ density });
  };

  const handleRadiusChange = (radius: ThemeRadius) => {
    updateThemeAxes({ radius });
  };

  const handleElevationChange = (elevation: ThemeElevation) => {
    updateThemeAxes({ elevation });
  };

  const handleMotionChange = (motion: ThemeMotion) => {
    updateThemeAxes({ motion });
  };

  const handleOverlayOpacityChange = (opacity: number) => {
    updateThemeAxes({ overlayOpacity: Math.max(0, Math.min(100, opacity)) });
  };

  const isDarkMode = axes.appearance === 'dark' || axes.appearance === 'high-contrast';

  // Sync data-mode attribute for design-system dark-mode.css compatibility
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-mode', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode]);

  const cycleTheme = () => {
    const idx = BASE_THEMES.findIndex((theme) => theme.key === themeKey);
    const next = BASE_THEMES[(idx + 1) % BASE_THEMES.length];
    applyPreset(next.key);
  };

  const currentTheme = useMemo(() => {
    const base = BASE_THEMES.find((t) => t.key === themeKey) ?? BASE_THEMES[0];
    const tokens = {
      colorPrimary: base.antTokens.colorPrimary,
      colorBgBase: base.antTokens.colorBgBase,
      colorTextBase: base.antTokens.colorTextBase,
    };
    const colors = {
      background: base.lightTokens.colorBgLayout,
      text: base.lightTokens.colorText,
      heading: base.lightTokens.colorHeading,
    };
    return {
      ...base,
      isDarkMode,
      antTokens: tokens,
      colors,
    };
  }, [themeKey, isDarkMode]);

  const toggleDarkMode = () => {
    const targetAppearance: ThemeAppearance = isDarkMode ? 'light' : 'dark';
    const nextAxes = updateThemeAxes({ appearance: targetAppearance, accent: axes.accent });
    setThemeKeyState(deriveThemeKeyFromAxes(nextAxes));
  };

  const handleSurfaceToneChange = (tone: ThemeSurfaceTone) => {
    setSurfaceToneSelection(tone);
    const nextAxes = updateThemeAxes({ surfaceTone: tone });
    const toneColor = readSurfaceColorFromCss();
    setSurfaceColorState(toneColor);
    setThemeKeyState(deriveThemeKeyFromAxes(nextAxes));
  };

  const handleSurfaceColorChange = (color: RgbaColor) => {
    const clamped = clampRgba(color);
    setSurfaceColorState(clamped);
    setSurfaceToneSelection(null);
  };

  useEffect(() => {
    const initial = readSurfaceColorFromCss();
    setSurfaceColorState(initial);
  }, [readSurfaceColorFromCss]);

  useEffect(() => {
    void refreshResolvedTheme();
  }, [refreshResolvedTheme]);

  const handleSetThemeId = useCallback(
    async (themeId: string | null) => {
      if (!themeId) {
        return;
      }
      if (isPermitAllMode()) {
        return;
      }
      if (!authInitialized || !authToken) {
        return;
      }
      try {
        await api.patch('/v1/me/theme', { themeId });
        const response = await api.get<ResolvedThemeResponse>('/v1/me/theme/resolved');
        applyResolvedTheme(response.data);
        const cacheKey = resolveResolvedThemeCacheKey(authToken);
        if (cacheKey) {
          const etag = typeof response.headers?.etag === 'string' ? response.headers.etag : undefined;
          writeResolvedThemeCache(cacheKey, { cachedAt: Date.now(), etag, data: response.data });
        }
      } catch {
        // Persist zorunlu değil; hata durumunda local seçim korunur.
      }
    },
    [applyResolvedTheme, authInitialized, authToken],
  );

  const value: ThemeContextValue = {
    themeKey,
    setThemeKey: applyPreset,
    currentThemeId,
    setThemeId: handleSetThemeId,
    refreshResolvedTheme,
    cycleTheme,
    options: BASE_THEMES,
    currentTheme,
    axes,
    setAppearance: handleAppearanceChange,
    setAccent: handleAccentChange,
    setDensity: handleDensityChange,
    setRadius: handleRadiusChange,
    setElevation: handleElevationChange,
    setMotion: handleMotionChange,
    setOverlayOpacity: handleOverlayOpacityChange,
    setTableSurfaceTone,
    setOverlayIntensity,
    surfaceTone: axes.surfaceTone,
    setSurfaceTone: handleSurfaceToneChange,
    surfaceToneOptions,
    surfaceToneSwatches,
    surfaceTonePresets: surfaceTonePresetSwatches,
    surfaceTonePalette,
    surfaceToneSelection,
    surfaceColor,
    setSurfaceColor: handleSurfaceColorChange,
    isDarkMode,
    toggleDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('ThemeProvider is required to use ThemeContext');
  }
  return ctx;
};
