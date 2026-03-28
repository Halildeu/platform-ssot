import { getShellServices } from '../../../../app/services/shell-services';

export const DESIGN_LAB_LEGACY_ALIAS_TELEMETRY_STORAGE_KEY = 'designlab.legacy-alias-telemetry.v1';

export type DesignLabLegacyAliasTelemetrySource = 'url_alias' | 'notice_cta';

export type DesignLabLegacyAliasTelemetryEntry = {
  count: number;
  canonicalSectionId: string;
  lastSeenAt: string;
  lastSource: DesignLabLegacyAliasTelemetrySource;
  lastTargetId?: string;
};

export type DesignLabLegacyAliasTelemetrySnapshot = {
  totalEvents: number;
  aliases: Record<string, DesignLabLegacyAliasTelemetryEntry>;
};

const DEFAULT_SNAPSHOT: DesignLabLegacyAliasTelemetrySnapshot = {
  totalEvents: 0,
  aliases: {},
};

const hasBrowserStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const readDesignLabLegacyAliasTelemetrySnapshot = (): DesignLabLegacyAliasTelemetrySnapshot => {
  if (!hasBrowserStorage()) {
    return DEFAULT_SNAPSHOT;
  }

  try {
    const raw = window.localStorage.getItem(DESIGN_LAB_LEGACY_ALIAS_TELEMETRY_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SNAPSHOT;
    }

    const parsed = JSON.parse(raw) as Partial<DesignLabLegacyAliasTelemetrySnapshot>;
    return {
      totalEvents:
        typeof parsed.totalEvents === 'number' && Number.isFinite(parsed.totalEvents)
          ? parsed.totalEvents
          : 0,
      aliases:
        parsed.aliases && typeof parsed.aliases === 'object'
          ? parsed.aliases as Record<string, DesignLabLegacyAliasTelemetryEntry>
          : {},
    };
  } catch {
    return DEFAULT_SNAPSHOT;
  }
};

export const recordDesignLabLegacyAliasTelemetry = ({
  aliasSectionId,
  canonicalSectionId,
  source,
  targetId,
}: {
  aliasSectionId: string;
  canonicalSectionId: string;
  source: DesignLabLegacyAliasTelemetrySource;
  targetId?: string;
}): DesignLabLegacyAliasTelemetrySnapshot => {
  const current = readDesignLabLegacyAliasTelemetrySnapshot();
  const currentEntry = current.aliases[aliasSectionId];
  const nextEntry: DesignLabLegacyAliasTelemetryEntry = {
    count: (currentEntry?.count ?? 0) + 1,
    canonicalSectionId,
    lastSeenAt: new Date().toISOString(),
    lastSource: source,
    ...(targetId ? { lastTargetId: targetId } : {}),
  };

  const nextSnapshot: DesignLabLegacyAliasTelemetrySnapshot = {
    totalEvents: current.totalEvents + 1,
    aliases: {
      ...current.aliases,
      [aliasSectionId]: nextEntry,
    },
  };

  if (hasBrowserStorage()) {
    try {
      window.localStorage.setItem(
        DESIGN_LAB_LEGACY_ALIAS_TELEMETRY_STORAGE_KEY,
        JSON.stringify(nextSnapshot),
      );
    } catch {
      // localStorage dolu veya erişilemezse UI akışı bloklanmaz
    }
  }

  try {
    getShellServices().telemetry.emit({
      type: 'designlab_legacy_alias_usage',
      payload: {
        aliasSectionId,
        canonicalSectionId,
        source,
        targetId: targetId ?? null,
      },
      meta: {
        area: 'design-lab',
        surface: 'legacy-alias-adapter',
      },
    });
  } catch {
    // shell telemetry hazır değilse UI akışı bloklanmaz
  }

  return nextSnapshot;
};
