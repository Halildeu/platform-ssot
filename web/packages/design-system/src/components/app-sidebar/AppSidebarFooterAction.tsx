import React from 'react';
import { cn } from '../../utils/cn';
import { useSidebar } from './useSidebar';

/* ------------------------------------------------------------------ */
/*  AppSidebarFooterAction — Generic action button for sidebar footer  */
/* ------------------------------------------------------------------ */

export interface AppSidebarFooterActionProps {
  /** Icon rendered before the label. */
  icon: React.ReactNode;
  /** Text label — always required for accessibility. */
  label: string;
  /** Click handler. Ignored when `href` is provided. */
  onClick?: () => void;
  /** Renders as a link when provided. */
  href?: string;
  /** Disables the action. */
  disabled?: boolean;
  /** Badge element rendered after the label. */
  badge?: React.ReactNode;
  /** Tooltip text in collapsed mode. Falls back to `label`. */
  tooltip?: string;
  /** Marks this action as currently active. */
  active?: boolean;
  /** Additional CSS class. */
  className?: string;
  /** Test ID. */
  'data-testid'?: string;
}

/**
 * Footer action button for the AppSidebar. Adapts to collapsed mode
 * by hiding the label and showing a tooltip on hover. Renders as an
 * anchor when `href` is provided, otherwise a button.
 *
 * @example
 * ```tsx
 * <AppSidebar.Footer>
 *   <AppSidebar.FooterAction
 *     icon={<SettingsIcon />}
 *     label="Settings"
 *     href="/settings"
 *   />
 *   <AppSidebar.FooterAction
 *     icon={<HelpIcon />}
 *     label="Support"
 *     onClick={openSupport}
 *   />
 * </AppSidebar.Footer>
 * ```
 *
 * @since 1.1.0
 * @see AppSidebar.Footer
 */
export const AppSidebarFooterAction = React.forwardRef<
  HTMLDivElement,
  AppSidebarFooterActionProps
>(
  (
    {
      icon,
      label,
      onClick,
      href,
      disabled = false,
      badge,
      tooltip,
      active = false,
      className,
      'data-testid': testId,
    },
    ref,
  ) => {
    const { isCollapsed } = useSidebar();

    const sharedClasses = cn(
      'group relative flex items-center gap-2 rounded-xl py-2 text-sm cursor-pointer',
      'border border-border-subtle bg-surface-default',
      'transition-all duration-200 outline-hidden',
      'focus-visible:ring-2 focus-visible:ring-[var(--action-primary)]',
      isCollapsed ? 'justify-center px-2' : 'px-3',
      active
        ? 'bg-surface-muted text-text-primary shadow-xs'
        : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary',
      disabled && 'pointer-events-none opacity-40',
      className,
    );

    const content = (
      <>
        <span className="shrink-0">{icon}</span>
        {!isCollapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
        {!isCollapsed && badge && <span className="shrink-0">{badge}</span>}
        {isCollapsed && (
          <span
            role="tooltip"
            className={cn(
              'pointer-events-none absolute left-full ml-2 z-50',
              'whitespace-nowrap rounded-md px-2 py-1 text-xs',
              'bg-[var(--text-primary)] text-[var(--surface-default)]',
              'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
              'transition-opacity duration-150',
            )}
          >
            {tooltip ?? label}
          </span>
        )}
      </>
    );

    const element =
      href && !disabled ? (
        <a
          href={href}
          className={sharedClasses}
          title={label}
          aria-label={label}
          data-testid={testId}
        >
          {content}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={sharedClasses}
          title={label}
          aria-label={label}
          data-testid={testId}
        >
          {content}
        </button>
      );

    return (
      <div ref={ref} className="w-full">
        {element}
      </div>
    );
  },
);

AppSidebarFooterAction.displayName = 'AppSidebar.FooterAction';
