"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { setDisplayName } from "../../system/compose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title */
  title?: React.ReactNode;
  /** Subtitle / description */
  subtitle?: React.ReactNode;
  /** Breadcrumb element */
  breadcrumb?: React.ReactNode;
  /** Actions area (buttons, etc.) */
  actions?: React.ReactNode;
  /** Tabs below header */
  tabs?: React.ReactNode;
  /** Sidebar content (renders right panel) */
  sidebar?: React.ReactNode;
  /** Sidebar width */
  sidebarWidth?: string;
  /** Full-width mode (no max-width constraint) */
  fullWidth?: boolean;
  /** Loading overlay */
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  function PageLayout(props, ref) {
    const {
      className,
      title,
      subtitle,
      breadcrumb,
      actions,
      tabs,
      sidebar,
      sidebarWidth = "320px",
      fullWidth = false,
      loading = false,
      children,
      ...rest
    } = props;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col min-h-0 flex-1",
          !fullWidth && "mx-auto w-full max-w-7xl",
          className,
        )}
        {...rest}
      >
        {/* Header area */}
        {(breadcrumb || title || actions) && (
          <header className="flex flex-col gap-4 px-6 pt-6 pb-4">
            {breadcrumb}

            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                {title && (
                  <h1 className="text-2xl font-bold text-text-primary tracking-tight truncate">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-text-secondary">{subtitle}</p>
                )}
              </div>

              {actions && (
                <div className="flex items-center gap-2 shrink-0">{actions}</div>
              )}
            </div>

            {tabs}
          </header>
        )}

        {/* Content area */}
        <div className="flex flex-1 min-h-0 relative">
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-default/60 backdrop-blur-[1px]">
              <svg className="h-6 w-6 animate-spin text-action-primary" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0 px-6 pb-6 overflow-y-auto">
            {children}
          </main>

          {/* Sidebar */}
          {sidebar && (
            <aside
              className="hidden lg:block border-l border-border-subtle overflow-y-auto shrink-0 p-6"
              style={{ width: sidebarWidth }}
            >
              {sidebar}
            </aside>
          )}
        </div>
      </div>
    );
  },
);

setDisplayName(PageLayout, "PageLayout");

export { PageLayout };
