// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  defaultErrorMessages,
  getErrorMessages,
  errorMessagesTr,
  errorMessagesEn,
} from '../i18n/errorMessages';

describe('errorMessages', () => {
  it('defaultErrorMessages is English', () => {
    expect(defaultErrorMessages).toBe(errorMessagesEn);
  });

  it('getErrorMessages returns Turkish for "tr"', () => {
    expect(getErrorMessages('tr')).toBe(errorMessagesTr);
  });

  it('getErrorMessages falls back to English for unknown locale', () => {
    expect(getErrorMessages('xx-unknown')).toBe(errorMessagesEn);
    expect(getErrorMessages('zzz')).toBe(errorMessagesEn);
  });

  it('getErrorMessages resolves extended locales (fr, de)', () => {
    const fr = getErrorMessages('fr');
    expect(fr).toBeDefined();
    expect(fr.required('Nom')).not.toBe(errorMessagesEn.required('Nom'));
  });

  it('Turkish messages produce correct strings', () => {
    expect(errorMessagesTr.required('Ad')).toBe('Ad zorunludur');
    expect(errorMessagesTr.minLength('Ad', 3)).toBe('Ad en az 3 karakter olmalıdır');
    expect(errorMessagesTr.max('Yaş', 120)).toBe('Yaş en fazla 120 olmalıdır');
    expect(errorMessagesTr.email('E-posta')).toBe('E-posta geçerli bir e-posta adresi olmalıdır');
  });

  it('English messages produce correct strings', () => {
    expect(errorMessagesEn.required('Name')).toBe('Name is required');
    expect(errorMessagesEn.minLength('Name', 3)).toBe('Name must be at least 3 characters');
    expect(errorMessagesEn.max('Age', 120)).toBe('Age must be at most 120');
    expect(errorMessagesEn.email('Email')).toBe('Email must be a valid email address');
  });
});
