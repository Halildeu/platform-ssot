import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import reducer, { setKeycloakSession } from './auth.slice';

const originalWindow = globalThis.window;
const originalLocalStorage = globalThis.localStorage;

class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return key in this.store ? this.store[key] : null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }
}

describe('auth.slice token sanitization', () => {
  beforeEach(() => {
    const localStorage = new LocalStorageMock();
    Object.defineProperty(globalThis, 'window', {
      value: { localStorage },
      configurable: true,
    });
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorage,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
    });
  });

  it("literal 'undefined' tokenını gerçek oturum olarak kabul etmez", () => {
    const next = reducer(
      undefined,
      setKeycloakSession({
        token: 'undefined',
        profile: {
          email: 'admin1@example.com',
          role: 'ADMIN',
          permissions: ['USER-READ'],
        },
      }),
    );

    expect(next.token).toBeNull();
    expect(next.user).toBeNull();
    expect(globalThis.localStorage.getItem('token')).toBeNull();
  });
});
