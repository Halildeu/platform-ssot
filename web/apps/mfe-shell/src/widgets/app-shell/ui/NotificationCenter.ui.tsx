import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useNotificationCenterActions,
  useNotificationCenterState,
} from '../../../features/notifications/model/use-notification-center.model';
import type { NotificationItem } from '../../../features/notifications/model/notifications.slice';
import { useThemeContext } from '../../../app/theme/theme-context.provider';

const typeStyleMap: Record<NotificationItem['type'], string> = {
  success: 'border-state-success-border bg-state-success-bg text-state-success-text',
  info: 'border-state-info-border bg-state-info text-state-info-text',
  warning: 'border-state-warning-border bg-state-warning-bg text-state-warning-text',
  error: 'border-state-danger-border bg-state-danger-bg text-state-danger-text',
  loading: 'border-selection-outline bg-surface-muted text-text-secondary',
};

const formatTimestamp = (timestamp: number) => {
  try {
    return new Date(timestamp).toLocaleString();
  } catch {
    return String(timestamp);
  }
};

const NotificationCenter: React.FC = () => {
  const state = useNotificationCenterState();
  const { toggle, markAllRead, clear, remove } = useNotificationCenterActions();
  const navigate = useNavigate();
  const { axes } = useThemeContext();
  const overlayStyle = useMemo(
    () => ({
      backgroundColor:
        `color-mix(in srgb, var(--surface-overlay-bg) ${axes.overlayIntensity}%, transparent)`,
      opacity: axes.overlayOpacity / 100,
    }),
    [axes.overlayOpacity, axes.overlayIntensity],
  );

  const drawerTitle = useMemo(() => {
    if (state.unreadCount === 0) {
      return 'Bildirimler';
    }
    return `Bildirimler (${state.unreadCount} okunmamış)`;
  }, [state.unreadCount]);

  const openAuditLog = useCallback(
    (auditId: string, notificationId: string) => {
      const search = new URLSearchParams({ auditId });
      navigate({ pathname: '/audit/events', search: search.toString() });
      remove(notificationId);
      toggle(false);
    },
    [navigate, remove, toggle],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => toggle()}
        aria-label="Bildirim merkezini aç"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-surface-default text-text-secondary shadow-sm transition hover:bg-surface-muted"
      >
        <span aria-hidden>🔔</span>
        {state.unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-state-danger-text px-1 text-center text-[10px] font-semibold text-text-inverse">
            {state.unreadCount > 99 ? '99+' : state.unreadCount}
          </span>
        )}
      </button>
      {state.isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-surface-overlay"
            style={overlayStyle}
            aria-hidden="true"
            role="presentation"
            onClick={() => toggle(false)}
            aria-label="Bildirim merkezini kapat"
          />
          <div className="relative ml-auto flex h-full w-full max-w-md flex-col bg-surface-default shadow-2xl">
            <header className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
              <div>
                <p className="text-base font-semibold text-text-primary">{drawerTitle}</p>
                <p className="text-xs text-text-subtle">Son {state.items.length} etkinlik listelenir</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-md bg-surface-muted px-3 py-1.5 text-xs font-semibold text-text-secondary disabled:opacity-50"
                  onClick={markAllRead}
                  disabled={state.items.length === 0}
                >
                  Tümünü okundu say
                </button>
                <button
                  type="button"
                  className="rounded-md bg-state-danger-bg px-3 py-1.5 text-xs font-semibold text-state-danger-text disabled:opacity-50"
                  onClick={clear}
                  disabled={state.items.length === 0}
                >
                  Temizle
                </button>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {state.items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border-subtle bg-surface-muted bg-opacity-70 p-6 text-center">
                  <p className="text-sm font-semibold text-text-secondary">Şu anda bildirim yok</p>
                  <p className="text-xs text-text-subtle">Yeni olaylar geldiğinde burada görünecek.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {state.items.map((item) => (
                    <article
                      key={item.id}
                      className={`rounded-2xl border border-border-subtle bg-surface-default p-4 shadow-sm ${item.read ? 'opacity-80' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-2">
                          <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${typeStyleMap[item.type ?? 'info']}`}>
                            {item.type?.toUpperCase() ?? 'INFO'}
                          </span>
                          <p className={`text-sm ${item.read ? 'text-text-subtle' : 'font-semibold text-text-primary'}`}>
                            {item.message}
                          </p>
                          {item.description ? (
                            <p className="text-xs text-text-subtle">{item.description}</p>
                          ) : null}
                          <p className="text-[11px] font-medium text-text-subtle">
                            {formatTimestamp(item.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {typeof item.meta?.auditId === 'string' && (
                            <button
                              type="button"
                              className="text-xs font-semibold text-action-primary-text hover:underline"
                              onClick={() => openAuditLog(String(item.meta?.auditId), item.id)}
                            >
                              Audit kaydını aç
                            </button>
                          )}
                          <button
                          type="button"
                          aria-label="Bildirimi kapat"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-subtle text-text-subtle hover:bg-surface-muted"
                          onClick={() => remove(item.id)}
                        >
                            <span aria-hidden>×</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationCenter;
