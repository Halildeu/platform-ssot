import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '@mfe/shared-http';
import { createSegmentedPreset } from '@mfe/design-system';
import { useThemeContext } from '../../../app/theme/theme-context.provider';
import { parseAnyColor, rgbaToHex, rgbaToString } from '../../../app/theme/color-utils';
import {
  contrastRatio,
  getAccentOptions,
  getDensityOptions,
  getElevationOptions,
  getMotionOptions,
  getRadiusOptions,
  groupOrder,
  parseColor,
  resolveThemeAttr,
  surfaceToneOptions,
  type ThemeAdminRow,
  type ThemeColorPickerState,
  type ThemeDetails,
  type ThemeMetaState,
  type ThemeRegistryEntry,
  type ThemeSummary,
} from '../ThemeAdminPage.shared';
import { useThemeAdminI18n } from '../useThemeAdminI18n';
import { apiOrFallback, apiPutOrLocal } from './useThemeStorage';

/* ------------------------------------------------------------------ */
/*  HTTP error helpers                                                 */
/* ------------------------------------------------------------------ */

function resolveHttpErrorMessage(error: unknown): { message: string | null; status: number | null } {
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

  return { message: null, status: null };
}

function formatHttpError(error: unknown, fallback: string): string {
  const { message, status } = resolveHttpErrorMessage(error);
  const resolved = message ?? fallback;
  if (status) {
    return `${resolved} (HTTP ${status})`;
  }
  return resolved;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useThemeAdmin() {
  const { t } = useThemeAdminI18n();
  const { currentThemeId, refreshResolvedTheme } = useThemeContext();

  /* --- refs --- */
  const hasManualThemeSelectionRef = useRef(false);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const paletteInitRef = useRef(false);

  /* --- state --- */
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

  /* --- undo/redo (Phase 3) --- */
  type ThemeSnapshot = { overrides: Record<string, string>; themeMeta: ThemeMetaState | null };
  const [undoStack, setUndoStack] = useState<ThemeSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<ThemeSnapshot[]>([]);
  const savedSnapshotRef = useRef<ThemeSnapshot>({ overrides: {}, themeMeta: null });

  const captureSnapshot = useCallback(
    (): ThemeSnapshot => ({
      overrides: { ...overrides },
      themeMeta: themeMeta ? { ...themeMeta, axes: { ...themeMeta.axes } } : null,
    }),
    [overrides, themeMeta],
  );

  const pushUndo = useCallback(() => {
    const snap = captureSnapshot();
    setUndoStack((prev) => [...prev.slice(-(50 - 1)), snap]);
    setRedoStack([]);
  }, [captureSnapshot]);

  const undo = useCallback(() => {
    setUndoStack((prev) => {
      if (prev.length === 0) return prev;
      const snap = prev[prev.length - 1];
      setRedoStack((redo) => [...redo, captureSnapshot()]);
      setOverrides(snap.overrides);
      setThemeMeta(snap.themeMeta);
      return prev.slice(0, -1);
    });
  }, [captureSnapshot]);

  const redo = useCallback(() => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;
      const snap = prev[prev.length - 1];
      setUndoStack((undos) => [...undos, captureSnapshot()]);
      setOverrides(snap.overrides);
      setThemeMeta(snap.themeMeta);
      return prev.slice(0, -1);
    });
  }, [captureSnapshot]);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  /* --- dirty state (Phase 3) --- */
  const isDirty = useMemo(() => {
    const saved = savedSnapshotRef.current;
    return JSON.stringify(overrides) !== JSON.stringify(saved.overrides)
      || JSON.stringify(themeMeta) !== JSON.stringify(saved.themeMeta);
  }, [overrides, themeMeta]);

  /* --- keyboard shortcuts: Cmd+Z / Cmd+Shift+Z (Phase 3) --- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || e.key.toLowerCase() !== 'z') return;
      // Don't intercept when input/textarea is focused
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      e.preventDefault();
      if (e.shiftKey) { redo(); } else { undo(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [undo, redo]);

  /* --- beforeunload dirty warning (Phase 3) --- */
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  /* --- axis option memos --- */
  const accentOptions = useMemo(() => getAccentOptions(t), [t]);
  const densityOptions = useMemo(() => getDensityOptions(t), [t]);
  const radiusOptions = useMemo(() => getRadiusOptions(t), [t]);
  const elevationOptions = useMemo(() => getElevationOptions(t), [t]);
  const motionOptions = useMemo(() => getMotionOptions(t), [t]);

  const themeAxisSegmentedPreset = useMemo(() => {
    const base = createSegmentedPreset('toolbar');
    return {
      variant: base.variant as 'default' | 'outline' | 'ghost' | undefined,
      shape: base.shape as 'rounded' | 'pill' | undefined,
      size: 'sm' as const,
      iconPosition: base.iconPosition as 'start' | 'end' | 'top' | undefined,
      fullWidth: true,
    };
  }, []);

  const densitySegmentedItems = useMemo(
    () => densityOptions.map((o) => ({ value: o.value, label: o.label, dataTestId: `theme-meta-density-${o.value}` })),
    [densityOptions],
  );
  const radiusSegmentedItems = useMemo(
    () => radiusOptions.map((o) => ({ value: o.value, label: o.label, dataTestId: `theme-meta-radius-${o.value}` })),
    [radiusOptions],
  );
  const elevationSegmentedItems = useMemo(
    () => elevationOptions.map((o) => ({ value: o.value, label: o.label, dataTestId: `theme-meta-elevation-${o.value}` })),
    [elevationOptions],
  );
  const motionSegmentedItems = useMemo(
    () => motionOptions.map((o) => ({ value: o.value, label: o.label, dataTestId: `theme-meta-motion-${o.value}` })),
    [motionOptions],
  );

  /* --- escape handler for color picker --- */
  useEffect(() => {
    if (!activeColorPicker) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveColorPicker(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [activeColorPicker]);

  /* --- default theme tracking --- */
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

  /* --- palette init --- */
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

  /* --- initial data load --- */
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
        if (!cancelled) setError(t('themeadmin.error.loadRegistryThemes'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [t]);

  /* --- sync selectedThemeId to context currentThemeId --- */
  useEffect(() => {
    if (hasManualThemeSelectionRef.current) return;
    if (!currentThemeId) return;
    if (!themes.some((theme) => theme.id === currentThemeId)) return;
    setSelectedThemeId(currentThemeId);
  }, [currentThemeId, themes]);

  /* --- load theme overrides on selection change --- */
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
        const loadedOverrides = themeData.overrides ?? {};
        const loadedMeta: ThemeMetaState = {
          appearance: themeData.appearance ?? 'light',
          surfaceTone: themeData.surfaceTone ?? null,
          axes: {
            accent: themeData.axes?.accent ?? 'neutral',
            density: themeData.axes?.density ?? 'comfortable',
            radius: themeData.axes?.radius ?? 'rounded',
            elevation: themeData.axes?.elevation ?? 'raised',
            motion: themeData.axes?.motion ?? 'standard',
          },
        };
        setOverrides(loadedOverrides);
        setSelectedTheme(themeData ?? null);
        setThemeMeta(loadedMeta);
        savedSnapshotRef.current = { overrides: { ...loadedOverrides }, themeMeta: { ...loadedMeta, axes: { ...loadedMeta.axes } } };
        setUndoStack([]);
        setRedoStack([]);
      } catch {
        if (!cancelled) {
          setError(t('themeadmin.error.loadThemeDetails'));
          setThemeMeta(null);
        }
      }
    };
    void loadThemeOverrides();
    return () => { cancelled = true; };
  }, [selectedThemeId, t]);

  /* --- CSS var registry map --- */
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

  /* --- resolve preview CSS vars from DOM --- */
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
        if (value) next[cssVar] = value;
      });
      setResolvedPreviewCssVars(next);
    });

    return () => window.cancelAnimationFrame(raf);
  }, [previewCssVarsToResolve, selectedThemeId, themeMeta, overrides]);

  /* --- preview styling memos --- */
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
      cssVars.forEach((cssVar) => { styleVars[cssVar] = value; });
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

  /* --- grouped rows for registry editor --- */
  const rowsByGroup = useMemo(() => {
    const grouped: Record<string, ThemeAdminRow[]> = {};
    registry.forEach((entry) => {
      const group = entry.groupName ?? 'other';
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push({ ...entry, value: overrides[entry.key] });
    });
    Object.values(grouped).forEach((rows) => rows.sort((a, b) => a.key.localeCompare(b.key)));
    const sortedGroups = Object.keys(grouped).sort((a, b) => {
      const ia = groupOrder.indexOf(a);
      const ib = groupOrder.indexOf(b);
      const sa = ia === -1 ? Number.MAX_SAFE_INTEGER : ia;
      const sb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib;
      return sa - sb || a.localeCompare(b);
    });
    return sortedGroups.map((id) => ({ id, rows: grouped[id] }));
  }, [registry, overrides]);

  /* --- textarea groups for registry editor --- */
  const textAreaGroups = useMemo(() => {
    const rows: ThemeAdminRow[] = registry.map((entry) => ({ ...entry, value: overrides[entry.key] }));
    const byKey = (predicate: (row: ThemeAdminRow) => boolean) =>
      rows.filter(predicate).sort((a, b) => a.key.localeCompare(b.key));

    return [
      { id: 'core', label: t('themeadmin.textAreaGroup.core'), rows: byKey((row) => row.key.startsWith('text.')) },
      { id: 'action', label: t('themeadmin.textAreaGroup.action'), rows: byKey((row) => row.key.startsWith('action.') && row.key.endsWith('.text')) },
      { id: 'status', label: t('themeadmin.textAreaGroup.status'), rows: byKey((row) => row.key.startsWith('status.') && row.key.endsWith('.text')) },
      { id: 'grid', label: t('themeadmin.textAreaGroup.grid'), rows: byKey((row) => row.key.startsWith('grid.') && row.key.endsWith('.text')) },
      { id: 'accent', label: t('themeadmin.textAreaGroup.accent'), rows: byKey((row) => row.key.startsWith('accent.')) },
    ].filter((group) => group.rows.length > 0);
  }, [registry, overrides, t]);

  /* --- palette theme ordering --- */
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
        if (preferredAccents.includes(accent) && !byAccent.has(accent)) byAccent.set(accent, theme);
      });
      ordered = preferredAccents.map((accent) => byAccent.get(accent)).filter(Boolean) as ThemeSummary[];
    } else {
      const byAccent = new Map<string, ThemeSummary>();
      explicitSelected.forEach((theme) => {
        const accent = normalize(theme.axes?.accent);
        if (!byAccent.has(accent)) byAccent.set(accent, theme);
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
    if (selected && !ordered.some((theme) => theme.id === selected.id)) ordered.push(selected);
    return ordered;
  }, [themes, selectedThemeId, paletteDraft]);

  const selectableThemes = useMemo(() => {
    const ordered: ThemeSummary[] = [];
    const seen = new Set<string>();
    paletteThemes.forEach((theme) => { ordered.push(theme); seen.add(theme.id); });
    themes.forEach((theme) => { if (!seen.has(theme.id)) { ordered.push(theme); seen.add(theme.id); } });
    return ordered;
  }, [paletteThemes, themes]);

  /* --- event handlers --- */
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
    pushUndo();
    const trimmed = value.trim();
    setOverrides((prev) => {
      const next = { ...prev };
      if (!trimmed) { delete next[key]; return next; }
      next[key] = trimmed;
      return next;
    });
    setSuccess(null);

    const shouldCheckContrast =
      key.endsWith('.bg') &&
      (key.startsWith('action.danger') || key.startsWith('status.danger') || key.startsWith('status.warning') || key.startsWith('status.success') || key.startsWith('status.info'));

    if (shouldCheckContrast) {
      if (!trimmed) {
        setContrastWarnings((prev) => { const next = { ...prev }; delete next[key]; return next; });
        return;
      }
      const bg = parseColor(trimmed);
      const fg = parseColor('#ffffff');
      if (!bg || !fg) {
        setContrastWarnings((prev) => ({ ...prev, [key]: t('themeadmin.error.contrastParse') }));
        return;
      }
      const ratio = contrastRatio(bg, fg);
      if (ratio < 4.5) {
        setContrastWarnings((prev) => ({ ...prev, [key]: t('themeadmin.error.contrastBelowThreshold', { ratio: ratio.toFixed(2) }) }));
      } else {
        setContrastWarnings((prev) => { const next = { ...prev }; delete next[key]; return next; });
      }
    } else {
      setContrastWarnings((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev }; delete next[key]; return next;
      });
    }
  };

  /* --- save handlers --- */
  const handleDefaultThemeSave = async () => {
    if (!defaultThemeId) {
      setDefaultThemeError(t('themeadmin.error.selectGlobalThemeFirst'));
      return;
    }
    setDefaultThemeSaving(true);
    setDefaultThemeError(null);
    setDefaultThemeSuccess(null);
    try {
      await apiPutOrLocal(`/v1/themes/global/default/${defaultThemeId}`, { defaultThemeId }, 'defaultTheme');
      setThemes((prev) =>
        prev.map((theme) => {
          const isCurrentlyDefault = String(theme.visibility ?? '').trim().toUpperCase() === 'DEFAULT';
          if (theme.id === defaultThemeId) return { ...theme, visibility: 'DEFAULT' };
          if (isCurrentlyDefault) return { ...theme, visibility: null };
          return theme;
        }),
      );
      setDefaultThemeSuccess(t('themeadmin.success.defaultThemeSaved'));
      void refreshResolvedTheme({ force: true });
    } catch (err: unknown) {
      setDefaultThemeError(formatHttpError(err, t('themeadmin.error.defaultThemeSave')));
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
      const updates = changed.map((theme) => ({ id: theme.id, activeFlag: Boolean(paletteDraft[theme.id]) }));
      await apiPutOrLocal('/v1/themes/global/palette', { themes: updates }, 'palette');
      setThemes((prev) => prev.map((theme) => ({ ...theme, activeFlag: Boolean(paletteDraft[theme.id]) })));
      setPaletteSuccess(t('themeadmin.success.paletteSaved'));
    } catch (err: unknown) {
      setPaletteError(formatHttpError(err, t('themeadmin.error.paletteSave')));
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
        apiPutOrLocal(`/v1/themes/global/${selectedThemeId}`, overrides, `overrides.${selectedThemeId}`),
      ]);
      setThemes((prev) =>
        prev.map((theme) =>
          theme.id === selectedThemeId
            ? { ...theme, appearance: themeMeta.appearance, surfaceTone: themeMeta.surfaceTone, axes: { ...(theme.axes ?? {}), ...themeMeta.axes } }
            : theme,
        ),
      );
      setSelectedTheme((prev) =>
        prev
          ? { ...prev, appearance: themeMeta.appearance, surfaceTone: themeMeta.surfaceTone, axes: { ...(prev.axes ?? {}), ...themeMeta.axes }, overrides }
          : prev,
      );
      setSuccess(t('themeadmin.success.themeSaved'));
      savedSnapshotRef.current = captureSnapshot();
      setUndoStack([]);
      setRedoStack([]);
      void refreshResolvedTheme({ force: true });
    } catch (err: unknown) {
      setError(formatHttpError(err, t('themeadmin.error.themeSave')));
    } finally {
      setSaving(false);
    }
  };

  /* --- theme meta with undo tracking --- */
  const setThemeMetaWithUndo = useCallback(
    (updater: (prev: ThemeMetaState | null) => ThemeMetaState | null) => {
      pushUndo();
      setThemeMeta(updater);
    },
    [pushUndo],
  );

  /* --- dark/light toggle (Phase 4) --- */
  const toggleAppearance = useCallback(() => {
    pushUndo();
    setThemeMeta((prev) =>
      prev ? { ...prev, appearance: prev.appearance === 'dark' ? 'light' : 'dark' } : prev,
    );
  }, [pushUndo]);

  /* --- manual theme selection --- */
  const selectThemeManually = (themeId: string | null) => {
    hasManualThemeSelectionRef.current = true;
    setSelectedThemeId(themeId);
  };

  return {
    t,
    /* refs */
    previewRef,
    /* data */
    registry, themes, selectedThemeId, selectedTheme, themeMeta, overrides,
    /* default theme */
    defaultThemeId, setDefaultThemeId, defaultThemeDirty, defaultThemeSaving, defaultThemeError, defaultThemeSuccess,
    /* palette */
    paletteDraft, setPaletteDraft, paletteDirty, paletteSaving, paletteSelectedCount, paletteError, paletteSuccess,
    /* axis options */
    accentOptions, surfaceToneOptions,
    themeAxisSegmentedPreset, densitySegmentedItems, radiusSegmentedItems, elevationSegmentedItems, motionSegmentedItems,
    /* preview */
    previewThemeAttr, previewStyle, resolvedPreviewCssVars, resolvedPreviewDisplayCssVars,
    /* editor data */
    rowsByGroup, textAreaGroups, paletteThemes, selectableThemes,
    /* color picker */
    activeColorPicker, setActiveColorPicker,
    contrastWarnings,
    /* status */
    loading, saving, error, success,
    /* undo/redo (Phase 3) */
    isDirty, canUndo, canRedo, undo, redo,
    /* actions */
    setThemeMeta: setThemeMetaWithUndo, selectThemeManually, toggleAppearance,
    registryCssVarsByKey,
    openColorPicker, handleValueChange,
    handleDefaultThemeSave, handlePaletteSave, handleSave,
  };
}

export type UseThemeAdminReturn = ReturnType<typeof useThemeAdmin>;
