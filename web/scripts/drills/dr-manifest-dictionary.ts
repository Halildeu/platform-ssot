#!/usr/bin/env tsx
/**
 * Manifest & sözlük fallback drill’i.
 * CDN veya TMS erişimi olmadığında Access manifesti ve i18n sözlüğü
 * paket içi kopyalardan okunabiliyor mu diye doğrular.
 */
import { performance } from 'node:perf_hooks';
import accessRolesPageManifest from '../../apps/mfe-access/src/manifest/access/roles-page.manifest';
import { getDictionary, dictionaryVersion } from '@mfe/i18n-dicts';

const log = (message: string, meta: Record<string, unknown> = {}) => {
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), message, ...meta }));
};

const assert = (condition: unknown, errorMessage: string): void => {
  if (!condition) {
    throw new Error(errorMessage);
  }
};

const drill = () => {
  const startDict = performance.now();
  const trDictionary = getDictionary('tr', 'access');
  const dictDuration = Math.round(performance.now() - startDict);
  assert(trDictionary, 'TR access sözlüğü okunamadı');

  const startFallback = performance.now();
  const fallbackDictionary = getDictionary('fr', 'access');
  const fallbackDuration = Math.round(performance.now() - startFallback);
  assert(fallbackDictionary, 'Fallback sözlüğü okunamadı');

  log('i18n dictionary fallback hazır', {
    primaryLocale: trDictionary?.locale,
    fallbackLocale: fallbackDictionary?.locale,
    namespace: trDictionary?.namespace,
    version: dictionaryVersion,
    primaryLoadMs: dictDuration,
    fallbackLoadMs: fallbackDuration,
  });

  const manifestStart = performance.now();
  assert(accessRolesPageManifest.pageId === 'access.roles', 'Manifest pageId beklenenden farklı');
  const columnCount = accessRolesPageManifest.grid.columns.length;
  const manifestDuration = Math.round(performance.now() - manifestStart);

  log('Access manifest fallback hazır', {
    pageId: accessRolesPageManifest.pageId,
    columnCount,
    firstColumn: accessRolesPageManifest.grid.columns[0]?.key,
    manifestLoadMs: manifestDuration,
  });
};

drill();
