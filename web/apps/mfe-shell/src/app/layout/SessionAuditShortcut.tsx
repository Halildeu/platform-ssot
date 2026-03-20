import {
  getAuditFeedCapability,
  type AuditFeedCapabilityId,
} from '@platform/capabilities';
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  buildAuthSessionAuditSearch,
  buildUserLocaleReplayAuditSearch,
  buildUserLocaleReplayConflictAuditSearch,
  buildUserNotificationReplayAuditSearch,
  buildUserNotificationReplayConflictAuditSearch,
  buildUserDateFormatReplayAuditSearch,
  buildUserDateFormatReplayConflictAuditSearch,
  buildUserReplayAuditSearch,
  buildUserReplayConflictAuditSearch,
  buildUserTimeFormatReplayAuditSearch,
  buildUserTimeFormatReplayConflictAuditSearch,
  buildUserTimezoneReplayAuditSearch,
  buildUserTimezoneReplayConflictAuditSearch,
} from '../../features/auth/lib/session-audit-deeplink';

type SessionAuditShortcutProps = {
  email?: string | null;
  variant?: SessionAuditShortcutVariant;
};

export type SessionAuditShortcutVariant =
  | 'session'
  | 'replay'
  | 'replay-conflict'
  | 'notification-replay'
  | 'notification-replay-conflict'
  | 'locale-replay'
  | 'locale-replay-conflict'
  | 'timezone-replay'
  | 'timezone-replay-conflict'
  | 'date-format-replay'
  | 'date-format-replay-conflict'
  | 'time-format-replay'
  | 'time-format-replay-conflict';

const variantConfig = {
  session: {
    ariaLabel: 'Session audit kisayolu',
    searchBuilder: buildAuthSessionAuditSearch,
    testId: 'session-audit-shortcut',
    capabilityId: 'auth.session.created',
  },
  replay: {
    ariaLabel: 'Replay audit kisayolu',
    searchBuilder: buildUserReplayAuditSearch,
    testId: 'replay-audit-shortcut',
    capabilityId: 'user.session-timeout.synced',
  },
  'replay-conflict': {
    ariaLabel: 'Replay conflict audit kisayolu',
    searchBuilder: buildUserReplayConflictAuditSearch,
    testId: 'replay-conflict-audit-shortcut',
    capabilityId: 'user.session-timeout.conflict',
  },
  'notification-replay': {
    ariaLabel: 'Notification replay audit kisayolu',
    searchBuilder: buildUserNotificationReplayAuditSearch,
    testId: 'notification-replay-audit-shortcut',
    capabilityId: 'user.notification-preference.synced',
  },
  'notification-replay-conflict': {
    ariaLabel: 'Notification replay conflict audit kisayolu',
    searchBuilder: buildUserNotificationReplayConflictAuditSearch,
    testId: 'notification-replay-conflict-audit-shortcut',
    capabilityId: 'user.notification-preference.conflict',
  },
  'locale-replay': {
    ariaLabel: 'Locale replay audit kisayolu',
    searchBuilder: buildUserLocaleReplayAuditSearch,
    testId: 'locale-replay-audit-shortcut',
    capabilityId: 'user.locale.synced',
  },
  'locale-replay-conflict': {
    ariaLabel: 'Locale replay conflict audit kisayolu',
    searchBuilder: buildUserLocaleReplayConflictAuditSearch,
    testId: 'locale-replay-conflict-audit-shortcut',
    capabilityId: 'user.locale.conflict',
  },
  'timezone-replay': {
    ariaLabel: 'Timezone replay audit kisayolu',
    searchBuilder: buildUserTimezoneReplayAuditSearch,
    testId: 'timezone-replay-audit-shortcut',
    capabilityId: 'user.timezone.synced',
  },
  'timezone-replay-conflict': {
    ariaLabel: 'Timezone replay conflict audit kisayolu',
    searchBuilder: buildUserTimezoneReplayConflictAuditSearch,
    testId: 'timezone-replay-conflict-audit-shortcut',
    capabilityId: 'user.timezone.conflict',
  },
  'date-format-replay': {
    ariaLabel: 'Date format replay audit kisayolu',
    searchBuilder: buildUserDateFormatReplayAuditSearch,
    testId: 'date-format-replay-audit-shortcut',
    capabilityId: 'user.date-format.synced',
  },
  'date-format-replay-conflict': {
    ariaLabel: 'Date format replay conflict audit kisayolu',
    searchBuilder: buildUserDateFormatReplayConflictAuditSearch,
    testId: 'date-format-replay-conflict-audit-shortcut',
    capabilityId: 'user.date-format.conflict',
  },
  'time-format-replay': {
    ariaLabel: 'Time format replay audit kisayolu',
    searchBuilder: buildUserTimeFormatReplayAuditSearch,
    testId: 'time-format-replay-audit-shortcut',
    capabilityId: 'user.time-format.synced',
  },
  'time-format-replay-conflict': {
    ariaLabel: 'Time format replay conflict audit kisayolu',
    searchBuilder: buildUserTimeFormatReplayConflictAuditSearch,
    testId: 'time-format-replay-conflict-audit-shortcut',
    capabilityId: 'user.time-format.conflict',
  },
} as const satisfies Record<string, {
  ariaLabel: string;
  searchBuilder: (email: string) => string;
  testId: string;
  capabilityId: AuditFeedCapabilityId;
}>;

export const sessionAuditShortcutVariants = Object.keys(variantConfig) as SessionAuditShortcutVariant[];

export const getSessionAuditShortcutMeta = (variant: SessionAuditShortcutVariant = 'session') => {
  const config = variantConfig[variant];
  return {
    ...config,
    capability: getAuditFeedCapability(config.capabilityId),
  };
};

export const buildSessionAuditShortcutTarget = (
  email: string,
  variant: SessionAuditShortcutVariant = 'session',
) => {
  const normalizedEmail = email.trim();
  if (!normalizedEmail) {
    return null;
  }

  const config = variantConfig[variant];
  return {
    pathname: '/audit/events',
    search: config.searchBuilder(normalizedEmail),
  };
};

export const SessionAuditShortcut: React.FC<SessionAuditShortcutProps> = ({ email, variant = 'session' }) => {
  const navigate = useNavigate();
  const normalizedEmail = typeof email === 'string' ? email.trim() : '';
  const { capability, testId, ariaLabel } = getSessionAuditShortcutMeta(variant);
  const target = normalizedEmail ? buildSessionAuditShortcutTarget(normalizedEmail, variant) : null;

  if (!normalizedEmail || !target) {
    return null;
  }

  return (
    <button
      type="button"
      data-testid={testId}
      className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-panel px-3 py-1.5 text-xs font-semibold text-text-primary shadow-sm transition hover:bg-surface-muted"
      onClick={() => {
        navigate(target);
      }}
      title={capability.shortcutTitle}
      aria-label={ariaLabel}
    >
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
      <span className="hidden lg:inline">{capability.shortcutLabel}</span>
    </button>
  );
};

export default SessionAuditShortcut;
