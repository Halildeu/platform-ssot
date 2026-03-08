import React, { useEffect, Suspense, useMemo, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LayoutGrid, ChevronDown } from 'lucide-react';
import {
  api,
  configureSharedHttp,
  registerAuthTokenResolver,
  registerTraceIdResolver,
  registerUnauthorizedHandler,
} from '@mfe/shared-http';
import keycloak from './auth/keycloakClient';
import { authConfig, buildAppRedirectUri, isKeycloakMode, isPermitAllMode } from './auth/auth-config';

import { store } from './store/store';
import { useAppDispatch, useAppSelector } from './store/store.hooks';
import { ThemeProvider, useThemeContext } from './theme/theme-context.provider';
import UniversalColorPicker from './theme/components/UniversalColorPicker';
import { ThemePreviewCard, resolveThemeModeKey, type ThemeAppearance } from 'mfe-ui-kit';
import { parseAnyColor, rgbaToString, type RgbaColor } from './theme/color-utils';
import { logout, setKeycloakSession, setAuthInitialized, decodeJwtPayload } from '../features/auth/model/auth.slice';
import { fetchProducts } from '../features/products/model/products.slice';
import { LoginPage } from '../pages/login';
import { RegisterPage } from '../pages/register';
import { UnauthorizedPage } from '../pages/unauthorized';
import ThemeMatrixPage from '../pages/runtime/ThemeMatrixPage';
import ThemeAdminPage from '../pages/admin/ThemeAdminPage';
import DesignLabPage from '../pages/admin/DesignLabPage';
import { ProtectedRoute } from '../widgets/app-shell/ui/ProtectedRoute.ui';
import LoginPopover from '../widgets/app-shell/ui/LoginPopover.ui';
import AppLauncher from '../widgets/app-shell/ui/AppLauncher.ui';
import NotificationCenter from '../widgets/app-shell/ui/NotificationCenter.ui';
import { Sidebar } from '../widgets/app-shell/ui/Sidebar.ui';
import { useAuthorization } from '../features/auth/model/use-authorization.model';
import { PERMISSIONS } from '../features/auth/lib/permissions.constants';
import {
  configureShellServices,
  getShellServices,
  type ShellTelemetryEvent,
} from './services/shell-services';
import { broadcastAuthState, subscribeAuthState, withSuppressedAuthBroadcast } from './auth/auth-sync';
import type { ShellNotificationEntry } from './services/shell-services';
import {
  configureI18n,
  I18nProvider,
  i18n,
  useShellCommonI18n,
  type LoadDictionaryFn,
} from './i18n';
import { pushNotification, toggleOpen } from '../features/notifications/model/notifications.slice';
import { useShellShortcuts } from './shortcuts/useShellShortcuts.model';
import telemetryClient from './telemetry/telemetry-client';
import { trackPageView, resolveTraceId } from '@mfe/shared-http';
import type { TelemetryContext, TelemetryEvent } from '@mfe/shared-types';

const readEnv = (key: string, fallback: string): string => {
  if (typeof process !== 'undefined' && process?.env?.[key]) {
    return process.env[key] as string;
  }
  if (typeof window !== 'undefined') {
    const w = window as Window & { __env__?: Record<string, string> };
    if (w.__env__?.[key]) {
      return w.__env__[key] as string;
    }
  }
  return fallback;
};
import { getDictionary } from '@mfe/i18n-dicts';
import type { UserProfile } from '@mfe/shared-types';

declare global {
  interface Window {
    __shellStore?: typeof store;
  }
}

const SuggestionsApp = React.lazy(() => import('mfe_suggestions/SuggestionsApp'));
const EthicApp = React.lazy(() => import('mfe_ethic/EthicApp'));
const AccessModule = React.lazy(() => import('mfe_access/AccessApp'));
const AuditModule = React.lazy(() => import('mfe_audit/AuditApp'));
const UsersModule = React.lazy(() => import('mfe_users/UsersApp'));
const ReportingModule = React.lazy(() => import('mfe_reporting/ReportingApp'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
type ThemeScope = 'global' | 'user';

type BackendTheme = {
  id: string;
  name: string;
  type: 'GLOBAL' | 'USER';
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

const fetchBackendThemes = async (scope: ThemeScope): Promise<BackendTheme[]> => {
  const response = await api.get<BackendTheme[]>('/v1/themes', { params: { scope } });
  return response.data;
};

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

const THEME_PERSONALIZATION_GROUPS = new Set(['surface', 'text', 'border', 'accent', 'overlay']);
const THEME_PERSONALIZATION_GROUP_ORDER = ['surface', 'text', 'border', 'accent', 'overlay'];

type UserMenuItem =
  | { key: string; label: string; icon?: React.ReactNode; disabled?: boolean }
  | { type: 'divider' };

const UserMenuPopover: React.FC<{
  items: UserMenuItem[];
  onClose: () => void;
  onLogout?: () => void;
}> = ({ items, onClose, onLogout }) => {
  return (
    <div
      className="absolute right-0 z-50 mt-2 min-w-[220px] rounded-xl border border-border-subtle bg-surface-panel shadow-xl p-2"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-text-subtle">
        Kullanıcı
      </div>
      <ul className="flex flex-col gap-1 text-sm text-text-primary">
        {items.map((item) => {
          if ('type' in item && item.type === 'divider') {
            return <li key={Math.random()} className="my-1 border-t border-border-subtle" />;
          }
          const disabled = item.disabled;
          const handleClick = () => {
            if (disabled) return;
            if (item.key === 'logout') {
              onLogout?.();
            }
            onClose();
          };
          return (
            <li key={item.key}>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-text-primary hover:bg-surface-muted disabled:text-text-subtle"
                onClick={handleClick}
                disabled={disabled}
              >
                {item.icon ? <span aria-hidden>{item.icon}</span> : null}
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
const DICTIONARY_TTL_MS = 10 * 60 * 1000;

const loadDictionary: LoadDictionaryFn = async (locale, namespace, etag) => {
  const result = getDictionary(locale, namespace);
  if (!result) {
    return { dictionary: {} };
  }
  if (etag && etag === result.version) {
    return { notModified: true, ttlMs: DICTIONARY_TTL_MS };
  }
  return {
    dictionary: result.dictionary,
    etag: result.version,
    ttlMs: DICTIONARY_TTL_MS,
  };
};

const pushShellNotification = (entry: ShellNotificationEntry) => {
  store.dispatch(pushNotification(entry));
  if (entry.meta?.open === true) {
    store.dispatch(toggleOpen(true));
  }
};

const emitShellTelemetry = (event: ShellTelemetryEvent) => {
  telemetryClient.emit(event);
};

configureSharedHttp({ authMode: authConfig.mode });

configureShellServices({
  queryClient,
  getAuthToken: () => store.getState().auth.token,
  subscribeAuthToken: (listener) => {
    const readAuthState = () => store.getState().auth;
    let previousToken = readAuthState().token ?? null;
    let previousExpiresAt = readAuthState().expiresAt ?? null;
    let previousProfileHash = JSON.stringify(readAuthState().user ?? null);

    const notify = () => {
      const nextState = readAuthState();
      const token = nextState.token ?? null;
      const expiresAt = nextState.expiresAt ?? null;
      const profileHash = JSON.stringify(nextState.user ?? null);

      if (token !== previousToken) {
        listener(token);
      }

      if (token !== previousToken || expiresAt !== previousExpiresAt || profileHash !== previousProfileHash) {
        broadcastAuthState({
          token,
          expiresAt,
          profile: nextState.user ?? undefined,
        });
        previousToken = token;
        previousExpiresAt = expiresAt;
        previousProfileHash = profileHash;
      }
    };

    const unsubscribe = store.subscribe(notify);
    listener(previousToken ?? null);
    broadcastAuthState({
      token: previousToken ?? null,
      expiresAt: previousExpiresAt ?? null,
      profile: readAuthState().user ?? undefined,
    });
    return unsubscribe;
  },
  notify: pushShellNotification,
  telemetry: emitShellTelemetry,
  isFeatureEnabled: () => false,
});

const wireRemoteShellServices = () => {
  if (typeof window === 'undefined') {
    return;
  }
  const sharedServices = {
    notify: { push: pushShellNotification },
    telemetry: { emit: emitShellTelemetry },
    http: api,
    auth: {
      getToken: () => store.getState().auth.token ?? null,
      getUser: () => store.getState().auth.user ?? null,
    },
  };
  const remotes = [
    { name: 'mfe_access', loader: () => import('mfe_access/shell-services') },
    { name: 'mfe_audit', loader: () => import('mfe_audit/shell-services') },
    { name: 'mfe_users', loader: () => import('mfe_users/shell-services') },
    { name: 'mfe_reporting', loader: () => import('mfe_reporting/shell-services') },
  ];
  remotes.forEach(({ name, loader }) => {
    loader()
      .then((module) => module.configureShellServices(sharedServices))
      .catch((error) => {
        if (process.env.NODE_ENV !== 'production') {
          console.debug(`[shell] ${name} shell-services konfigurasyonu atlandı`, error);
        }
      });
  });
};

wireRemoteShellServices();

const generateTraceId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const random = Math.random().toString(16).slice(2, 10);
  return `trace-${Date.now().toString(36)}-${random}`;
};

registerAuthTokenResolver(() => store.getState().auth.token ?? null);
registerTraceIdResolver(() => generateTraceId());
registerUnauthorizedHandler(() => {
  const state = store.getState().auth;
  // Auth henüz init olmadıysa veya zaten token yoksa logout ile state’i sıfırlama.
  if (!state.initialized || !state.token) {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.debug('[AUTH 401 IGNORE]', { initialized: state.initialized, hasToken: Boolean(state.token) });
    }
    return;
  }
  store.dispatch(logout());
});

const mapKeycloakProfile = (token: string | null): Partial<UserProfile> | null => {
  if (!token) return null;
  const claims = decodeJwtPayload(token);
  if (!claims || typeof claims !== 'object') return null;
  const email = (claims['email'] as string) ?? (claims['preferred_username'] as string) ?? '';
  const name =
    (claims['name'] as string) ??
    (claims['given_name'] as string) ??
    (claims['preferred_username'] as string) ??
    email;
  const realmRoles = Array.isArray((claims as Record<string, unknown>)?.realm_access?.roles)
    ? ((claims as Record<string, unknown>)?.realm_access?.roles as string[])
    : [];
  const resourceRoles = Array.isArray(
    (claims as Record<string, unknown>)?.resource_access?.frontend?.roles,
  )
    ? ((claims as Record<string, unknown>)?.resource_access?.frontend?.roles as string[])
    : [];
  const permissions = [...realmRoles, ...resourceRoles].map((role) =>
    role?.toUpperCase?.() ?? String(role).toUpperCase(),
  );
  return {
    id: (claims['sub'] as string) ?? undefined,
    email,
    role: permissions[0] ?? 'USER',
    permissions,
    fullName: name,
    displayName: name,
    name,
  };
};

const base64Encode = (value: string) => {
  if (typeof btoa === 'function') {
    return btoa(value);
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'utf-8').toString('base64');
  }
  return value;
};

const encodeJwtSegment = (value: string) =>
  base64Encode(value).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

const buildFakeToken = (claims: Record<string, unknown>) => {
  const header = encodeJwtSegment(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = encodeJwtSegment(JSON.stringify(claims));
  return `${header}.${payload}.shell`;
};

const createFakeAuthSession = () => {
  const ttlMs = 60 * 60 * 1000;
  const permissions = authConfig.fakeUser.permissions ?? [];
  const expiresAt = Date.now() + ttlMs;
  const claims = {
    email: authConfig.fakeUser.email,
    name: authConfig.fakeUser.fullName,
    preferred_username: authConfig.fakeUser.displayName ?? authConfig.fakeUser.email,
    realm_access: { roles: permissions },
    resource_access: { frontend: { roles: permissions } },
    sessionTimeoutMinutes: ttlMs / 60000,
    exp: Math.floor(expiresAt / 1000),
  };
  const profile: Partial<UserProfile> = {
    email: authConfig.fakeUser.email,
    fullName: authConfig.fakeUser.fullName,
    displayName: authConfig.fakeUser.displayName ?? authConfig.fakeUser.fullName,
    permissions,
    role: authConfig.fakeUser.role,
  };
  return { token: buildFakeToken(claims), profile, expiresAt };
};

const detectInitialLocale = (): string => {
  if (typeof window === 'undefined') {
    return 'tr';
  }
  const stored = window.localStorage.getItem('mfe.locale');
  if (stored && stored.trim().length > 0) {
    return stored;
  }
  return 'tr';
};

configureI18n({
  initialLocale: detectInitialLocale(),
  fallbackLocale: 'en',
  defaultNamespace: 'common',
  loadDictionary,
  onFallback: (info) => {
    try {
      getShellServices().telemetry.emit({ type: 'i18n_fallback', payload: info });
    } catch (error) {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.debug('[shell i18n fallback]', info, error);
      }
    }
  },
  onMissingKey: (info) => {
    try {
      // Missing key telemetry
      const traceId = resolveTraceId() ?? undefined;
      const event: TelemetryEvent = {
        eventType: 'telemetry',
        eventName: 'i18n_missing_key',
        timestamp: new Date().toISOString(),
        traceId,
        context: {
          app: 'mfe-shell',
          env: (readEnv('APP_ENVIRONMENT', 'local') as TelemetryEvent['context']['env']),
          version: readEnv('APP_RELEASE', 'dev'),
          tags: { namespace: info.namespace, locale: info.locale, fallback: info.fallbackLocale },
        },
        payload: { namespace: info.namespace, locale: info.locale, key: info.key },
      };
      void trackAction(event);
    } catch (error) {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.debug('[shell i18n missing key]', info, error);
      }
    }
  },
});

const RouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Tipli telemetry: page_view
    const baseContext: TelemetryContext = {
      app: 'mfe-shell',
      env: (readEnv('APP_ENVIRONMENT', 'local') as TelemetryContext['env']),
      version: readEnv('APP_RELEASE', 'dev'),
    };
    const traceId = resolveTraceId() ?? undefined;
    const event: TelemetryEvent = {
      eventType: 'telemetry',
      eventName: 'page_view',
      timestamp: new Date().toISOString(),
      traceId,
      context: { ...baseContext, tags: { route: location.pathname } },
      payload: { route: location.pathname },
    };
    void trackPageView(event);
    telemetryClient.trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
};

// STORY-0022: Theme Personalization v1.0
const ThemeRuntimePanelButton: React.FC = () => {
  const {
    axes,
    setThemeKey,
    surfaceColor,
    currentThemeId,
    setThemeId,
  } = useThemeContext();
  const [open, setOpen] = useState(false);
  const [themeRegistry, setThemeRegistry] = useState<ThemeRegistryEntry[]>([]);
  const [themeRegistryLoading, setThemeRegistryLoading] = useState(false);
  const [themeRegistryError, setThemeRegistryError] = useState<string | null>(null);
  const [userThemeEditorOpen, setUserThemeEditorOpen] = useState(false);
  const [userThemeOverridesDraft, setUserThemeOverridesDraft] = useState<Record<string, string>>({});
  const [userThemeEditorSaving, setUserThemeEditorSaving] = useState(false);
  const [userThemeEditorError, setUserThemeEditorError] = useState<string | null>(null);
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
  const [pendingGlobalThemeId, setPendingGlobalThemeId] = useState<string | null>(null);
  const overlayStyle = useMemo(
    () => ({
      backgroundColor: `color-mix(in srgb, var(--surface-overlay-bg) ${axes.overlayIntensity}%, transparent)`,
      opacity: axes.overlayOpacity / 100,
    }),
    [axes.overlayIntensity, axes.overlayOpacity],
  );
  const paletteGlobalThemes = useMemo(() => {
    const preferredAccents = ['light', 'violet', 'emerald', 'sunset', 'ocean', 'graphite'];
    const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();
    const hasExplicitPalette = globalThemes.some((theme) => theme.activeFlag === true);

    if (!hasExplicitPalette) {
      const byAccent = new Map<string, BackendTheme>();
      globalThemes.forEach((theme) => {
        const accent = normalize(theme.axes?.accent);
        if (preferredAccents.includes(accent) && !byAccent.has(accent)) {
          byAccent.set(accent, theme);
        }
      });
      return preferredAccents.map((accent) => byAccent.get(accent)).filter(Boolean) as BackendTheme[];
    }

    const visibleThemes = globalThemes.filter((theme) => theme.activeFlag === true);
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

  const resolveThemeAttrForPreview = useCallback((appearanceRaw: unknown, densityRaw: unknown) => {
    return resolveThemeModeKey({ appearance: appearanceRaw, density: densityRaw });
  }, []);

  useEffect(() => {
    if (!open || userThemeEditorOpen || activeUserThemeColorPicker) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
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
	          fetchBackendThemes('global'),
	          fetchBackendThemes('user'),
        ]);
        if (cancelled) return;
        setGlobalThemes(global);
        setUserThemes(user);
      } catch {
        if (!cancelled) {
          setThemesError('Temalar yüklenemedi.');
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
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    let cancelled = false;

    const loadRegistry = async () => {
      setThemeRegistryLoading(true);
      setThemeRegistryError(null);
      try {
        const response = await api.get<ThemeRegistryEntry[]>('/v1/theme-registry');
        if (cancelled) return;
        setThemeRegistry(response.data ?? []);
      } catch {
        if (!cancelled) {
          setThemeRegistryError('Tema registry yüklenemedi.');
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
  }, [open]);

  useEffect(() => {
    if (!userThemeEditorOpen && !activeUserThemeColorPicker) {
      return;
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (activeUserThemeColorPicker) {
        setActiveUserThemeColorPicker(null);
        return;
      }
      setUserThemeEditorOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [userThemeEditorOpen, activeUserThemeColorPicker]);

  const selectedUserTheme = useMemo(
    () => userThemes.find((theme) => theme.id === currentThemeId),
    [userThemes, currentThemeId],
  );

  const activePaletteGlobalThemeId = useMemo(() => {
    const normalizeId = (value: unknown) => (typeof value === 'string' && value.trim().length > 0 ? value.trim() : null);

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
  }, [pendingGlobalThemeId, currentThemeId, globalThemes, selectedUserTheme?.baseThemeId]);

  const userThemeRowsByGroup = useMemo(() => {
    type UserThemeEditorRow = ThemeRegistryEntry & { value?: string };

    const grouped: Record<string, UserThemeEditorRow[]> = {};
    themeRegistry
      .filter(
        (entry) =>
          THEME_PERSONALIZATION_GROUPS.has(entry.groupName) &&
          entry.editableBy === 'USER_ALLOWED' &&
          entry.controlType === 'COLOR',
      )
      .forEach((entry) => {
        const group = entry.groupName ?? 'other';
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
      const accent = String(theme.axes?.accent ?? '').trim().toLowerCase();
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
      setThemesError('Renk düzenlemek için kişisel bir tema seçin.');
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
    const parsed = parseAnyColor(current ?? '') ?? { r: 255, g: 255, b: 255, a: 1 };
    setActiveUserThemeColorPicker({ key, label, color: parsed });
  };

  const handleSaveUserThemeOverrides = async () => {
    if (!selectedUserTheme) {
      setUserThemeEditorError('Önce kişisel bir tema seçin.');
      return;
    }
    try {
      setUserThemeEditorSaving(true);
      setUserThemeEditorError(null);
      const response = await api.put<BackendTheme>(`/v1/themes/${selectedUserTheme.id}`, userThemeOverridesDraft);
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
        typeof data === 'string'
          ? data
          : typeof data === 'object' && data !== null && 'message' in data
            ? typeof (data as { message?: unknown }).message === 'string'
              ? (data as { message: string }).message
              : null
            : null;
      setUserThemeEditorError(message || 'Tema override kaydedilemedi.');
    } finally {
      setUserThemeEditorSaving(false);
    }
  };

  const handleForkTheme = async (themeId: string) => {
    if (isUserLimitReached) {
      setLimitError('En fazla 3 kişisel tema oluşturabilirsiniz.');
      return;
    }
    try {
      const response = await api.post<BackendTheme>(`/v1/themes/${themeId}/fork`);
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
        typeof data === 'string'
          ? data
          : typeof data === 'object' && data !== null && 'message' in data
            ? typeof (data as { message?: unknown }).message === 'string'
              ? (data as { message: string }).message
              : null
            : null;
      if (message && String(message).includes('USER_THEME_LIMIT_EXCEEDED')) {
        setLimitError('En fazla 3 kişisel tema oluşturabilirsiniz.');
        return;
      }
      setThemesError(message || 'Tema kopyalanamadı.');
    }
  };

	  const handleDeleteTheme = async (themeId: string) => {
	    try {
	      await api.delete(`/v1/themes/${themeId}`);
	      setUserThemes((prev) => prev.filter((theme) => theme.id !== themeId));
      setLimitError(null);

      if (currentThemeId === themeId) {
        const remainingUserThemes = userThemes.filter((theme) => theme.id !== themeId);
        if (remainingUserThemes.length > 0) {
          handleThemeSelect(remainingUserThemes[0].id);
        } else if (globalThemes.length > 0) {
          handleThemeSelect(globalThemes[0].id);
        }
      }
    } catch {
      setThemesError('Tema silinemedi.');
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
        aria-label="Tema paneli"
        aria-controls="runtime-panel"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span aria-hidden>🎨</span>
        <span className="hidden xl:inline">Görünüm</span>
      </button>
      {open && (
        <div
          id="runtime-panel"
          data-testid="runtime-panel"
          className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-border-subtle bg-surface-panel p-4 shadow-xl"
          data-surface-tone={axes.surfaceTone ?? undefined}
          style={{ background: rgbaToString(surfaceColor) }}
          role="dialog"
          aria-label="Tema eksenleri"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 text-xs font-semibold text-text-secondary">
              <span>Tema paleti</span>
              {themesLoading ? (
                <span className="text-[11px] text-text-subtle">Temalar yükleniyor…</span>
              ) : themesError ? (
                <span className="text-[11px] text-status-danger-text">{themesError}</span>
              ) : paletteGlobalThemes.length === 0 ? (
                <span className="text-[11px] text-text-subtle">Global tema paleti bulunamadı.</span>
              ) : (
                <div className="grid grid-cols-3 gap-2" role="list" data-testid="global-theme-palette">
                  {paletteGlobalThemes.map((theme) => {
                    const isActive = theme.id === activePaletteGlobalThemeId;
                    const accent = String(theme.axes?.accent ?? 'neutral').trim().toLowerCase();
                    const density = theme.axes?.density ?? axes.density;
                    const radius = theme.axes?.radius ?? axes.radius;
                    const elevation = theme.axes?.elevation ?? axes.elevation;
                    const motion = theme.axes?.motion ?? axes.motion;
                    const surfaceTone = theme.surfaceTone ?? axes.surfaceTone ?? undefined;
                    const cardThemeAttr = resolveThemeAttrForPreview(theme.appearance, density);
                    const label = theme.name.replace(/^Global\s+/i, '');
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        role="listitem"
                        aria-pressed={isActive}
                        data-active={isActive ? 'true' : 'false'}
                        onClick={() => handleGlobalThemePaletteSelect(theme)}
                        className={`rounded-2xl border p-2 transition focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 ${
                          isActive
                            ? 'border-action-primary-border shadow-sm'
                            : 'border-border-subtle hover:border-text-secondary'
                        }`}
                        aria-label={`Global tema: ${label}`}
                      >
                        <span className="mb-1 block truncate text-[11px] font-semibold text-text-secondary">{label}</span>
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
                  <span className="font-semibold">Profil teması (backend)</span>
                  <span className="text-[10px] text-text-subtle">
                    Benim temalarım ({userThemeCount}/{userThemeLimit})
                  </span>
                </div>
                <button
                  type="button"
                  data-testid="theme-fork-button"
                  className="inline-flex w-full items-center justify-center rounded-full border border-border-subtle bg-surface-muted px-2 py-1 text-[11px] font-medium text-text-secondary hover:border-text-secondary disabled:cursor-not-allowed disabled:text-text-subtle"
	                  onClick={() => {
	                    setPendingGlobalThemeId(null);
	                    const fallback = paletteGlobalThemes[0]?.id;
	                    const globalSelected = globalThemes.some((theme) => theme.id === currentThemeId) ? currentThemeId : null;
	                    const sourceId = globalSelected ?? fallback;
	                    if (sourceId) {
	                      void handleForkTheme(sourceId);
                    }
                  }}
                  disabled={themesLoading || Boolean(themesError) || isUserLimitReached || paletteGlobalThemes.length === 0}
                  title={
                    isUserLimitReached
                      ? 'En fazla 3 kişisel tema oluşturabilirsiniz.'
                      : paletteGlobalThemes.length === 0
                        ? 'Önce global tema paleti yüklenmeli.'
                        : 'Seçili global temayı kopyala ve özelleştir'
                  }
                >
                  Kopyala ve özelleştir
                </button>
                {themesLoading ? (
                  <span className="text-text-subtle">Temalar yükleniyor…</span>
                ) : themesError ? (
                  <span className="text-status-danger-text">{themesError}</span>
                ) : (
                  <div className="flex flex-col gap-1">
                    {limitError ? (
                      <span className="text-[10px] text-status-warning-text">{limitError}</span>
                    ) : null}
                    {userThemes.length > 0 && (
                      <>
                        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-text-subtle">
                          Kişisel
                        </span>
                        <div className="flex flex-wrap gap-1" data-testid="user-theme-list">
                          {userThemes.map((theme) => {
                            const selected = theme.id === currentThemeId;
                            return (
                              <div key={theme.id} className="inline-flex items-center gap-1">
                                <button
                                  type="button"
                                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium transition focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 ${
                                    selected
                                      ? 'border-action-primary-border bg-action-primary text-action-primary-text'
                                      : 'border-border-subtle bg-surface-muted text-text-secondary hover:border-text-secondary'
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
                                  onClick={() => void handleDeleteTheme(theme.id)}
                                  title="Temayı sil"
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
                      <span className="text-text-subtle">Henüz tanımlı bir tema yok.</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                data-testid="user-theme-colors-button"
                className="inline-flex items-center justify-between rounded-lg border border-border-subtle bg-surface-panel px-3 py-2 text-left text-xs font-semibold text-text-primary shadow-sm hover:border-text-secondary disabled:cursor-not-allowed disabled:opacity-60"
                onClick={openUserThemeEditor}
                disabled={!selectedUserTheme || themeRegistryLoading || themeRegistry.length === 0}
                title={
                  !selectedUserTheme
                    ? 'Renk düzenlemek için kişisel tema seçin.'
                    : themeRegistryLoading
                      ? 'Registry yükleniyor…'
                      : themeRegistry.length === 0
                        ? 'Tema registry bulunamadı.'
                        : 'Kişisel tema renklerini düzenle'
                }
              >
                <span>Kişisel tema renkleri</span>
                <span aria-hidden>›</span>
              </button>
	              {themeRegistryError ? (
	                <span className="text-[10px] text-status-warning-text">{themeRegistryError}</span>
	              ) : null}
	            </div>
	            <div className="text-[10px] text-text-subtle">
	              Tema paleti sadece tema seçimi içindir; renk ve diğer ayarları tema özelleştirme alanından düzenleyin.
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
                  <div className="mb-2 flex items-center justify-between rounded-2xl border border-border-subtle bg-surface-panel px-4 py-3 shadow-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-text-primary">Kişisel tema renkleri</span>
                      <span className="text-[10px] text-text-subtle">{selectedUserTheme?.name ?? currentThemeId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-action-primary-border bg-action-primary px-3 py-1 text-xs font-semibold text-action-primary-text hover:opacity-90 disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-surface-muted disabled:text-text-subtle"
                        onClick={() => void handleSaveUserThemeOverrides()}
                        disabled={userThemeEditorSaving || !selectedUserTheme}
                      >
                        {userThemeEditorSaving ? 'Kaydediliyor…' : 'Kaydet'}
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary hover:border-text-secondary"
                        onClick={() => setUserThemeEditorOpen(false)}
                      >
                        Kapat
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
                      Registry yükleniyor…
                    </div>
                  ) : userThemeRowsByGroup.length === 0 ? (
                    <div className="rounded-xl border border-border-subtle bg-surface-panel px-3 py-3 text-[11px] font-semibold text-text-secondary">
                      Düzenlenebilir registry alanı bulunamadı.
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {userThemeRowsByGroup.map((group) => (
                        <section key={group.id} className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
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
                                  <span className="font-semibold text-text-primary">{row.label}</span>
                                  <span className="text-[10px] text-text-subtle">{row.key}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    className="h-7 flex-1 rounded-md border border-border-subtle bg-surface-panel px-2 text-[11px] text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
                                    value={row.value ?? ''}
                                    onChange={(event) => handleUserThemeOverrideChange(row.key, event.target.value)}
                                    placeholder="#rrggbb veya rgba(...)"
                                  />
                                  <button
                                    type="button"
                                    className="h-6 w-6 rounded-md border border-border-subtle shadow-sm"
                                    style={{ backgroundColor: row.value ?? 'transparent' }}
                                    aria-label={`${row.label} renk seç`}
                                    onClick={() => openUserThemeColorPicker(row.key, row.label)}
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
                <div className="absolute inset-0 bg-surface-overlay" style={overlayStyle} aria-hidden="true" />
                <div className="relative w-full max-w-3xl" onClick={(event) => event.stopPropagation()}>
                  <div className="mb-2 flex items-center justify-between rounded-2xl border border-border-subtle bg-surface-panel px-4 py-3 shadow-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-text-primary">
                        {activeUserThemeColorPicker.label}
                      </span>
                      <span className="text-[10px] text-text-subtle">{activeUserThemeColorPicker.key}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary hover:border-text-secondary"
                        onClick={() => {
                          handleUserThemeOverrideChange(activeUserThemeColorPicker.key, '');
                          setActiveUserThemeColorPicker(null);
                        }}
                      >
                        Override’ı kaldır
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary hover:border-text-secondary"
                        onClick={() => setActiveUserThemeColorPicker(null)}
                      >
                        Kapat
                      </button>
                    </div>
                  </div>
                  <UniversalColorPicker
                    color={activeUserThemeColorPicker.color}
                    surfaceTone={null}
                    surfaceTonePresets={[]}
                    surfaceTonePalette={[]}
                    onManualColorChange={(next) => {
                      setActiveUserThemeColorPicker((prev) => (prev ? { ...prev, color: next } : prev));
                      handleUserThemeOverrideChange(activeUserThemeColorPicker.key, rgbaToString(next));
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

const Header = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const permitAllMode = isPermitAllMode();
  const keycloakEnabled = isKeycloakMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [launcherOpen, setLauncherOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [visibleNavItems, setVisibleNavItems] = useState<
    { key: string; path: string; labelKey: string }[]
  >([]);
  const [overflowNavItems, setOverflowNavItems] = useState<
    { key: string; path: string; labelKey: string }[]
  >([]);
  const { hasPermission } = useAuthorization();
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const overflowMenuRef = useRef<HTMLDivElement | null>(null);
  const { t, manager: i18nManager, locale } = useShellCommonI18n();

  useEffect(() => {
    setLoginOpen(false);
    setLauncherOpen(false);
    setUserMenuOpen(false);
    setOverflowOpen(false);
  }, [location.pathname]);

  const menuItems = useMemo(() => {
    const items: { key: string; path: string; labelKey: string }[] = [
      { key: '/', path: '/', labelKey: 'shell.nav.home' },
      { key: '/suggestions', path: '/suggestions', labelKey: 'shell.nav.suggestions' },
      { key: '/ethic', path: '/ethic', labelKey: 'shell.nav.ethic' },
    ];

    if (hasPermission(PERMISSIONS.ACCESS_MODULE)) {
      items.push({ key: '/access', path: '/access/roles', labelKey: 'shell.nav.access' });
    }

    if (hasPermission(PERMISSIONS.AUDIT_MODULE)) {
      items.push({ key: '/audit', path: '/audit/events', labelKey: 'shell.nav.audit' });
    }

    if (hasPermission(PERMISSIONS.USER_MANAGEMENT_MODULE)) {
      items.push({ key: '/admin/users', path: '/admin/users', labelKey: 'shell.nav.users' });
    }

    if (hasPermission(PERMISSIONS.THEME_ADMIN)) {
      items.push({ key: '/admin/themes', path: '/admin/themes', labelKey: 'shell.nav.themes' });
      items.push({ key: '/admin/design-lab', path: '/admin/design-lab', labelKey: 'shell.nav.designLab' });
    }

    return items;
  }, [hasPermission, t, locale]);

  const activeKey = useMemo(() => {
    const normalizedPath = location.pathname || '/';
    // Daha spesifik rotaları öncele (örn. /admin/users, /access/roles)
    const sorted = [...menuItems].sort((a, b) => b.key.length - a.key.length);
    const match = sorted.find((item) => {
      if (item.key === '/') {
        return normalizedPath === '/';
      }
      return normalizedPath.startsWith(item.key);
    });
    return match ? (match.key as string) : '/';
  }, [location.pathname, menuItems]);

  useEffect(() => {
    const updateVisible = () => {
      if (typeof window === 'undefined') {
        setVisibleNavItems(menuItems);
        setOverflowNavItems([]);
        return;
      }
      const width = window.innerWidth || 1920;
      // Sağ blok tam daraldıktan sonra sol nav gizlenmeye başlasın: rezerv değerlerini düşük tut.
      // Sağ blok tamamen daralsın, nav daha geç gizlensin: rezervi küçülttük.
      const RESERVED_RIGHT = width > 1440 ? 300 : width > 1200 ? 260 : width > 1024 ? 220 : 180;
      const AVAILABLE = Math.max(0, width - RESERVED_RIGHT);
      // Öğeler sırayla overflow’a gitsin diye ortalama genişliği biraz küçük tut.
      const avgItemWidth = 100;
      const maxSlots = Math.max(1, Math.floor(AVAILABLE / avgItemWidth));
      const needsOverflow = menuItems.length > maxSlots;
      // Ellipsis için bir slot ayır: maxSlots-1
      const visibleCount = needsOverflow
        ? Math.max(1, maxSlots - 1)
        : menuItems.length;
      setVisibleNavItems(menuItems.slice(0, visibleCount));
      setOverflowNavItems(menuItems.slice(visibleCount));
      setOverflowOpen(false);
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, [menuItems]);

  const userDisplayName = useMemo(() => {
    if (user?.fullName && user.fullName.trim().length > 0) {
      return user.fullName;
    }
    if (user?.displayName) return user.displayName;
    if (user?.name) return user.name;
    if (user?.email) {
      const [namePart] = user.email.split('@');
      return namePart;
    }
    return t('shell.header.defaultUser');
  }, [t, locale, user?.displayName, user?.email, user?.fullName, user?.name]);

  const formattedLastLogin = useMemo(() => {
    if (!user?.lastLoginAt) {
      return t('shell.header.neverLoggedIn');
    }
    try {
      const date = new Date(user.lastLoginAt);
      let localeCode: string | undefined;
      switch (locale) {
        case 'tr':
          localeCode = 'tr-TR';
          break;
        case 'en':
          localeCode = 'en-US';
          break;
        case 'de':
          localeCode = 'de-DE';
          break;
        case 'es':
          localeCode = 'es-ES';
          break;
        default:
          localeCode = undefined;
      }
      return localeCode ? date.toLocaleString(localeCode) : date.toLocaleString();
    } catch {
      return user.lastLoginAt;
    }
  }, [user?.lastLoginAt, t, locale]);

  const userMenuItems = useMemo(
    () => [
      {
        key: 'last-login',
        label: t('shell.header.lastLogin').replace('{value}', formattedLastLogin),
        disabled: true,
      },
      { type: 'divider' as const },
      { key: 'profile', label: t('shell.header.profileSoon'), disabled: true },
      { type: 'divider' as const },
      {
        key: 'logout',
        label: t('shell.header.logout'),
        icon: '🚪',
      },
    ],
    [formattedLastLogin, t],
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    if (keycloakEnabled && typeof window !== 'undefined') {
      keycloak.logout({ redirectUri: buildAppRedirectUri('/login'), federated: true }).catch(() => {
        // no-op
      });
    }
  }, [dispatch, keycloakEnabled]);

  const blurHiddenMenuFocus = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.requestAnimationFrame(() => {
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLElement
        && menuContainerRef.current?.contains(activeElement)
        && activeElement.closest('[aria-hidden="true"]')
      ) {
        activeElement.blur();
      }
    });
  }, []);

  const handleMenuSelect = useCallback(() => {
    blurHiddenMenuFocus();
  }, [blurHiddenMenuFocus]);

  useEffect(() => {
    blurHiddenMenuFocus();
  }, [menuItems, activeKey, blurHiddenMenuFocus]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handleResize = () => {
      blurHiddenMenuFocus();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [blurHiddenMenuFocus]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (overflowMenuRef.current && !overflowMenuRef.current.contains(event.target as Node)) {
        setOverflowOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header
      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      className="sticky top-0 z-50 bg-surface-header px-6 py-2"
    >
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface-panel px-3 py-2 shadow-sm">
        <div ref={menuContainerRef} className="flex flex-1 items-center gap-2 min-w-0">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-action-secondary-border bg-action-secondary text-action-secondary-text shadow-sm transition hover:opacity-90"
            onClick={() => setLauncherOpen((prev) => !prev)}
          >
            <LayoutGrid className="h-4 w-4" aria-hidden />
          </button>
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <nav className="flex flex-1 items-center gap-1 min-w-0">
              <div className="flex flex-1 flex-nowrap items-center gap-2 min-w-0 overflow-hidden">
	                {visibleNavItems.map((item) => {
	                  const isActive = item.key === activeKey;
	                  return (
	                    <Link
	                      key={item.key}
	                      data-testid={item.key === '/admin/design-lab' ? 'nav-design-lab' : undefined}
	                      to={item.path}
	                      onClick={handleMenuSelect}
	                      className={
	                        isActive
                          ? 'rounded-full px-3 py-1 text-xs font-semibold text-action-primary-text shadow-sm'
                          : 'rounded-full px-3 py-1 text-xs font-medium text-text-secondary'
                      }
                      style={{
                        backgroundColor: isActive
                          ? 'var(--accent-primary)'
                          : 'color-mix(in srgb, var(--surface-panel-bg) 70%, transparent)',
                        color: isActive ? 'var(--action-primary-text)' : 'var(--text-secondary)',
                        boxShadow: isActive ? 'var(--elevation-surface)' : 'none',
                        border: isActive ? '1px solid var(--accent-primary-hover)' : '1px solid var(--border-subtle)',
                        flexShrink: 0,
                      }}
                    >
                      {t(item.labelKey)}
                    </Link>
                  );
                })}
              </div>
              {overflowNavItems.length > 0 && (
                <div className="relative flex-shrink-0" ref={overflowMenuRef}>
                  <button
                    type="button"
                    className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium border ${
                      overflowOpen
                        ? 'bg-action-primary text-action-primary-text border-accent-primary'
                        : 'bg-surface-muted text-text-secondary border-border-subtle hover:bg-surface-panel hover:text-text-primary'
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setOverflowOpen((prev) => !prev);
                    }}
                    aria-haspopup="menu"
                    aria-expanded={overflowOpen}
                    title={t('shell.nav.more') ?? 'Diğer sayfalar'}
                  >
                    ⋯
                  </button>
                  {overflowOpen && (
                    <div
                      className="absolute right-0 z-50 mt-2 min-w-[220px] rounded-xl border border-border-subtle bg-surface-panel shadow-xl p-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-text-subtle">
                        {t('shell.nav.more') ?? 'Diğer sayfalar'}
                      </div>
                      <ul className="flex flex-col gap-2 text-sm text-text-primary">
                        {overflowNavItems.map((item) => {
                          const isActive = item.key === activeKey;
                          return (
	                            <li key={item.key}>
	                              <Link
	                                data-testid={item.key === '/admin/design-lab' ? 'nav-design-lab' : undefined}
	                                to={item.path}
	                                onClick={(event) => {
	                                  event.stopPropagation();
	                                  handleMenuSelect();
                                  setOverflowOpen(false);
                                }}
                                className={
                                  isActive
                                    ? 'rounded-full px-3 py-1 text-xs font-semibold text-action-primary-text shadow-sm'
                                    : 'rounded-full px-3 py-1 text-xs font-medium text-text-secondary'
                                }
                                style={{
                                  backgroundColor: isActive
                                    ? 'var(--accent-primary)'
                                    : 'color-mix(in srgb, var(--surface-panel-bg) 70%, transparent)',
                                  color: isActive ? 'var(--action-primary-text)' : 'var(--text-secondary)',
                                  boxShadow: isActive ? 'var(--elevation-surface)' : 'none',
                                  border: isActive
                                    ? '1px solid var(--accent-primary-hover)'
                                    : '1px solid var(--border-subtle)',
                                }}
                              >
                                {t(item.labelKey)}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2 xl:flex">
            <span className="hidden text-xs font-semibold text-text-secondary md:inline">
              {t('shell.header.language')}:
            </span>
            <select
              className="h-8 rounded-md border border-action-secondary-border bg-action-secondary px-2 text-xs font-semibold text-action-secondary-text focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
              value={i18nManager.getLocale()}
              aria-label="Dil seçimi"
              onChange={(event) => {
                const nextLocale = event.target.value;
                i18nManager.setLocale(nextLocale);
                if (typeof window !== 'undefined') {
                  try {
                    window.localStorage.setItem('mfe.locale', nextLocale);
                    window.dispatchEvent(
                      new CustomEvent('app:locale-change', { detail: { locale: nextLocale } }),
                    );
                  } catch {
                    // localStorage veya dispatch hatası UI'yi bloklamasın
                  }
                }
              }}
            >
              <option value="tr">🇹🇷 {t('shell.language.tr')}</option>
              <option value="en">🇬🇧 {t('shell.language.en')}</option>
              <option value="de">🇩🇪 {t('shell.language.de')}</option>
              <option value="es">🇪🇸 {t('shell.language.es')}</option>
            </select>
          </div>
          <div className="inline-flex items-center rounded-full border border-border-subtle bg-surface-panel px-2 py-1 text-xs font-semibold text-text-secondary xl:hidden">
            <span aria-hidden>
              {locale === 'tr' ? '🇹🇷' : locale === 'en' ? '🇬🇧' : locale === 'de' ? '🇩🇪' : locale === 'es' ? '🇪🇸' : '🌐'}
            </span>
          </div>
          <div className="inline-flex">
            <ThemeRuntimePanelButton />
          </div>
          <NotificationCenter />
          {token ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setUserMenuOpen((prev) => !prev);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-surface-panel px-2.5 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-muted lg:gap-2 lg:px-3"
              >
                <span aria-hidden>👤</span>
                <span className="max-w-[140px] truncate text-left hidden lg:inline">{userDisplayName}</span>
                <ChevronDown className="h-3 w-3" aria-hidden />
              </button>
              {userMenuOpen ? (
                <UserMenuPopover
                  onClose={() => setUserMenuOpen(false)}
                  onLogout={handleLogout}
                  items={userMenuItems}
                />
              ) : null}
            </div>
          ) : permitAllMode ? (
            <span className="rounded-full border border-border-subtle bg-surface-panel px-3 py-1 text-xs font-semibold text-text-secondary">
              PermitAll modunda giriş gerekmiyor.
            </span>
	          ) : (
	            <button
	              type="button"
	              className="inline-flex items-center gap-2 rounded-full border border-action-primary-border bg-action-primary px-4 py-2 text-xs font-semibold text-action-primary-text shadow-sm hover:opacity-90"
	              onClick={() => {
	                setLoginOpen(false);
	                keycloak.login({ redirectUri: buildAppRedirectUri(window.location.href) }).catch(() => {
	                  setLoginOpen(true);
	                });
              }}
            >
              <span aria-hidden>🔑</span>
              <span>{t('shell.header.loginPanel')}</span>
            </button>
          )}
        </div>
      </div>
      {!token && !permitAllMode && loginOpen && (
        <LoginPopover onClose={() => setLoginOpen(false)} onNavigate={() => navigate('/login')} />
      )}
      {launcherOpen && <AppLauncher onClose={() => setLauncherOpen(false)} />}
    </header>
  );
};

const AuthTraceRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { token, user } = useAppSelector((state) => state.auth);
  const permissions = user?.permissions ?? [];

  React.useEffect(() => {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && location.pathname === '/admin/users') {
      console.debug('[AUTH STATE TRACE]', {
        path: location.pathname,
        hasToken: Boolean(token),
        email: user?.email ?? null,
        permissions,
      });
    }
  }, [location.pathname, token, user?.email, permissions]);

  return <>{children}</>;
};

const AppLayout = () => {
  const { currentTheme } = useThemeContext();
  const colors = currentTheme.colors;
  const authState = useAppSelector((state) => state.auth);
  const { token, expiresAt } = authState;
  const permitAllMode = isPermitAllMode();
  const showSidebar = Boolean(token) || permitAllMode;
  const dispatch = useAppDispatch();
  const { t } = useShellCommonI18n();
  useShellShortcuts();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!token || !expiresAt) {
      return;
    }
    const now = Date.now();
    const remaining = expiresAt - now;
    const sendSessionExpiredNotification = () => {
      dispatch(
        pushNotification({
          message: t('auth.session.expired'),
          description: t('auth.session.expired.description'),
          type: 'warning',
          meta: { source: 'session-expired' },
        }),
      );
    };
    if (remaining <= 0) {
      sendSessionExpiredNotification();
      dispatch(logout());
      return;
    }
    const timeoutId = window.setTimeout(() => {
      sendSessionExpiredNotification();
      dispatch(logout());
    }, remaining);
    return () => window.clearTimeout(timeoutId);
  }, [dispatch, expiresAt, token]);

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <RouteTracker />
      <div
        style={{
          minHeight: '100vh',
          background: colors.background,
          color: colors.text,
        }}
        className="flex min-h-screen flex-col"
      >
        <Header />
        <div className="flex min-h-0 flex-1">
          {showSidebar ? <Sidebar /> : null}
          <main className="min-w-0 flex-1 px-8 py-8">
          <div className="flex w-full flex-col gap-6">
            <Suspense fallback={<div>Yükleniyor...</div>}>
              <Routes>
                <Route path="/suggestions" element={<ProtectedRoute><SuggestionsApp /></ProtectedRoute>} />
                <Route path="/ethic" element={<ProtectedRoute><EthicApp /></ProtectedRoute>} />
                <Route
                  path="/access/roles"
                  element={(
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.ACCESS_MODULE]}>
                      <AccessModule />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/access"
                  element={<Navigate to="/access/roles" replace />}
                />
                <Route
                  path="/audit/events"
                  element={(
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.AUDIT_MODULE]}>
                      <AuditModule />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/admin/reports/*"
                  element={(
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.REPORTING_MODULE]}>
                      <ReportingModule />
                    </ProtectedRoute>
                  )}
                />
                <Route path="/admin/reports" element={<Navigate to="/admin/reports/users" replace />} />
                <Route path="/reports/*" element={<Navigate to="/admin/reports" replace />} />
                <Route path="/reports" element={<Navigate to="/admin/reports/users" replace />} />
                <Route
                  path="/admin/users"
                  element={(
                    <AuthTraceRoute>
                      <ProtectedRoute requiredPermissions={[PERMISSIONS.USER_MANAGEMENT_MODULE]}>
                        <UsersModule />
                      </ProtectedRoute>
                    </AuthTraceRoute>
                  )}
                />
                <Route
                  path="/admin/themes"
                  element={(
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.THEME_ADMIN]}>
                      <ThemeAdminPage />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/admin/design-lab"
                  element={(
                    <ProtectedRoute requiredPermissions={[PERMISSIONS.THEME_ADMIN]}>
                      <DesignLabPage />
                    </ProtectedRoute>
                  )}
                />
                <Route path="/runtime/theme-matrix" element={<ThemeMatrixPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route
                  path="/"
                  element={<Navigate to={(token || permitAllMode) ? '/suggestions' : '/login'} replace />}
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

const AuthBootstrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const tokenRef = useRef<string | null>(null);
  const shouldUseKeycloak = isKeycloakMode();

  useEffect(() => {
    tokenRef.current = token ?? null;
  }, [token]);

  useEffect(() => {
    if (!shouldUseKeycloak) {
      dispatch(setAuthInitialized(true));
      return () => undefined;
    }
    const unsubscribe = subscribeAuthState((payload) => {
      withSuppressedAuthBroadcast(() => {
        if (!payload?.token) {
          dispatch(logout());
          dispatch(setAuthInitialized(true));
          return;
        }
        dispatch(
          setKeycloakSession({
            token: payload.token,
            profile: payload.profile ?? undefined,
            expiresAt: payload.expiresAt ?? null,
          }),
        );
        dispatch(setAuthInitialized(true));
      });
    });
    return unsubscribe;
  }, [dispatch, shouldUseKeycloak]);

  useEffect(() => {
    if (!shouldUseKeycloak) {
      if (authConfig.enableFakeAuth) {
        const session = createFakeAuthSession();
        dispatch(
          setKeycloakSession({
            token: session.token,
            profile: session.profile ?? undefined,
            expiresAt: session.expiresAt,
          }),
        );
      } else {
        dispatch(setKeycloakSession({ token: null }));
      }
      dispatch(setAuthInitialized(true));
      return;
    }
    let mounted = true;

    const bootstrap = async () => {
      try {
        await keycloak.init({
          onLoad: 'check-sso',
          pkceMethod: 'S256',
          checkLoginIframe: false,
          silentCheckSsoRedirectUri: authConfig.keycloak.silentCheckSsoRedirectUri,
        });
        if (!mounted) return;
        const token = keycloak.token ?? null;
        if (token) {
          const profile = mapKeycloakProfile(token);
          dispatch(
            setKeycloakSession({
              token,
              profile: profile ?? undefined,
              expiresAt: keycloak.tokenParsed?.exp ? keycloak.tokenParsed.exp * 1000 : null,
            }),
          );
        } else {
          if (!tokenRef.current) {
            dispatch(setKeycloakSession({ token: null }));
          }
        }
      } catch {
        if (mounted && !tokenRef.current) {
          dispatch(setKeycloakSession({ token: null }));
        }
      } finally {
        if (mounted) {
          dispatch(setAuthInitialized(true));
        }
      }
    };

    bootstrap();

    keycloak.onTokenExpired = async () => {
      try {
        const refreshed = await keycloak.updateToken(60);
        if (refreshed && keycloak.token) {
          const profile = mapKeycloakProfile(keycloak.token);
          dispatch(
            setKeycloakSession({
              token: keycloak.token,
              profile: profile ?? undefined,
              expiresAt: keycloak.tokenParsed?.exp ? keycloak.tokenParsed.exp * 1000 : null,
            }),
          );
        }
      } catch {
        dispatch(logout());
      }
    };

    return () => {
      mounted = false;
    };
  }, [dispatch, shouldUseKeycloak]);

  return <>{children}</>;
};

const AntShellTheme: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrapper>
        <AppLayout />
      </AuthBootstrapper>
      {process.env.NODE_ENV !== 'production' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
};

const App = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    window.__shellStore = store;
  }
  return (
    <Provider store={store}>
      <ThemeProvider>
        <I18nProvider manager={i18n}>
          <AntShellTheme />
        </I18nProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
