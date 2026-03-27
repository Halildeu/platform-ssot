declare module 'mfe_shell/i18n' {
  export interface ShellI18nManager {
    getLocale(): string;
    setLocale(locale: string): void;
    addLocaleChangeListener(listener: (locale: string) => void): () => void;
    preloadNamespace(namespace: string, locale?: string): Promise<void>;
    translateSync(key: string, params?: Record<string, unknown>, namespace?: string): string;
    hasDictionary(namespace: string, locale?: string): boolean;
    formatNumber(value: number, options?: Intl.NumberFormatOptions, locale?: string): string;
    formatDate(value: Date | number, options?: Intl.DateTimeFormatOptions, locale?: string): string;
  }

  export function useI18nManager(): ShellI18nManager;
}
