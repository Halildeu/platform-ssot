import React from 'react';
import { useI18nManager, I18nManager, type I18nManager as ShellI18nManager } from 'mfe_shell/i18n';
import { getDictionary } from '@mfe/i18n-dicts';

const NAMESPACE = 'reports';
const FALLBACK_TTL_MS = 10 * 60 * 1000;

let fallbackManager: ShellI18nManager | null = null;

const ensureFallbackManager = (): ShellI18nManager => {
  if (fallbackManager) {
    return fallbackManager;
  }
  fallbackManager = new I18nManager({
    initialLocale: 'tr',
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

export const useReportingI18n = () => {
  let manager: ShellI18nManager | null = null;
  try {
    manager = useI18nManager();
  } catch {
    manager = null;
  }

  const resolvedManager = React.useMemo(() => manager ?? ensureFallbackManager(), [manager]);
  const [, forceUpdate] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      await resolvedManager.preloadNamespace(NAMESPACE);
      if (active) {
        forceUpdate((value) => value + 1);
      }
    };
    load();
    const unsubscribe = resolvedManager.addLocaleChangeListener(() => {
      void load();
    });
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [resolvedManager]);

  const ready = resolvedManager.hasDictionary(NAMESPACE);
  const locale = resolvedManager.getLocale();

  const t = React.useCallback(
    (key: string, params?: Record<string, unknown>) => resolvedManager.translateSync(key, params ?? {}, NAMESPACE),
    [resolvedManager, locale],
  );

  return {
    t,
    ready,
    manager: resolvedManager,
  };
};
