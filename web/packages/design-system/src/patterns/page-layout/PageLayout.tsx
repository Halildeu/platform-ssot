"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { setDisplayName } from "../../system/compose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PageLayoutClasses = Record<string, string>;
export type PageBreadcrumbItem = { label: string; href?: string };
export type PageLayoutRouteInput = { path: string; label: string };
export interface PageLayoutPresetOptions {
  preset: "content-only" | "detail-sidebar" | "ops-workspace";
  pageWidth?: "default" | "wide" | "full";
  stickyHeader?: boolean;
  currentBreadcrumbMode?: "text" | "link";
  responsiveDetailBreakpoint?: "base" | "sm" | "md" | "lg" | "xl";
}

export function createPageLayoutPreset(
  options: PageLayoutPresetOptions,
): Partial<PageLayoutProps> {
  const { preset, pageWidth, stickyHeader, currentBreadcrumbMode, responsiveDetailBreakpoint } =
    options;

  switch (preset) {
    case "content-only":
      return {
        pageWidth: pageWidth ?? "default",
        stickyHeader: stickyHeader ?? false,
        responsiveDetailCollapse: false,
        currentBreadcrumbMode: currentBreadcrumbMode ?? "text",
      };
    case "detail-sidebar":
      return {
        pageWidth: pageWidth ?? "full",
        stickyHeader: stickyHeader ?? false,
        responsiveDetailCollapse: true,
        responsiveDetailBreakpoint: responsiveDetailBreakpoint ?? "md",
        currentBreadcrumbMode: currentBreadcrumbMode ?? "text",
      };
    case "ops-workspace":
      return {
        pageWidth: pageWidth ?? "full",
        stickyHeader: stickyHeader ?? true,
        responsiveDetailCollapse: true,
        responsiveDetailBreakpoint: responsiveDetailBreakpoint ?? "lg",
        currentBreadcrumbMode: currentBreadcrumbMode ?? "link",
      };
  }
}

export function createPageLayoutBreadcrumbItems(
  inputs: PageBreadcrumbItem[],
): PageBreadcrumbItem[] {
  return inputs.map((item) => ({
    label: item.label,
    href: item.href ?? item.path,
  }));
}

export interface PageLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
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
  /** Page width preset */
  pageWidth?: "default" | "wide" | "full";
  /** Sticky header */
  stickyHeader?: boolean;
  /** Collapse detail panel on small screens */
  responsiveDetailCollapse?: boolean;
  /** Breakpoint for detail collapse */
  responsiveDetailBreakpoint?: "base" | "sm" | "md" | "lg" | "xl";
  /** Breadcrumb display mode */
  currentBreadcrumbMode?: "text" | "link";
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

export { PageLayout, createPageLayoutPreset, createPageLayoutBreadcrumbItems };
