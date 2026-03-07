import React, { cloneElement, isValidElement, useId, useState } from 'react';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../runtime/access-controller';

export interface TooltipProps extends AccessControlledProps {
  text: string;
  children: React.ReactNode;
  className?: string;
  placement?: 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  className,
  placement = 'top',
  access = 'full',
}) => {
  const accessState = resolveAccessState(access);
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  if (accessState.isHidden) {
    return null;
  }

  const triggerProps = {
    'aria-describedby': open ? tooltipId : undefined,
  };

  const trigger = isValidElement(children)
    ? cloneElement(children as React.ReactElement<Record<string, unknown>>, triggerProps)
    : <span {...triggerProps}>{children}</span>;

  return (
    <span
      className={`relative inline-flex ${className ?? ''}`.trim()}
      data-access-state={accessState.state}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {trigger}
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className={`pointer-events-none absolute left-1/2 z-50 max-w-xs -translate-x-1/2 rounded-xl border border-border-subtle bg-surface-panel px-3 py-2 text-xs font-medium text-text-primary shadow-lg ${
            placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          style={{ boxShadow: 'var(--elevation-overlay)' }}
        >
          {text}
        </span>
      ) : null}
    </span>
  );
};

export default Tooltip;
