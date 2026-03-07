import React, { useEffect, useId } from 'react';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../../runtime/access-controller';

export interface FormDrawerProps extends AccessControlledProps {
  open: boolean;
  title?: React.ReactNode;
  onClose: () => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  width?: number | string;
  submitText?: React.ReactNode;
  cancelText?: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
  accessReason?: string;
}

export const FormDrawer: React.FC<FormDrawerProps> = ({
  open,
  title,
  onClose,
  onSubmit,
  width = 480,
  submitText = 'Kaydet',
  cancelText = 'İptal',
  loading,
  children,
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open || accessState.isHidden) {
    return null;
  }

  const panelWidth = typeof width === 'number' ? `${width}px` : width;
  const buttonBase =
    'inline-flex items-center justify-center rounded-md border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selection-outline focus-visible:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2';
  const canSubmit = accessState.state === 'full';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loading) {
      return;
    }
    onSubmit?.(event);
  };

  return (
    <div className="fixed inset-0 z-50 flex" data-access-state={accessState.state}>
      <div
        className="absolute inset-0 bg-surface-overlay"
        style={{
          backgroundColor:
            'color-mix(in srgb, var(--surface-overlay-bg) calc(var(--overlay-intensity) * 1%), transparent)',
          opacity: 'var(--overlay-opacity)',
        }}
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative ml-auto flex h-full w-full max-w-full justify-end">
        <div
          className="flex h-full w-full max-w-full flex-col bg-surface"
          style={{
            maxWidth: panelWidth,
            borderRadius: 'var(--radius-surface)',
            overflow: 'hidden',
            boxShadow: 'var(--elevation-overlay)',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : 'Drawer'}
        >
          <header className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
            <div id={title ? titleId : undefined} className="text-base font-semibold text-text-primary">{title}</div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-subtle hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selection-outline focus-visible:ring-offset-1"
              aria-label="Kapat"
            >
              ✕
            </button>
          </header>
          <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
            <footer className="flex justify-end gap-2 border-t border-border-subtle px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className={`${buttonBase} border border-border-subtle bg-surface-panel text-text-secondary hover:bg-surface-muted`}
                title={accessReason}
              >
                {cancelText}
              </button>
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className={`${buttonBase} border-transparent bg-action-primary text-action-primary-text hover:opacity-90`}
                title={accessReason}
              >
                {submitText}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormDrawer;
