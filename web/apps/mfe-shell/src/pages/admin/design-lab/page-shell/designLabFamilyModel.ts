export type DesignLabFamilyIdentity = {
  familyId: string;
  recipeId: string;
};

export const toDesignLabFamilyIdentity = <T extends { recipeId: string }>(
  family: T,
): T & DesignLabFamilyIdentity => ({
  ...family,
  familyId: family.recipeId,
});
