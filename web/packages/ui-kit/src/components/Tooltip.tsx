import React from 'react';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../runtime/access-controller';

export interface TooltipProps extends AccessControlledProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Basit tooltip primitive'i.
 * Varsayılan olarak native `title` attribute'u kullanır; ileride daha zengin bir tooltip ile değiştirilebilir.
 */
export const Tooltip: React.FC<TooltipProps> = ({ text, children, className, access = 'full' }) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }
  return (
    <span title={text} className={className} data-access-state={accessState.state}>
      {children}
    </span>
  );
};

export default Tooltip;
