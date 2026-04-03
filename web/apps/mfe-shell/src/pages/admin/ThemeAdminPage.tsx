import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  PageLayout,
  Segmented,
  Text,
  createPageLayoutBreadcrumbItems,
  createPageLayoutPreset,
  createSegmentedPreset,
} from '@mfe/design-system';
import { api } from '@mfe/shared-http';
import { useThemeContext } from '../../app/theme/theme-context.provider';
import { parseAnyColor, rgbaToHex, rgbaToString, type RgbaColor as _RgbaColor } from '../../app/theme/color-utils';
import ThemeAdminPreviewPanel from './ThemeAdminPreviewPanel';
import ThemeAdminRegistryEditor from './ThemeAdminRegistryEditor';
import {
  contrastRatio,
  getAccentOptions,
  getDensityOptions,
  getElevationOptions,
  groupOrder,
  getMotionOptions,
  parseColor,
  getRadiusOptions,
  resolveThemeAttr,
  surfaceToneOptions,
  type ThemeColorPickerState,
  type ThemeDetails,
  type ThemeAdminRow,
  type ThemeMetaState,
  type ThemeRegistryEntry,
  type ThemeSummary,
} from './ThemeAdminPage.shared';
import { useThemeAdminI18n } from './useThemeAdminI18n';

/* ------------------------------------------------------------------ */
/*  localStorage hybrid persistence helpers                            */
/* ------------------------------------------------------------------ */

const LS_PREFIX = 'mfe.theme.admin';

function lsGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${LS_PREFIX}.${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function lsSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(`${LS_PREFIX}.${key}`, JSON.stringify(value));
  } catch {
    /* quota exceeded — silent */
  }
}

async function apiOrFallback<T>(
  apiCall: () => Promise<{ data: T }>,
  fallbackKey: string,
  fallbackData?: T,
): Promise<T> {
  try {
    const res = await apiCall();
    const data = res.data;
    lsSet(fallbackKey, data);
    return data;
  } catch {
    const cached = lsGet<T>(fallbackKey);
    if (cached) return cached;
    if (fallbackData !== undefined) return fallbackData;
    throw new Error(`No API and no cached data for ${fallbackKey}`);
  }
}

async function apiPutOrLocal(
  url: string,
  payload: unknown,
  localKey: string,
): Promise<void> {
  lsSet(localKey, payload);
  try {
    await api.put(url, payload);
  } catch {
    /* API unavailable — saved locally, silent */
  }
}

// STORY-0022: Theme Personalization v1.0
const ThemeAdminPage: React.FC = () => {
  const { t } = useThemeAdminI18n();
  const { currentThemeId, refreshResolvedTheme } = useThemeContext();
  const hasManualThemeSelectionRef = useRef(false);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const paletteInitRef = useRef(false);
  const [registry, setRegistry] = useState<ThemeRegistryEntry[]>([]);
  const [themes, setThemes] = useState<ThemeSummary[]>([]);
  const [defaultThemeId, setDefaultThemeId] = useState<string | null>(null);
  const [defaultThemeSaving, setDefaultThemeSaving] = useState(false);
  const [defaultThemeError, setDefaultThemeError] = useState<string | null>(null);
  const [defaultThemeSuccess, setDefaultThemeSuccess] = useState<string | null>(null);
  const [paletteDraft, setPaletteDraft] = useState<Record<string, boolean>>({});
  const [paletteSaving, setPaletteSaving] = useState(false);
  const [paletteError, setPaletteError] = useState<string | null>(null);
  const [paletteSuccess, setPaletteSuccess] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeDetails | null>(null);
  const [themeMeta, setThemeMeta] = useState<ThemeMetaState | null>(null);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [resolvedPreviewCssVars, setResolvedPreviewCssVars] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [contrastWarnings, setContrastWarnings] = useState<Record<string, string>>({});
  const [activeColorPicker, setActiveColorPicker] = useState<ThemeColorPickerState | null>(null);

  const accentOptions = useMemo(() => getAccentOptions(t), [t]);
  const densityOptions = useMemo(() => getDensityOptions(t), [t]);
  const radiusOptions = useMemo(() => getRadiusOptions(t), [t]);
  const elevationOptions = useMemo(() => getElevationOptions(t), [t]);
  const motionOptions = useMemo(() => getMotionOptions(t), [t]);
  const themeAxisSegmentedPreset = useMemo(
    () => ({
      ...createSegmentedPreset('toolbar'),
      size: 'sm' as const,
      fullWidth: true,
    }),
    [],
  );
  const densitySegmentedItems = useMemo(
    () => densityOptions.map((option) => ({
      value: option.value,
      label: option.label,
      dataTestId: `theme-meta-density-${option.value}`,
    })),
    [densityOptions],
  );
  const radiusSegmentedItems = useMemo(
    () => radiusOptions.map((option) => ({
      value: option.value,
      label: option.label,
      dataTestId: `theme-meta-radius-${option.value}`,
    })),
    [radiusOptions],
  );
  const elevationSegmentedItems = useMemo(
    () => elevationOptions.map((option) => ({
      value: option.value,
      label: option.label,
      dataTestId: `theme-meta-elevation-${option.value}`,
    })),
    [elevationOptions],
  );
  const motionSegmentedItems = useMemo(
    () => motionOptions.map((option) => ({
      value: option.value,
      label: option.label,
      dataTestId: `theme-meta-motion-${option.value}`,
    })),
    [motionOptions],
  );

  const resolveHttpErrorMessage = (error: unknown): { message: string | null; status: number | null } => {
    const anyError = error as { response?: { data?: unknown; status?: number }; message?: unknown };
    const status = typeof anyError.response?.status === 'number' ? anyError.response?.status ?? null : null;
    const data = anyError.response?.data;

    if (typeof data === 'string' && data.trim().length > 0) {
      return { message: data, status };
    }

    if (typeof data === 'object' && data !== null) {
      const record = data as Record<string, unknown>;
      const candidate =
        (typeof record.message === 'string' && record.message.trim().length > 0 ? record.message : null) ??
        (typeof record.detail === 'string' && record.detail.trim().length > 0 ? record.detail : null) ??
        (typeof record.errorCode === 'string' && record.errorCode.trim().length > 0 ? record.errorCode : null) ??
        (typeof record.title === 'string' && record.title.trim().length > 0 ? record.title : null) ??
        null;
      if (candidate) {
        return { message: candidate, status };
      }
    }

    if (typeof anyError.message === 'string' && anyError.message.trim().length > 0) {
      return { message: anyError.message, status };
    }

    return { message: null, status };
  };

  const formatHttpError = (error: unknown, fallback: string): string => {
    const { message, status } = resolveHttpErrorMessage(error);
    const resolved = message ?? fallback;
    if (status) {
      return `${resolved} (HTTP ${status})`;
    }
    return resolved;
  };

  useEffect(() => {
    if (!activeColorPicker) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveColorPicker(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeColorPicker]);

  const currentDefaultThemeId = useMemo(() => {
    const match = themes.find((theme) => String(theme.visibility ?? '').trim().toUpperCase() === 'DEFAULT');
    return match?.id ?? null;
  }, [themes]);

  const defaultThemeDirty = useMemo(() => {
    if (!defaultThemeId) return false;
    return defaultThemeId !== currentDefaultThemeId;
  }, [defaultThemeId, currentDefaultThemeId]);

  useEffect(() => {
    if (themes.length === 0) return;
    if (defaultThemeId) return;
    setDefaultThemeId(currentDefaultThemeId ?? themes[0]?.id ?? null);
  }, [themes, defaultThemeId, currentDefaultThemeId]);

  useEffect(() => {
    setDefaultThemeError(null);
    setDefaultThemeSuccess(null);
  }, [defaultThemeId]);

  useEffect(() => {
    if (paletteInitRef.current) return;
    if (themes.length === 0) return;

    const preferredAccents = ['light', 'violet', 'emerald', 'sunset', 'ocean', 'graphite'];
    const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();
    const hasExplicitPalette = themes.some((theme) => theme.activeFlag === true);

    const next: Record<string, boolean> = {};
    themes.forEach((theme) => {
      if (hasExplicitPalette) {
        next[theme.id] = theme.activeFlag === true;
        return;
      }
      const accent = normalize(theme.axes?.accent);
      next[theme.id] = preferredAccents.includes(accent);
    });

    if (!Object.values(next).some(Boolean) && themes[0]) {
      next[themes[0].id] = true;
    }

    paletteInitRef.current = true;
    setPaletteDraft(next);
  }, [themes]);

  const paletteSelectedCount = useMemo(() => Object.values(paletteDraft).filter(Boolean).length, [paletteDraft]);

  const paletteDirty = useMemo(() => {
    if (themes.length === 0) return false;
    if (Object.keys(paletteDraft).length === 0) return false;
    return themes.some((theme) => Boolean(theme.activeFlag) !== Boolean(paletteDraft[theme.id]));
  }, [themes, paletteDraft]);

  useEffect(() => {
    setPaletteError(null);
    setPaletteSuccess(null);
  }, [paletteDraft]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [registryData, themesData] = await Promise.all([
          apiOrFallback<ThemeRegistryEntry[]>(
            () => api.get<ThemeRegistryEntry[]>('/v1/theme-registry'),
            'registry',
            [],
          ),
          apiOrFallback<ThemeSummary[]>(
            () => api.get<ThemeSummary[]>('/v1/themes', { params: { scope: 'global' } }),
            'themes',
            [],
          ),
        ]);
        if (cancelled) return;
        setRegistry(registryData);
        setThemes(themesData);
        if (!selectedThemeId && themesData && themesData.length > 0) {
          const preferred =
            currentThemeId && themesData.some((theme: ThemeSummary) => theme.id === currentThemeId)
              ? currentThemeId
              : themesData[0].id;
          setSelectedThemeId(preferred);
        }
      } catch {
        if (!cancelled) {
          setError(t('themeadmin.error.loadRegistryThemes'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    if (hasManualThemeSelectionRef.current) return;
    if (!currentThemeId) return;
    if (!themes.some((theme) => theme.id === currentThemeId)) return;
    setSelectedThemeId(currentThemeId);
  }, [currentThemeId, themes]);

  useEffect(() => {
    let cancelled = false;

    const loadThemeOverrides = async () => {
      if (!selectedThemeId) {
        setOverrides({});
        setSelectedTheme(null);
        setThemeMeta(null);
        setResolvedPreviewCssVars({});
        setActiveColorPicker(null);
        setContrastWarnings({});
        return;
      }
      setResolvedPreviewCssVars({});
      setActiveColorPicker(null);
      setContrastWarnings({});
      setError(null);
      setSuccess(null);
      try {
        const themeData = await apiOrFallback<ThemeDetails>(
          () => api.get<ThemeDetails>(`/v1/themes/${selectedThemeId}`),
          `theme.${selectedThemeId}`,
        );
        if (cancelled) return;
        setOverrides(themeData.overrides ?? {});
        setSelectedTheme(themeData ?? null);
        setThemeMeta({
          appearance: themeData.appearance ?? 'light',
          surfaceTone: themeData.surfaceTone ?? null,
          axes: {
            accent: themeData.axes?.accent ?? 'neutral',
            density: themeData.axes?.density ?? 'comfortable',
            radius: themeData.axes?.radius ?? 'rounded',
            elevation: themeData.axes?.elevation ?? 'raised',
            motion: themeData.axes?.motion ?? 'standard',
          },
        });
      } catch {
        if (!cancelled) {
          setError(t('themeadmin.error.loadThemeDetails'));
          setThemeMeta(null);
        }
      }
    };
    void loadThemeOverrides();
    return () => {
      cancelled = true;
    };
  }, [selectedThemeId, t]);

  const registryCssVarsByKey = useMemo(() => {
    const map: Record<string, string[]> = {};
    registry.forEach((entry) => {
      map[entry.key] = Array.isArray(entry.cssVars) ? entry.cssVars : [];
    });
    return map;
  }, [registry]);

  const previewCssVarsToResolve = useMemo(() => {
    const set = new Set<string>();
    Object.values(registryCssVarsByKey).forEach((cssVars) => {
      cssVars.forEach((cssVar) => set.add(cssVar));
    });
    return Array.from(set);
  }, [registryCssVarsByKey]);

  useEffect(() => {
    const previewEl = previewRef.current;
    if (!previewEl) return;
    if (previewCssVarsToResolve.length === 0) return;

    let raf = 0;
    raf = window.requestAnimationFrame(() => {
      const computed = getComputedStyle(previewEl);
      const next: Record<string, string> = {};
      previewCssVarsToResolve.forEach((cssVar) => {
        const value = computed.getPropertyValue(cssVar).trim();
        if (value) {
          next[cssVar] = value;
        }
      });
      setResolvedPreviewCssVars(next);
    });

    return () => {
      window.cancelAnimationFrame(raf);
    };
  }, [previewCssVarsToResolve, selectedThemeId, themeMeta, overrides]);

  const previewThemeAttr = useMemo(() => {
    return resolveThemeAttr(
      themeMeta?.appearance ?? selectedTheme?.appearance,
      themeMeta?.axes?.density ?? selectedTheme?.axes?.density,
    );
  }, [selectedTheme, themeMeta]);

  const previewStyle = useMemo(() => {
    const styleVars: Record<string, string> = {};
    const orderedKeys = Object.keys(overrides).sort((a, b) => a.localeCompare(b));
    orderedKeys.forEach((key) => {
      const raw = overrides[key];
      const value = raw?.trim?.() ?? '';
      if (!value) return;
      const cssVars = registryCssVarsByKey[key] ?? [];
      cssVars.forEach((cssVar) => {
        styleVars[cssVar] = value;
      });
    });
    return styleVars as React.CSSProperties;
  }, [overrides, registryCssVarsByKey]);

  const resolvedPreviewDisplayCssVars = useMemo(() => {
    const next: Record<string, string> = {};
    Object.entries(resolvedPreviewCssVars).forEach(([cssVar, raw]) => {
      const parsed = parseAnyColor(raw);
      if (!parsed) {
        next[cssVar] = raw.trim();
        return;
      }
      next[cssVar] = parsed.a >= 1 ? rgbaToHex(parsed) : rgbaToString(parsed);
    });
    return next;
  }, [resolvedPreviewCssVars]);

  const rowsByGroup = useMemo(() => {
    const grouped: Record<string, ThemeAdminRow[]> = {};
    registry.forEach((entry) => {
      const group = entry.groupName ?? 'other';
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push({
        ...entry,
        value: overrides[entry.key],
      });
    });
    Object.values(grouped).forEach((rows) => {
      rows.sort((a, b) => a.key.localeCompare(b.key));
    });
    const sortedGroups = Object.keys(grouped).sort((a, b) => {
      const ia = groupOrder.indexOf(a);
      const ib = groupOrder.indexOf(b);
      const sa = ia === -1 ? Number.MAX_SAFE_INTEGER : ia;
      const sb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib;
      return sa - sb || a.localeCompare(b);
    });
    return sortedGroups.map((id) => ({ id, rows: grouped[id] }));
  }, [registry, overrides]);

  const textAreaGroups = useMemo(() => {
    const rows: ThemeAdminRow[] = registry.map((entry) => ({
      ...entry,
      value: overrides[entry.key],
    }));

    const byKey = (predicate: (row: ThemeAdminRow) => boolean) =>
      rows.filter(predicate).sort((a, b) => a.key.localeCompare(b.key));

    return [
      {
        id: 'core',
        label: t('themeadmin.textAreaGroup.core'),
        rows: byKey((row) => row.key.startsWith('text.')),
      },
      {
        id: 'action',
        label: t('themeadmin.textAreaGroup.action'),
        rows: byKey((row) => row.key.startsWith('action.') && row.key.endsWith('.text')),
      },
      {
        id: 'status',
        label: t('themeadmin.textAreaGroup.status'),
        rows: byKey((row) => row.key.startsWith('status.') && row.key.endsWith('.text')),
      },
      {
        id: 'grid',
        label: t('themeadmin.textAreaGroup.grid'),
        rows: byKey((row) => row.key.startsWith('grid.') && row.key.endsWith('.text')),
      },
      {
        id: 'accent',
        label: t('themeadmin.textAreaGroup.accent'),
        rows: byKey((row) => row.key.startsWith('accent.')),
      },
    ]
      .filter((group) => group.rows.length > 0);
  }, [registry, overrides, t]);

  const paletteThemes = useMemo(() => {
    const preferredAccents = ['light', 'violet', 'emerald', 'sunset', 'ocean', 'graphite'];
    const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();

    const explicitSelected = themes.filter((theme) => Boolean(paletteDraft[theme.id]));
    const hasExplicitPalette = explicitSelected.length > 0;

    let ordered: ThemeSummary[] = [];
    if (!hasExplicitPalette) {
      const byAccent = new Map<string, ThemeSummary>();
      themes.forEach((theme) => {
        const accent = normalize(theme.axes?.accent);
        if (preferredAccents.includes(accent) && !byAccent.has(accent)) {
          byAccent.set(accent, theme);
        }
      });
      ordered = preferredAccents.map((accent) => byAccent.get(accent)).filter(Boolean) as ThemeSummary[];
    } else {
      const byAccent = new Map<string, ThemeSummary>();
      explicitSelected.forEach((theme) => {
        const accent = normalize(theme.axes?.accent);
        if (!byAccent.has(accent)) {
          byAccent.set(accent, theme);
        }
      });

      const seen = new Set<string>();
      preferredAccents.forEach((accent) => {
        const theme = byAccent.get(accent);
        if (!theme) return;
        ordered.push(theme);
        seen.add(theme.id);
      });

      explicitSelected
        .filter((theme) => !seen.has(theme.id))
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((theme) => ordered.push(theme));
    }

    const selected = themes.find((theme) => theme.id === selectedThemeId);
    if (selected && !ordered.some((theme) => theme.id === selected.id)) {
      ordered.push(selected);
    }
    return ordered;
  }, [themes, selectedThemeId, paletteDraft]);

  const selectableThemes = useMemo(() => {
    const ordered: ThemeSummary[] = [];
    const seen = new Set<string>();
    paletteThemes.forEach((theme) => {
      ordered.push(theme);
      seen.add(theme.id);
    });
    themes.forEach((theme) => {
      if (seen.has(theme.id)) return;
      ordered.push(theme);
      seen.add(theme.id);
    });
    return ordered;
  }, [paletteThemes, themes]);

  const openColorPicker = (row: ThemeAdminRow) => {
    if (activeColorPicker?.key === row.key) {
      setActiveColorPicker(null);
      return;
    }
    const cssVars = Array.isArray(row.cssVars) ? row.cssVars : [];
    const resolvedValue = cssVars.length > 0 ? resolvedPreviewCssVars[cssVars[0]] : '';
    const candidate = row.value?.trim() ? row.value.trim() : resolvedValue;
    const parsed = parseAnyColor(candidate) ?? { r: 255, g: 255, b: 255, a: 1 };
    setActiveColorPicker({ key: row.key, label: row.label, color: parsed });
  };

  const handleValueChange = (key: string, value: string) => {
    const trimmed = value.trim();
    setOverrides((prev) => {
      const next = { ...prev };
      if (!trimmed) {
        delete next[key];
        return next;
      }
      next[key] = trimmed;
      return next;
    });
    setSuccess(null);

    const shouldCheckContrast =
      key.endsWith('.bg')
      && (
        key.startsWith('action.danger')
        || key.startsWith('status.danger')
        || key.startsWith('status.warning')
        || key.startsWith('status.success')
        || key.startsWith('status.info')
      );

    if (shouldCheckContrast) {
      if (!trimmed) {
        setContrastWarnings((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        return;
      }
      const bg = parseColor(trimmed);
      const fg = parseColor('#ffffff');
      if (!bg || !fg) {
        setContrastWarnings((prev) => ({
          ...prev,
          [key]: t('themeadmin.error.contrastParse'),
        }));
        return;
      }
      const ratio = contrastRatio(bg, fg);
      if (ratio < 4.5) {
        setContrastWarnings((prev) => ({
          ...prev,
          [key]: t('themeadmin.error.contrastBelowThreshold', { ratio: ratio.toFixed(2) }),
        }));
      } else {
        setContrastWarnings((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
    } else {
      setContrastWarnings((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleDefaultThemeSave = async () => {
    if (!defaultThemeId) {
      setDefaultThemeError(t('themeadmin.error.selectGlobalThemeFirst'));
      return;
    }
    setDefaultThemeSaving(true);
    setDefaultThemeError(null);
    setDefaultThemeSuccess(null);
    try {
      await apiPutOrLocal(
        `/v1/themes/global/default/${defaultThemeId}`,
        { defaultThemeId },
        'defaultTheme',
      );
      setThemes((prev) =>
        prev.map((theme) => {
          const isCurrentlyDefault = String(theme.visibility ?? '').trim().toUpperCase() === 'DEFAULT';
          if (theme.id === defaultThemeId) {
            return { ...theme, visibility: 'DEFAULT' };
          }
          if (isCurrentlyDefault) {
            return { ...theme, visibility: null };
          }
          return theme;
        }),
      );
      setDefaultThemeSuccess(t('themeadmin.success.defaultThemeSaved'));
      void refreshResolvedTheme({ force: true });
    } catch (error: unknown) {
      setDefaultThemeError(formatHttpError(error, t('themeadmin.error.defaultThemeSave')));
    } finally {
      setDefaultThemeSaving(false);
    }
  };

  const handlePaletteSave = async () => {
    if (themes.length === 0) {
      setPaletteError(t('themeadmin.error.loadThemesFirst'));
      return;
    }
    if (paletteSelectedCount === 0) {
      setPaletteError(t('themeadmin.error.paletteSelectAtLeastOne'));
      return;
    }

    const changed = themes.filter((theme) => Boolean(theme.activeFlag) !== Boolean(paletteDraft[theme.id]));
    if (changed.length === 0) {
      setPaletteSuccess(t('themeadmin.success.paletteUpToDate'));
      return;
    }

    setPaletteSaving(true);
    setPaletteError(null);
    setPaletteSuccess(null);
    try {
      const updates = changed.map((theme) => ({
        id: theme.id,
        activeFlag: Boolean(paletteDraft[theme.id]),
      }));
      await apiPutOrLocal(
        '/v1/themes/global/palette',
        { themes: updates },
        'palette',
      );

      setThemes((prev) =>
        prev.map((theme) => ({
          ...theme,
          activeFlag: Boolean(paletteDraft[theme.id]),
        })),
      );
      setPaletteSuccess(t('themeadmin.success.paletteSaved'));
    } catch (error: unknown) {
      setPaletteError(formatHttpError(error, t('themeadmin.error.paletteSave')));
    } finally {
      setPaletteSaving(false);
    }
  };

  const handleSave = async () => {
    if (!selectedThemeId) {
      setError(t('themeadmin.error.selectGlobalThemeFirst'));
      return;
    }
    if (!themeMeta) {
      setError(t('themeadmin.error.themePropertiesUnavailable'));
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await Promise.all([
        apiPutOrLocal(
          `/v1/themes/global/${selectedThemeId}/meta`,
          { appearance: themeMeta.appearance, surfaceTone: themeMeta.surfaceTone, axes: themeMeta.axes },
          `meta.${selectedThemeId}`,
        ),
        apiPutOrLocal(
          `/v1/themes/global/${selectedThemeId}`,
          overrides,
          `overrides.${selectedThemeId}`,
        ),
      ]);
      setThemes((prev) =>
        prev.map((theme) =>
          theme.id === selectedThemeId
            ? {
                ...theme,
                appearance: themeMeta.appearance,
                surfaceTone: themeMeta.surfaceTone,
                axes: { ...(theme.axes ?? {}), ...themeMeta.axes },
              }
            : theme,
        ),
      );
      setSelectedTheme((prev) =>
        prev
          ? {
              ...prev,
              appearance: themeMeta.appearance,
              surfaceTone: themeMeta.surfaceTone,
              axes: { ...(prev.axes ?? {}), ...themeMeta.axes },
              overrides,
            }
          : prev,
      );
      setSuccess(t('themeadmin.success.themeSaved'));
      void refreshResolvedTheme({ force: true });
    } catch (error: unknown) {
      setError(formatHttpError(error, t('themeadmin.error.themeSave')));
    } finally {
      setSaving(false);
    }
  };

  const title = t('themeadmin.page.title');
  const description = t('themeadmin.page.description');

  return (
    <PageLayout
      {...createPageLayoutPreset({ preset: 'ops-workspace', pageWidth: 'wide', stickyHeader: false })}
      title={title}
      description={description}
      breadcrumbItems={createPageLayoutBreadcrumbItems([
        { title: t('themeadmin.breadcrumb.shell'), path: '/' },
        { title: t('themeadmin.breadcrumb.themes'), path: '/admin/themes' },
      ])}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4" data-testid="theme-admin-page">
        {loading ? (
          <Text variant="secondary">{t('themeadmin.loading')}</Text>
	        ) : (
	          <>
	            {error ? (
	              <div className="rounded-xl border border-status-danger-border bg-status-danger px-3 py-2 text-[11px] font-semibold text-status-danger-text">
	                {error}
	              </div>
	            ) : null}
	            {success ? <Text variant="success">{success}</Text> : null}
	            <div className="grid gap-4 lg:grid-cols-2">
	              <div className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-3">
	                <div className="flex items-center justify-between gap-2">
	                  <div className="flex flex-col gap-0.5">
	                    <span className="text-xs font-semibold text-text-secondary">{t('themeadmin.defaultTheme.title')}</span>
	                    <span className="text-[11px] text-text-subtle">
	                      {t('themeadmin.defaultTheme.description')}
	                    </span>
	                  </div>
	                  <button
	                    type="button"
	                    className="inline-flex items-center rounded-full border border-border-subtle bg-surface-default px-3 py-1 text-[11px] font-semibold text-text-secondary hover:border-text-secondary disabled:cursor-not-allowed disabled:text-text-subtle"
	                    onClick={() => void handleDefaultThemeSave()}
	                    disabled={defaultThemeSaving || !defaultThemeDirty || !defaultThemeId}
	                  >
	                    {defaultThemeSaving ? t('themeadmin.defaultTheme.saving') : t('themeadmin.defaultTheme.save')}
	                  </button>
	                </div>
	                <select
	                  className="mt-2 h-9 w-full rounded-md border border-border-subtle bg-surface-default px-2 text-xs font-semibold text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
	                  value={defaultThemeId ?? ''}
	                  onChange={(event) => setDefaultThemeId(event.target.value || null)}
	                >
	                  {themes.map((theme) => {
	                    const label = theme.name.replace(/^Global\s+/i, '');
	                    return (
	                      <option key={theme.id} value={theme.id}>
	                        {label}
	                      </option>
	                    );
		                  })}
		                </select>
		                {defaultThemeError ? (
		                  <div className="mt-2 rounded-xl border border-status-danger-border bg-status-danger px-3 py-2 text-[11px] font-semibold text-status-danger-text">
		                    {defaultThemeError}
		                  </div>
		                ) : null}
		                {defaultThemeSuccess ? (
		                  <div className="mt-2 text-[11px] text-status-success-text">{defaultThemeSuccess}</div>
		                ) : null}
		              </div>

	              <div className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-3">
	                <div className="flex items-center justify-between gap-2">
	                  <div className="flex flex-col gap-0.5">
	                    <span className="text-xs font-semibold text-text-secondary">{t('themeadmin.palette.title')}</span>
	                    <span className="text-[11px] text-text-subtle">
	                      {t('themeadmin.palette.description', {
	                        selectedCount: paletteSelectedCount,
	                        totalCount: themes.length,
	                      })}
	                    </span>
	                  </div>
	                  <button
	                    type="button"
	                    className="inline-flex items-center rounded-full border border-border-subtle bg-surface-default px-3 py-1 text-[11px] font-semibold text-text-secondary hover:border-text-secondary disabled:cursor-not-allowed disabled:text-text-subtle"
	                    onClick={() => void handlePaletteSave()}
	                    disabled={paletteSaving || !paletteDirty}
		                  >
		                    {paletteSaving ? t('themeadmin.palette.saving') : t('themeadmin.palette.save')}
		                  </button>
		                </div>
		                {paletteError ? (
		                  <div className="mt-2 rounded-xl border border-status-danger-border bg-status-danger px-3 py-2 text-[11px] font-semibold text-status-danger-text">
		                    {paletteError}
		                  </div>
		                ) : null}
		                {paletteSuccess ? (
		                  <div className="mt-2 text-[11px] text-status-success-text">{paletteSuccess}</div>
		                ) : null}
		                <div className="mt-2 grid gap-2 sm:grid-cols-2">
	                  {themes.map((theme) => {
	                    const label = theme.name.replace(/^Global\s+/i, '');
	                    const checked = Boolean(paletteDraft[theme.id]);
	                    return (
	                      <label
	                        key={theme.id}
	                        className="flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-default px-2 py-2 text-[11px]"
	                      >
	                        <input
	                          type="checkbox"
	                          className="h-4 w-4 accent-action-primary"
	                          checked={checked}
	                          onChange={(event) => {
	                            const nextChecked = event.target.checked;
	                            setPaletteDraft((prev) => ({
	                              ...prev,
	                              [theme.id]: nextChecked,
	                            }));
	                          }}
	                        />
	                        <span className="font-semibold text-text-primary">{label}</span>
	                      </label>
	                    );
	                  })}
	                </div>
	              </div>
	            </div>

	            <div className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-3">
	              <div className="flex flex-wrap items-center gap-2">
	                <span className="text-xs font-semibold text-text-secondary">{t('themeadmin.selection.title')}:</span>
	                <select
	                  className="h-9 rounded-md border border-border-subtle bg-surface-default px-2 text-xs font-semibold text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
	                  value={selectedThemeId ?? ''}
	                  onChange={(event) => {
	                    hasManualThemeSelectionRef.current = true;
	                    setSelectedThemeId(event.target.value || null);
	                  }}
	                >
	                  {selectableThemes.map((theme) => {
	                    const label = theme.name.replace(/^Global\s+/i, '');
	                    return (
	                      <option key={theme.id} value={theme.id}>
	                        {label}
	                      </option>
	                    );
	                  })}
	                </select>
	                <button
	                  type="button"
	                  className="inline-flex items-center rounded-md border border-action-primary-border bg-action-primary px-3 py-1 text-xs font-semibold text-action-primary-text hover:opacity-90 disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-surface-muted disabled:text-text-subtle"
	                  onClick={() => void handleSave()}
	                  disabled={saving || !selectedThemeId || !themeMeta}
	                >
	                  {saving ? t('themeadmin.selection.saving') : t('themeadmin.selection.save')}
	                </button>
	              </div>
	              <div className="mt-2 text-[10px] text-text-subtle">
	                {t('themeadmin.selection.description')}
	              </div>
	            </div>

	            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_520px]">
		              <div className="flex flex-col gap-4">
		              <details open className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-2">
		                <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-text-secondary">
		                  {t('themeadmin.meta.title')}
		                </summary>
	                <div className="mt-3 grid gap-3 md:grid-cols-2">
		                  <div className="text-[11px] font-semibold text-text-secondary">
		                    {t('themeadmin.meta.appearance')}
		                    <div className="mt-1 flex h-8 items-center rounded-md border border-border-subtle bg-surface-muted px-2 text-[11px] text-text-primary">
		                      {themeMeta?.appearance ? themeMeta.appearance : '—'}
		                    </div>
		                  </div>
		                  <label className="text-[11px] font-semibold text-text-secondary">
		                    {t('themeadmin.meta.accent')}
		                    <select
		                      className="mt-1 h-8 w-full rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle"
		                      value={themeMeta?.axes.accent ?? ''}
		                      disabled={!themeMeta}
		                      onChange={(event) => {
		                        const next = event.target.value;
		                        setThemeMeta((prev) => (prev ? { ...prev, axes: { ...prev.axes, accent: next } } : prev));
		                      }}
		                    >
		                      {accentOptions.map((option) => (
		                        <option key={option.value} value={option.value}>
		                          {option.label}
		                        </option>
		                      ))}
		                    </select>
		                  </label>
		                  <label className="text-[11px] font-semibold text-text-secondary">
		                    {t('themeadmin.meta.surfaceTone')}
		                    <select
		                      className="mt-1 h-8 w-full rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle"
	                      value={themeMeta?.surfaceTone ?? ''}
	                      disabled={!themeMeta}
	                      onChange={(event) => {
	                        const next = event.target.value;
	                        setThemeMeta((prev) => (prev ? { ...prev, surfaceTone: next ? next : null } : prev));
	                      }}
	                    >
	                      <option value="">{t('themeadmin.meta.surfaceTone.default')}</option>
	                      {surfaceToneOptions.map((tone) => (
	                        <option key={tone} value={tone}>
	                          {tone}
	                        </option>
	                      ))}
	                    </select>
	                  </label>
		                  <div className="text-[11px] font-semibold text-text-secondary">
		                    {t('themeadmin.meta.density')}
                        <Segmented
                          items={densitySegmentedItems}
                          value={themeMeta?.axes.density ?? ''}
                          access={themeMeta ? 'full' : 'disabled'}
                          ariaLabel={t('themeadmin.meta.density')}
                          onValueChange={(nextValue) => {
                            const next = nextValue as string;
                            setThemeMeta((prev) => (prev ? { ...prev, axes: { ...prev.axes, density: next } } : prev));
                          }}
                          variant={themeAxisSegmentedPreset.variant}
                          shape={themeAxisSegmentedPreset.shape}
                          size={themeAxisSegmentedPreset.size}
                          iconPosition={themeAxisSegmentedPreset.iconPosition}
                          fullWidth={themeAxisSegmentedPreset.fullWidth}
                          className="mt-1 w-full"
                          classes={{ list: 'w-full', item: 'min-w-0 flex-1', content: 'w-full' }}
                        />
	                  </div>
		                  <div className="text-[11px] font-semibold text-text-secondary">
		                    {t('themeadmin.meta.radius')}
                        <Segmented
                          items={radiusSegmentedItems}
                          value={themeMeta?.axes.radius ?? ''}
                          access={themeMeta ? 'full' : 'disabled'}
                          ariaLabel={t('themeadmin.meta.radius')}
                          onValueChange={(nextValue) => {
                            const next = nextValue as string;
                            setThemeMeta((prev) => (prev ? { ...prev, axes: { ...prev.axes, radius: next } } : prev));
                          }}
                          variant={themeAxisSegmentedPreset.variant}
                          shape={themeAxisSegmentedPreset.shape}
                          size={themeAxisSegmentedPreset.size}
                          iconPosition={themeAxisSegmentedPreset.iconPosition}
                          fullWidth={themeAxisSegmentedPreset.fullWidth}
                          className="mt-1 w-full"
                          classes={{ list: 'w-full', item: 'min-w-0 flex-1', content: 'w-full' }}
                        />
	                  </div>
		                  <div className="text-[11px] font-semibold text-text-secondary">
		                    {t('themeadmin.meta.elevation')}
                        <Segmented
                          items={elevationSegmentedItems}
                          value={themeMeta?.axes.elevation ?? ''}
                          access={themeMeta ? 'full' : 'disabled'}
                          ariaLabel={t('themeadmin.meta.elevation')}
                          onValueChange={(nextValue) => {
                            const next = nextValue as string;
                            setThemeMeta((prev) => (prev ? { ...prev, axes: { ...prev.axes, elevation: next } } : prev));
                          }}
                          variant={themeAxisSegmentedPreset.variant}
                          shape={themeAxisSegmentedPreset.shape}
                          size={themeAxisSegmentedPreset.size}
                          iconPosition={themeAxisSegmentedPreset.iconPosition}
                          fullWidth={themeAxisSegmentedPreset.fullWidth}
                          className="mt-1 w-full"
                          classes={{ list: 'w-full', item: 'min-w-0 flex-1', content: 'w-full' }}
                        />
	                  </div>
		                  <div className="text-[11px] font-semibold text-text-secondary">
		                    {t('themeadmin.meta.motion')}
                        <Segmented
                          items={motionSegmentedItems}
                          value={themeMeta?.axes.motion ?? ''}
                          access={themeMeta ? 'full' : 'disabled'}
                          ariaLabel={t('themeadmin.meta.motion')}
                          onValueChange={(nextValue) => {
                            const next = nextValue as string;
                            setThemeMeta((prev) => (prev ? { ...prev, axes: { ...prev.axes, motion: next } } : prev));
                          }}
                          variant={themeAxisSegmentedPreset.variant}
                          shape={themeAxisSegmentedPreset.shape}
                          size={themeAxisSegmentedPreset.size}
                          iconPosition={themeAxisSegmentedPreset.iconPosition}
                          fullWidth={themeAxisSegmentedPreset.fullWidth}
                          className="mt-1 w-full"
                          classes={{ list: 'w-full', item: 'min-w-0 flex-1', content: 'w-full' }}
                        />
	                  </div>
	                </div>
		                <div className="mt-2 text-[10px] text-text-subtle">
		                  {t('themeadmin.meta.previewHint')}
		                </div>
		              </details>

              <ThemeAdminRegistryEditor
                textAreaGroups={textAreaGroups}
                rowsByGroup={rowsByGroup}
                resolvedPreviewCssVars={resolvedPreviewCssVars}
                resolvedPreviewDisplayCssVars={resolvedPreviewDisplayCssVars}
                activeColorPicker={activeColorPicker}
                contrastWarnings={contrastWarnings}
                onValueChange={handleValueChange}
                onOpenColorPicker={openColorPicker}
                onCloseColorPicker={() => setActiveColorPicker(null)}
                onColorPickerChange={(key, color) => {
                  setActiveColorPicker((prev) => (prev && prev.key === key ? { ...prev, color } : prev));
                }}
              />

	              </div>
	              <ThemeAdminPreviewPanel
	                previewRef={previewRef}
	                paletteThemes={paletteThemes}
	                selectedThemeId={selectedThemeId}
	                selectedTheme={selectedTheme}
	                themeMeta={themeMeta}
	                previewThemeAttr={previewThemeAttr}
	                previewStyle={previewStyle}
	                rowsByGroup={rowsByGroup}
	                overrides={overrides}
	                resolvedPreviewDisplayCssVars={resolvedPreviewDisplayCssVars}
	                onSelectTheme={(themeId) => {
	                  hasManualThemeSelectionRef.current = true;
	                  setSelectedThemeId(themeId);
	                }}
	              />
	            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ThemeAdminPage;
