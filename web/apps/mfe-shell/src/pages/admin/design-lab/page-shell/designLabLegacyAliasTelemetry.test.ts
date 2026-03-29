// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const emitMock = vi.fn();

vi.mock('../../../../app/services/shell-services', () => ({
  getShellServices: () => ({
    telemetry: {
      emit: emitMock,
    },
  }),
}));

import {
  DESIGN_LAB_LEGACY_ALIAS_TELEMETRY_STORAGE_KEY,
  readDesignLabLegacyAliasTelemetrySnapshot,
  recordDesignLabLegacyAliasTelemetry,
} from './designLabLegacyAliasTelemetry';

describe('designLabLegacyAliasTelemetry', () => {
  beforeEach(() => {
    window.localStorage.clear();
    emitMock.mockReset();
  });

  it('bos storage durumunda default snapshot dondurur', () => {
    expect(readDesignLabLegacyAliasTelemetrySnapshot()).toEqual({
      totalEvents: 0,
      aliases: {},
    });
  });

  it('alias kullanimini localStorage ve telemetry emit hattina yazar', () => {
    const snapshot = recordDesignLabLegacyAliasTelemetry({
      aliasSectionId: 'visualization',
      canonicalSectionId: 'components',
      source: 'url_alias',
    });

    expect(snapshot.totalEvents).toBe(1);
    expect(snapshot.aliases.visualization).toMatchObject({
      count: 1,
      canonicalSectionId: 'components',
      lastSource: 'url_alias',
    });

    const persisted = JSON.parse(
      window.localStorage.getItem(DESIGN_LAB_LEGACY_ALIAS_TELEMETRY_STORAGE_KEY) ?? '{}',
    );
    expect(persisted.totalEvents).toBe(1);
    expect(persisted.aliases.visualization.count).toBe(1);

    expect(emitMock).toHaveBeenCalledWith({
      type: 'designlab_legacy_alias_usage',
      payload: {
        aliasSectionId: 'visualization',
        canonicalSectionId: 'components',
        source: 'url_alias',
        targetId: null,
      },
      meta: {
        area: 'design-lab',
        surface: 'legacy-alias-adapter',
      },
    });
  });

  it('tekrar eden alias olaylarini biriktirir ve son hedef bilgisini gunceller', () => {
    recordDesignLabLegacyAliasTelemetry({
      aliasSectionId: 'ai_ux',
      canonicalSectionId: 'recipes',
      source: 'url_alias',
    });

    const snapshot = recordDesignLabLegacyAliasTelemetry({
      aliasSectionId: 'ai_ux',
      canonicalSectionId: 'recipes',
      source: 'notice_cta',
      targetId: 'ai_guided_authoring',
    });

    expect(snapshot.totalEvents).toBe(2);
    expect(snapshot.aliases.ai_ux).toMatchObject({
      count: 2,
      canonicalSectionId: 'recipes',
      lastSource: 'notice_cta',
      lastTargetId: 'ai_guided_authoring',
    });
    expect(snapshot.aliases.ai_ux.lastSeenAt).toEqual(expect.any(String));

    expect(emitMock).toHaveBeenLastCalledWith({
      type: 'designlab_legacy_alias_usage',
      payload: {
        aliasSectionId: 'ai_ux',
        canonicalSectionId: 'recipes',
        source: 'notice_cta',
        targetId: 'ai_guided_authoring',
      },
      meta: {
        area: 'design-lab',
        surface: 'legacy-alias-adapter',
      },
    });
  });
});
