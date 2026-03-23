import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { api } from "@mfe/shared-http";
import { useThemeContext } from "../theme/theme-context.provider";
import UniversalColorPicker from "../theme/components/UniversalColorPicker";
import {
  ThemePreviewCard,
  resolveThemeModeKey,
  type ThemeAppearance,
} from "@mfe/design-system";
import {
  parseAnyColor,
  rgbaToString,
  type RgbaColor,
} from "../theme/color-utils";
import { useShellCommonI18n } from "../i18n";

type ThemeScope = "global" | "user";
type BackendTheme = {
  id: string;
  name: string;
  type: "GLOBAL" | "USER";
  appearance?: ThemeAppearance | string;
  baseThemeId?: string | null;
  surfaceTone?: string | null;
  activeFlag?: boolean | null;
  axes?: {
    accent?: string;
    density?: string;
    radius?: string;
    elevation?: string;
    motion?: string;
  };
  overrides?: Record<string, string>;
};

const fetchBackendThemes = async (
  scope: ThemeScope,
): Promise<BackendTheme[]> => {
  const response = await api.get<BackendTheme[]>("/v1/themes", {
    params: { scope },
  });
  return response.data;
};

type ThemeRegistryControlType = "COLOR" | "OPACITY" | "RADIUS" | "MOTION";
type ThemeRegistryEditableBy = "USER_ALLOWED" | "ADMIN_ONLY";

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

const THEME_PERSONALIZATION_GROUPS = new Set([
  "surface",
  "text",
  "border",
  "accent",
  "overlay",
]);
const THEME_PERSONALIZATION_GROUP_ORDER = [
  "surface",
  "text",
  "border",
  "accent",
  "overlay",
];

export const ThemeRuntimePanelButton: React.FC = () => {
  const { t } = useShellCommonI18n();
  const { axes, setThemeKey, surfaceColor, currentThemeId, setThemeId } =
    useThemeContext();
  const [open, setOpen] = useState(false);
  const [themeRegistry, setThemeRegistry] = useState<ThemeRegistryEntry[]>([]);
  const [themeRegistryLoading, setThemeRegistryLoading] = useState(false);
  const [themeRegistryError, setThemeRegistryError] = useState<string | null>(
    null,
  );
  const [userThemeEditorOpen, setUserThemeEditorOpen] = useState(false);
  const [userThemeOverridesDraft, setUserThemeOverridesDraft] = useState<
    Record<string, string>
  >({});
  const [userThemeEditorSaving, setUserThemeEditorSaving] = useState(false);
  const [userThemeEditorError, setUserThemeEditorError] = useState<
    string | null
  >(null);
  const [activeUserThemeColorPicker, setActiveUserThemeColorPicker] = useState<{
    key: string;
    label: string;
    color: RgbaColor;
  } | null>(null);
  const [globalThemes, setGlobalThemes] = useState<BackendTheme[]>([]);
  const [userThemes, setUserThemes] = useState<BackendTheme[]>([]);
  const [themesLoading, setThemesLoading] = useState(false);
  const [themesError, setThemesError] = useState<string | null>(null);
  const [limitError, setLimitError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const userThemeLimit = 3;
  const userThemeCount = userThemes.length;
  const isUserLimitReached = userThemeCount >= userThemeLimit;
  const [pendingGlobalThemeId, setPendingGlobalThemeId] = useState<
    string | null
  >(null);
  const overlayStyle = useMemo(
    () => ({
      backgroundColor: `color-mix(in srgb, var(--surface-overlay-bg) ${axes.overlayIntensity}%, transparent)`,
      opacity: axes.overlayOpacity / 100,
    }),
    [axes.overlayIntensity, axes.overlayOpacity],
  );
  const paletteGlobalThemes = useMemo(() => {
    const preferredAccents = [
      "light",
      "violet",
      "emerald",
      "sunset",
      "ocean",
      "graphite",
    ];
    const normalize = (value: unknown) =>
      String(value ?? "")
        .trim()
        .toLowerCase();
    const hasExplicitPalette = globalThemes.some(
      (theme) => theme.activeFlag === true,
    );

    if (!hasExplicitPalette) {
      const byAccent = new Map<string, BackendTheme>();
      globalThemes.forEach((theme) => {
        const accent = normalize(theme.axes?.accent);
        if (preferredAccents.includes(accent) && !byAccent.has(accent)) {
          byAccent.set(accent, theme);
        }
      });
      return preferredAccents
        .map((accent) => byAccent.get(accent))
        .filter(Boolean) as BackendTheme[];
    }

    const visibleThemes = globalThemes.filter(
      (theme) => theme.activeFlag === true,
    );
    const byAccent = new Map<string, BackendTheme>();
    visibleThemes.forEach((theme) => {
      const accent = normalize(theme.axes?.accent);
      if (!byAccent.has(accent)) {
        byAccent.set(accent, theme);
      }
    });

    const ordered: BackendTheme[] = [];
    const seen = new Set<string>();
    preferredAccents.forEach((accent) => {
      const theme = byAccent.get(accent);
      if (!theme) return;
      ordered.push(theme);
      seen.add(theme.id);
    });

    visibleThemes
      .filter((theme) => !seen.has(theme.id))
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((theme) => ordered.push(theme));

    return ordered;
  }, [globalThemes]);

  const resolveThemeAttrForPreview = useCallback(
    (appearanceRaw: unknown, densityRaw: unknown) => {
      return resolveThemeModeKey({
        appearance: appearanceRaw,
        density: densityRaw,
      });
    },
    [],
  );

  useEffect(() => {
    if (!open || userThemeEditorOpen || activeUserThemeColorPicker) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, userThemeEditorOpen, activeUserThemeColorPicker]);

  useEffect(() => {
    if (!open) {
      return;
    }
    let cancelled = false;

    const loadThemes = async () => {
      setThemesLoading(true);
      setThemesError(null);
      setLimitError(null);
      try {
        const [global, user] = await Promise.all([
          fetchBackendThemes("global"),
          fetchBackendThemes("user"),
        ]);
        if (cancelled) return;
        setGlobalThemes(global);
        setUserThemes(user);
      } catch {
        if (!cancelled) {
          setThemesError(t("shell.theme.errors.loadThemes"));
        }
      } finally {
        if (!cancelled) {
          setThemesLoading(false);
        }
      }
    };

    loadThemes();

    return () => {
      cancelled = true;
    };
  }, [open, t]);

  useEffect(() => {
    if (!open) {
      return;
    }
    let cancelled = false;

    const loadRegistry = async () => {
      setThemeRegistryLoading(true);
      setThemeRegistryError(null);
      try {
        const response =
          await api.get<ThemeRegistryEntry[]>("/v1/theme-registry");
        if (cancelled) return;
        setThemeRegistry(response.data ?? []);
      } catch {
        if (!cancelled) {
          setThemeRegistryError(t("shell.theme.errors.loadRegistry"));
        }
      } finally {
        if (!cancelled) {
          setThemeRegistryLoading(false);
        }
      }
    };

    loadRegistry();

    return () => {
      cancelled = true;
    };
  }, [open, t]);

  useEffect(() => {
    if (!userThemeEditorOpen && !activeUserThemeColorPicker) {
      return;
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (activeUserThemeColorPicker) {
        setActiveUserThemeColorPicker(null);
        return;
      }
      setUserThemeEditorOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [userThemeEditorOpen, activeUserThemeColorPicker]);

  const selectedUserTheme = useMemo(
    () => userThemes.find((theme) => theme.id === currentThemeId),
    [userThemes, currentThemeId],
  );

  const activePaletteGlobalThemeId = useMemo(() => {
    const normalizeId = (value: unknown) =>
      typeof value === "string" && value.trim().length > 0
        ? value.trim()
        : null;

    if (pendingGlobalThemeId) return pendingGlobalThemeId;

    const currentId = normalizeId(currentThemeId);
    if (currentId && globalThemes.some((theme) => theme.id === currentId)) {
      return currentId;
    }

    const baseId = normalizeId(selectedUserTheme?.baseThemeId);
    if (baseId && globalThemes.some((theme) => theme.id === baseId)) {
      return baseId;
    }

    return null;
  }, [
    pendingGlobalThemeId,
    currentThemeId,
    globalThemes,
    selectedUserTheme?.baseThemeId,
  ]);

  const userThemeRowsByGroup = useMemo(() => {
    type UserThemeEditorRow = ThemeRegistryEntry & { value?: string };

    const grouped: Record<string, UserThemeEditorRow[]> = {};
    themeRegistry
      .filter(
        (entry) =>
          THEME_PERSONALIZATION_GROUPS.has(entry.groupName) &&
          entry.editableBy === "USER_ALLOWED" &&
          entry.controlType === "COLOR",
      )
      .forEach((entry) => {
        const group = entry.groupName ?? "other";
        if (!grouped[group]) {
          grouped[group] = [];
        }
        grouped[group].push({
          ...entry,
          value: userThemeOverridesDraft[entry.key],
        });
      });

    const sortedGroups = Object.keys(grouped).sort((a, b) => {
      const ia = THEME_PERSONALIZATION_GROUP_ORDER.indexOf(a);
      const ib = THEME_PERSONALIZATION_GROUP_ORDER.indexOf(b);
      const sa = ia === -1 ? Number.MAX_SAFE_INTEGER : ia;
      const sb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib;
      return sa - sb || a.localeCompare(b);
    });

    return sortedGroups.map((id) => ({ id, rows: grouped[id] }));
  }, [themeRegistry, userThemeOverridesDraft]);

  const handleThemeSelect = useCallback(
    (themeId: string) => {
      void setThemeId(themeId);
    },
    [setThemeId],
  );

  const handleGlobalThemePaletteSelect = useCallback(
    (theme: BackendTheme) => {
      const accent = String(theme.axes?.accent ?? "")
        .trim()
        .toLowerCase();
      if (accent) {
        setThemeKey(accent);
      }
      setPendingGlobalThemeId(theme.id);
      handleThemeSelect(theme.id);
    },
    [handleThemeSelect, setThemeKey],
  );

  const openUserThemeEditor = () => {
    if (!selectedUserTheme) {
      setThemesError(t("shell.theme.errors.selectPersonalTheme"));
      return;
    }
    setUserThemeOverridesDraft(selectedUserTheme.overrides ?? {});
    setUserThemeEditorError(null);
    setUserThemeEditorOpen(true);
  };

  const handleUserThemeOverrideChange = (key: string, value: string) => {
    const trimmed = value.trim();
    setUserThemeOverridesDraft((prev) => {
      const next = { ...prev };
      if (!trimmed) {
        delete next[key];
        return next;
      }
      next[key] = trimmed;
      return next;
    });
    setUserThemeEditorError(null);
  };

  const openUserThemeColorPicker = (key: string, label: string) => {
    const current = userThemeOverridesDraft[key];
    const parsed = parseAnyColor(current ?? "") ?? {
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    };
    setActiveUserThemeColorPicker({ key, label, color: parsed });
  };

  const handleSaveUserThemeOverrides = async () => {
    if (!selectedUserTheme) {
      setUserThemeEditorError(t("shell.theme.errors.selectPersonalThemeFirst"));
      return;
    }
    try {
      setUserThemeEditorSaving(true);
      setUserThemeEditorError(null);
      const response = await api.put<BackendTheme>(
        `/v1/themes/${selectedUserTheme.id}`,
        userThemeOverridesDraft,
      );
      const updated = response.data;

      setUserThemes((prev) =>
        prev.map((theme) =>
          theme.id === updated.id
            ? {
                ...theme,
                name: updated.name ?? theme.name,
                appearance: updated.appearance ?? theme.appearance,
                overrides: updated.overrides ?? userThemeOverridesDraft,
              }
            : theme,
        ),
      );

      setUserThemeEditorOpen(false);
      setActiveUserThemeColorPicker(null);
      handleThemeSelect(selectedUserTheme.id);
    } catch (error: unknown) {
      const anyError = error as { response?: { data?: unknown } };
      const data = anyError.response?.data;
      const message =
        typeof data === "string"
          ? data
          : typeof data === "object" && data !== null && "message" in data
            ? typeof (data as { message?: unknown }).message === "string"
              ? (data as { message: string }).message
              : null
            : null;
      setUserThemeEditorError(
        message || t("shell.theme.errors.overrideSaveFailed"),
      );
    } finally {
      setUserThemeEditorSaving(false);
    }
  };

  const handleForkTheme = async (themeId: string) => {
    if (isUserLimitReached) {
      setLimitError(t("shell.theme.errors.personalThemeLimit"));
      return;
    }
    try {
      const response = await api.post<BackendTheme>(
        `/v1/themes/${themeId}/fork`,
      );
      const created = response.data;
      setUserThemes((prev) => [...prev, created]);
      setLimitError(null);
      handleThemeSelect(created.id);
    } catch (error: unknown) {
      // USER_THEME_LIMIT_EXCEEDED veya diğer validasyon hataları
      // Mesaj ThemeExceptionHandler tarafından "message" alanında taşınıyor.
      const anyError = error as { response?: { data?: unknown } };
      const data = anyError.response?.data;
      const message =
        typeof data === "string"
          ? data
          : typeof data === "object" && data !== null && "message" in data
            ? typeof (data as { message?: unknown }).message === "string"
              ? (data as { message: string }).message
              : null
            : null;
      if (message && String(message).includes("USER_THEME_LIMIT_EXCEEDED")) {
        setLimitError(t("shell.theme.errors.personalThemeLimit"));
        return;
      }
      setThemesError(message || t("shell.theme.errors.copyFailed"));
    }
  };

  const handleDeleteTheme = async (themeId: string) => {
    try {
      await api.delete(`/v1/themes/${themeId}`);
      setUserThemes((prev) => prev.filter((theme) => theme.id !== themeId));
      setLimitError(null);

      if (currentThemeId === themeId) {
        const remainingUserThemes = userThemes.filter(
          (theme) => theme.id !== themeId,
        );
        if (remainingUserThemes.length > 0) {
          handleThemeSelect(remainingUserThemes[0].id);
        } else if (globalThemes.length > 0) {
          handleThemeSelect(globalThemes[0].id);
        }
      }
    } catch {
      setThemesError(t("shell.theme.errors.deleteFailed"));
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="inline-flex h-8 items-center gap-1 rounded-full border border-action-primary-border bg-action-primary px-3 text-xs font-semibold text-action-primary-text transition hover:opacity-90"
        data-testid="runtime-panel-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t("shell.theme.panel.triggerAria")}
        aria-controls="runtime-panel"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span aria-hidden>🎨</span>
        <span className="hidden xl:inline">
          {t("shell.theme.panel.triggerText")}
        </span>
      </button>
      {open && (
        <div
          id="runtime-panel"
          data-testid="runtime-panel"
          className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-border-subtle bg-surface-panel p-4 shadow-xl"
          data-surface-tone={axes.surfaceTone ?? undefined}
          style={{ background: rgbaToString(surfaceColor) }}
          role="dialog"
          aria-label={t("shell.theme.panel.dialogLabel")}
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 text-xs font-semibold text-text-secondary">
              <span>{t("shell.theme.panel.paletteTitle")}</span>
              {themesLoading ? (
                <span className="text-[11px] text-text-subtle">
                  {t("shell.theme.panel.loadingThemes")}
                </span>
              ) : themesError ? (
                <span className="text-[11px] text-status-danger-text">
                  {themesError}
                </span>
              ) : paletteGlobalThemes.length === 0 ? (
                <span className="text-[11px] text-text-subtle">
                  {t("shell.theme.panel.globalPaletteEmpty")}
                </span>
              ) : (
                <div
                  className="grid grid-cols-3 gap-2"
                  role="list"
                  data-testid="global-theme-palette"
                >
                  {paletteGlobalThemes.map((theme) => {
                    const isActive = theme.id === activePaletteGlobalThemeId;
                    const accent = String(theme.axes?.accent ?? "neutral")
                      .trim()
                      .toLowerCase();
                    const density = theme.axes?.density ?? axes.density;
                    const radius = theme.axes?.radius ?? axes.radius;
                    const elevation = theme.axes?.elevation ?? axes.elevation;
                    const motion = theme.axes?.motion ?? axes.motion;
                    const surfaceTone =
                      theme.surfaceTone ?? axes.surfaceTone ?? undefined;
                    const cardThemeAttr = resolveThemeAttrForPreview(
                      theme.appearance,
                      density,
                    );
                    const label = theme.name.replace(/^Global\s+/i, "");
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        role="listitem"
                        aria-pressed={isActive}
                        data-active={isActive ? "true" : "false"}
                        onClick={() => handleGlobalThemePaletteSelect(theme)}
                        className={`rounded-2xl border p-2 transition focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 ${
                          isActive
                            ? "border-action-primary-border shadow-xs"
                            : "border-border-subtle hover:border-text-secondary"
                        }`}
                        aria-label={t("shell.theme.panel.globalThemeAria", {
                          label,
                        })}
                      >
                        <span className="mb-1 block truncate text-[11px] font-semibold text-text-secondary">
                          {label}
                        </span>
                        <div
                          data-theme-scope
                          data-theme={cardThemeAttr}
                          data-accent={accent}
                          data-density={density}
                          data-radius={radius}
                          data-elevation={elevation}
                          data-motion={motion}
                          data-surface-tone={surfaceTone}
                          className="mt-1"
                        >
                          <ThemePreviewCard selected={isActive} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="mt-2 flex flex-col gap-1 text-[11px] text-text-secondary">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">
                    {t("shell.theme.panel.profileThemeLabel")}
                  </span>
                  <span className="text-[10px] text-text-subtle">
                    {t("shell.theme.panel.myThemesCount", {
                      count: userThemeCount,
                      limit: userThemeLimit,
                    })}
                  </span>
                </div>
                <button
                  type="button"
                  data-testid="theme-fork-button"
                  className="inline-flex w-full items-center justify-center rounded-full border border-border-subtle bg-surface-muted px-2 py-1 text-[11px] font-medium text-text-secondary hover:border-text-secondary disabled:cursor-not-allowed disabled:text-text-subtle"
                  onClick={() => {
                    setPendingGlobalThemeId(null);
                    const fallback = paletteGlobalThemes[0]?.id;
                    const globalSelected = globalThemes.some(
                      (theme) => theme.id === currentThemeId,
                    )
                      ? currentThemeId
                      : null;
                    const sourceId = globalSelected ?? fallback;
                    if (sourceId) {
                      void handleForkTheme(sourceId);
                    }
                  }}
                  disabled={
                    themesLoading ||
                    Boolean(themesError) ||
                    isUserLimitReached ||
                    paletteGlobalThemes.length === 0
                  }
                  title={
                    isUserLimitReached
                      ? t("shell.theme.panel.forkTitle.limit")
                      : paletteGlobalThemes.length === 0
                        ? t("shell.theme.panel.forkTitle.noPalette")
                        : t("shell.theme.panel.forkTitle.ready")
                  }
                >
                  {t("shell.theme.panel.forkButton")}
                </button>
                {themesLoading ? (
                  <span className="text-text-subtle">
                    {t("shell.theme.panel.loadingThemes")}
                  </span>
                ) : themesError ? (
                  <span className="text-status-danger-text">{themesError}</span>
                ) : (
                  <div className="flex flex-col gap-1">
                    {limitError ? (
                      <span className="text-[10px] text-status-warning-text">
                        {limitError}
                      </span>
                    ) : null}
                    {userThemes.length > 0 && (
                      <>
                        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-text-subtle">
                          {t("shell.theme.panel.personalLabel")}
                        </span>
                        <div
                          className="flex flex-wrap gap-1"
                          data-testid="user-theme-list"
                        >
                          {userThemes.map((theme) => {
                            const selected = theme.id === currentThemeId;
                            return (
                              <div
                                key={theme.id}
                                className="inline-flex items-center gap-1"
                              >
                                <button
                                  type="button"
                                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium transition focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 ${
                                    selected
                                      ? "border-action-primary-border bg-action-primary text-action-primary-text"
                                      : "border-border-subtle bg-surface-muted text-text-secondary hover:border-text-secondary"
                                  }`}
                                  onClick={() => {
                                    setPendingGlobalThemeId(null);
                                    handleThemeSelect(theme.id);
                                  }}
                                >
                                  <span className="truncate">{theme.name}</span>
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex items-center rounded-full border border-border-subtle bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium text-text-secondary hover:border-status-danger-border hover:text-status-danger-text"
                                  onClick={() =>
                                    void handleDeleteTheme(theme.id)
                                  }
                                  title={t(
                                    "shell.theme.panel.deleteThemeTitle",
                                  )}
                                >
                                  <span aria-hidden>✕</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                    {globalThemes.length === 0 && userThemes.length === 0 && (
                      <span className="text-text-subtle">
                        {t("shell.theme.panel.noThemes")}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                data-testid="user-theme-colors-button"
                className="inline-flex items-center justify-between rounded-lg border border-border-subtle bg-surface-panel px-3 py-2 text-left text-xs font-semibold text-text-primary shadow-xs hover:border-text-secondary disabled:cursor-not-allowed disabled:opacity-60"
                onClick={openUserThemeEditor}
                disabled={
                  !selectedUserTheme ||
                  themeRegistryLoading ||
                  themeRegistry.length === 0
                }
                title={
                  !selectedUserTheme
                    ? t("shell.theme.panel.personalColorsHintSelect")
                    : themeRegistryLoading
                      ? t("shell.theme.panel.personalColorsHintLoading")
                      : themeRegistry.length === 0
                        ? t(
                            "shell.theme.panel.personalColorsHintMissingRegistry",
                          )
                        : t("shell.theme.panel.personalColorsHintReady")
                }
              >
                <span>{t("shell.theme.panel.personalColorsAction")}</span>
                <span aria-hidden>›</span>
              </button>
              {themeRegistryError ? (
                <span className="text-[10px] text-status-warning-text">
                  {themeRegistryError}
                </span>
              ) : null}
            </div>
            <div className="text-[10px] text-text-subtle">
              {t("shell.theme.panel.paletteHint")}
            </div>
          </div>
        </div>
      )}
      {userThemeEditorOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
              data-testid="user-theme-editor-overlay"
              onClick={() => setUserThemeEditorOpen(false)}
            >
              <div
                className="absolute inset-0 bg-surface-overlay"
                style={overlayStyle}
                aria-hidden="true"
              />
              <div
                className="relative w-full max-w-3xl"
                data-testid="user-theme-editor"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-2 flex items-center justify-between rounded-2xl border border-border-subtle bg-surface-panel px-4 py-3 shadow-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-text-primary">
                      {t("shell.theme.panel.editorTitle")}
                    </span>
                    <span className="text-[10px] text-text-subtle">
                      {selectedUserTheme?.name ?? currentThemeId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-action-primary-border bg-action-primary px-3 py-1 text-xs font-semibold text-action-primary-text hover:opacity-90 disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-surface-muted disabled:text-text-subtle"
                      onClick={() => void handleSaveUserThemeOverrides()}
                      disabled={userThemeEditorSaving || !selectedUserTheme}
                    >
                      {userThemeEditorSaving
                        ? t("shell.theme.panel.saving")
                        : t("common.save")}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary hover:border-text-secondary"
                      onClick={() => setUserThemeEditorOpen(false)}
                    >
                      {t("shell.theme.panel.close")}
                    </button>
                  </div>
                </div>
                {userThemeEditorError ? (
                  <div className="mb-2 rounded-xl border border-status-danger-border bg-status-danger px-3 py-2 text-[11px] font-semibold text-status-danger-text">
                    {userThemeEditorError}
                  </div>
                ) : null}
                {themeRegistryLoading ? (
                  <div className="rounded-xl border border-border-subtle bg-surface-panel px-3 py-3 text-[11px] font-semibold text-text-secondary">
                    {t("shell.theme.panel.registryLoading")}
                  </div>
                ) : userThemeRowsByGroup.length === 0 ? (
                  <div className="rounded-xl border border-border-subtle bg-surface-panel px-3 py-3 text-[11px] font-semibold text-text-secondary">
                    {t("shell.theme.panel.noEditableRegistry")}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {userThemeRowsByGroup.map((group) => (
                      <section
                        key={group.id}
                        className="rounded-2xl border border-border-subtle bg-surface-panel p-3"
                      >
                        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                          {group.id}
                        </h2>
                        <div className="flex flex-col gap-2">
                          {group.rows.map((row) => (
                            <label
                              key={row.id}
                              className="flex flex-col gap-1 rounded-xl border border-border-subtle bg-surface-default px-2 py-2 text-[11px]"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-text-primary">
                                  {row.label}
                                </span>
                                <span className="text-[10px] text-text-subtle">
                                  {row.key}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  className="h-7 flex-1 rounded-md border border-border-subtle bg-surface-panel px-2 text-[11px] text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
                                  value={row.value ?? ""}
                                  onChange={(event) =>
                                    handleUserThemeOverrideChange(
                                      row.key,
                                      event.target.value,
                                    )
                                  }
                                  placeholder={t(
                                    "shell.theme.panel.colorInputPlaceholder",
                                  )}
                                />
                                <button
                                  type="button"
                                  className="h-6 w-6 rounded-md border border-border-subtle shadow-xs"
                                  style={{
                                    backgroundColor: row.value ?? "transparent",
                                  }}
                                  aria-label={t(
                                    "shell.theme.panel.colorPickerAria",
                                    { label: row.label },
                                  )}
                                  onClick={() =>
                                    openUserThemeColorPicker(row.key, row.label)
                                  }
                                />
                              </div>
                              <span className="text-[10px] text-text-subtle">
                                {row.description ?? row.groupName}
                              </span>
                            </label>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
      {activeUserThemeColorPicker
        ? createPortal(
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8"
              onClick={() => setActiveUserThemeColorPicker(null)}
            >
              <div
                className="absolute inset-0 bg-surface-overlay"
                style={overlayStyle}
                aria-hidden="true"
              />
              <div
                className="relative w-full max-w-3xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-2 flex items-center justify-between rounded-2xl border border-border-subtle bg-surface-panel px-4 py-3 shadow-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-text-primary">
                      {activeUserThemeColorPicker.label}
                    </span>
                    <span className="text-[10px] text-text-subtle">
                      {activeUserThemeColorPicker.key}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary hover:border-text-secondary"
                      onClick={() => {
                        handleUserThemeOverrideChange(
                          activeUserThemeColorPicker.key,
                          "",
                        );
                        setActiveUserThemeColorPicker(null);
                      }}
                    >
                      {t("shell.theme.panel.clearOverride")}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary hover:border-text-secondary"
                      onClick={() => setActiveUserThemeColorPicker(null)}
                    >
                      {t("shell.theme.panel.close")}
                    </button>
                  </div>
                </div>
                <UniversalColorPicker
                  color={activeUserThemeColorPicker.color}
                  surfaceTone={null}
                  surfaceTonePresets={[]}
                  surfaceTonePalette={[]}
                  onManualColorChange={(next) => {
                    setActiveUserThemeColorPicker((prev) =>
                      prev ? { ...prev, color: next } : prev,
                    );
                    handleUserThemeOverrideChange(
                      activeUserThemeColorPicker.key,
                      rgbaToString(next),
                    );
                  }}
                  onSurfaceToneChange={() => {
                    // no-op (surface tone pickers are not used in user theme registry editor)
                  }}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};
