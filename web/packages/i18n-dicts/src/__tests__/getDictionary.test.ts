import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getDictionary,
  getAvailableLocales,
  getAvailableNamespaces,
  dictionaryVersion,
} from '../index';

test('getDictionary normalises locale and returns matching dictionary', () => {
  const result = getDictionary('tr-TR', 'access');
  assert.ok(result, 'dictionary bulunamadı');
  assert.equal(result?.locale, 'tr');
  assert.equal(result?.namespace, 'access');
  assert.ok(result?.version.endsWith('-access'));
  assert.equal(result?.dictionary['access.actions.clone'], 'Rolü Klonla');
});

test('getDictionary de locale sözlüğünü döner', () => {
  const result = getDictionary('de-DE', 'access');
  assert.ok(result, 'dictionary bulunamadı');
  assert.equal(result?.locale, 'de');
  assert.equal(result?.dictionary['access.actions.clone'], 'Clone Role');
});

test('getDictionary returns null for bilinmeyen namespace', () => {
  const result = getDictionary('tr', 'unknown');
  assert.equal(result, null);
});

test('available locale ve namespace listeleri beklenen değerleri döner', () => {
  const locales = getAvailableLocales();
  assert.deepEqual(locales.sort(), ['de', 'en', 'es', 'pseudo', 'tr']);

  const namespaces = getAvailableNamespaces();
  assert.deepEqual(namespaces.sort(), ['access', 'audit', 'common', 'reports']);

  assert.match(dictionaryVersion, /^\d+\.\d+\.\d+$/);
});

test('reports namespace sözlükleri döner', () => {
  const resultTr = getDictionary('tr', 'reports');
  assert.ok(resultTr);
  assert.equal(resultTr?.dictionary['reports.nav.users'], 'Kullanıcılar');

  const resultEn = getDictionary('en', 'reports');
  assert.ok(resultEn);
  assert.equal(resultEn?.dictionary['reports.toolbar.refresh'], 'Refresh data');
});

test('pseudo locale istemi pseudolokalize metin döner', () => {
  const result = getDictionary('pseudo', 'access');
  assert.ok(result, 'pseudo dictionary bulunamadı');
  assert.equal(result?.locale, 'pseudo');
  assert.equal(result?.dictionary['access.actions.clone'], 'Çlóñé Rólé');
});
