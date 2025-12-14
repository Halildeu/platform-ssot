// Minimal mock for mfe_shell/i18n to allow Storybook builds without the remote.
// Provides a simple in-memory dictionary manager with synchronous translate.
type Dictionary = Record<string, string>;

class MockI18nManager {
  private dictionary: Dictionary;
  private listeners: Array<() => void> = [];

  constructor() {
    this.dictionary = {};
  }

  preloadNamespace(): Promise<void> {
    return Promise.resolve();
  }

  hasDictionary(): boolean {
    return true;
  }

  translateSync(key: string, params: Record<string, unknown> = {}): string {
    const base = this.dictionary[key] ?? key;
    return Object.keys(params).reduce(
      (acc, k) => acc.replace(`{${k}}`, String(params[k])),
      base,
    );
  }

  addLocaleChangeListener(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== cb);
    };
  }
}

const singletonManager = new MockI18nManager();

export const useI18nManager = () => singletonManager;
export const I18nManager = MockI18nManager;
export type I18nManager = MockI18nManager;
