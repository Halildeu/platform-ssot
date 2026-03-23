import React from 'react';
import { cn } from '../utils/cn';
import { resolveAccessState, accessStyles, type AccessControlledProps } from '../internal/access-controller';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EmptyStateReason =
  | 'no-data'
  | 'no-results'
  | 'no-permission'
  | 'error'
  | 'first-time'
  | 'filtered-empty';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface EmptyStateBuilderLocaleText {
  'no-data'?: { title?: string; description?: string };
  'no-results'?: { title?: string; description?: string };
  'no-permission'?: { title?: string; description?: string };
  error?: { title?: string; description?: string };
  'first-time'?: { title?: string; description?: string };
  'filtered-empty'?: { title?: string; description?: string };
}

/** Contextual empty state with reason-based icon, messaging, and optional action buttons. */
export interface EmptyStateBuilderProps extends AccessControlledProps {
  /** The reason for the empty state, determines the default icon and messaging */
  reason: EmptyStateReason;
  /** Override the default title for the given reason */
  title?: string;
  /** Override the default description for the given reason */
  description?: string;
  /** Primary call-to-action button displayed below the description */
  primaryAction?: EmptyStateAction;
  /** Secondary action button displayed next to the primary action */
  secondaryAction?: EmptyStateAction;
  /** Controls icon dimensions, font sizes, and vertical padding */
  size?: EmptyStateSize;
  /** Localized labels per reason — Turkish defaults are used when omitted */
  localeText?: EmptyStateBuilderLocaleText;
  /** Additional CSS class names for the root element */
  className?: string;
}

// ---------------------------------------------------------------------------
// Defaults per reason
// ---------------------------------------------------------------------------

const DEFAULTS: Record<EmptyStateReason, { title: string; description: string }> = {
  'no-data': {
    title: 'Hen\u00fcz veri yok',
    description: 'Bu alan\u0131 doldurmaya ba\u015flay\u0131n.',
  },
  'no-results': {
    title: 'Sonu\u00e7 bulunamad\u0131',
    description: 'Farkl\u0131 arama terimleri deneyebilirsiniz.',
  },
  'no-permission': {
    title: 'Bu i\u00e7eri\u011fe eri\u015fim yetkiniz yok',
    description: 'Eri\u015fim izni i\u00e7in y\u00f6neticinize ba\u015fvurun.',
  },
  error: {
    title: 'Bir hata olu\u015ftu',
    description: 'L\u00fctfen daha sonra tekrar deneyin.',
  },
  'first-time': {
    title: 'Ba\u015flamak i\u00e7in...',
    description: '\u0130lk ad\u0131m\u0131n\u0131z\u0131 at\u0131n ve olu\u015fturmaya ba\u015flay\u0131n.',
  },
  'filtered-empty': {
    title: 'Filtrelenmi\u015f sonu\u00e7 yok',
    description: 'Filtreleri de\u011fi\u015ftirmeyi deneyin.',
  },
};

// ---------------------------------------------------------------------------
// Size config
// ---------------------------------------------------------------------------

const SIZE_CONFIG: Record<EmptyStateSize, { icon: number; titleCls: string; descCls: string; gap: string; py: string }> = {
  sm: { icon: 32, titleCls: 'text-sm', descCls: 'text-xs', gap: 'gap-2', py: 'py-6' },
  md: { icon: 48, titleCls: 'text-base', descCls: 'text-sm', gap: 'gap-3', py: 'py-10' },
  lg: { icon: 64, titleCls: 'text-lg', descCls: 'text-base', gap: 'gap-4', py: 'py-14' },
};

// ---------------------------------------------------------------------------
// Icons (inline SVG)
// ---------------------------------------------------------------------------

function IconDatabase({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary opacity-50">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function IconSearch({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary opacity-50">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconLock({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary opacity-50">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconWarning({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary opacity-50">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconRocket({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary opacity-50">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function IconFilter({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary opacity-50">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

const REASON_ICONS: Record<EmptyStateReason, React.FC<{ size: number }>> = {
  'no-data': IconDatabase,
  'no-results': IconSearch,
  'no-permission': IconLock,
  error: IconWarning,
  'first-time': IconRocket,
  'filtered-empty': IconFilter,
};

// ---------------------------------------------------------------------------
// EmptyStateBuilder component
// ---------------------------------------------------------------------------

/** Contextual empty state with reason-based icon, messaging, and optional action buttons. */
export const EmptyStateBuilder = React.forwardRef<HTMLDivElement, EmptyStateBuilderProps>(({
  reason,
  title,
  description,
  primaryAction,
  secondaryAction,
  size = 'md',
  localeText,
  access,
  accessReason,
  className,
}, ref) => {
  const { state, isHidden, isDisabled } = resolveAccessState(access);
  const defaults = DEFAULTS[reason];
  const config = SIZE_CONFIG[size];
  const IconComponent = REASON_ICONS[reason];

  if (isHidden) return null;

  const resolvedTitle = title ?? localeText?.[reason]?.title ?? defaults.title;
  const resolvedDesc = description ?? localeText?.[reason]?.description ?? defaults.description;

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        config.py,
        config.gap,
        accessStyles(state),
        className,
      )}
      role="status"
      aria-label={resolvedTitle}
      title={accessReason}
    >
      <IconComponent size={config.icon} />

      <h4 className={cn('font-semibold text-text-primary', config.titleCls)}>
        {resolvedTitle}
      </h4>

      <p className={cn('max-w-sm text-text-secondary', config.descCls)}>
        {resolvedDesc}
      </p>

      {(primaryAction || secondaryAction) && (
        <div className="mt-2 flex items-center gap-3">
          {primaryAction && (
            <button
              type="button"
              className="rounded-md bg-action-primary px-4 py-2 text-sm font-medium text-text-inverse hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDisabled}
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              className="rounded-md border border-border-default bg-[var(--surface-primary)] px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDisabled}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
});

EmptyStateBuilder.displayName = 'EmptyStateBuilder';
