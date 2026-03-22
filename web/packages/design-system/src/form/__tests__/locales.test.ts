// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { getErrorMessages } from '../i18n/errorMessages';
import { allLocales } from '../i18n/locales';

describe('i18n locales', () => {
  it('has 50+ locales', () => {
    expect(Object.keys(allLocales).length).toBeGreaterThanOrEqual(50);
  });

  it('each locale has all 8 message functions', () => {
    const keys = ['required', 'minLength', 'maxLength', 'min', 'max', 'pattern', 'email', 'invalid'];
    for (const [code, messages] of Object.entries(allLocales)) {
      for (const key of keys) {
        expect(typeof (messages as any)[key]).toBe('function');
      }
    }
  });

  it('getErrorMessages resolves all locale codes', () => {
    for (const code of Object.keys(allLocales)) {
      const messages = getErrorMessages(code);
      expect(messages).toBeDefined();
      expect(typeof messages.required).toBe('function');
    }
  });

  it('RTL locales are included', () => {
    expect(allLocales.ar).toBeDefined();
    expect(allLocales.he).toBeDefined();
    expect(allLocales.fa).toBeDefined();
    expect(allLocales.ur).toBeDefined();
  });

  it('messages produce non-empty strings', () => {
    for (const [code, messages] of Object.entries(allLocales)) {
      expect(messages.required('Field').length).toBeGreaterThan(0);
      expect(messages.email('Email').length).toBeGreaterThan(0);
    }
  });
});
