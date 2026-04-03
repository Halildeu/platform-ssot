import { useEffect } from 'react';
import { useAppDispatch } from '../store/store.hooks';
import type { AppDispatch } from '../store/store';
import { pushNotification, toggleOpen } from '../../features/notifications/model/notifications.slice';
import { useShellCommonI18n } from '../i18n';
import { isEditableElement } from './keyboard-utils';

const openNotification = (dispatch: AppDispatch, key: string, message: string, description?: string) => {
  dispatch(
    pushNotification({
      id: `shortcut-${key}`,
      message,
      description,
      type: 'info',
      meta: { source: 'shortcut', key, open: true },
    }),
  );
  dispatch(toggleOpen(true));
};

export const useShellShortcuts = () => {
  const dispatch = useAppDispatch();
  const { t } = useShellCommonI18n();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const rawKey = typeof event.key === 'string' ? event.key : '';
      if (rawKey.length === 0) {
        return;
      }
      const key = rawKey.toLowerCase();
      const isEditable = isEditableElement(event.target);

      if (key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        if (isEditable) {
          return;
        }
        event.preventDefault();
        openNotification(
          dispatch,
          '/',
          t('shell.shortcuts.searchSoon.title'),
          t('shell.shortcuts.searchSoon.description'),
        );
        return;
      }

      // Ctrl+K / Cmd+K is now handled by useGlobalSearch (header CommandPalette).
      // Do not intercept here.

      if (key === 'r' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
        if (isEditable) {
          return;
        }
        event.preventDefault();
        openNotification(
          dispatch,
          'r',
          t('shell.shortcuts.refreshDisabled.title'),
          t('shell.shortcuts.refreshDisabled.description'),
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch, t]);
};
