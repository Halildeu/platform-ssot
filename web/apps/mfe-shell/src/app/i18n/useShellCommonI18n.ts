import React from 'react';
import { useI18nManager } from './index';

const NAMESPACE = 'common';

export const useShellCommonI18n = () => {
  const manager = useI18nManager();
  const [, forceUpdate] = React.useState(0);

  React.useEffect(() => {
    let active = true;

    const load = async () => {
      await manager.preloadNamespace(NAMESPACE);
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
  }, [manager]);

  const ready = manager.hasDictionary(NAMESPACE);
  const locale = manager.getLocale();

  const t = React.useCallback(
    (key: string, params?: Record<string, unknown>) =>
      manager.translateSync(key, params ?? {}, NAMESPACE),
    [manager, locale],
  );

  return { t, ready, manager, locale };
};

export type ShellI18n = ReturnType<typeof useShellCommonI18n>;
