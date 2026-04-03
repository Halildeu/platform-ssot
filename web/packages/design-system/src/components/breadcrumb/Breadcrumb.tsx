"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { setDisplayName } from "../../system/compose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  active?: boolean;
}

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

// ---------------------------------------------------------------------------
// Default separator
// ---------------------------------------------------------------------------

function DefaultSeparator() {
  return (
    <svg className="h-3.5 w-3.5 text-text-disabled shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Breadcrumb Root
// ---------------------------------------------------------------------------

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  function Breadcrumb({ className, separator, children, ...props }, ref) {
    const items = React.Children.toArray(children);
    const sep = separator ?? <DefaultSeparator />;

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
        <ol className="flex items-center gap-1.5 flex-wrap">
          {items.map((child, i) => (
            <React.Fragment key={i}>
              {child}
              {i < items.length - 1 && (
                <li className="flex items-center" role="presentation" aria-hidden>
                  {sep}
                </li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    );
  },
);

// ---------------------------------------------------------------------------
// BreadcrumbItem
// ---------------------------------------------------------------------------

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem({ className, active = false, children, ...props }, ref) {
    return (
      <li
        ref={ref}
        className={cn("inline-flex items-center", className)}
        aria-current={active ? "page" : undefined}
        {...props}
      >
        {active ? (
          <span className="text-sm font-medium text-text-primary">{children}</span>
        ) : (
          children
        )}
      </li>
    );
  },
);

// ---------------------------------------------------------------------------
// BreadcrumbLink
// ---------------------------------------------------------------------------

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  function BreadcrumbLink({ className, children, ...props }, ref) {
    return (
      <a
        ref={ref}
        className={cn(
          "text-sm text-text-secondary hover:text-text-primary transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary rounded-sm",
          className,
        )}
        {...props}
      >
        {children}
      </a>
    );
  },
);

setDisplayName(Breadcrumb, "Breadcrumb");
setDisplayName(BreadcrumbItem, "BreadcrumbItem");
setDisplayName(BreadcrumbLink, "BreadcrumbLink");

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink };
