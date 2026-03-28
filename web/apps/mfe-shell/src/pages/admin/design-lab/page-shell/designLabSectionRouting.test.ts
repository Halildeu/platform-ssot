import { describe, expect, it } from 'vitest';
import {
  getLegacyAdapterSectionAliasesForCanonicalSection,
  isAdapterLegacyDesignLabSectionId,
  isLegacyDesignLabSectionId,
  isReplaceableLegacyDesignLabSectionId,
  normalizeDesignLabSectionId,
  resolveLegacySectionComponentFallbackGroupId,
  resolveLegacySectionPreferredComponentGroupId,
  resolveLegacySectionPreferredRecipeId,
  resolveLegacySectionRecipeFallbackId,
} from './designLabSectionRouting';

describe('designLabSectionRouting', () => {
  it('replaceable legacy sectionlari canonical katmana normalize eder', () => {
    expect(normalizeDesignLabSectionId('patterns')).toBe('recipes');
    expect(normalizeDesignLabSectionId('templates')).toBe('pages');
    expect(normalizeDesignLabSectionId('content_language')).toBe('foundations');
    expect(normalizeDesignLabSectionId('governance')).toBe('foundations');
  });

  it('adapter legacy sectionlari gecici canonical hedefe normalize eder', () => {
    expect(normalizeDesignLabSectionId('visualization')).toBe('components');
    expect(normalizeDesignLabSectionId('ai_ux')).toBe('recipes');
  });

  it('replaceable ve legacy ayirimini korur', () => {
    expect(isReplaceableLegacyDesignLabSectionId('patterns')).toBe(true);
    expect(isReplaceableLegacyDesignLabSectionId('content_language')).toBe(true);
    expect(isAdapterLegacyDesignLabSectionId('visualization')).toBe(true);
    expect(isAdapterLegacyDesignLabSectionId('ai_ux')).toBe(true);
    expect(isAdapterLegacyDesignLabSectionId('patterns')).toBe(false);
    expect(isReplaceableLegacyDesignLabSectionId('visualization')).toBe(false);
    expect(isLegacyDesignLabSectionId('visualization')).toBe(true);
    expect(isLegacyDesignLabSectionId('components')).toBe(false);
  });

  it('visualization aliasi icin semantik component group fallback cozer', () => {
    expect(resolveLegacySectionPreferredComponentGroupId('visualization')).toBe('data_display');
    expect(resolveLegacySectionPreferredComponentGroupId('ai_ux')).toBeNull();
    expect(resolveLegacySectionPreferredComponentGroupId('components')).toBeNull();
  });

  it('ai_ux aliasi icin semantik recipe fallback cozer', () => {
    expect(resolveLegacySectionPreferredRecipeId('ai_ux')).toBe('ai_guided_authoring');
    expect(resolveLegacySectionPreferredRecipeId('visualization')).toBeNull();
    expect(resolveLegacySectionPreferredRecipeId('recipes')).toBeNull();
  });

  it('canonical section icin adapter alias listesini cozer', () => {
    expect(getLegacyAdapterSectionAliasesForCanonicalSection('components')).toEqual(['visualization']);
    expect(getLegacyAdapterSectionAliasesForCanonicalSection('recipes')).toEqual(['ai_ux']);
    expect(getLegacyAdapterSectionAliasesForCanonicalSection('pages')).toEqual([]);
  });

  it('explicit component hedefi yoksa legacy fallback group karari verir', () => {
    expect(
      resolveLegacySectionComponentFallbackGroupId({
        sectionId: 'visualization',
        groupParam: null,
        subgroupParam: null,
        itemParam: null,
      }),
    ).toBe('data_display');

    expect(
      resolveLegacySectionComponentFallbackGroupId({
        sectionId: 'visualization',
        groupParam: 'data_display',
        subgroupParam: null,
        itemParam: null,
      }),
    ).toBeNull();

    expect(
      resolveLegacySectionComponentFallbackGroupId({
        sectionId: 'ai_ux',
        groupParam: null,
        subgroupParam: null,
        itemParam: null,
      }),
    ).toBeNull();
  });

  it('explicit recipe hedefi yoksa legacy fallback recipe karari verir', () => {
    expect(
      resolveLegacySectionRecipeFallbackId({
        sectionId: 'ai_ux',
        recipeParam: null,
      }),
    ).toBe('ai_guided_authoring');

    expect(
      resolveLegacySectionRecipeFallbackId({
        sectionId: 'ai_ux',
        recipeParam: 'approval_review',
      }),
    ).toBeNull();

    expect(
      resolveLegacySectionRecipeFallbackId({
        sectionId: 'visualization',
        recipeParam: null,
      }),
    ).toBeNull();
  });
});
