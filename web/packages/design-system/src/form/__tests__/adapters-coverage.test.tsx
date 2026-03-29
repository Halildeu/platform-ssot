// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// --- RHF Adapter ---
import { createRHFAdapter, RHFFormProvider } from '../adapters/rhfAdapter';

// --- Error Messages ---
import {
  getErrorMessages,
  errorMessagesTr,
  errorMessagesEn,
  defaultErrorMessages,
} from '../i18n/errorMessages';
import type { ErrorMessageMap } from '../i18n/errorMessages';

// --- Locale Count ---
import { getSupportedLocaleCount } from '../i18n/localeCount';

// --- useFormLocale ---
import { useFormLocale } from '../i18n/useFormLocale';

// --- FormContext ---
import { useFormContext, FormContext } from '../FormContext';
import type { FormContextValue } from '../FormContext';

// --- LocaleProvider for hooks ---
import { LocaleProvider } from '../../providers/LocaleProvider';

// =====================================================================
// 1. createRHFAdapter — all mapping branches
// =====================================================================

describe('createRHFAdapter', () => {
  function createMockRHF(overrides: Record<string, unknown> = {}) {
    return {
      watch: () => ({}),
      getValues: () => ({ name: 'Alice', email: 'a@b.com', ...overrides }),
      setValue: vi.fn(),
      formState: {
        errors: {
          name: { message: 'Name is required' },
          email: undefined,
          age: { message: '' }, // empty message — should be filtered
        },
        touchedFields: {
          name: true,
          email: false,
          age: undefined,
        },
        dirtyFields: {
          name: true,
          email: false,
        },
        isSubmitting: false,
        isValid: true,
        isDirty: true,
      },
      trigger: vi.fn().mockResolvedValue(true),
      reset: vi.fn(),
    };
  }

  it('maps errors correctly — includes only non-empty messages', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm });

    expect(adapter.errors).toEqual({ name: 'Name is required' });
    expect(adapter.errors.email).toBeUndefined();
    expect(adapter.errors.age).toBeUndefined();
  });

  it('maps touched fields correctly — only true values', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm });

    expect(adapter.touched).toEqual({ name: true });
    expect(adapter.touched.email).toBeUndefined();
  });

  it('maps dirty fields correctly', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm });

    expect(adapter.dirtyFields).toEqual({ name: true });
  });

  it('returns values from getValues', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm });

    expect(adapter.values).toEqual({ name: 'Alice', email: 'a@b.com' });
  });

  it('defaults access to full and mode to onBlur', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm });

    expect(adapter.access).toBe('full');
    expect(adapter.mode).toBe('onBlur');
  });

  it('respects custom access and mode', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm, access: 'readonly', mode: 'onChange' });

    expect(adapter.access).toBe('readonly');
    expect(adapter.mode).toBe('onChange');
  });

  it('setFieldValue calls setValue with shouldValidate based on mode', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm, mode: 'onChange' });

    adapter.setFieldValue('name', 'Bob');
    expect(rhfForm.setValue).toHaveBeenCalledWith('name', 'Bob', { shouldValidate: true });
  });

  it('setFieldValue with onBlur mode does not validate', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm, mode: 'onBlur' });

    adapter.setFieldValue('name', 'Bob');
    expect(rhfForm.setValue).toHaveBeenCalledWith('name', 'Bob', { shouldValidate: false });
  });

  it('validateField triggers RHF validation and returns error', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm });

    const result = adapter.validateField('name');
    expect(rhfForm.trigger).toHaveBeenCalledWith('name');
    expect(result).toBe('Name is required');
  });

  it('validateField returns null when no error', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm });

    const result = adapter.validateField('email');
    expect(result).toBeNull();
  });

  it('validateForm triggers full validation', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm });

    const result = adapter.validateForm();
    expect(rhfForm.trigger).toHaveBeenCalledWith();
    expect(result).toEqual({ name: 'Name is required' });
  });

  it('reset calls RHF reset', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm });

    adapter.reset({ name: '' });
    expect(rhfForm.reset).toHaveBeenCalledWith({ name: '' });
  });

  it('setFieldTouched, setFieldError, clearFieldError are noops', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm });

    // Should not throw
    adapter.setFieldTouched('name', true);
    adapter.setFieldError('name', 'err');
    adapter.clearFieldError('name');
  });

  it('exposes isValid, isDirty, isSubmitting from formState', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm });

    expect(adapter.isValid).toBe(true);
    expect(adapter.isDirty).toBe(true);
    expect(adapter.isSubmitting).toBe(false);
  });

  it('validator is null', () => {
    const rhfForm = createMockRHF();
    const adapter = createRHFAdapter({ rhfForm });

    expect(adapter.validator).toBeNull();
  });
});

// =====================================================================
// 2. RHFFormProvider — renders children with context
// =====================================================================

describe('RHFFormProvider', () => {
  it('provides context to children', () => {
    const rhfForm = {
      watch: () => ({}),
      getValues: () => ({ field: 'value' }),
      setValue: vi.fn(),
      formState: {
        errors: {},
        touchedFields: {},
        dirtyFields: {},
        isSubmitting: false,
        isValid: true,
        isDirty: false,
      },
      trigger: vi.fn(),
      reset: vi.fn(),
    };

    let contextValue: FormContextValue | null = null;

    function Consumer() {
      contextValue = useFormContext();
      return null;
    }

    render(
      <RHFFormProvider rhfForm={rhfForm}>
        <Consumer />
      </RHFFormProvider>,
    );

    expect(contextValue).not.toBeNull();
    expect(contextValue!.values).toEqual({ field: 'value' });
    expect(contextValue!.isValid).toBe(true);
  });
});

// =====================================================================
// 3. Error Messages — all message types, locales, fallbacks
// =====================================================================

describe('Error Messages', () => {
  it('errorMessagesTr has all keys', () => {
    const keys: (keyof ErrorMessageMap)[] = ['required', 'minLength', 'maxLength', 'min', 'max', 'pattern', 'email', 'invalid'];
    for (const key of keys) {
      expect(typeof errorMessagesTr[key]).toBe('function');
    }
  });

  it('errorMessagesEn has all keys', () => {
    expect(errorMessagesEn.required('Name')).toBe('Name is required');
    expect(errorMessagesEn.minLength('Name', 3)).toContain('at least 3');
    expect(errorMessagesEn.maxLength('Name', 50)).toContain('at most 50');
    expect(errorMessagesEn.min('Age', 18)).toContain('at least 18');
    expect(errorMessagesEn.max('Age', 99)).toContain('at most 99');
    expect(errorMessagesEn.pattern('Email')).toContain('invalid');
    expect(errorMessagesEn.email('Email')).toContain('valid email');
    expect(errorMessagesEn.invalid('Field')).toContain('invalid');
  });

  it('errorMessagesTr produces Turkish messages', () => {
    expect(errorMessagesTr.required('Ad')).toContain('zorunlu');
    expect(errorMessagesTr.minLength('Ad', 2)).toContain('en az');
    expect(errorMessagesTr.maxLength('Ad', 100)).toContain('en fazla');
    expect(errorMessagesTr.min('Ya\u015f', 0)).toContain('en az');
    expect(errorMessagesTr.max('Ya\u015f', 150)).toContain('en fazla');
    expect(errorMessagesTr.pattern('E-posta')).toContain('ge\u00e7ersiz');
    expect(errorMessagesTr.email('E-posta')).toContain('e-posta');
    expect(errorMessagesTr.invalid('Alan')).toContain('ge\u00e7ersiz');
  });

  it('defaultErrorMessages is English', () => {
    expect(defaultErrorMessages).toBe(errorMessagesEn);
  });

  it('getErrorMessages returns English for "en"', () => {
    const msgs = getErrorMessages('en');
    expect(msgs.required('X')).toBe('X is required');
  });

  it('getErrorMessages returns Turkish for "tr"', () => {
    const msgs = getErrorMessages('tr');
    expect(msgs.required('X')).toContain('zorunlu');
  });

  it('getErrorMessages falls back to English for unknown locale', () => {
    const msgs = getErrorMessages('xx-unknown');
    expect(msgs.required('X')).toBe('X is required');
  });

  it('getErrorMessages returns a valid pack for "de"', () => {
    const msgs = getErrorMessages('de');
    expect(typeof msgs.required).toBe('function');
    const result = msgs.required('Name');
    expect(result.length).toBeGreaterThan(0);
  });

  it('getErrorMessages returns a valid pack for "fr"', () => {
    const msgs = getErrorMessages('fr');
    expect(typeof msgs.required).toBe('function');
  });

  it('getErrorMessages returns a valid pack for "ar"', () => {
    const msgs = getErrorMessages('ar');
    expect(typeof msgs.required).toBe('function');
  });

  it('getErrorMessages returns a valid pack for "ja"', () => {
    const msgs = getErrorMessages('ja');
    expect(typeof msgs.required).toBe('function');
  });
});

// =====================================================================
// 4. Locale Count
// =====================================================================

describe('getSupportedLocaleCount', () => {
  it('returns a number > 2 (at least tr + en + some extended)', () => {
    const count = getSupportedLocaleCount();
    expect(count).toBeGreaterThan(2);
  });

  it('count includes built-in tr and en', () => {
    // The function returns 2 + extended
    const count = getSupportedLocaleCount();
    expect(count).toBeGreaterThanOrEqual(4); // at least tr, en, de, fr
  });
});

// =====================================================================
// 5. useFormLocale — with and without overrides
// =====================================================================

describe('useFormLocale', () => {
  function Wrapper({ locale, children }: { locale: string; children: React.ReactNode }) {
    return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
  }

  it('returns English messages by default', () => {
    let msgs: ErrorMessageMap | undefined;
    function TestComp() {
      msgs = useFormLocale();
      return null;
    }
    render(
      <Wrapper locale="en">
        <TestComp />
      </Wrapper>,
    );
    expect(msgs!.required('X')).toBe('X is required');
  });

  it('returns Turkish messages for tr locale', () => {
    let msgs: ErrorMessageMap | undefined;
    function TestComp() {
      msgs = useFormLocale();
      return null;
    }
    render(
      <Wrapper locale="tr">
        <TestComp />
      </Wrapper>,
    );
    expect(msgs!.required('X')).toContain('zorunlu');
  });

  it('applies overrides', () => {
    let msgs: ErrorMessageMap | undefined;
    function TestComp() {
      msgs = useFormLocale({ required: (label) => `${label} cannot be empty` });
      return null;
    }
    render(
      <Wrapper locale="en">
        <TestComp />
      </Wrapper>,
    );
    expect(msgs!.required('Name')).toBe('Name cannot be empty');
    // Other messages should still be from English defaults
    expect(msgs!.email('Email')).toContain('valid email');
  });

  it('returns base messages when no overrides', () => {
    let msgs: ErrorMessageMap | undefined;
    function TestComp() {
      msgs = useFormLocale(undefined);
      return null;
    }
    render(
      <Wrapper locale="en">
        <TestComp />
      </Wrapper>,
    );
    expect(msgs!.required('X')).toBe('X is required');
  });
});

// =====================================================================
// 6. FormContext — useFormContext throws outside provider
// =====================================================================

describe('useFormContext', () => {
  it('throws when used outside FormProvider', () => {
    function TestComp() {
      useFormContext();
      return null;
    }

    expect(() => render(<TestComp />)).toThrow('useFormContext must be used within');
  });

  it('returns context value when inside provider', () => {
    let ctx: FormContextValue | null = null;
    function TestComp() {
      ctx = useFormContext();
      return null;
    }

    const mockContext: FormContextValue = {
      values: {},
      errors: {},
      touched: {},
      dirtyFields: {},
      access: 'full',
      mode: 'onBlur',
      setFieldValue: vi.fn(),
      setFieldTouched: vi.fn(),
      setFieldError: vi.fn(),
      clearFieldError: vi.fn(),
      validateField: vi.fn().mockReturnValue(null),
      validateForm: vi.fn().mockReturnValue({}),
      reset: vi.fn(),
      isValid: true,
      isDirty: false,
      isSubmitting: false,
      validator: null,
    };

    render(
      <FormContext.Provider value={mockContext}>
        <TestComp />
      </FormContext.Provider>,
    );

    expect(ctx).toBe(mockContext);
  });
});
