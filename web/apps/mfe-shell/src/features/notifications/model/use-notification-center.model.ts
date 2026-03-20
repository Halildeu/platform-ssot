import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/store.hooks';
import {
  toggleOpen,
  markAllRead,
  markNotificationsRead,
  removeNotification,
  removeNotifications,
  clearAll,
} from './notifications.slice';

export const useNotificationCenterState = () => {
  return useAppSelector((state) => state.notifications);
};

export const useNotificationCenterActions = () => {
  const dispatch = useAppDispatch();

  return {
    toggle: useCallback((open?: boolean) => { dispatch(toggleOpen(open)); }, [dispatch]),
    markAllRead: useCallback(() => { dispatch(markAllRead()); }, [dispatch]),
    markSelectedRead: useCallback((ids: string[]) => { dispatch(markNotificationsRead(ids)); }, [dispatch]),
    remove: useCallback((id: string) => { dispatch(removeNotification(id)); }, [dispatch]),
    removeMany: useCallback((ids: string[]) => { dispatch(removeNotifications(ids)); }, [dispatch]),
    clear: useCallback(() => { dispatch(clearAll()); }, [dispatch]),
  };
};
