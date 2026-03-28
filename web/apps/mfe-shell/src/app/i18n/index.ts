import { I18nManager, type I18nManagerConfig } from './I18nManager';

const defaultManager = new I18nManager();

export const i18n = defaultManager;

export const configureI18n = (config: I18nManagerConfig): I18nManager => {
  if (config.initialLocale) {
    defaultManager.setLocale(config.initialLocale);
  }
  if (config.fallbackLocale) {
    defaultManager.setFallbackLocale(config.fallbackLocale);
  }
  if (config.loadDictionary) {
    defaultManager.setLoadDictionary(config.loadDictionary);
  }
  if (config.onFallback) {
    defaultManager.setFallbackHandler(config.onFallback);
  }
  if (config.onMissingKey) {
    defaultManager.setMissingKeyHandler(config.onMissingKey);
  }
  return defaultManager;
};

export { I18nManager } from './I18nManager';
export type { Dictionary, LoadDictionaryFn, LoadDictionaryResult, FallbackInfo } from './I18nManager';
export { I18nProvider, useI18nManager } from './I18nProvider';
export { useShellCommonI18n } from './useShellCommonI18n';
export { useShellNamespaceI18n } from './useShellNamespaceI18n';
