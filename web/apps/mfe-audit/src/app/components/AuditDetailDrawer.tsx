import React, { useMemo } from 'react';
import { AuditEvent } from '../types/audit-event';
import JsonPreview from './JsonPreview';
import { DetailDrawer, type DetailTab } from '@mfe/design-system';

export type AuditDetailDrawerProps = {
  event?: AuditEvent | null;
  open: boolean;
  onClose: () => void;
  onTabChange?: (tab: TabKey, event?: AuditEvent | null) => void;
};

type TabKey = 'summary' | 'diff' | 'raw';

export const AuditDetailDrawer: React.FC<AuditDetailDrawerProps> = ({ event, open, onClose, onTabChange }) => {
  const diffPayload = useMemo(() => {
    if (!event) {
      return null;
    }
    if (!event.before && !event.after) {
      return null;
    }
    return {
      before: event.before ?? {},
      after: event.after ?? {},
    };
  }, [event]);

  const tabs = useMemo<DetailTab[]>(() => {
    if (!event) {
      return [];
    }
    const items: DetailTab[] = [
      {
        key: 'summary',
        label: 'Summary',
        sections: [
          {
            key: 'summary',
            content: (
              <div data-testid="audit-detail-summary" className="space-y-4 text-sm">
                <dl className="grid gap-3">
                  <div>
                    <dt className="text-xs uppercase text-text-subtle">Timestamp</dt>
                    <dd className="font-medium text-text-primary">{new Date(event.timestamp).toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-text-subtle">User</dt>
                    <dd className="text-text-secondary">{event.userEmail}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-text-subtle">Service</dt>
                    <dd className="text-text-secondary">{event.service}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-text-subtle">Level</dt>
                    <dd className="text-text-secondary">{event.level}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-text-subtle">Correlation ID</dt>
                    <dd className="text-text-secondary">{event.correlationId ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-text-subtle">Details</dt>
                    <dd className="text-text-secondary">{event.details ?? '—'}</dd>
                  </div>
                </dl>
                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">Metadata</h4>
                    <JsonPreview data={event.metadata} />
                  </div>
                )}
              </div>
            ),
          },
        ],
      },
    ];

    if (diffPayload) {
      items.push({
        key: 'diff',
        label: 'Diff',
        sections: [
          {
            key: 'diff',
            content: (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">Before</h4>
                  <JsonPreview data={diffPayload.before} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">After</h4>
                  <JsonPreview data={diffPayload.after} />
                </div>
              </div>
            ),
          },
        ],
      });
    }

    items.push({
      key: 'raw',
      label: 'Raw JSON',
      sections: [
        {
          key: 'raw',
          content: (
            <div data-testid="audit-detail-raw">
              <JsonPreview data={event} />
            </div>
          ),
        },
      ],
    });

    return items;
  }, [event, diffPayload]);

  if (!event) {
    return (
      <DetailDrawer open={open} onClose={onClose} title="Audit Event" width={420}>
        <p className="text-sm text-text-subtle">Henüz bir kayıt seçilmedi.</p>
      </DetailDrawer>
    );
  }

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      width={420}
      title="Audit Event"
      tabs={tabs}
      extra={<span className="text-sm text-text-subtle">{event.action}</span>}
      onTabChange={(tabKey) => onTabChange?.(tabKey as TabKey, event)}
    />
  );
};
