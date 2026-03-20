import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getDictionary } from '../index';

const locales = ['en', 'tr', 'de', 'es', 'pseudo'] as const;

const requiredDesignLabKeys = [
  'designlab.taxonomy.sections.foundations.title',
  'designlab.taxonomy.sections.foundations.description',
  'designlab.taxonomy.sections.components.title',
  'designlab.taxonomy.sections.components.description',
  'designlab.taxonomy.sections.recipes.title',
  'designlab.taxonomy.sections.recipes.description',
  'designlab.taxonomy.sections.pages.title',
  'designlab.taxonomy.sections.pages.description',
  'designlab.taxonomy.badges.adapter',
  'designlab.taxonomy.adapterNotice.title',
  'designlab.taxonomy.adapterNotice.description',
  'designlab.taxonomy.adapterNotice.cta.visualization',
  'designlab.taxonomy.adapterNotice.cta.ai_ux',
  'designlab.sidebar.title.foundations',
  'designlab.sidebar.title.components',
  'designlab.sidebar.title.recipes',
  'designlab.sidebar.title.pages',
  'designlab.sidebar.help.foundations',
  'designlab.sidebar.help.components',
  'designlab.sidebar.help.recipes',
  'designlab.sidebar.help.pages',
  'designlab.sidebar.search.foundations.placeholder',
  'designlab.sidebar.search.components.placeholder',
  'designlab.sidebar.search.recipes.placeholder',
  'designlab.sidebar.search.pages.placeholder',
  'designlab.sidebar.foundationTree.title',
  'designlab.sidebar.pageList.title',
  'designlab.sidebar.page.count',
  'designlab.sidebar.page.empty.search',
  'designlab.sidebar.page.empty.default',
  'designlab.sidebar.page.empty.hint',
  'designlab.workspace.catalog.foundations',
  'designlab.workspace.catalog.components',
  'designlab.workspace.catalog.recipes',
  'designlab.workspace.catalog.pages',
  'designlab.hero.placeholder.foundations',
  'designlab.hero.placeholder.description.foundations',
  'designlab.hero.placeholder.page',
  'designlab.hero.placeholder.description.page',
  'designlab.lens.foundations.badge',
  'designlab.lens.foundations.title',
  'designlab.lens.foundations.note',
  'designlab.lens.foundations.useWhen',
  'designlab.lens.components.badge',
  'designlab.lens.components.title',
  'designlab.lens.components.note',
  'designlab.lens.components.useWhen',
  'designlab.lens.recipes.badge',
  'designlab.lens.recipes.title',
  'designlab.lens.recipes.note',
  'designlab.lens.recipes.useWhen',
  'designlab.lens.pages.badge',
  'designlab.lens.pages.title',
  'designlab.lens.pages.note',
  'designlab.lens.pages.useWhen',
  'designlab.tabs.general.description.foundations',
  'designlab.tabs.general.description.components',
  'designlab.tabs.general.description.recipes',
  'designlab.tabs.general.description.pages',
  'designlab.tabs.demo.description.foundations',
  'designlab.tabs.demo.description.components',
  'designlab.tabs.demo.description.recipes',
  'designlab.tabs.demo.description.pages',
  'designlab.tabs.overview.description.foundations',
  'designlab.tabs.overview.description.components',
  'designlab.tabs.overview.description.recipes',
  'designlab.tabs.overview.description.pages',
  'designlab.tabs.api.description.foundations',
  'designlab.tabs.api.description.components',
  'designlab.tabs.api.description.recipes',
  'designlab.tabs.api.description.pages',
  'designlab.tabs.ux.description.foundations',
  'designlab.tabs.ux.description.components',
  'designlab.tabs.ux.description.recipes',
  'designlab.tabs.ux.description.pages',
  'designlab.tabs.quality.description.foundations',
  'designlab.tabs.quality.description.components',
  'designlab.tabs.quality.description.recipes',
  'designlab.tabs.quality.description.pages',
] as const;

test('designlab canonical key seti tum locale sozluklerinde vardir', () => {
  for (const locale of locales) {
    const dictionaryResult = getDictionary(locale, 'designlab');
    assert.ok(dictionaryResult, `${locale} icin designlab sozlugu bulunamadi`);

    for (const key of requiredDesignLabKeys) {
      const value = dictionaryResult.dictionary[key];
      assert.equal(
        typeof value,
        'string',
        `${locale} locale icin eksik key: ${key}`,
      );
      assert.notEqual(
        value.trim(),
        '',
        `${locale} locale icin bos ceviri: ${key}`,
      );
      assert.notEqual(
        value,
        key,
        `${locale} locale icin ham key fallback render riski: ${key}`,
      );
    }
  }
});
