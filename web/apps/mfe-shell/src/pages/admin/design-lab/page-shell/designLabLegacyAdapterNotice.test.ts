import { describe, expect, it } from 'vitest';
import { resolveLegacyAdapterNoticeAction } from './designLabLegacyAdapterNotice';

describe('designLabLegacyAdapterNotice', () => {
  it('visualization aliasi icin component family CTA cozer', () => {
    expect(resolveLegacyAdapterNoticeAction('visualization')).toEqual({
      kind: 'component-family',
      targetId: 'data_display',
      translationKey: 'designlab.taxonomy.adapterNotice.cta.visualization',
      testId: 'design-lab-legacy-adapter-action-visualization',
    });
  });

  it('ai_ux aliasi icin recipe CTA cozer', () => {
    expect(resolveLegacyAdapterNoticeAction('ai_ux')).toEqual({
      kind: 'recipe',
      targetId: 'ai_guided_authoring',
      translationKey: 'designlab.taxonomy.adapterNotice.cta.ai_ux',
      testId: 'design-lab-legacy-adapter-action-ai-ux',
    });
  });

  it('canonical sectionlar icin CTA dondurmez', () => {
    expect(resolveLegacyAdapterNoticeAction('components')).toBeNull();
    expect(resolveLegacyAdapterNoticeAction('recipes')).toBeNull();
    expect(resolveLegacyAdapterNoticeAction(null)).toBeNull();
  });
});
