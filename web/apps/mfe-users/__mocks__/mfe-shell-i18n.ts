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

export class I18nManager {
  private locale: string;
  private fallbackLocale: string;
  private readonly defaultNamespace: string;
  private loadDictionaryFn: LoadDictionaryFn;
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

  addLocaleChangeListener(listener: (locale: string) => void): () => void {
    this.localeListeners.add(listener);
    return () => this.localeListeners.delete(listener);
  }

  hasDictionary(namespace: string, locale: string = this.locale): boolean {
    const entry = this.cache.get(this.cacheKey(locale, namespace));
    return Boolean(entry && Object.keys(entry.dictionary).length > 0);
  }

  async preloadNamespace(namespace: string, locale: string = this.locale): Promise<void> {
    await this.ensureDictionary(locale, namespace);
    if (locale !== this.fallbackLocale) {
      await this.ensureDictionary(this.fallbackLocale, namespace);
    }
  }

  translateSync(
    key: string,
    params: Record<string, unknown> = {},
    namespace: string = this.defaultNamespace,
  ): string {
    const primary = this.cache.get(this.cacheKey(this.locale, namespace));
    if (primary?.dictionary?.[key]) {
      return this.interpolate(primary.dictionary[key], params);
    }
    if (this.locale !== this.fallbackLocale) {
      const fallback = this.cache.get(this.cacheKey(this.fallbackLocale, namespace));
      if (fallback?.dictionary?.[key]) {
        this.onFallback?.({
          namespace,
          key,
          locale: this.locale,
          fallbackLocale: this.fallbackLocale,
        });
        return this.interpolate(fallback.dictionary[key], params);
      }
    }
    this.onMissingKey?.({
      namespace,
      key,
      locale: this.locale,
      fallbackLocale: this.fallbackLocale,
    });
    return key;
  }

  private cacheKey(locale: string, namespace: string): string {
    return `${locale}::${namespace}`;
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
      this.cache.set(key, {
        dictionary: response.dictionary,
        etag: response.etag ?? null,
        expiresAt: response.ttlMs ? now + response.ttlMs : null,
      });
      return response.dictionary;
    }

    const empty: Dictionary = {};
    this.cache.set(key, { dictionary: empty });
    return empty;
  }

  private interpolate(template: string, params: Record<string, unknown>): string {
    return template.replace(/\{(\w+)\}/g, (match, paramKey) => {
      const value = params[paramKey];
      return value === undefined || value === null ? match : String(value);
    });
  }
}

export const __moduleExports = {
  I18nManager,
};
