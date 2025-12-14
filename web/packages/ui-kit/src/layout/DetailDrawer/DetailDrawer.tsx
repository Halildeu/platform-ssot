import React from 'react';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../../runtime/access-controller';

export type DetailSection = {
  key: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  content?: React.ReactNode;
};

export type DetailTab = {
  key: string;
  label: React.ReactNode;
  sections: DetailSection[];
};

export interface DetailDrawerProps extends AccessControlledProps {
  open: boolean;
  title?: React.ReactNode;
  onClose: () => void;
  width?: number | string;
  sections?: DetailSection[];
  tabs?: DetailTab[];
  extra?: React.ReactNode;
  children?: React.ReactNode;
  onTabChange?: (key: string) => void;
}

const renderSection = (section: DetailSection) => (
  <div key={section.key} className="mfe-detail-drawer__section mb-6">
    {section.title && (
      <div className="mb-1 text-sm font-semibold text-text-primary">{section.title}</div>
    )}
    {section.description && (
      <p className="mb-3 text-xs text-text-secondary">{section.description}</p>
    )}
    {section.content && <div className="text-sm text-text-primary">{section.content}</div>}
  </div>
);

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  open,
  title,
  onClose,
  width = 420,
  sections,
  tabs,
  extra,
  children,
  onTabChange,
  access = 'full',
}) => {
  const accessState = resolveAccessState(access);
  if (!open || accessState.isHidden) {
    return null;
  }

  const hasTabs = Boolean(tabs && tabs.length > 0);
  const firstTabKey = hasTabs ? tabs![0].key : null;
  const [activeTab, setActiveTab] = React.useState<string | null>(firstTabKey);

  React.useEffect(() => {
    if (open && hasTabs) {
      setActiveTab(firstTabKey);
    }
  }, [tabs, open, hasTabs, firstTabKey]);

  const handleTabSelect = (tabKey: string) => {
    setActiveTab(tabKey);
    onTabChange?.(tabKey);
  };

  const resolvedSections: DetailSection[] = hasTabs
    ? tabs?.find((tab) => tab.key === (activeTab ?? firstTabKey))?.sections ?? []
    : sections ?? [];
  const hasCustomContent = Boolean(children);
  const panelWidth = typeof width === 'number' ? `${width}px` : width;

  return (
    <div className="mfe-detail-drawer fixed inset-0 z-50 flex" data-access-state={accessState.state}>
      <div
        className="absolute inset-0 bg-surface-overlay"
        style={{
          backgroundColor:
            'color-mix(in srgb, var(--surface-overlay-bg) calc(var(--overlay-intensity, 10) * 1%), transparent)',
          opacity: 'var(--overlay-opacity, 0.9)',
        }}
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative ml-auto flex h-full w-full max-w-full justify-end">
        <div
          className="relative flex h-full w-full max-w-full flex-col bg-surface"
          style={{
            maxWidth: panelWidth,
            borderRadius: 'var(--radius-surface, 12px)',
            overflow: 'hidden',
            boxShadow: 'var(--elevation-overlay)',
          }}
        >
          <header className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
            <div className="text-base font-semibold text-text-primary">{title}</div>
            <div className="flex items-center gap-3">
              {extra}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-subtle hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selection-outline focus-visible:ring-offset-1"
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>
          </header>
          <div className="flex h-full flex-col overflow-hidden">
            {hasTabs && (
              <div className="mfe-detail-drawer__tabs flex border-b border-border-subtle px-6">
                {tabs?.map((tab) => {
                  const isActive = tab.key === (activeTab ?? tabs[0]?.key);
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      className={`px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-b-2 border-selection text-text-primary'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                      onClick={() => handleTabSelect(tab.key)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {hasCustomContent ? (
                children
              ) : (
                <>
                  {resolvedSections.map(renderSection)}
                  {!resolvedSections.length && (
                    <p className="text-sm text-text-secondary">İçerik bulunamadı.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;
