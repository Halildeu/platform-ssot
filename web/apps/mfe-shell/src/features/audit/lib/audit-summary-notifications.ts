import {
  buildAuditFeedNotificationDescriptor,
  type AuditFeedCapabilityId,
  type AuditFeedNotificationDescriptor,
  type AuditSummarySnapshot,
} from '@platform/capabilities';

type CollectAuditSummaryNotificationsInput = {
  email: string;
  previousGroups: readonly AuditSummarySnapshot[];
  nextGroups: readonly AuditSummarySnapshot[];
};

const flattenSummaryMetrics = (
  groups: readonly AuditSummarySnapshot[],
): Map<AuditFeedCapabilityId, number> => {
  const totals = new Map<AuditFeedCapabilityId, number>();

  for (const group of groups) {
    for (const metric of group.metrics) {
      totals.set(metric.capabilityId, metric.total);
    }
  }

  return totals;
};

export function collectAuditSummaryNotifications({
  email,
  previousGroups,
  nextGroups,
}: CollectAuditSummaryNotificationsInput): AuditFeedNotificationDescriptor[] {
  const previousTotals = flattenSummaryMetrics(previousGroups);
  const nextTotals = flattenSummaryMetrics(nextGroups);
  const notifications: AuditFeedNotificationDescriptor[] = [];

  for (const [capabilityId, nextTotal] of Array.from(nextTotals.entries())) {
    const previousTotal = previousTotals.get(capabilityId) ?? 0;
    const delta = nextTotal - previousTotal;

    if (delta <= 0) {
      continue;
    }

    const descriptor = buildAuditFeedNotificationDescriptor(
      capabilityId,
      email,
      delta,
      nextTotal,
    );

    if (descriptor) {
      notifications.push(descriptor);
    }
  }

  return notifications;
}
