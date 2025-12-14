import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import type { ReactTestRenderer } from 'react-test-renderer';
import {
  I18nManager,
  I18nProvider,
  type LoadDictionaryResult,
} from 'mfe_shell/i18n';
import { getDictionary } from '@mfe/i18n-dicts';
import { useAccessI18n, type AccessI18n } from '../useAccessI18n';

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
  let renderer: ReactTestRenderer;

  const TestComponent: React.FC = () => {
    latest = useAccessI18n();
    return null;
  };

  await act(async () => {
    renderer = TestRenderer.create(
      <I18nProvider manager={manager}>
        <TestComponent />
      </I18nProvider>,
    );
    await flushMicrotasks();
  });

  assert.ok(latest?.ready);
  assert.equal(latest?.t('access.actions.clone'), 'Rolü Klonla');

  // formatNumber/formatDate gerçek değer döner; sadece locale izlerini doğruluyoruz.
  latest?.formatNumber(42);
  latest?.formatDate(new Date('2025-01-02T03:00:00Z'), { timeZone: 'UTC' });

  assert.deepEqual(manager.preloadCalls[0], { locale: 'tr', namespace: 'access' });
  assert.deepEqual(
    manager.formatNumberCalls.map((entry) => entry.locale),
    ['tr'],
  );
  assert.deepEqual(
    manager.formatDateCalls.map((entry) => entry.locale),
    ['tr'],
  );

  await act(async () => {
    manager.setLocale('en');
    await flushMicrotasks();
  });

  assert.equal(latest?.t('access.actions.clone'), 'Clone Role');

  latest?.formatNumber(24);
  latest?.formatDate(new Date('2025-01-02T03:00:00Z'), { timeZone: 'UTC' });

  const lastPreloadCall = manager.preloadCalls[manager.preloadCalls.length - 1];
  assert.equal(lastPreloadCall.locale, 'en');
  assert.deepEqual(
    manager.formatNumberCalls.map((entry) => entry.locale),
    ['tr', 'en'],
  );
  assert.deepEqual(
    manager.formatDateCalls.map((entry) => entry.locale),
    ['tr', 'en'],
  );

  await act(async () => {
    renderer.unmount();
  });
});

test('useAccessI18n provider olmadığında fallback manager ile çalışır', async () => {
  let latest: AccessI18n | undefined;
  let renderer: ReactTestRenderer;

  const TestComponent: React.FC = () => {
    latest = useAccessI18n();
    return null;
  };

  await act(async () => {
    renderer = TestRenderer.create(<TestComponent />);
    await flushMicrotasks();
  });

  assert.ok(latest?.ready);
  assert.equal(latest?.t('access.actions.clone'), 'Rolü Klonla');
  assert.equal(latest?.formatNumber(5), new Intl.NumberFormat('tr').format(5));

  await act(async () => {
    renderer.unmount();
  });
});
