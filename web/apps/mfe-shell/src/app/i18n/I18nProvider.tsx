import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { I18nManager } from './I18nManager';

const I18nContext = createContext<I18nManager | null>(null);

export type I18nProviderProps = {
  manager: I18nManager;
  children: React.ReactNode;
};

export const I18nProvider: React.FC<I18nProviderProps> = ({ manager, children }) => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const syncDocumentLocale = (locale: string) => {
      if (typeof document === 'undefined') {
        return;
      }
      document.documentElement.lang = locale;
      document.documentElement.dir = manager.isRTL(locale) ? 'rtl' : 'ltr';
    };

    syncDocumentLocale(manager.getLocale());
    const unsubscribe = manager.addLocaleChangeListener((locale) => {
      syncDocumentLocale(locale);
      forceUpdate((value) => value + 1);
    });
    return unsubscribe;
  }, [manager]);

  const contextValue = useMemo(() => manager, [manager]);

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export const useI18nManager = (): I18nManager => {
  const manager = useContext(I18nContext);
  if (!manager) {
    throw new Error('useI18nManager can only be used inside I18nProvider');
  }
  return manager;
};
