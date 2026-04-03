import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationDrawer, type NotificationSurfaceItem } from '@mfe/design-system';
import { NotificationBell } from './header/NotificationBell';

import {
  useNotificationCenterActions,
  useNotificationCenterState,
} from '../../features/notifications/model/use-notification-center.model';

type NotificationPrimaryNavigation = {
  pathname: string;
  search?: string;
  actionLabel: string;
};

const normalizeSearch = (search: string): string => search.replace(/^\?+/, '');

const resolvePrimaryNavigation = (item: NotificationSurfaceItem): NotificationPrimaryNavigation | null => {
  const auditId = typeof item.meta?.auditId === 'string' ? item.meta.auditId : null;
  if (auditId) {
    const search = new URLSearchParams({ auditId });
    return {
      pathname: '/audit/events',
      search: search.toString(),
      actionLabel: 'Audit kaydını aç',
    };
  }

  const pathname = typeof item.meta?.pathname === 'string' ? item.meta.pathname.trim() : '';
  if (!pathname) {
    return null;
  }

  return {
    pathname,
    search: typeof item.meta?.search === 'string' ? normalizeSearch(item.meta.search) : undefined,
    actionLabel:
      typeof item.meta?.actionLabel === 'string' && item.meta.actionLabel.trim().length > 0
        ? item.meta.actionLabel
        : 'Detaya git',
  };
};

const NotificationCenter: React.FC = () => {
  const state = useNotificationCenterState();
  const { toggle, markAllRead, markSelectedRead, clear, remove, removeMany } = useNotificationCenterActions();
  const navigate = useNavigate();

  const drawerTitle = useMemo(() => {
    if (state.unreadCount === 0) {
      return 'Bildirimler';
    }
    return `Bildirimler (${state.unreadCount} okunmamış)`;
  }, [state.unreadCount]);

  const summaryLabel = useMemo(() => {
    if (state.items.length === 0) {
      return 'Yeni olaylar geldiğinde burada görünecek.';
    }
    return `Son ${state.items.length} etkinlik listelenir`;
  }, [state.items.length]);

  const openNotificationTarget = useCallback(
    (target: NotificationPrimaryNavigation, notificationId: string) => {
      navigate({
        pathname: target.pathname,
        search: target.search,
      });
      remove(notificationId);
      toggle(false);
    },
    [navigate, remove, toggle],
  );

  const getPrimaryActionLabel = useCallback((item: NotificationSurfaceItem) => {
    return resolvePrimaryNavigation(item)?.actionLabel ?? null;
  }, []);

  const handlePrimaryAction = useCallback(
    (item: NotificationSurfaceItem) => {
      const target = resolvePrimaryNavigation(item);
      if (!target) {
        return;
      }
      openNotificationTarget(target, item.id);
    },
    [openNotificationTarget],
  );

  return (
    <>
      <NotificationBell
        unreadCount={state.unreadCount}
        onClick={() => toggle()}
        label={drawerTitle}
      />
      <NotificationDrawer
        open={state.isOpen}
        onClose={() => toggle(false)}
        title={drawerTitle}
        dialogLabel="Bildirim merkezi"
        items={state.items}
        summaryLabel={summaryLabel}
        emptyTitle="Şu anda bildirim yok"
        emptyDescription="Yeni olaylar geldiğinde burada görünecek."
        filteredEmptyTitle="Bu filtre için bildirim yok"
        markAllReadLabel="Tümünü okundu say"
        clearLabel="Temizle"
        removeLabel="Bildirimi kapat"
        onMarkAllRead={markAllRead}
        onMarkSelectedRead={markSelectedRead}
        onClear={clear}
        onRemoveItem={remove}
        onRemoveSelected={removeMany}
        getPrimaryActionLabel={getPrimaryActionLabel}
        onPrimaryAction={handlePrimaryAction}
        showFilters
        selectable
        grouping="priority"
        dateGrouping="relative-day"
        closeOnOverlayClick
        closeOnEscape
        portalTarget={typeof document !== 'undefined' ? document.body : null}
      />
    </>
  );
};

export default NotificationCenter;
