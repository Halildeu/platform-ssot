// @vitest-environment jsdom
import { test, expect, vi } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';

import {
  I18nManager,
  I18nProvider,
  type LoadDictionaryResult,
} from '../../../../mfe-shell/src/app/i18n/index.ts';
import { getDictionary } from '@mfe/i18n-dicts';
import { useAccessI18n, type AccessI18n } from '../useAccessI18n';
import { act } from 'react';

const flushMicrotasks = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

const loadDictionary = async (locale: string, namespace: string): Promise<LoadDictionaryResult> => {
  const entry = getDictionary(locale, namespace);
  if (!entry) {
    return { dictionary: {} };
  }
  return { dictionary: entry.dictionary };
};

class TrackingI18nManager extends I18nManager {
  public readonly preloadCalls: Array<{ locale: string; namespace: string }> = [];
  public readonly formatNumberCalls: Array<{ locale: string }> = [];
  public readonly formatDateCalls: Array<{ locale: string }> = [];

  override async preloadNamespace(namespace: string, locale: string = this.getLocale()): Promise<void> {
    this.preloadCalls.push({ locale, namespace });
    await super.preloadNamespace(namespace, locale);
  }

  override formatNumber(
    value: number,
    options?: Intl.NumberFormatOptions,
    locale?: string,
  ): string {
    const resolvedLocale = locale ?? this.getLocale();
    this.formatNumberCalls.push({ locale: resolvedLocale });
    return super.formatNumber(value, options, locale);
  }

  override formatDate(
    value: Date | number,
    options?: Intl.DateTimeFormatOptions,
    locale?: string,
  ): string {
    const resolvedLocale = locale ?? this.getLocale();
    this.formatDateCalls.push({ locale: resolvedLocale });
    return super.formatDate(value, options, locale);
  }
}

test('useAccessI18n sözlükleri yükler ve locale değişimini takip eder', async () => {
  const manager = new TrackingI18nManager({
    initialLocale: 'tr',
    fallbackLocale: 'en',
    loadDictionary,
  });

  let latest: AccessI18n | undefined;

  const TestComponent: React.FC = () => {
    latest = useAccessI18n();
    return null;
  };

  await act(async () => {
    render(
      <I18nProvider manager={manager}>
        <TestComponent />
      </I18nProvider>,
    );
    await flushMicrotasks();
  });

  expect(latest?.ready).toBeTruthy();
  expect(latest?.t('access.actions.clone')).toBe('Rolü Klonla');

  latest?.formatNumber(42);
  latest?.formatDate(new Date('2025-01-02T03:00:00Z'), { timeZone: 'UTC' });

  expect(manager.preloadCalls[0]).toEqual({ locale: 'tr', namespace: 'access' });
  expect(manager.formatNumberCalls.map((entry) => entry.locale)).toEqual(['tr']);
  expect(manager.formatDateCalls.map((entry) => entry.locale)).toEqual(['tr']);

  await act(async () => {
    manager.setLocale('en');
    await flushMicrotasks();
  });

  expect(latest?.t('access.actions.clone')).toBe('Clone Role');

  latest?.formatNumber(24);
  latest?.formatDate(new Date('2025-01-02T03:00:00Z'), { timeZone: 'UTC' });

  const lastPreloadCall = manager.preloadCalls[manager.preloadCalls.length - 1];
  expect(lastPreloadCall.locale).toBe('en');
  expect(manager.formatNumberCalls.map((entry) => entry.locale)).toEqual(['tr', 'en']);
  expect(manager.formatDateCalls.map((entry) => entry.locale)).toEqual(['tr', 'en']);

  cleanup();
});

test('useAccessI18n provider olmadığında fallback manager ile çalışır', async () => {
  let latest: AccessI18n | undefined;

  const TestComponent: React.FC = () => {
    latest = useAccessI18n();
    return null;
  };

  await act(async () => {
    render(<TestComponent />);
    await flushMicrotasks();
  });

  expect(latest?.ready).toBeTruthy();
  expect(latest?.t('access.actions.clone')).toBe('Rolü Klonla');
  expect(latest?.formatNumber(5)).toBe(new Intl.NumberFormat('tr').format(5));

  cleanup();
});
