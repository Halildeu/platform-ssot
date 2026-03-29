// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { collectAuditSummaryNotifications } from './audit-summary-notifications';

describe('audit-summary-notifications', () => {
  it('artan success ve conflict metricleri icin capability bazli bildirim descriptoru uretir', () => {
    const notifications = collectAuditSummaryNotifications({
      email: 'admin@example.com',
      previousGroups: [
        {
          groupId: 'profile.session-timeout',
          title: 'Session-timeout replay',
          description: 'demo',
          total: 1,
          latestEventId: 'evt-1',
          latestEventTimestamp: '2026-03-14T10:00:00Z',
          latestCapabilityId: 'user.session-timeout.synced',
          metrics: [
            {
              capabilityId: 'user.session-timeout.synced',
              label: 'Replay success',
              total: 1,
            },
            {
              capabilityId: 'user.session-timeout.conflict',
              label: 'Replay conflict',
              total: 0,
            },
          ],
        },
      ],
      nextGroups: [
        {
          groupId: 'profile.session-timeout',
          title: 'Session-timeout replay',
          description: 'demo',
          total: 3,
          latestEventId: 'evt-3',
          latestEventTimestamp: '2026-03-14T12:00:00Z',
          latestCapabilityId: 'user.session-timeout.conflict',
          metrics: [
            {
              capabilityId: 'user.session-timeout.synced',
              label: 'Replay success',
              total: 2,
            },
            {
              capabilityId: 'user.session-timeout.conflict',
              label: 'Replay conflict',
              total: 1,
            },
          ],
        },
      ],
    });

    expect(notifications).toHaveLength(2);
    expect(notifications[0]).toMatchObject({
      message: 'Session-timeout replay kaydı güncellendi',
      type: 'success',
      open: false,
    });
    expect(notifications[1]).toMatchObject({
      message: 'Session-timeout replay conflict algılandı',
      type: 'warning',
      open: true,
    });
  });

  it('ilk baseline yoksa veya toplam artmadiysa bildirim uretmez', () => {
    const notifications = collectAuditSummaryNotifications({
      email: 'admin@example.com',
      previousGroups: [],
      nextGroups: [
        {
          groupId: 'auth.session',
          title: 'Session bootstrap',
          description: 'demo',
          total: 4,
          latestEventId: 'evt-1',
          latestEventTimestamp: '2026-03-14T10:00:00Z',
          latestCapabilityId: 'auth.session.created',
          metrics: [
            {
              capabilityId: 'auth.session.created',
              label: 'Session events',
              total: 4,
            },
          ],
        },
      ],
    });

    expect(notifications).toHaveLength(0);
  });
});
