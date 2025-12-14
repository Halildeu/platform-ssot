import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/store.hooks';
import {
  toggleOpen,
  markAllRead,
  removeNotification,
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
    remove: useCallback((id: string) => { dispatch(removeNotification(id)); }, [dispatch]),
    clear: useCallback(() => { dispatch(clearAll()); }, [dispatch]),
  };
};
