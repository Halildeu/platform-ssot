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
    const unsubscribe = manager.addLocaleChangeListener(() => {
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
    throw new Error('useI18nManager sadece I18nProvider içerisinde kullanılabilir');
  }
  return manager;
};

