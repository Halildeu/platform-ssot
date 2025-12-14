import React from 'react';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../runtime/access-controller';

export type EmptyProps = {
  description?: string;
  className?: string;
} & AccessControlledProps;

export const Empty: React.FC<EmptyProps> = ({
  description = 'Kayıt bulunamadı',
  className = '',
  access = 'full',
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }
  return (
    <div
      data-access-state={accessState.state}
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface-panel px-6 py-8 text-center text-sm text-text-secondary ${className}`}
    >
      <span aria-hidden>🗂️</span>
      <div>{description}</div>
    </div>
  );
};
