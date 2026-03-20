import React from 'react';
import { I18nManager, type I18nManager as ShellI18nManager } from 'mfe_shell/i18n';
import { getDictionary } from '@mfe/i18n-dicts';

const NAMESPACE = 'users';
const COMMON_NAMESPACE = 'common';
const FALLBACK_TTL_MS = 10 * 60 * 1000;

let fallbackManager: ShellI18nManager | null = null;

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

const ensureFallbackManager = (): ShellI18nManager => {
  if (fallbackManager) {
    return fallbackManager;
  }
  fallbackManager = new I18nManager({
    initialLocale: detectInitialLocale(),
    fallbackLocale: 'en',
    defaultNamespace: NAMESPACE,
    loadDictionary: async (locale, namespace, etag) => {
      const result = getDictionary(locale, namespace);
      if (!result) {
        return { dictionary: {} };
      }
      if (etag && etag === result.version) {
        return { notModified: true, ttlMs: FALLBACK_TTL_MS };
      }
      return {
        dictionary: result.dictionary,
        etag: result.version,
        ttlMs: FALLBACK_TTL_MS,
      };
    },
  });
  return fallbackManager;
};

export const useUsersI18n = () => {
  const resolvedManager = React.useMemo(() => ensureFallbackManager(), []);
  const [revision, setRevision] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      await resolvedManager.preloadNamespace(NAMESPACE);
      await resolvedManager.preloadNamespace(COMMON_NAMESPACE);
      if (active) {
        setRevision((value) => value + 1);
      }
    };
    load();

    const unsubscribe = resolvedManager.addLocaleChangeListener(() => {
      void load();
    });

    const handleLocaleChange = (event: Event) => {
      const custom = event as CustomEvent<{ locale?: string }>;
      const nextLocale = custom.detail?.locale;
      if (nextLocale) {
        resolvedManager.setLocale(nextLocale);
        void load();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('app:locale-change', handleLocaleChange);
    }

    return () => {
      active = false;
      unsubscribe?.();
      if (typeof window !== 'undefined') {
        window.removeEventListener('app:locale-change', handleLocaleChange);
      }
    };
  }, [resolvedManager]);

  const ready = resolvedManager.hasDictionary(NAMESPACE);
  const locale = resolvedManager.getLocale();

  const t = React.useCallback(
    (key: string, params?: Record<string, unknown>) => {
      const namespace = key.startsWith('shell.') ? COMMON_NAMESPACE : NAMESPACE;
      return resolvedManager.translateSync(key, params ?? {}, namespace);
    },
    [resolvedManager, locale, revision],
  );

  return {
    t,
    ready,
    manager: resolvedManager,
    locale,
  };
};
