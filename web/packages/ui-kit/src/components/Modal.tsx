import React from 'react';
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from '../runtime/access-controller';

export type ModalProps = {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
} & AccessControlledProps;

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  onClose,
  children,
  footer,
  className = '',
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (!open || accessState.isHidden) return null;

  const resolvedInteraction: AccessLevel =
    accessState.isDisabled || accessState.isReadonly ? accessState.state : 'full';
  const guardedClose = onClose
    ? withAccessGuard<React.MouseEvent<HTMLButtonElement | HTMLDivElement>>(
        resolvedInteraction,
        () => onClose(),
        accessState.isDisabled,
      )
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-access-state={accessState.state}>
      <div
        className="absolute inset-0 bg-surface-overlay"
        style={{
          backgroundColor:
            'color-mix(in srgb, var(--surface-overlay-bg) calc(var(--overlay-intensity, 10) * 1%), transparent)',
          opacity: 'var(--overlay-opacity, 0.9)',
        }}
        onClick={guardedClose}
        role="presentation"
        aria-hidden="true"
      />
      <div
        className={`relative w-full max-w-lg rounded-xl border border-border-subtle bg-surface-panel ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-access-state={accessState.state}
        style={{ boxShadow: 'var(--elevation-overlay)' }}
      >
        <div className="flex items-start justify-between border-b border-border-subtle px-4 py-3">
          <div className="text-sm font-semibold text-text-primary">{title}</div>
          {onClose ? (
            <button
              type="button"
              onClick={guardedClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Kapat"
              aria-disabled={resolvedInteraction !== 'full' || undefined}
              disabled={accessState.isDisabled}
              title={accessReason}
            >
              ×
            </button>
          ) : null}
        </div>
        <div className="px-4 py-3 text-sm text-text-primary">{children}</div>
        {footer ? (
          <div className="border-t border-border-subtle px-4 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
};
