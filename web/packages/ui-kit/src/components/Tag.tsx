import React from 'react';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../runtime/access-controller';

type TagTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

const toneClass: Record<TagTone, string> = {
  default: 'border-border-subtle text-text-secondary bg-surface-panel',
  success: 'border-state-success-border text-state-success-text bg-state-success',
  warning: 'border-state-warning-border text-state-warning-text bg-state-warning',
  danger: 'border-state-danger-border text-state-danger-text bg-state-danger',
  info: 'border-state-info-border text-state-info-text bg-state-info',
};

export type TagProps = {
  children: React.ReactNode;
  tone?: TagTone;
  className?: string;
} & AccessControlledProps;

export const Tag: React.FC<TagProps> = ({ children, tone = 'default', className = '', access = 'full' }) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }
  return (
    <span
      data-access-state={accessState.state}
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneClass[tone]} ${className}`}
    >
      {children}
    </span>
  );
};
