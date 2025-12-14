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

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
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
      }
    },
    markAllRead(state) {
      if (state.unreadCount === 0) {
        return;
      }
      state.items = state.items.map((item) => ({ ...item, read: true }));
      state.unreadCount = 0;
    },
    toggleOpen(state, action: PayloadAction<boolean | undefined>) {
      const nextOpen = action.payload ?? !state.isOpen;
      state.isOpen = nextOpen;
      if (!nextOpen) {
        state.items = state.items.map((item) => ({ ...item, read: true }));
        state.unreadCount = 0;
      }
    },
    clearAll(state) {
      state.items = [];
      state.unreadCount = 0;
      state.isOpen = false;
    },
  },
});

export const {
  pushNotification,
  removeNotification,
  markAllRead,
  toggleOpen,
  clearAll,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
