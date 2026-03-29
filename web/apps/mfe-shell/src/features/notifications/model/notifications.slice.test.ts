// @vitest-environment jsdom
import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const STORAGE_KEY = 'mfe.notifications.v1';

const loadModule = async () => import('./notifications.slice');

describe('notifications.slice', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.resetModules();
  });

  it('localStorage durumunu bootstrap asamasinda hydrate eder', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'notif-persisted',
          message: 'Persist edilmis olay',
          type: 'warning',
          priority: 'high',
          pinned: true,
          createdAt: 1710000000000,
          read: false,
          meta: { source: 'test' },
        },
      ]),
    );

    const mod = await loadModule();
    const store = configureStore({
      reducer: {
        notifications: mod.default,
      },
    });

    const state = store.getState().notifications;
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({
      id: 'notif-persisted',
      message: 'Persist edilmis olay',
      priority: 'high',
      pinned: true,
      read: false,
    });
    expect(state.unreadCount).toBe(1);
  });

  it('batch aksiyonlari ve close akisi persistence durumunu gunceller', async () => {
    const mod = await loadModule();
    const store = configureStore({
      reducer: {
        notifications: mod.default,
      },
    });

    store.dispatch(mod.pushNotification({ message: 'Policy-check fail', type: 'error', priority: 'high' }));
    store.dispatch(mod.pushNotification({ message: 'Sync tamamlandi', type: 'success' }));

    let persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(persisted).toHaveLength(2);

    const [latestItem, olderItem] = store.getState().notifications.items;
    store.dispatch(mod.markNotificationsRead([latestItem.id]));

    persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(persisted.find((item: { id: string; read: boolean }) => item.id === latestItem.id)?.read).toBe(true);
    expect(store.getState().notifications.unreadCount).toBe(1);

    store.dispatch(mod.toggleOpen(true));
    store.dispatch(mod.toggleOpen(false));

    persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(persisted.every((item: { read: boolean }) => item.read)).toBe(true);
    expect(store.getState().notifications.unreadCount).toBe(0);

    store.dispatch(mod.removeNotifications([latestItem.id, olderItem.id]));

    persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(persisted).toEqual([]);
    expect(store.getState().notifications.items).toEqual([]);
  });
});
