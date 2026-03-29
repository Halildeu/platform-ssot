// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
  buildAuthSessionAuditSearch,
  buildUserDateFormatReplayAuditSearch,
  buildUserDateFormatReplayConflictAuditSearch,
  buildUserLocaleReplayAuditSearch,
  buildUserLocaleReplayConflictAuditSearch,
  buildUserNotificationReplayAuditSearch,
  buildUserNotificationReplayConflictAuditSearch,
  buildUserReplayAuditSearch,
  buildUserReplayConflictAuditSearch,
  buildUserTimeFormatReplayAuditSearch,
  buildUserTimeFormatReplayConflictAuditSearch,
  buildUserTimezoneReplayAuditSearch,
  buildUserTimezoneReplayConflictAuditSearch,
  canOpenAuthSessionAudit,
  createAuthSessionAuditNotification,
} from './session-audit-deeplink';

describe('session-audit-deeplink', () => {
  it('audit-read ile auth session audit bildirimi uretir', () => {
    const notification = createAuthSessionAuditNotification({
      email: 'admin@example.com',
      permissions: ['audit-read'],
      role: 'USER',
    });

    expect(notification).not.toBeNull();
    expect(notification?.meta).toMatchObject({
      pathname: '/audit/events',
      search: 'service=auth-service&action=SESSION_CREATED',
      actionLabel: 'Oturum audit kaydini ac',
    });
  });

  it('legacy VIEW_AUDIT iznini audit access olarak kabul eder', () => {
    expect(
      canOpenAuthSessionAudit({
        email: 'legacy@example.com',
        permissions: ['VIEW_AUDIT'],
        role: 'USER',
      }),
    ).toBe(true);
  });

  it('audit izni yoksa bildirim uretmez', () => {
    expect(
      createAuthSessionAuditNotification({
        email: 'viewer@example.com',
        permissions: ['user-read'],
        role: 'USER',
      }),
    ).toBeNull();
  });

  it('search query tutarli sekilde kurulur', () => {
    expect(buildAuthSessionAuditSearch('admin@example.com')).toBe(
      'service=auth-service&action=SESSION_CREATED',
    );
  });

  it('replay success query tutarli sekilde kurulur', () => {
    expect(buildUserReplayAuditSearch('admin@example.com')).toBe(
      'service=user-service&action=USER_SESSION_TIMEOUT_SYNCED',
    );
  });

  it('replay conflict query tutarli sekilde kurulur', () => {
    expect(buildUserReplayConflictAuditSearch('admin@example.com')).toBe(
      'service=user-service&action=USER_SESSION_TIMEOUT_SYNC_CONFLICT',
    );
  });

  it('notification replay success query tutarli sekilde kurulur', () => {
    expect(buildUserNotificationReplayAuditSearch('admin@example.com')).toBe(
      'service=user-service&action=USER_NOTIFICATION_PREFERENCE_SYNCED',
    );
  });

  it('notification replay conflict query tutarli sekilde kurulur', () => {
    expect(buildUserNotificationReplayConflictAuditSearch('admin@example.com')).toBe(
      'service=user-service&action=USER_NOTIFICATION_PREFERENCE_SYNC_CONFLICT',
    );
  });

  it('locale replay success query tutarli sekilde kurulur', () => {
    expect(buildUserLocaleReplayAuditSearch('admin@example.com')).toBe(
      'service=user-service&action=USER_LOCALE_SYNCED',
    );
  });

  it('locale replay conflict query tutarli sekilde kurulur', () => {
    expect(buildUserLocaleReplayConflictAuditSearch('admin@example.com')).toBe(
      'service=user-service&action=USER_LOCALE_SYNC_CONFLICT',
    );
  });

  it('timezone replay success query tutarli sekilde kurulur', () => {
    expect(buildUserTimezoneReplayAuditSearch('admin@example.com')).toBe(
      'service=user-service&action=USER_TIMEZONE_SYNCED',
    );
  });

  it('timezone replay conflict query tutarli sekilde kurulur', () => {
    expect(buildUserTimezoneReplayConflictAuditSearch('admin@example.com')).toBe(
      'service=user-service&action=USER_TIMEZONE_SYNC_CONFLICT',
    );
  });

  it('date format replay success query tutarli sekilde kurulur', () => {
    expect(buildUserDateFormatReplayAuditSearch('admin@example.com')).toBe(
      'service=user-service&action=USER_DATE_FORMAT_SYNCED',
    );
  });

  it('date format replay conflict query tutarli sekilde kurulur', () => {
    expect(buildUserDateFormatReplayConflictAuditSearch('admin@example.com')).toBe(
      'service=user-service&action=USER_DATE_FORMAT_SYNC_CONFLICT',
    );
  });

  it('time format replay success query tutarli sekilde kurulur', () => {
    expect(buildUserTimeFormatReplayAuditSearch('admin@example.com')).toBe(
      'service=user-service&action=USER_TIME_FORMAT_SYNCED',
    );
  });

  it('time format replay conflict query tutarli sekilde kurulur', () => {
    expect(buildUserTimeFormatReplayConflictAuditSearch('admin@example.com')).toBe(
      'service=user-service&action=USER_TIME_FORMAT_SYNC_CONFLICT',
    );
  });
});
