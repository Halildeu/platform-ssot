import React from 'react';
import { useI18nManager } from './index';

export const useShellNamespaceI18n = (namespace: string) => {
  const manager = useI18nManager();
  const [, forceUpdate] = React.useState(0);

  React.useEffect(() => {
    let active = true;

    const load = async () => {
      await manager.preloadNamespace(namespace);
      if (active) {
        forceUpdate((value) => value + 1);
      }
    };

    void load();
    const unsubscribe = manager.addLocaleChangeListener(() => {
      void load();
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [manager, namespace]);

  const ready = manager.hasDictionary(namespace);
  const locale = manager.getLocale();

  const t = React.useCallback(
    (key: string, params?: Record<string, unknown>, overrideNamespace?: string) =>
      manager.translateSync(key, params ?? {}, overrideNamespace ?? namespace),
    [locale, manager, namespace, ready],
  );

  const formatNumber = React.useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => manager.formatNumber(value, options),
    [locale, manager],
  );

  const formatDate = React.useCallback(
    (value: Date | number, options?: Intl.DateTimeFormatOptions) => manager.formatDate(value, options),
    [locale, manager],
  );

  return { t, ready, manager, locale, formatNumber, formatDate };
};

export type ShellNamespaceI18n = ReturnType<typeof useShellNamespaceI18n>;
