import React from "react";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/*  PageLayout — Full-page scaffold with header, content, detail,     */
/*  footer, breadcrumb, filters, and responsive collapse.             */
/* ------------------------------------------------------------------ */

// --------------- Types ---------------

export interface PageBreadcrumbItem {
  title: React.ReactNode;
  path?: string;
  onClick?: () => void;
  current?: boolean;
}

export type PageLayoutRouteInput =
  | string
  | {
      title?: React.ReactNode;
      label?: React.ReactNode;
      path?: string;
      href?: string;
      onClick?: () => void;
      current?: boolean;
    };

export interface PageLayoutClasses {
  root?: string;
  header?: string;
  headerInner?: string;
  breadcrumb?: string;
  titleRow?: string;
  titleBlock?: string;
  description?: string;
  headerExtra?: string;
  actions?: string;
  content?: string;
  contentInner?: string;
  filters?: string;
  contentHeader?: string;
  contentToolbar?: string;
  body?: string;
  main?: string;
  detail?: string;
  footer?: string;
  footerInner?: string;
  secondaryNav?: string;
}

export interface PageLayoutProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbItems?: PageBreadcrumbItem[];
  currentBreadcrumbMode?: "text" | "link";
  breadcrumbAriaLabel?: string;
  headerExtra?: React.ReactNode;
  actions?: React.ReactNode;
  secondaryNav?: React.ReactNode;
  filterBar?: React.ReactNode;
  contentHeader?: React.ReactNode;
  contentToolbar?: React.ReactNode;
  children?: React.ReactNode;
  detail?: React.ReactNode;
  footer?: React.ReactNode;
  stickyHeader?: boolean;
  pageWidth?: "default" | "wide" | "full";
  responsiveDetailCollapse?: boolean;
  responsiveDetailBreakpoint?: "base" | "sm" | "md" | "lg" | "xl";
  ariaLabel?: string;
  classes?: PageLayoutClasses;
  className?: string;
  contentClassName?: string;
  detailClassName?: string;
  style?: React.CSSProperties;
}

// --------------- Helpers (internal) ---------------

const PAGE_WIDTH_CLASSES: Record<NonNullable<PageLayoutProps["pageWidth"]>, string> = {
  default: "max-w-5xl mx-auto",
  wide: "max-w-7xl mx-auto",
  full: "",
};

/**
 * Map breakpoint token to the Tailwind responsive prefix at which
 * the detail panel switches from stacked (below) to side-by-side.
 */
const BREAKPOINT_FLEX_ROW: Record<
  NonNullable<PageLayoutProps["responsiveDetailBreakpoint"]>,
  string
> = {
  base: "flex-row",
  sm: "sm:flex-row",
  md: "md:flex-row",
  lg: "lg:flex-row",
  xl: "xl:flex-row",
};

// --------------- Breadcrumb (internal) ---------------

interface BreadcrumbNavProps {
  items: PageBreadcrumbItem[];
  currentMode: "text" | "link";
  ariaLabel?: string;
  className?: string;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  currentMode,
  ariaLabel = "Breadcrumb",
  className,
}) => (
  <nav aria-label={ariaLabel} className={className}>
    <ol className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const isCurrent = item.current ?? isLast;
        const isClickable =
          !isCurrent || currentMode === "link"
            ? !!(item.path || item.onClick)
            : false;

        return (
          <li key={idx} className="flex items-center gap-1.5">
            {idx > 0 && (
              <svg
                className="h-3.5 w-3.5 flex-shrink-0 text-[var(--text-secondary)] opacity-50"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 4l4 4-4 4" />
              </svg>
            )}

            {isClickable ? (
              <a
                href={item.path}
                onClick={
                  item.onClick
                    ? (e) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        }
                      }
                    : undefined
                }
                className="hover:text-[var(--text-primary)] transition-colors"
                aria-current={isCurrent ? "page" : undefined}
              >
                {item.title}
              </a>
            ) : (
              <span
                className={cn(isCurrent && "text-[var(--text-primary)] font-medium")}
                aria-current={isCurrent ? "page" : undefined}
              >
                {item.title}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

// --------------- Component ---------------

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  breadcrumbItems,
  currentBreadcrumbMode = "text",
  breadcrumbAriaLabel,
  headerExtra,
  actions,
  secondaryNav,
  filterBar,
  contentHeader,
  contentToolbar,
  children,
  detail,
  footer,
  stickyHeader = false,
  pageWidth = "default",
  responsiveDetailCollapse = false,
  responsiveDetailBreakpoint = "md",
  ariaLabel,
  classes,
  className,
  contentClassName,
  detailClassName,
  style,
}) => {
  const widthCls = PAGE_WIDTH_CLASSES[pageWidth];
  const hasHeader = !!(title || breadcrumbItems?.length || actions || headerExtra);

  return (
    <div
      className={cn("flex min-h-0 flex-col", classes?.root, className)}
      style={style}
      aria-label={ariaLabel}
    >
      {/* ---- Header ---- */}
      {hasHeader && (
        <header
          className={cn(
            "border-b border-[var(--border-subtle)] bg-[var(--surface-default)] px-6 pt-4 pb-4",
            stickyHeader && "sticky top-0 z-10",
            classes?.header,
          )}
        >
          <div className={cn(widthCls, classes?.headerInner)}>
            {/* Breadcrumb */}
            {breadcrumbItems && breadcrumbItems.length > 0 && (
              <BreadcrumbNav
                items={breadcrumbItems}
                currentMode={currentBreadcrumbMode}
                ariaLabel={breadcrumbAriaLabel}
                className={cn("mb-2", classes?.breadcrumb)}
              />
            )}

            {/* Title row */}
            {(title || actions) && (
              <div
                className={cn(
                  "flex items-start justify-between gap-4",
                  classes?.titleRow,
                )}
              >
                <div className={cn("min-w-0 flex-1", classes?.titleBlock)}>
                  {title && (
                    <h1 className="text-xl font-semibold text-[var(--text-primary)] truncate">
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p
                      className={cn(
                        "mt-1 text-sm text-[var(--text-secondary)] line-clamp-2",
                        classes?.description,
                      )}
                    >
                      {description}
                    </p>
                  )}
                </div>

                {actions && (
                  <div
                    className={cn(
                      "flex items-center gap-2 flex-shrink-0",
                      classes?.actions,
                    )}
                  >
                    {actions}
                  </div>
                )}
              </div>
            )}

            {/* Header extra */}
            {headerExtra && (
              <div className={cn("mt-3", classes?.headerExtra)}>
                {headerExtra}
              </div>
            )}
          </div>
        </header>
      )}

      {/* ---- Secondary nav ---- */}
      {secondaryNav && (
        <div
          className={cn(
            "border-b border-[var(--border-subtle)] bg-[var(--surface-default)] px-6",
            classes?.secondaryNav,
          )}
        >
          <div className={widthCls}>{secondaryNav}</div>
        </div>
      )}

      {/* ---- Content ---- */}
      <div
        className={cn(
          "flex-1 min-h-0 px-6 py-4",
          classes?.content,
          contentClassName,
        )}
      >
        <div className={cn(widthCls, classes?.contentInner)}>
          {/* Filter bar */}
          {filterBar && (
            <div className={cn("mb-4", classes?.filters)}>{filterBar}</div>
          )}

          {/* Content header */}
          {contentHeader && (
            <div className={cn("mb-4", classes?.contentHeader)}>
              {contentHeader}
            </div>
          )}

          {/* Content toolbar */}
          {contentToolbar && (
            <div className={cn("mb-4", classes?.contentToolbar)}>
              {contentToolbar}
            </div>
          )}

          {/* Body: main + optional detail */}
          {detail ? (
            <div
              className={cn(
                "flex flex-col gap-6",
                responsiveDetailCollapse
                  ? BREAKPOINT_FLEX_ROW[responsiveDetailBreakpoint]
                  : "flex-row",
                classes?.body,
              )}
            >
              <div className={cn("min-w-0 flex-1", classes?.main)}>
                {children}
              </div>
              <div
                className={cn(
                  "flex-shrink-0",
                  !responsiveDetailCollapse && "w-80",
                  responsiveDetailCollapse && "w-full",
                  responsiveDetailCollapse &&
                    responsiveDetailBreakpoint === "sm" &&
                    "sm:w-80",
                  responsiveDetailCollapse &&
                    responsiveDetailBreakpoint === "md" &&
                    "md:w-80",
                  responsiveDetailCollapse &&
                    responsiveDetailBreakpoint === "lg" &&
                    "lg:w-80",
                  responsiveDetailCollapse &&
                    responsiveDetailBreakpoint === "xl" &&
                    "xl:w-80",
                  responsiveDetailCollapse &&
                    responsiveDetailBreakpoint === "base" &&
                    "w-80",
                  classes?.detail,
                  detailClassName,
                )}
              >
                {detail}
              </div>
            </div>
          ) : (
            <div className={cn(classes?.body)}>
              <div className={cn(classes?.main)}>{children}</div>
            </div>
          )}
        </div>
      </div>

      {/* ---- Footer ---- */}
      {footer && (
        <footer
          className={cn(
            "border-t border-[var(--border-subtle)] bg-[var(--surface-default)] px-6 py-3",
            classes?.footer,
          )}
        >
          <div className={cn(widthCls, classes?.footerInner)}>{footer}</div>
        </footer>
      )}
    </div>
  );
};

PageLayout.displayName = "PageLayout";

// --------------- Presets ---------------

export interface PageLayoutPresetOptions {
  preset: "content-only" | "detail-sidebar" | "ops-workspace";
  pageWidth?: "default" | "wide" | "full";
  stickyHeader?: boolean;
  currentBreadcrumbMode?: "text" | "link";
  responsiveDetailBreakpoint?: "base" | "sm" | "md" | "lg" | "xl";
}

/**
 * Create a set of PageLayoutProps for common page archetypes.
 *
 * - `content-only`     — non-sticky, default width, no collapse
 * - `detail-sidebar`   — full width, collapse at md
 * - `ops-workspace`    — full width, sticky, collapse at lg
 */
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

// --------------- Breadcrumb builder ---------------

/**
 * Convert flexible route inputs to normalized `PageBreadcrumbItem[]`.
 *
 * - Strings become `{ title: str }`
 * - Objects map `label` or `title` to `title`, and `href` or `path` to `path`
 * - If no item has explicit `current: true`, the last item is auto-marked current
 */
export function createPageLayoutBreadcrumbItems(
  inputs: PageLayoutRouteInput[],
): PageBreadcrumbItem[] {
  const hasExplicitCurrent = inputs.some(
    (i) => typeof i !== "string" && i.current === true,
  );

  return inputs.map((input, idx): PageBreadcrumbItem => {
    if (typeof input === "string") {
      return {
        title: input,
        current: !hasExplicitCurrent && idx === inputs.length - 1,
      };
    }

    return {
      title: input.label ?? input.title ?? "",
      path: input.href ?? input.path,
      onClick: input.onClick,
      current: input.current ?? (!hasExplicitCurrent && idx === inputs.length - 1),
    };
  });
}
