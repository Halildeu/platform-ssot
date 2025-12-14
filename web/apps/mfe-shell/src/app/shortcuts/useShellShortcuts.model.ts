import { useEffect } from 'react';
import { useAppDispatch } from '../store/store.hooks';
import type { AppDispatch } from '../store/store';
import { pushNotification, toggleOpen } from '../../features/notifications/model/notifications.slice';

const isEditableElement = (target: EventTarget | null) => {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  if (target.isContentEditable) {
    return true;
  }

  return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target.getAttribute('role') === 'textbox';
};

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
        openNotification(dispatch, '/', 'Global arama kısayolu yakında', 'Komut paleti tamamlanana kadar menüyü kullanabilirsiniz.');
        return;
      }

      if (key === 'k' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        openNotification(dispatch, 'ctrl+k', 'Komut paleti hazırlanıyor', 'Komut paleti entegrasyonu SP2-2 görevinde tamamlanacak.');
        return;
      }

      if (key === 'r' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
        if (isEditable) {
          return;
        }
        event.preventDefault();
        openNotification(dispatch, 'r', 'Yenileme kısayolu devre dışı', 'MFE yenileme deneyimi üzerinde çalışıyoruz.');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch]);
};
