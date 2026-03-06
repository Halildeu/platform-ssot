import React from 'react';
import clsx from 'clsx';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../../runtime/access-controller';
import { Breadcrumb } from '../../components/Breadcrumb';

export interface PageBreadcrumbItem {
  title: React.ReactNode;
  path?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export interface PageLayoutProps extends AccessControlledProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbItems?: PageBreadcrumbItem[];
  headerExtra?: React.ReactNode;
  actions?: React.ReactNode;
  filterBar?: React.ReactNode;
  children?: React.ReactNode;
  detail?: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
  detailClassName?: string;
  style?: React.CSSProperties;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  breadcrumbItems,
  headerExtra,
  actions,
  filterBar,
  children,
  detail,
  footer,
  contentClassName,
  detailClassName,
  style,
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }
  const hasBreadcrumbs = Boolean(breadcrumbItems && breadcrumbItems.length > 0);

  return (
    <div
      className={clsx('mfe-page-layout flex flex-col min-h-full bg-transparent text-text-primary')}
      style={style}
      data-access-state={accessState.state}
      aria-disabled={accessState.isDisabled || accessState.isReadonly || undefined}
      title={accessReason}
    >
      <header className="mfe-page-layout__header flex flex-col gap-4 px-6 py-4 bg-transparent">
        <div className="flex flex-col gap-2 flex-1">
          {hasBreadcrumbs && (
            <Breadcrumb
              className="mfe-page-layout__breadcrumb"
              size="sm"
              items={breadcrumbItems!.map((item, index) => ({
                label: item.title,
                href: item.path,
                onClick: item.onClick,
                current: index === breadcrumbItems!.length - 1,
              }))}
            />
          )}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
              {title && (
                <h1 className="text-2xl font-semibold text-text-primary m-0" data-testid="page-layout-title">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-sm text-text-secondary m-0 mfe-page-layout__description">{description}</p>
              )}
            </div>
            {headerExtra && <div className="shrink-0">{headerExtra}</div>}
          </div>
        </div>
        {actions && (
          <div className="mfe-page-layout__actions flex flex-wrap gap-2 items-center">{actions}</div>
        )}
      </header>
      <main className="mfe-page-layout__content flex flex-col gap-4 px-6 py-4 flex-1">
        {filterBar && <div className="mfe-page-layout__filters">{filterBar}</div>}
        <div className="mfe-page-layout__body flex gap-4 items-start">
          <div className={clsx('mfe-page-layout__main flex-1 min-w-0', contentClassName)}>{children}</div>
          {detail && (
            <aside className={clsx('mfe-page-layout__detail w-[360px] shrink-0', detailClassName)}>
              {detail}
            </aside>
          )}
        </div>
      </main>
      {footer && (
        <footer className="mfe-page-layout__footer px-6 py-4 bg-transparent border-t border-border-subtle">
          {footer}
        </footer>
      )}
    </div>
  );
};

export default PageLayout;
