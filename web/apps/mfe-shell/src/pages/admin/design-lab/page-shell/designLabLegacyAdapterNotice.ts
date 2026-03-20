import {
  resolveLegacySectionPreferredComponentGroupId,
  resolveLegacySectionPreferredRecipeId,
} from './designLabSectionRouting';

export type DesignLabLegacyAdapterNoticeAction =
  | {
      kind: 'component-family';
      targetId: string;
      translationKey: 'designlab.taxonomy.adapterNotice.cta.visualization';
      testId: 'design-lab-legacy-adapter-action-visualization';
    }
  | {
      kind: 'recipe';
      targetId: string;
      translationKey: 'designlab.taxonomy.adapterNotice.cta.ai_ux';
      testId: 'design-lab-legacy-adapter-action-ai-ux';
    };

export const resolveLegacyAdapterNoticeAction = (
  sectionId: string | null | undefined,
): DesignLabLegacyAdapterNoticeAction | null => {
  switch (sectionId) {
    case 'visualization': {
      const targetId = resolveLegacySectionPreferredComponentGroupId(sectionId);
      return targetId
        ? {
            kind: 'component-family',
            targetId,
            translationKey: 'designlab.taxonomy.adapterNotice.cta.visualization',
            testId: 'design-lab-legacy-adapter-action-visualization',
          }
        : null;
    }
    case 'ai_ux': {
      const targetId = resolveLegacySectionPreferredRecipeId(sectionId);
      return targetId
        ? {
            kind: 'recipe',
            targetId,
            translationKey: 'designlab.taxonomy.adapterNotice.cta.ai_ux',
            testId: 'design-lab-legacy-adapter-action-ai-ux',
          }
        : null;
    }
    default:
      return null;
  }
};
