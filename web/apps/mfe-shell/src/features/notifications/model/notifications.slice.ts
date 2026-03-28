import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ShellNotificationEntry } from '../../../app/services/shell-services';

export interface NotificationItem extends ShellNotificationEntry {
  id: string;
  createdAt: number;
  read: boolean;
}

export interface NotificationsState {
  items: NotificationItem[];
  unreadCount: number;
  isOpen: boolean;
}

const MAX_ITEMS = 50;
const STORAGE_KEY = 'mfe.notifications.v1';

const persistNotifications = (items: NotificationItem[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // ignore persistence errors
  }
};

const loadPersistedNotifications = (): NotificationItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((item): item is NotificationItem => {
        return (
          Boolean(item) &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.message === 'string' &&
          typeof item.createdAt === 'number' &&
          typeof item.read === 'boolean'
        );
      })
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
};

const persistedItems = loadPersistedNotifications();

const initialState: NotificationsState = {
  items: persistedItems,
  unreadCount: persistedItems.filter((item) => !item.read).length,
  isOpen: false,
};

const ensureId = (id?: string) => {
  if (id && id.trim().length > 0) {
    return id;
  }
  return `notif-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    pushNotification: {
      reducer(state, action: PayloadAction<NotificationItem>) {
        state.items.unshift(action.payload);
        state.unreadCount += 1;
        if (state.items.length > MAX_ITEMS) {
          const removed = state.items.splice(MAX_ITEMS);
          const unreadRemoved = removed.filter((item) => !item.read).length;
          state.unreadCount = Math.max(0, state.unreadCount - unreadRemoved);
        }
        persistNotifications(state.items);
      },
      prepare(entry: ShellNotificationEntry) {
        const id = ensureId(entry.id);
        const createdAt =
          typeof entry.createdAt === 'number' && Number.isFinite(entry.createdAt)
            ? entry.createdAt
            : Date.now();
        return {
          payload: {
            ...entry,
            id,
            createdAt,
            type: entry.type ?? 'info',
            read: false,
          } satisfies NotificationItem,
        };
      },
    },
    removeNotification(state, action: PayloadAction<string>) {
      const index = state.items.findIndex((item) => item.id === action.payload);
      if (index >= 0) {
        const [removed] = state.items.splice(index, 1);
        if (!removed.read && state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
        persistNotifications(state.items);
      }
    },
    removeNotifications(state, action: PayloadAction<string[]>) {
      const idSet = new Set(action.payload);
      if (idSet.size === 0) {
        return;
      }
      state.items = state.items.filter((item) => !idSet.has(item.id));
      state.unreadCount = state.items.filter((item) => !item.read).length;
      persistNotifications(state.items);
    },
    markAllRead(state) {
      if (state.unreadCount === 0) {
        return;
      }
      state.items = state.items.map((item) => ({ ...item, read: true }));
      state.unreadCount = 0;
      persistNotifications(state.items);
    },
    markNotificationsRead(state, action: PayloadAction<string[]>) {
      const idSet = new Set(action.payload);
      if (idSet.size === 0) {
        return;
      }
      state.items = state.items.map((item) => (
        idSet.has(item.id) ? { ...item, read: true } : item
      ));
      state.unreadCount = state.items.filter((item) => !item.read).length;
      persistNotifications(state.items);
    },
    toggleOpen(state, action: PayloadAction<boolean | undefined>) {
      const nextOpen = action.payload ?? !state.isOpen;
      state.isOpen = nextOpen;
      if (!nextOpen) {
        state.items = state.items.map((item) => ({ ...item, read: true }));
        state.unreadCount = 0;
        persistNotifications(state.items);
      }
    },
    clearAll(state) {
      state.items = [];
      state.unreadCount = 0;
      state.isOpen = false;
      persistNotifications(state.items);
    },
  },
});

export const {
  pushNotification,
  removeNotification,
  removeNotifications,
  markAllRead,
  markNotificationsRead,
  toggleOpen,
  clearAll,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
