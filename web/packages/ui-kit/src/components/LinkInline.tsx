import React from 'react';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from '../runtime/access-controller';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type LinkInlineTone = 'primary' | 'secondary';
export type LinkInlineUnderline = 'always' | 'hover' | 'none';

const toneClasses: Record<LinkInlineTone, string> = {
  primary:
    'text-[var(--accent-primary)] visited:text-text-secondary hover:text-[var(--accent-primary-hover)]',
  secondary: 'text-text-secondary hover:text-text-primary',
};

const underlineClasses: Record<LinkInlineUnderline, string> = {
  always: 'underline underline-offset-4',
  hover: 'no-underline hover:underline hover:underline-offset-4',
  none: 'no-underline',
};

export interface LinkInlineProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>,
    AccessControlledProps {
  children: React.ReactNode;
  tone?: LinkInlineTone;
  underline?: LinkInlineUnderline;
  current?: boolean;
  disabled?: boolean;
  external?: boolean;
  leadingVisual?: React.ReactNode;
  trailingVisual?: React.ReactNode;
}

export const LinkInline = React.forwardRef<HTMLAnchorElement, LinkInlineProps>(function LinkInline(
  {
    children,
    className,
    tone = 'primary',
    underline = 'hover',
    current = false,
    disabled = false,
    external,
    leadingVisual,
    trailingVisual,
    access = 'full',
    accessReason,
    href,
    onClick,
    rel,
    target,
    title,
    ...props
  },
  ref,
) {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  const inferredExternal = typeof href === 'string' && /^https?:\/\//.test(href);
  const isExternal = external ?? inferredExternal;
  const blocked = disabled || accessState.isDisabled || accessState.isReadonly;
  const interactionState: AccessLevel = blocked ? 'disabled' : accessState.state;
  const handleClick = withAccessGuard<React.MouseEvent<HTMLAnchorElement>>(interactionState, onClick, blocked);
  const baseClassName = cn(
    'inline-flex items-center gap-1 rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-2',
    toneClasses[tone],
    underlineClasses[underline],
    current && 'font-semibold text-text-primary decoration-[var(--accent-primary)] underline underline-offset-4',
    blocked && 'cursor-not-allowed border border-border-subtle bg-surface-muted px-2 py-1 text-text-subtle no-underline opacity-100',
    className,
  );
  const titleText = accessReason ?? title;

  if (blocked || !href) {
    return (
      <span
        className={baseClassName}
        data-access-state={accessState.state}
        data-link-state="blocked"
        aria-disabled="true"
        title={titleText}
      >
        {leadingVisual ? <span aria-hidden="true">{leadingVisual}</span> : null}
        <span>{children}</span>
        {trailingVisual ? <span aria-hidden="true">{trailingVisual}</span> : null}
      </span>
    );
  }

  return (
    <a
      {...props}
      ref={ref}
      href={href}
      onClick={handleClick}
      className={baseClassName}
      data-access-state={accessState.state}
      data-link-state={current ? 'current' : isExternal ? 'external' : 'internal'}
      aria-current={current ? 'page' : undefined}
      target={isExternal ? '_blank' : target}
      rel={isExternal ? 'noopener noreferrer' : rel}
      title={titleText}
    >
      {leadingVisual ? <span aria-hidden="true">{leadingVisual}</span> : null}
      <span>{children}</span>
      {trailingVisual ? (
        <span aria-hidden="true">{trailingVisual}</span>
      ) : isExternal ? (
        <span aria-hidden="true">↗</span>
      ) : null}
      {isExternal ? <span className="sr-only">Harici bağlantı</span> : null}
    </a>
  );
});

export default LinkInline;
