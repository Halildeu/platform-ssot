import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageLayout, Text, ThemePreviewCard, resolveThemeModeKey } from 'mfe-ui-kit';
import { api } from '@mfe/shared-http';
import UniversalColorPicker from '../../app/theme/components/UniversalColorPicker';
import { useThemeContext } from '../../app/theme/theme-context.provider';
import { parseAnyColor, rgbaToHex, rgbaToString, type RgbaColor } from '../../app/theme/color-utils';

type ThemeRegistryControlType = 'COLOR' | 'OPACITY' | 'RADIUS' | 'MOTION';
type ThemeRegistryEditableBy = 'USER_ALLOWED' | 'ADMIN_ONLY';

type ThemeRegistryEntry = {
  id: string;
  key: string;
  label: string;
  groupName: string;
  controlType: ThemeRegistryControlType;
  editableBy: ThemeRegistryEditableBy;
  cssVars?: string[];
  description?: string;
};

type ThemeSummary = {
  id: string;
  name: string;
  type: 'GLOBAL' | 'USER';
  appearance?: string;
  surfaceTone?: string | null;
  activeFlag?: boolean | null;
  visibility?: string | null;
  axes?: {
    accent?: string;
    density?: string;
    radius?: string;
    elevation?: string;
    motion?: string;
  };
};

type ThemeDetails = ThemeSummary & {
  overrides?: Record<string, string>;
};

type ThemeAdminRow = ThemeRegistryEntry & {
  value?: string;
};

type ThemeMetaState = {
  appearance: string;
  surfaceTone: string | null;
  axes: {
    accent: string;
    density: string;
    radius: string;
    elevation: string;
    motion: string;
  };
};

const groupOrder = ['surface', 'text', 'border', 'selection', 'accent', 'overlay', 'grid', 'erpAction', 'status'];
const groupLabelMap: Record<string, string> = {
  surface: 'Surface',
  text: 'Text',
  border: 'Border',
  selection: 'Selection',
  accent: 'Accent',
  overlay: 'Overlay',
  grid: 'Grid',
  erpAction: 'Action',
  status: 'Status',
};

const usageHintByKey: Record<string, string> = {
  'surface.page.bg': 'Uygulama sayfa zemini (body).',
  'surface.default.bg': 'Genel yüzeyler/kartlar (çoğu container).',
  'surface.panel.bg': 'Popover/panel container’ları (örn: Uygulamalar menüsü).',
  'surface.muted.bg': 'Muted/hover yüzeyi (örn: hover:bg-surface-muted, ikon balonları).',
  'surface.header.bg': 'Header yüzeyi (bg-surface-header).',
  'surface.raised.bg': 'Yükseltilmiş kart/yüzey (shadow ile).',
  'overlay.bg': 'Modal/backdrop overlay (bg-surface-overlay).',
};

const resolveTailwindHint = (key: string): string | null => {
  if (key === 'overlay.bg') return 'bg-surface-overlay';
  if (key === 'selection.bg') return 'bg-selection';
  if (key.startsWith('surface.') && key.endsWith('.bg')) {
    const suffix = key.replace(/^surface\./, '').replace(/\.bg$/, '');
    return `bg-surface-${suffix}`;
  }
  if (key.startsWith('text.')) {
    const suffix = key.replace(/^text\./, '');
    return `text-text-${suffix}`;
  }
  if (key.startsWith('border.')) {
    const suffix = key.replace(/^border\./, '');
    return `border-border-${suffix}`;
  }
  return null;
};

const resolveThemeAttr = (appearanceRaw: string | undefined | null, densityRaw: string | undefined | null) => {
  return resolveThemeModeKey({ appearance: appearanceRaw, density: densityRaw });
};

const densityOptions = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
];

const radiusOptions = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'sharp', label: 'Sharp' },
];

const elevationOptions = [
  { value: 'raised', label: 'Raised' },
  { value: 'flat', label: 'Flat' },
];

const motionOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'reduced', label: 'Reduced' },
];

const accentOptions = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'light', label: 'Light' },
  { value: 'violet', label: 'Violet' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'graphite', label: 'Graphite' },
];

const surfaceToneOptions = [
  ...Array.from({ length: 6 }, (_, index) => `ultra-${index + 1}`),
  ...Array.from({ length: 6 }, (_, index) => `mid-${index + 1}`),
  ...Array.from({ length: 6 }, (_, index) => `deep-${index + 1}`),
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const parseColor = (raw: string | undefined | null): { r: number; g: number; b: number } | null => {
  if (!raw) return null;
  const value = raw.trim();
  const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split('').map((ch) => ch + ch).join('');
    }
    const int = Number.parseInt(hex, 16);
    if (Number.isNaN(int)) return null;
    return {
      r: (int >> 16) & 255,
      g: (int >> 8) & 255,
      b: int & 255,
    };
  }
  const rgbMatch = value.match(/^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)$/i);
  if (rgbMatch) {
    const r = clamp(Number.parseFloat(rgbMatch[1]), 0, 255);
    const g = clamp(Number.parseFloat(rgbMatch[2]), 0, 255);
    const b = clamp(Number.parseFloat(rgbMatch[3]), 0, 255);
    return { r, g, b };
  }
  return null;
};

const relativeLuminance = (rgb: { r: number; g: number; b: number }) => {
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const r = channel(rgb.r);
  const g = channel(rgb.g);
  const b = channel(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (bg: { r: number; g: number; b: number }, fg: { r: number; g: number; b: number }) => {
  const L1 = relativeLuminance(bg);
  const L2 = relativeLuminance(fg);
  const maxL = Math.max(L1, L2);
  const minL = Math.min(L1, L2);
  return (maxL + 0.05) / (minL + 0.05);
};

// STORY-0022: Theme Personalization v1.0
const ThemeAdminPage: React.FC = () => {
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
  const [activeColorPicker, setActiveColorPicker] = useState<{
    key: string;
    label: string;
    color: RgbaColor;
  } | null>(null);

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
        const [registryRes, themesRes] = await Promise.all([
          api.get<ThemeRegistryEntry[]>('/v1/theme-registry'),
          api.get<ThemeSummary[]>('/v1/themes', { params: { scope: 'global' } }),
        ]);
        if (cancelled) return;
        setRegistry(registryRes.data ?? []);
        setThemes(themesRes.data ?? []);
        if (!selectedThemeId && themesRes.data && themesRes.data.length > 0) {
          const preferred =
            currentThemeId && themesRes.data.some((theme) => theme.id === currentThemeId)
              ? currentThemeId
              : themesRes.data[0].id;
          setSelectedThemeId(preferred);
        }
      } catch {
        if (!cancelled) {
          setError('Tema registry veya global temalar yüklenemedi.');
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
  }, []);

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
        const res = await api.get<ThemeDetails>(`/v1/themes/${selectedThemeId}`);
        if (cancelled) return;
        setOverrides(res.data.overrides ?? {});
        setSelectedTheme(res.data ?? null);
	        setThemeMeta({
	          appearance: res.data.appearance ?? 'light',
	          surfaceTone: res.data.surfaceTone ?? null,
	          axes: {
	            accent: res.data.axes?.accent ?? 'neutral',
	            density: res.data.axes?.density ?? 'comfortable',
	            radius: res.data.axes?.radius ?? 'rounded',
	            elevation: res.data.axes?.elevation ?? 'raised',
	            motion: res.data.axes?.motion ?? 'standard',
	          },
	        });
      } catch {
        if (!cancelled) {
          setError('Tema detayları yüklenemedi.');
          setThemeMeta(null);
        }
      }
    };
    void loadThemeOverrides();
    return () => {
      cancelled = true;
    };
  }, [selectedThemeId]);

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
        label: 'Genel metin (text.*)',
        rows: byKey((row) => row.key.startsWith('text.')),
      },
      {
        id: 'action',
        label: 'Buton metinleri (action.*.text)',
        rows: byKey((row) => row.key.startsWith('action.') && row.key.endsWith('.text')),
      },
      {
        id: 'status',
        label: 'Durum metinleri (status.*.text)',
        rows: byKey((row) => row.key.startsWith('status.') && row.key.endsWith('.text')),
      },
      {
        id: 'grid',
        label: 'Grid metinleri (grid.*.text)',
        rows: byKey((row) => row.key.startsWith('grid.') && row.key.endsWith('.text')),
      },
      {
        id: 'accent',
        label: 'Vurgu/link (accent.*) — bazı metinler bunu kullanır',
        rows: byKey((row) => row.key.startsWith('accent.')),
      },
    ]
      .filter((group) => group.rows.length > 0);
  }, [registry, overrides]);

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
          [key]: 'Renk formatı çözülemedi; kontrast hesaplanamadı.',
        }));
        return;
      }
      const ratio = contrastRatio(bg, fg);
      if (ratio < 4.5) {
        setContrastWarnings((prev) => ({
          ...prev,
          [key]: `Kontrast oranı ${ratio.toFixed(2)}:1 – WCAG AA (4.5:1) eşiğinin altında.`,
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
      setDefaultThemeError('Önce bir global tema seçin.');
      return;
    }
    setDefaultThemeSaving(true);
    setDefaultThemeError(null);
    setDefaultThemeSuccess(null);
    try {
      await api.put(`/v1/themes/global/default/${defaultThemeId}`);
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
      setDefaultThemeSuccess('Varsayılan global tema güncellendi.');
      void refreshResolvedTheme({ force: true });
    } catch (error: unknown) {
      setDefaultThemeError(formatHttpError(error, 'Varsayılan global tema güncellenemedi.'));
    } finally {
      setDefaultThemeSaving(false);
    }
  };

  const handlePaletteSave = async () => {
    if (themes.length === 0) {
      setPaletteError('Önce global temalar yüklenmeli.');
      return;
    }
    if (paletteSelectedCount === 0) {
      setPaletteError('Görünüm paleti için en az 1 tema seçin.');
      return;
    }

    const changed = themes.filter((theme) => Boolean(theme.activeFlag) !== Boolean(paletteDraft[theme.id]));
    if (changed.length === 0) {
      setPaletteSuccess('Görünüm paleti zaten güncel.');
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
      await api.put('/v1/themes/global/palette', { themes: updates });

      setThemes((prev) =>
        prev.map((theme) => ({
          ...theme,
          activeFlag: Boolean(paletteDraft[theme.id]),
        })),
      );
      setPaletteSuccess('Görünüm paleti başarıyla güncellendi.');
    } catch (error: unknown) {
      setPaletteError(formatHttpError(error, 'Görünüm paleti güncellenemedi.'));
    } finally {
      setPaletteSaving(false);
    }
  };

  const handleSave = async () => {
    if (!selectedThemeId) {
      setError('Önce bir global tema seçin.');
      return;
    }
    if (!themeMeta) {
      setError('Tema özellikleri yüklenemedi.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await Promise.all([
        api.put(`/v1/themes/global/${selectedThemeId}/meta`, {
          appearance: themeMeta.appearance,
          surfaceTone: themeMeta.surfaceTone,
          axes: themeMeta.axes,
        }),
        api.put(`/v1/themes/global/${selectedThemeId}`, overrides),
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
      setSuccess('Tema özellikleri ve registry overrides başarıyla kaydedildi.');
      void refreshResolvedTheme({ force: true });
    } catch (error: unknown) {
      setError(formatHttpError(error, 'Tema kayıt edilirken bir hata oluştu.'));
    } finally {
      setSaving(false);
    }
  };

  const renderCssVarSwatch = (groupId: string, cssVar: string) => {
    if (groupId === 'text') {
      return (
        <div
          key={cssVar}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border-subtle bg-surface-default text-[11px] font-bold"
          style={{ color: `var(${cssVar})` }}
          title={cssVar}
        >
          Aa
        </div>
      );
    }
    if (groupId === 'border') {
      return (
        <div
          key={cssVar}
          className="h-7 w-7 rounded-md border-2 bg-surface-default"
          style={{ borderColor: `var(${cssVar})` }}
          title={cssVar}
        />
      );
    }
    return (
      <div
        key={cssVar}
        className="h-7 w-7 rounded-md border border-border-subtle"
        style={{ backgroundColor: `var(${cssVar})` }}
        title={cssVar}
      />
    );
  };

  const renderRegistryRow = (row: ThemeAdminRow) => {
    const isAdminOnly = row.editableBy === 'ADMIN_ONLY';
    const cssVars = Array.isArray(row.cssVars) ? row.cssVars : [];
    const resolvedRaw = cssVars.length > 0 ? resolvedPreviewCssVars[cssVars[0]] : '';
    const resolvedDisplay = cssVars.length > 0 ? resolvedPreviewDisplayCssVars[cssVars[0]] : '';
    const fallbackRaw = row.key === 'surface.page.bg' ? resolvedPreviewCssVars['--surface-default-bg'] ?? '' : '';
    const fallbackDisplay = row.key === 'surface.page.bg' ? resolvedPreviewDisplayCssVars['--surface-default-bg'] ?? '' : '';
    const effectiveResolvedRaw = resolvedRaw || fallbackRaw;
    const effectiveResolvedDisplay = resolvedDisplay || fallbackDisplay;
    const overrideValue = row.value?.trim() ? row.value.trim() : '';
    const swatchColor = overrideValue || effectiveResolvedRaw || 'transparent';
    const isDangerBg =
      row.key.endsWith('.bg') &&
      (row.key.startsWith('action.danger') ||
        row.key.startsWith('status.danger') ||
        row.key.startsWith('status.warning') ||
        row.key.startsWith('status.success') ||
        row.key.startsWith('status.info'));
    const contrastWarning = isDangerBg ? contrastWarnings[row.key] : undefined;
    const tailwindHint = resolveTailwindHint(row.key);
    const usageHint = usageHintByKey[row.key];

    return (
      <label
        key={row.id}
        className="flex flex-col gap-1 rounded-xl border border-border-subtle bg-surface-panel px-2 py-2 text-[11px]"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-text-primary">{row.label}</span>
          <span className="text-[10px] text-text-subtle">{row.key}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="h-7 flex-1 rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
            value={row.value ?? ''}
            onChange={(event) => handleValueChange(row.key, event.target.value)}
            placeholder={row.controlType === 'COLOR' ? effectiveResolvedDisplay || '#rrggbb veya rgba(...)' : ''}
          />
          {row.controlType === 'COLOR' ? (
            <button
              type="button"
              className="h-6 w-6 rounded-md border border-border-subtle shadow-sm"
              style={{ backgroundColor: swatchColor }}
              aria-label={`${row.label} renk seç`}
              onClick={() => openColorPicker(row)}
            />
          ) : (
            <span
              className="h-6 w-6 rounded-md border border-border-subtle"
              style={{ backgroundColor: swatchColor }}
              aria-hidden
            />
          )}
        </div>
        {row.controlType === 'COLOR' && !overrideValue && effectiveResolvedDisplay ? (
          <div className="text-[10px] text-text-subtle">
            Varsayılan: <span className="font-mono">{effectiveResolvedDisplay}</span>
          </div>
        ) : null}
        {row.controlType === 'COLOR' && activeColorPicker?.key === row.key ? (
          <div className="mt-2 rounded-xl border border-border-subtle bg-surface-default p-2">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-text-secondary">Renk seçici</span>
                <span className="text-[10px] text-text-subtle">{activeColorPicker.key}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-2 py-1 text-[10px] font-semibold text-text-secondary hover:border-text-secondary"
                  onClick={() => {
                    handleValueChange(row.key, '');
                    setActiveColorPicker(null);
                  }}
                >
                  Override’ı kaldır
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-2 py-1 text-[10px] font-semibold text-text-secondary hover:border-text-secondary"
                  onClick={() => setActiveColorPicker(null)}
                >
                  Kapat
                </button>
              </div>
            </div>
            <UniversalColorPicker
              color={activeColorPicker.color}
              surfaceTone={null}
              surfaceTonePresets={[]}
              surfaceTonePalette={[]}
              onManualColorChange={(next) => {
                setActiveColorPicker((prev) => (prev && prev.key === row.key ? { ...prev, color: next } : prev));
                handleValueChange(row.key, rgbaToString(next));
              }}
              onSurfaceToneChange={() => {
                // no-op (surface tone pickers are not used in admin registry editor)
              }}
            />
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-text-subtle">{row.description ?? row.groupName}</span>
          <span className={isAdminOnly ? 'text-[10px] font-semibold text-status-warning-text' : 'text-[10px] text-text-subtle'}>
            {isAdminOnly ? 'ADMIN_ONLY' : 'USER_ALLOWED'}
          </span>
        </div>
        {cssVars.length > 0 ? (
          <div className="text-[10px] text-text-subtle">
            CSS: <span className="font-mono">{cssVars.join(', ')}</span>
          </div>
        ) : null}
        {tailwindHint ? (
          <div className="text-[10px] text-text-subtle">
            Tailwind: <span className="font-mono">{tailwindHint}</span>
          </div>
        ) : null}
        {usageHint ? (
          <div className="text-[10px] text-text-subtle">
            Kullanım: {usageHint}
          </div>
        ) : null}
        {isDangerBg ? (
          <>
            <span className="text-[10px] text-status-warning-text">
              ERP action/status arka planı – kontrast ve a11y kurallarına dikkat edin.
            </span>
            {contrastWarning ? (
              <span className="text-[10px] text-status-danger-text">{contrastWarning}</span>
            ) : null}
          </>
        ) : null}
      </label>
    );
  };

  const title = 'Tema Registry (Admin)';
  const description =
    'GLOBAL temaların registry tabanlı semantik alanlarını (surface/text/border/accent/overlay/status) THEME_ADMIN yetkisiyle düzenleyin.';

  return (
    <PageLayout
      title={title}
      description={description}
      breadcrumbItems={[
        { title: 'Shell', path: '/' },
        { title: 'Tema Yönetimi', path: '/admin/themes' },
      ]}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4" data-testid="theme-admin-page">
        {loading ? (
          <Text variant="secondary">Tema registry yükleniyor…</Text>
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
	                    <span className="text-xs font-semibold text-text-secondary">Global varsayılan tema</span>
	                    <span className="text-[11px] text-text-subtle">
	                      Kullanıcının seçimi yoksa uygulanır.
	                    </span>
	                  </div>
	                  <button
	                    type="button"
	                    className="inline-flex items-center rounded-full border border-border-subtle bg-surface-default px-3 py-1 text-[11px] font-semibold text-text-secondary hover:border-text-secondary disabled:cursor-not-allowed disabled:text-text-subtle"
	                    onClick={() => void handleDefaultThemeSave()}
	                    disabled={defaultThemeSaving || !defaultThemeDirty || !defaultThemeId}
	                  >
	                    {defaultThemeSaving ? 'Kaydediliyor…' : 'Varsayılanı kaydet'}
	                  </button>
	                </div>
	                <select
	                  className="mt-2 h-9 w-full rounded-md border border-border-subtle bg-surface-default px-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
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
	                    <span className="text-xs font-semibold text-text-secondary">Görünüm paleti</span>
	                    <span className="text-[11px] text-text-subtle">
	                      Palet’te göster ({paletteSelectedCount}/{themes.length})
	                    </span>
	                  </div>
	                  <button
	                    type="button"
	                    className="inline-flex items-center rounded-full border border-border-subtle bg-surface-default px-3 py-1 text-[11px] font-semibold text-text-secondary hover:border-text-secondary disabled:cursor-not-allowed disabled:text-text-subtle"
	                    onClick={() => void handlePaletteSave()}
	                    disabled={paletteSaving || !paletteDirty}
		                  >
		                    {paletteSaving ? 'Kaydediliyor…' : 'Paleti kaydet'}
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
	                <span className="text-xs font-semibold text-text-secondary">Düzenlenecek global tema:</span>
	                <select
	                  className="h-9 rounded-md border border-border-subtle bg-surface-default px-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
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
	                  {saving ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}
	                </button>
	              </div>
	              <div className="mt-2 text-[10px] text-text-subtle">
	                Tema seçimi üst seviyedir; aşağıda seçili temanın özelliklerini ve registry renklerini düzenleyebilirsiniz.
	              </div>
	            </div>

	            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_520px]">
		              <div className="flex flex-col gap-4">
		              <details open className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-2">
		                <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-text-secondary">
		                  Tema özellikleri
		                </summary>
	                <div className="mt-3 grid gap-3 md:grid-cols-2">
		                  <div className="text-[11px] font-semibold text-text-secondary">
		                    Görünüm (appearance)
		                    <div className="mt-1 flex h-8 items-center rounded-md border border-border-subtle bg-surface-muted px-2 text-[11px] text-text-primary">
		                      {themeMeta?.appearance ? themeMeta.appearance : '—'}
		                    </div>
		                  </div>
		                  <label className="text-[11px] font-semibold text-text-secondary">
		                    Accent
		                    <select
		                      className="mt-1 h-8 w-full rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle"
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
		                    Surface tone
		                    <select
		                      className="mt-1 h-8 w-full rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle"
	                      value={themeMeta?.surfaceTone ?? ''}
	                      disabled={!themeMeta}
	                      onChange={(event) => {
	                        const next = event.target.value;
	                        setThemeMeta((prev) => (prev ? { ...prev, surfaceTone: next ? next : null } : prev));
	                      }}
	                    >
	                      <option value="">Varsayılan</option>
	                      {surfaceToneOptions.map((tone) => (
	                        <option key={tone} value={tone}>
	                          {tone}
	                        </option>
	                      ))}
	                    </select>
	                  </label>
	                  <label className="text-[11px] font-semibold text-text-secondary">
	                    Density
	                    <select
	                      className="mt-1 h-8 w-full rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle"
	                      value={themeMeta?.axes.density ?? ''}
	                      disabled={!themeMeta}
	                      onChange={(event) => {
	                        const next = event.target.value;
	                        setThemeMeta((prev) => (prev ? { ...prev, axes: { ...prev.axes, density: next } } : prev));
	                      }}
	                    >
	                      {densityOptions.map((option) => (
	                        <option key={option.value} value={option.value}>
	                          {option.label}
	                        </option>
	                      ))}
	                    </select>
	                  </label>
	                  <label className="text-[11px] font-semibold text-text-secondary">
	                    Radius
	                    <select
	                      className="mt-1 h-8 w-full rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle"
	                      value={themeMeta?.axes.radius ?? ''}
	                      disabled={!themeMeta}
	                      onChange={(event) => {
	                        const next = event.target.value;
	                        setThemeMeta((prev) => (prev ? { ...prev, axes: { ...prev.axes, radius: next } } : prev));
	                      }}
	                    >
	                      {radiusOptions.map((option) => (
	                        <option key={option.value} value={option.value}>
	                          {option.label}
	                        </option>
	                      ))}
	                    </select>
	                  </label>
	                  <label className="text-[11px] font-semibold text-text-secondary">
	                    Elevation
	                    <select
	                      className="mt-1 h-8 w-full rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle"
	                      value={themeMeta?.axes.elevation ?? ''}
	                      disabled={!themeMeta}
	                      onChange={(event) => {
	                        const next = event.target.value;
	                        setThemeMeta((prev) => (prev ? { ...prev, axes: { ...prev.axes, elevation: next } } : prev));
	                      }}
	                    >
	                      {elevationOptions.map((option) => (
	                        <option key={option.value} value={option.value}>
	                          {option.label}
	                        </option>
	                      ))}
	                    </select>
	                  </label>
	                  <label className="text-[11px] font-semibold text-text-secondary">
	                    Motion
	                    <select
	                      className="mt-1 h-8 w-full rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle"
	                      value={themeMeta?.axes.motion ?? ''}
	                      disabled={!themeMeta}
	                      onChange={(event) => {
	                        const next = event.target.value;
	                        setThemeMeta((prev) => (prev ? { ...prev, axes: { ...prev.axes, motion: next } } : prev));
	                      }}
	                    >
	                      {motionOptions.map((option) => (
	                        <option key={option.value} value={option.value}>
	                          {option.label}
	                        </option>
	                      ))}
	                    </select>
	                  </label>
	                </div>
		                <div className="mt-2 text-[10px] text-text-subtle">
		                  Değişiklikler önizlemeye anlık uygulanır; kalıcı olması için üstteki kaydet butonunu kullanın.
		                </div>
		              </details>

		              <details open className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-2">
		                <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-text-secondary">
		                  Registry renkleri
		                </summary>
	                <div className="mt-3 flex flex-col gap-4">
	                  {textAreaGroups.length > 0 ? (
	                    <details open className="rounded-2xl border border-border-subtle bg-surface-default px-3 py-2">
	                      <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-text-secondary">
	                        Metin renkleri (alan bazlı)
	                      </summary>
	                      <div className="mt-2 flex flex-col gap-3">
	                        {textAreaGroups.map((group) => (
	                          <details
	                            key={group.id}
	                            className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-2"
	                          >
	                            <summary className="cursor-pointer select-none text-[11px] font-semibold text-text-secondary">
	                              {group.label}
	                            </summary>
	                            <div className="mt-2 flex flex-col gap-2">
	                              {group.rows.map((row) => renderRegistryRow(row))}
	                            </div>
	                          </details>
	                        ))}
	                        <div className="text-[10px] text-text-subtle">
	                          Not: “Hepsini kırmızı yaptım ama bazı metinler farklı” durumu çoğunlukla <span className="font-semibold">action/status/accent</span> token’larından kaynaklanır.
	                        </div>
	                      </div>
	                    </details>
	                  ) : null}
                  {rowsByGroup.map((group) => (
                    <details key={group.id} className="rounded-2xl border border-border-subtle bg-surface-default px-3 py-2">
                      <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        {groupLabelMap[group.id] ?? group.id}
                      </summary>
                      <div className="mt-2 flex flex-col gap-2">
                        {group.rows.map((row) => {
                          const isAdminOnly = row.editableBy === 'ADMIN_ONLY';
                          const cssVars = Array.isArray(row.cssVars) ? row.cssVars : [];
                          const resolvedRaw = cssVars.length > 0 ? resolvedPreviewCssVars[cssVars[0]] : '';
                          const resolvedDisplay = cssVars.length > 0 ? resolvedPreviewDisplayCssVars[cssVars[0]] : '';
                          const overrideValue = row.value?.trim() ? row.value.trim() : '';
                          const swatchColor = overrideValue || resolvedRaw || 'transparent';
                          const isDangerKey =
                            row.key.endsWith('.bg') &&
                            (row.key.startsWith('action.danger') ||
                              row.key.startsWith('status.danger') ||
                              row.key.startsWith('status.warning') ||
                              row.key.startsWith('status.success') ||
                              row.key.startsWith('status.info'));
                          const contrastWarning = isDangerKey ? contrastWarnings[row.key] : undefined;
                          return (
                            <label
                              key={row.id}
                              className="flex flex-col gap-1 rounded-xl border border-border-subtle bg-surface-panel px-2 py-2 text-[11px]"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-text-primary">{row.label}</span>
                                <span className="text-[10px] text-text-subtle">{row.key}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  className="h-7 flex-1 rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
                                  value={row.value ?? ''}
                                  onChange={(event) => handleValueChange(row.key, event.target.value)}
                                  placeholder={
                                    row.controlType === 'COLOR'
                                      ? resolvedDisplay || '#rrggbb veya rgba(...)'
                                      : ''
                                  }
                                />
                                {row.controlType === 'COLOR' ? (
                                  <button
                                    type="button"
                                    className="h-6 w-6 rounded-md border border-border-subtle shadow-sm"
                                    style={{ backgroundColor: swatchColor }}
                                    aria-label={`${row.label} renk seç`}
                                    onClick={() => openColorPicker(row)}
                                  />
                                ) : (
                                  <span
                                    className="h-6 w-6 rounded-md border border-border-subtle"
                                    style={{ backgroundColor: swatchColor }}
                                    aria-hidden
                                  />
                                )}
                              </div>
                              {row.controlType === 'COLOR' && !overrideValue && resolvedDisplay ? (
                                <div className="text-[10px] text-text-subtle">
                                  Varsayılan: <span className="font-mono">{resolvedDisplay}</span>
                                </div>
                              ) : null}
                              {row.controlType === 'COLOR' && activeColorPicker?.key === row.key ? (
                                <div className="mt-2 rounded-xl border border-border-subtle bg-surface-default p-2">
                                  <div className="mb-2 flex items-center justify-between gap-2">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-[10px] font-semibold text-text-secondary">
                                        Renk seçici
                                      </span>
                                      <span className="text-[10px] text-text-subtle">{activeColorPicker.key}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-2 py-1 text-[10px] font-semibold text-text-secondary hover:border-text-secondary"
                                        onClick={() => {
                                          handleValueChange(row.key, '');
                                          setActiveColorPicker(null);
                                        }}
                                      >
                                        Override’ı kaldır
                                      </button>
                                      <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-2 py-1 text-[10px] font-semibold text-text-secondary hover:border-text-secondary"
                                        onClick={() => setActiveColorPicker(null)}
                                      >
                                        Kapat
                                      </button>
                                    </div>
                                  </div>
                                  <UniversalColorPicker
                                    color={activeColorPicker.color}
                                    surfaceTone={null}
                                    surfaceTonePresets={[]}
                                    surfaceTonePalette={[]}
                                    onManualColorChange={(next) => {
                                      setActiveColorPicker((prev) =>
                                        prev && prev.key === row.key ? { ...prev, color: next } : prev,
                                      );
                                      handleValueChange(row.key, rgbaToString(next));
                                    }}
                                    onSurfaceToneChange={() => {
                                      // no-op (surface tone pickers are not used in admin registry editor)
                                    }}
                                  />
                                </div>
                              ) : null}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] text-text-subtle">
                                  {row.description ?? row.groupName}
                                </span>
                                <span
                                  className={
                                    isAdminOnly
                                      ? 'text-[10px] font-semibold text-status-warning-text'
                                      : 'text-[10px] text-text-subtle'
                                  }
                                >
                                  {isAdminOnly ? 'ADMIN_ONLY' : 'USER_ALLOWED'}
                                </span>
                              </div>
                              {isDangerKey ? (
                                <>
                                  <span className="text-[10px] text-status-warning-text">
                                    ERP action/status alanı – kontrast ve a11y kurallarına dikkat edin.
                                  </span>
                                  {contrastWarning ? (
                                    <span className="text-[10px] text-status-danger-text">{contrastWarning}</span>
                                  ) : null}
                                </>
                              ) : null}
                            </label>
                          );
                        })}
                      </div>
                    </details>
                  ))}
                </div>
              </details>

	              </div>
	              <aside className="lg:sticky lg:top-24 self-start max-h-[calc(100vh-8rem)] overflow-auto">
	              <details open data-theme-preview className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-2">
	                <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-text-secondary">
	                  Önizleme
	                </summary>
	                <div className="mt-3 flex flex-col gap-4">
	                  <div className="rounded-2xl border border-border-subtle bg-surface-default p-3">
	                    <div className="flex items-center justify-between gap-2">
	                      <div className="flex flex-col gap-0.5">
	                        <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
	                          Tema paleti
	                        </span>
	                        <span className="text-[10px] text-text-subtle">Seçip düzenleyin.</span>
	                      </div>
	                      <span className="text-[10px] font-semibold text-text-secondary">
	                        {selectedTheme?.name ?? '—'}
	                      </span>
	                    </div>
	                    <div className="mt-2 grid grid-cols-3 gap-2" role="list">
	                      {paletteThemes.map((theme) => {
	                        const isActive = theme.id === selectedThemeId;
	                        const density = theme.axes?.density;
	                        const cardThemeAttr = resolveThemeAttr(theme.appearance, density);
	                        const accent = theme.axes?.accent ?? 'neutral';
	                        const label = theme.name.replace(/^Global\s+/i, '');
		                        return (
		                          <button
		                            key={theme.id}
		                            type="button"
		                            role="listitem"
		                            aria-pressed={isActive}
		                            onClick={() => {
		                              hasManualThemeSelectionRef.current = true;
		                              setSelectedThemeId(theme.id);
		                            }}
		                            className={`rounded-2xl border p-2 transition focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 ${
		                              isActive
		                                ? 'border-action-primary-border shadow-sm'
		                                : 'border-border-subtle hover:border-text-secondary'
		                            }`}
	                            title={theme.name}
	                          >
	                            <span className="mb-1 block truncate text-[11px] font-semibold text-text-secondary">
	                              {label}
	                            </span>
	                            <div
	                              data-theme-scope
	                              data-theme={cardThemeAttr}
	                              data-accent={accent}
	                              data-density={theme.axes?.density}
	                              data-radius={theme.axes?.radius}
	                              data-elevation={theme.axes?.elevation}
	                              data-motion={theme.axes?.motion}
	                              data-surface-tone={theme.surfaceTone ?? undefined}
	                              className="mt-1"
	                            >
	                              <ThemePreviewCard selected={isActive} />
	                            </div>
	                          </button>
	                        );
	                      })}
	                    </div>
	                  </div>
	                  <div className="flex items-center justify-between gap-2">
	                    <span className="text-[10px] text-text-subtle">Değişiklikler yalnız bu alanda anlık uygulanır.</span>
	                    <span className="text-[10px] font-semibold text-text-secondary">
	                      {selectedTheme?.name ?? '—'}
	                    </span>
	                  </div>
	                  <div
                      ref={previewRef}
	                    className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-page"
	                    data-theme-scope
	                    data-theme={previewThemeAttr}
	                    data-accent={themeMeta?.axes.accent ?? selectedTheme?.axes?.accent}
	                    data-density={themeMeta?.axes.density ?? selectedTheme?.axes?.density}
	                    data-radius={themeMeta?.axes.radius ?? selectedTheme?.axes?.radius}
	                    data-elevation={themeMeta?.axes.elevation ?? selectedTheme?.axes?.elevation}
	                    data-motion={themeMeta?.axes.motion ?? selectedTheme?.axes?.motion}
	                    data-surface-tone={(themeMeta?.surfaceTone ?? selectedTheme?.surfaceTone) || undefined}
	                    style={previewStyle}
	                  >
                    <div className="border-b border-border-subtle bg-surface-header px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-xl bg-accent-primary" aria-hidden />
                          <div className="flex flex-col leading-tight">
                            <span className="text-[11px] font-semibold text-text-primary">Shell</span>
                            <span className="text-[10px] text-text-subtle">/admin/themes</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center rounded-full bg-surface-panel px-2 py-1 text-[10px] font-semibold text-text-secondary">
                            Bildirim
                          </span>
                          <span className="inline-flex items-center rounded-full bg-surface-panel px-2 py-1 text-[10px] font-semibold text-text-secondary">
                            Profil
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {['Ana Sayfa', 'Öneriler', 'Etik', 'Erişim', 'Denetim'].map((label) => (
                          <span
                            key={label}
                            className="inline-flex items-center rounded-full border border-border-subtle bg-surface-panel px-2 py-1 text-[10px] font-semibold text-text-secondary"
                          >
                            {label}
                          </span>
                        ))}
                        <span className="inline-flex items-center rounded-full bg-accent-soft px-2 py-1 text-[10px] font-semibold text-accent-primary">
                          shell.nav.themes
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="grid gap-3">
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: 'Default', className: 'bg-surface-default text-text-primary' },
                            { label: 'Raised', className: 'bg-surface-raised text-text-primary' },
                            { label: 'Muted', className: 'bg-surface-muted text-text-primary' },
                            { label: 'Panel', className: 'bg-surface-panel text-text-primary' },
                            { label: 'Header', className: 'bg-surface-header text-text-primary' },
                            { label: 'Overlay', className: 'bg-surface-overlay text-text-inverse' },
                          ].map((surface) => (
                            <div
                              key={surface.label}
                              className={`rounded-xl border border-border-subtle p-2 ${surface.className}`}
                            >
                              <div className="text-[10px] font-semibold">{surface.label}</div>
                              <div className="mt-1 h-4 rounded-md border border-border-subtle bg-transparent" aria-hidden />
                            </div>
                          ))}
                        </div>

                        <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col gap-0.5">
                              <div className="text-[12px] font-semibold text-text-primary">Tema önizleme</div>
                              <div className="text-[11px] text-text-secondary">
                                Metin, border, accent ve overlay örnekleri
                              </div>
                            </div>
                            <ThemePreviewCard selected className="w-28 shrink-0" />
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="inline-flex items-center rounded-md bg-accent-primary px-3 py-1.5 text-[11px] font-semibold text-text-inverse"
                            >
                              Primary
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded-md bg-accent-primary-hover px-3 py-1.5 text-[11px] font-semibold text-text-inverse"
                            >
                              Hover
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded-md border border-border-default bg-surface-default px-3 py-1.5 text-[11px] font-semibold text-text-primary"
                            >
                              Secondary
                            </button>
                            <span className="inline-flex items-center rounded-full bg-accent-soft px-2 py-1 text-[10px] font-semibold text-accent-primary">
                              Accent soft
                            </span>
                            <span className="inline-flex items-center rounded-full bg-accent-focus px-2 py-1 text-[10px] font-semibold text-text-primary">
                              Accent focus
                            </span>
                          </div>
                          <div className="mt-3 grid gap-2">
                            <div className="rounded-xl border border-border-subtle bg-surface-default px-3 py-2">
                              <div className="text-[11px] font-semibold text-text-primary">Başlık</div>
                              <div className="mt-1 text-[11px] text-text-secondary">
                                İkincil metin ve açıklama örneği
                              </div>
                              <div className="mt-1 text-[11px] text-text-subtle">Subtle metin örneği</div>
                            </div>
                            <div className="rounded-xl border border-border-subtle bg-surface-default px-3 py-2">
                              <div className="text-[10px] font-semibold text-text-secondary">Form alanı</div>
                              <input
                                className="mt-1 h-8 w-full rounded-md border border-border-default bg-surface-default px-2 text-[11px] text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1"
                                placeholder="Input placeholder"
                              />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-default">
                              <div className="grid grid-cols-3 gap-2 border-b border-border-subtle bg-surface-muted px-3 py-2 text-[10px] font-semibold text-text-secondary">
                                <span>Kolon</span>
                                <span>Durum</span>
                                <span className="text-right">Tutar</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 border-b border-border-subtle px-3 py-2 text-[11px] text-text-primary">
                                <span>Satır A</span>
                                <span className="text-text-secondary">Aktif</span>
                                <span className="text-right font-semibold">1.234,56</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 px-3 py-2 text-[11px] text-text-primary">
                                <span>Satır B</span>
                                <span className="text-text-secondary">Beklemede</span>
                                <span className="text-right font-semibold">987,00</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                          <div className="text-[11px] font-semibold text-text-primary">Overlay (modal/backdrop)</div>
                          <div className="relative mt-2 h-24 overflow-hidden rounded-xl border border-border-subtle bg-surface-default">
                            <div className="absolute inset-0 bg-surface-overlay opacity-70" aria-hidden />
                            <div className="absolute inset-0 flex items-center justify-center p-2">
                              <div className="w-full max-w-[260px] rounded-xl border border-border-subtle bg-surface-panel p-3 shadow-sm">
                                <div className="text-[11px] font-semibold text-text-primary">Modal başlığı</div>
                                <div className="mt-1 text-[10px] text-text-secondary">
                                  Overlay arka planı ve panel yüzeyi örneği
                                </div>
                                <div className="mt-2 flex justify-end gap-2">
                                  <span className="inline-flex items-center rounded-md border border-border-default bg-surface-default px-2 py-1 text-[10px] font-semibold text-text-primary">
                                    İptal
                                  </span>
                                  <span className="inline-flex items-center rounded-md bg-accent-primary px-2 py-1 text-[10px] font-semibold text-text-inverse">
                                    Onayla
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-col gap-0.5">
                              <div className="text-[11px] font-semibold text-text-primary">Token swatch’leri</div>
                              <div className="text-[10px] text-text-subtle">
                                Registry alanlarının tamamı (override varsa vurgulu).
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-text-secondary">
                              {Object.keys(overrides).length} override
                            </span>
                          </div>
                          <div className="mt-2 flex flex-col gap-2">
                            {rowsByGroup.map((group) => (
                              <details
                                key={group.id}
                                open
                                className="rounded-xl border border-border-subtle bg-surface-default px-2 py-2"
                              >
                                <summary className="cursor-pointer select-none text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                                  {group.id}
                                </summary>
                                <div className="mt-2 flex flex-col gap-1">
                                  {group.rows.map((row) => {
                                    const cssVars = Array.isArray(row.cssVars) ? row.cssVars : [];
                                    const isOverridden = Boolean(row.value && row.value.trim());
                                    const resolvedValue =
                                      cssVars.length > 0 ? resolvedPreviewDisplayCssVars[cssVars[0]] : '';
                                    return (
                                      <div
                                        key={row.id}
                                        className={`flex items-center justify-between gap-2 rounded-lg border px-2 py-2 ${
                                          isOverridden
                                            ? 'border-accent-primary bg-accent-soft'
                                            : 'border-border-subtle bg-surface-panel'
                                        }`}
                                      >
                                        <div className="flex min-w-0 items-center gap-2">
                                          <div className="flex items-center gap-1">
                                            {cssVars.length > 0
                                              ? cssVars.map((cssVar) => renderCssVarSwatch(group.id, cssVar))
                                              : (
                                                <div className="h-7 w-7 rounded-md border border-border-subtle bg-surface-default" />
                                              )}
                                          </div>
                                          <div className="min-w-0">
                                            <div className="truncate text-[11px] font-semibold text-text-primary">
                                              {row.label}
                                            </div>
                                            <div className="truncate text-[10px] text-text-subtle">{row.key}</div>
                                            {cssVars.length > 1 ? (
                                              <div className="truncate text-[10px] text-text-subtle">
                                                {cssVars.join(', ')}
                                              </div>
                                            ) : null}
                                          </div>
                                        </div>
                                        <span className="shrink-0 font-mono text-[10px] text-text-secondary">
                                          {resolvedValue || row.value?.trim() || '—'}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </details>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
	              </details>
	              </aside>
	            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ThemeAdminPage;
