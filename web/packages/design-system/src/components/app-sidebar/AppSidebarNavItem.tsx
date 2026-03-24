import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { useSidebar } from './useSidebar';
import type { AppSidebarNavItemProps } from './types';

export const AppSidebarNavItem: React.FC<AppSidebarNavItemProps> = ({
  icon,
  label,
  href,
  active = false,
  badge,
  disabled = false,
  onClick,
  tooltip,
  children,
  depth = 0,
  className,
}) => {
  const { isCollapsed } = useSidebar();
  const itemRef = useRef<HTMLElement>(null);

  /* Auto-scroll into view when item becomes active */
  useEffect(() => {
    if (active && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [active]);

  /* Indentation based on depth (0-3) */
  const depthPadding = isCollapsed ? 'px-2' : depth === 0 ? 'px-3' : depth === 1 ? 'pl-8 pr-3' : depth === 2 ? 'pl-12 pr-3' : 'pl-16 pr-3';

  const sharedClasses = cn(
    'group relative flex items-center gap-3 rounded-md py-2 text-sm',
    'transition-all duration-200 outline-none',
    'focus-visible:ring-2 focus-visible:ring-[var(--action-primary)]',
    depthPadding,
    active
      ? 'bg-[var(--action-primary)]/10 text-[var(--action-primary)] font-medium'
      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-canvas)] hover:text-[var(--text-primary)]',
    disabled && 'pointer-events-none opacity-40',
    isCollapsed && 'justify-center',
    className,
  );

  /* Active indicator — 3px left border */
  const activeIndicator = active && !isCollapsed && (
    <span
      className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r bg-[var(--action-primary)]"
      aria-hidden="true"
    />
  );

  const content = (
    <>
      {activeIndicator}
      {icon && <span className="shrink-0 text-lg">{icon}</span>}
      {!isCollapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
      {!isCollapsed && badge && <span className="shrink-0">{badge}</span>}

      {/* Tooltip shown when collapsed */}
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

  const element = href && !disabled ? (
    <a
      ref={itemRef as React.Ref<HTMLAnchorElement>}
      href={href}
      data-sidebar-item=""
      className={sharedClasses}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
    >
      {content}
    </a>
  ) : (
    <button
      ref={itemRef as React.Ref<HTMLButtonElement>}
      type="button"
      data-sidebar-item=""
      className={cn(sharedClasses, 'w-full text-left')}
      onClick={disabled ? undefined : onClick}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
    >
      {content}
    </button>
  );

  /* Nested children */
  if (children && !isCollapsed) {
    return (
      <div>
        {element}
        <div className="space-y-0.5">
          {React.Children.map(children, (child) => {
            if (React.isValidElement<AppSidebarNavItemProps>(child)) {
              return React.cloneElement(child, {
                depth: Math.min((depth ?? 0) + 1, 3) as number,
              });
            }
            return child;
          })}
        </div>
      </div>
    );
  }

  return element;
};

AppSidebarNavItem.displayName = 'AppSidebar.NavItem';
