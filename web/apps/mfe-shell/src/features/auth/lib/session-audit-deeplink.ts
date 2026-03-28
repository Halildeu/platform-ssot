import {
  buildAuditFeedSearch,
  getAuditFeedCapability,
} from '@platform/capabilities';
import type { ShellNotificationEntry } from '../../../app/services/shell-services';

type AuthSessionAuditNotificationOptions = {
  email?: string | null;
  permissions?: readonly string[] | null;
  role?: string | null;
};

const AUDIT_PERMISSION_ALIASES = new Set(['AUDIT-READ', 'VIEW-AUDIT']);

const normalizePermission = (permission: string): string => (
  permission.trim().toUpperCase().replace(/_/g, '-')
);

export const canOpenAuthSessionAudit = ({
  permissions,
  role,
}: AuthSessionAuditNotificationOptions): boolean => {
  if (typeof role === 'string' && role.trim().toUpperCase() === 'ADMIN') {
    return true;
  }
  return (permissions ?? []).some((permission) => AUDIT_PERMISSION_ALIASES.has(normalizePermission(permission)));
};

export const buildAuthSessionAuditSearch = (email: string): string => (
  buildAuditFeedSearch('auth.session.created', email)
);

export const buildUserReplayAuditSearch = (email: string): string => (
  buildAuditFeedSearch('user.session-timeout.synced', email)
);

export const buildUserReplayConflictAuditSearch = (email: string): string => (
  buildAuditFeedSearch('user.session-timeout.conflict', email)
);

export const buildUserNotificationReplayAuditSearch = (email: string): string => (
  buildAuditFeedSearch('user.notification-preference.synced', email)
);

export const buildUserNotificationReplayConflictAuditSearch = (email: string): string => (
  buildAuditFeedSearch('user.notification-preference.conflict', email)
);

export const buildUserLocaleReplayAuditSearch = (email: string): string => (
  buildAuditFeedSearch('user.locale.synced', email)
);

export const buildUserLocaleReplayConflictAuditSearch = (email: string): string => (
  buildAuditFeedSearch('user.locale.conflict', email)
);

export const buildUserTimezoneReplayAuditSearch = (email: string): string => (
  buildAuditFeedSearch('user.timezone.synced', email)
);

export const buildUserTimezoneReplayConflictAuditSearch = (email: string): string => (
  buildAuditFeedSearch('user.timezone.conflict', email)
);

export const buildUserDateFormatReplayAuditSearch = (email: string): string => (
  buildAuditFeedSearch('user.date-format.synced', email)
);

export const buildUserDateFormatReplayConflictAuditSearch = (email: string): string => (
  buildAuditFeedSearch('user.date-format.conflict', email)
);

export const buildUserTimeFormatReplayAuditSearch = (email: string): string => (
  buildAuditFeedSearch('user.time-format.synced', email)
);

export const buildUserTimeFormatReplayConflictAuditSearch = (email: string): string => (
  buildAuditFeedSearch('user.time-format.conflict', email)
);

export const createAuthSessionAuditNotification = ({
  email,
  permissions,
  role,
}: AuthSessionAuditNotificationOptions): ShellNotificationEntry | null => {
  const normalizedEmail = typeof email === 'string' ? email.trim() : '';
  if (!normalizedEmail || !canOpenAuthSessionAudit({ permissions, role })) {
    return null;
  }
  return {
    id: `auth-session-audit-${normalizedEmail.toLowerCase()}`,
    message: 'Oturum acildi',
    description: getAuditFeedCapability('auth.session.created').description,
    type: 'success',
    priority: 'high',
    meta: {
      source: 'auth.login',
      open: true,
      pathname: '/audit/events',
      search: buildAuthSessionAuditSearch(normalizedEmail),
      actionLabel: 'Oturum audit kaydini ac',
    },
  };
};
