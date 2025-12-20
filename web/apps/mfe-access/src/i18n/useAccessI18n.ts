import React from 'react';
import { useI18nManager, I18nManager, type I18nManager as ShellI18nManager } from 'mfe_shell/i18n';
import { getDictionary } from '@mfe/i18n-dicts';

const NAMESPACE = 'access';
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

export type UseAccessI18nOptions = {
  manager?: ShellI18nManager;
};

export const useAccessI18n = (options?: UseAccessI18nOptions) => {
  let contextManager: ShellI18nManager | null = null;
  try {
    contextManager = useI18nManager();
  } catch {
    contextManager = null;
  }

  const manager = React.useMemo<ShellI18nManager>(() => {
    if (options?.manager) {
      return options.manager;
    }
    if (contextManager) {
      return contextManager;
    }
    return ensureFallbackManager();
  }, [contextManager, options?.manager]);

  const [, forceUpdate] = React.useState(0);

  React.useEffect(() => {
    let active = true;

    const load = async () => {
      await manager.preloadNamespace(NAMESPACE);
      if (active) {
        forceUpdate((value) => value + 1);
      }
    };

    load();
    const unsubscribe = manager.addLocaleChangeListener(() => {
      void load();
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [manager]);

  const ready = manager.hasDictionary(NAMESPACE);
  const locale = manager.getLocale();

  const t = React.useCallback(
    (key: string, params?: Record<string, unknown>) =>
      manager.translateSync(key, params ?? {}, NAMESPACE),
    [manager, locale],
  );

  const formatNumber = React.useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => manager.formatNumber(value, options),
    [manager, locale],
  );

  const formatDate = React.useCallback(
    (value: Date | number, options?: Intl.DateTimeFormatOptions) =>
      manager.formatDate(value, options),
    [manager, locale],
  );

  return { t, ready, formatNumber, formatDate };
};

export type AccessI18n = ReturnType<typeof useAccessI18n>;
