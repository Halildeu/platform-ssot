export type Dictionary = Record<string, string>;

export type LoadDictionaryResult =
  | { dictionary: Dictionary; etag?: string | null; ttlMs?: number | null }
  | { notModified: true; ttlMs?: number | null };

export type LoadDictionaryFn = (
  locale: string,
  namespace: string,
  etag?: string | null,
) => Promise<LoadDictionaryResult>;

export type FallbackInfo = {
  namespace: string;
  key: string;
  locale: string;
  fallbackLocale: string;
};

export type I18nManagerConfig = {
  initialLocale?: string;
  fallbackLocale?: string;
  defaultNamespace?: string;
  loadDictionary?: LoadDictionaryFn;
  onFallback?: (info: FallbackInfo) => void;
  onMissingKey?: (info: FallbackInfo) => void;
};

type CacheEntry = {
  dictionary: Dictionary;
  etag?: string | null;
  expiresAt?: number | null;
};

const DEFAULT_FALLBACK_LOCALE = 'en';
const RTL_LOCALES = new Set(['ar', 'fa', 'he', 'ur']);

export class I18nManager {
  private locale: string;
  private loadDictionaryFn: LoadDictionaryFn;
  private fallbackLocale: string;
  private readonly defaultNamespace: string;
  private readonly cache = new Map<string, CacheEntry>();
  private readonly localeListeners = new Set<(locale: string) => void>();
  private onFallback?: (info: FallbackInfo) => void;
  private onMissingKey?: (info: FallbackInfo) => void;

  constructor(config: I18nManagerConfig = {}) {
    this.locale = config.initialLocale ?? DEFAULT_FALLBACK_LOCALE;
    this.fallbackLocale = config.fallbackLocale ?? DEFAULT_FALLBACK_LOCALE;
    this.defaultNamespace = config.defaultNamespace ?? 'common';
    this.loadDictionaryFn =
      config.loadDictionary ??
      (async () => ({ dictionary: {}, etag: null, ttlMs: 5 * 60 * 1000 }));
    this.onFallback = config.onFallback;
    this.onMissingKey = config.onMissingKey;
  }

  getLocale(): string {
    return this.locale;
  }

  setLocale(locale: string): void {
    if (!locale || this.locale === locale) {
      return;
    }
    this.locale = locale;
    this.localeListeners.forEach((listener) => listener(locale));
  }

  getFallbackLocale(): string {
    return this.fallbackLocale;
  }

  setFallbackLocale(locale: string): void {
    if (!locale) {
      return;
    }
    this.fallbackLocale = locale;
  }

  setLoadDictionary(fn: LoadDictionaryFn): void {
    this.loadDictionaryFn = fn;
    this.cache.clear();
  }

  setFallbackHandler(handler?: (info: FallbackInfo) => void): void {
    this.onFallback = handler;
  }

  setMissingKeyHandler(handler?: (info: FallbackInfo) => void): void {
    this.onMissingKey = handler;
  }

  isRTL(locale: string = this.locale): boolean {
    const short = locale.split('-')[0];
    return RTL_LOCALES.has(short.toLowerCase());
  }

  addLocaleChangeListener(listener: (locale: string) => void): () => void {
    this.localeListeners.add(listener);
    return () => this.localeListeners.delete(listener);
  }

  private cacheKey(locale: string, namespace: string): string {
    return `${locale}::${namespace}`;
  }

  private getCacheEntry(locale: string, namespace: string): CacheEntry | undefined {
    return this.cache.get(this.cacheKey(locale, namespace));
  }

  hasDictionary(namespace: string, locale: string = this.locale): boolean {
    const entry = this.getCacheEntry(locale, namespace);
    return Boolean(entry && Object.keys(entry.dictionary).length > 0);
  }

  async preloadNamespace(namespace: string, locale: string = this.locale): Promise<void> {
    await this.ensureDictionary(locale, namespace);
    if (this.fallbackLocale !== locale) {
      await this.ensureDictionary(this.fallbackLocale, namespace);
    }
  }

  translateSync(
    key: string,
    params: Record<string, unknown> = {},
    namespace: string = this.defaultNamespace,
  ): string {
    const primary = this.getCacheEntry(this.locale, namespace);
    if (primary?.dictionary?.[key]) {
      return this.interpolate(primary.dictionary[key], params);
    }
    if (this.locale !== this.fallbackLocale) {
      const fallback = this.getCacheEntry(this.fallbackLocale, namespace);
      if (fallback?.dictionary?.[key]) {
        return this.interpolate(fallback.dictionary[key], params);
      }
    }
    if (this.onMissingKey) {
      this.onMissingKey({
        key,
        locale: this.locale,
        namespace,
        fallbackLocale: this.fallbackLocale,
      });
    }
    return key;
  }

  private async ensureDictionary(locale: string, namespace: string): Promise<Dictionary> {
    const key = this.cacheKey(locale, namespace);
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (!cached.expiresAt || cached.expiresAt > now)) {
      return cached.dictionary;
    }

    const response = await this.loadDictionaryFn(locale, namespace, cached?.etag ?? null);

    if ('notModified' in response && cached) {
      const expiresAt = response.ttlMs ? now + response.ttlMs : cached.expiresAt ?? null;
      this.cache.set(key, { ...cached, expiresAt });
      return cached.dictionary;
    }

    if ('dictionary' in response) {
      const expiresAt = response.ttlMs ? now + response.ttlMs : null;
      this.cache.set(key, {
        dictionary: response.dictionary,
        etag: response.etag ?? null,
        expiresAt,
      });
      return response.dictionary;
    }

    const empty: Dictionary = {};
    this.cache.set(key, { dictionary: empty });
    return empty;
  }

  async t(key: string, params: Record<string, unknown> = {}, namespace?: string): Promise<string> {
    const effectiveNamespace = namespace ?? this.defaultNamespace;
    const localized = await this.resolveKey(this.locale, effectiveNamespace, key, params);
    if (localized !== null) {
      return localized;
    }

    if (this.locale !== this.fallbackLocale) {
      const fallback = await this.resolveKey(this.fallbackLocale, effectiveNamespace, key, params);
      if (fallback !== null) {
        this.onFallback?.({
          namespace: effectiveNamespace,
          key,
          locale: this.locale,
          fallbackLocale: this.fallbackLocale,
        });
        return fallback;
      }
    }

    return key;
  }

  formatNumber(value: number, options?: Intl.NumberFormatOptions, locale = this.locale): string {
    return new Intl.NumberFormat(locale, options).format(value);
  }

  formatDate(value: Date | number, options?: Intl.DateTimeFormatOptions, locale = this.locale): string {
    return new Intl.DateTimeFormat(locale, options).format(value);
  }

  private async resolveKey(
    locale: string,
    namespace: string,
    key: string,
    params: Record<string, unknown>,
  ): Promise<string | null> {
    const dictionary = await this.ensureDictionary(locale, namespace);
    const template = dictionary[key];
    if (!template) {
      return null;
    }
    return this.interpolate(template, params);
  }

  private interpolate(template: string, params: Record<string, unknown>): string {
    return template.replace(/\{(\w+)\}/g, (match, paramKey) => {
      const value = params[paramKey];
      if (value === undefined || value === null) {
        return match;
      }
      return String(value);
    });
  }
}
