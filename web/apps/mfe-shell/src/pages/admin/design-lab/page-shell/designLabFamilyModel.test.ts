import { describe, expect, it } from 'vitest';
import { toDesignLabFamilyIdentity } from './designLabFamilyModel';

describe('designLabFamilyModel', () => {
  it('recipeId alanini presenter katmani icin familyId aliasina cevirir', () => {
    const family = toDesignLabFamilyIdentity({
      recipeId: 'recipe-navigation',
      title: 'Navigation family',
    });

    expect(family.familyId).toBe('recipe-navigation');
    expect(family.recipeId).toBe('recipe-navigation');
    expect(family.title).toBe('Navigation family');
  });
});
