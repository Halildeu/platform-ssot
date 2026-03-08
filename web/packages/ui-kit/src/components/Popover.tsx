import React, {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from '../runtime/access-controller';

export interface PopoverProps extends AccessControlledProps {
  trigger: React.ReactNode;
  title?: React.ReactNode;
  content: React.ReactNode;
  align?: 'left' | 'right';
  side?: 'top' | 'bottom';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const callHandler = <E,>(handler: ((event: E) => void) | undefined, event: E) => {
  handler?.(event);
};

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  title,
  content,
  align = 'left',
  side = 'bottom',
  open,
  defaultOpen = false,
  onOpenChange,
  className = '',
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  const interactionState: AccessLevel =
    accessState.isDisabled || accessState.isReadonly ? accessState.state : 'full';
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const resolvedOpen = open ?? uncontrolledOpen;
  const popoverId = useId();
  const titleId = useId();
  const ref = useRef<HTMLDivElement | null>(null);

  const setOpen = (next: boolean) => {
    if (open === undefined) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!resolvedOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [resolvedOpen]);

  if (accessState.isHidden) {
    return null;
  }

  const guardedToggle = withAccessGuard<React.MouseEvent<HTMLElement>>(
    interactionState,
    () => setOpen(!resolvedOpen),
    accessState.isDisabled,
  );

  const guardedToggleKeyboard = withAccessGuard<React.KeyboardEvent<HTMLElement>>(
    interactionState,
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setOpen(!resolvedOpen);
      }
      if (event.key === 'ArrowDown' && !resolvedOpen) {
        event.preventDefault();
        setOpen(true);
      }
    },
    accessState.isDisabled,
  );

  const triggerProps = {
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': resolvedOpen,
    'aria-controls': resolvedOpen ? popoverId : undefined,
    'aria-disabled': (interactionState !== 'full') || undefined,
    'aria-readonly': accessState.isReadonly || undefined,
    'title': accessReason,
    onClick: guardedToggle,
    onKeyDown: guardedToggleKeyboard,
  };

  const triggerNode = isValidElement(trigger)
    ? cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
        ...triggerProps,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          const original = (trigger as React.ReactElement<Record<string, unknown>>).props?.onClick as
            | ((event: React.MouseEvent<HTMLElement>) => void)
            | undefined;
          callHandler(original, event);
          if (!event.defaultPrevented) {
            guardedToggle(event);
          }
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          const original = (trigger as React.ReactElement<Record<string, unknown>>).props?.onKeyDown as
            | ((event: React.KeyboardEvent<HTMLElement>) => void)
            | undefined;
          callHandler(original, event);
          if (!event.defaultPrevented) {
            guardedToggleKeyboard(event);
          }
        },
      })
    : (
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md border border-border-subtle bg-surface-panel px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        {...triggerProps}
        disabled={interactionState !== 'full'}
      >
        {trigger}
      </button>
    );

  return (
    <div
      className={`relative inline-flex ${className}`.trim()}
      ref={ref}
      data-access-state={accessState.state}
    >
      {triggerNode}
      {resolvedOpen ? (
        <div
          id={popoverId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : 'Popover'}
          className={`absolute z-50 w-80 rounded-2xl border border-border-subtle bg-surface-panel p-4 shadow-2xl ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${side === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'}`}
          style={{ boxShadow: 'var(--elevation-overlay)' }}
        >
          {title ? (
            <div id={titleId} className="mb-2 text-sm font-semibold text-text-primary">{title}</div>
          ) : null}
          <div className="text-sm text-text-secondary">{content}</div>
        </div>
      ) : null}
    </div>
  );
};

export default Popover;
