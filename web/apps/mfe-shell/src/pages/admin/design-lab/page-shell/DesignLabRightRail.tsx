import React from 'react';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

type DesignLabDetailTabItem = {
  id: string;
  label: string;
};

type DesignLabRightRailStat = {
  label: string;
  value: React.ReactNode;
};

type DesignLabRightRailProps = {
  isOpen: boolean;
  onToggle: () => void;
  openLabel: string;
  closeLabel: string;
  detailTabs: DesignLabDetailTabItem[];
  activeDetailTabId: string;
  onOutlineSelect: (tabId: string) => void;
  sidebarStats: DesignLabRightRailStat[];
  contextMetadataTitle?: string;
  contextMetadataItems?: Array<Record<string, unknown>> | null;
  releaseMetadataItems?: Array<Record<string, unknown>> | null;
  adoptionMetadataItems?: Array<Record<string, unknown>> | null;
  migrationMetadataItems?: Array<Record<string, unknown>> | null;
  activeMetadataItems: Array<Record<string, unknown>>;
  OutlinePanelComponent: React.ComponentType<any>;
  StatsPanelComponent: React.ComponentType<any>;
  MetadataPanelComponent: React.ComponentType<any>;
};

export const DesignLabRightRail: React.FC<DesignLabRightRailProps> = ({
  isOpen,
  onToggle,
  openLabel,
  closeLabel,
  detailTabs,
  activeDetailTabId,
  onOutlineSelect,
  sidebarStats,
  contextMetadataTitle,
  contextMetadataItems,
  releaseMetadataItems,
  adoptionMetadataItems,
  migrationMetadataItems,
  activeMetadataItems,
  OutlinePanelComponent,
  StatsPanelComponent,
  MetadataPanelComponent,
}) => {
  const OutlinePanel = OutlinePanelComponent;
  const StatsPanel = StatsPanelComponent;
  const MetadataPanel = MetadataPanelComponent;

  return (
    <aside className="hidden xl:block" data-testid="design-lab-right-rail-shell" data-state={isOpen ? 'open' : 'closed'}>
      <div className="sticky top-4">
        {!isOpen ? (
          <div className="flex justify-end">
            <button
              type="button"
              data-testid="design-lab-right-rail-open"
              aria-expanded="false"
              aria-label={openLabel}
              title={openLabel}
              onClick={onToggle}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface-panel text-text-secondary shadow-xs transition hover:bg-surface-muted hover:text-text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-2"
            >
              <PanelRightOpen className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <button
                type="button"
                data-testid="design-lab-right-rail-close"
                aria-expanded="true"
                aria-label={closeLabel}
                title={closeLabel}
                onClick={onToggle}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface-panel text-text-secondary shadow-xs transition hover:bg-surface-muted hover:text-text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-2"
              >
                <PanelRightClose className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div data-testid="design-lab-right-rail-content" className="flex flex-col gap-4">
              <OutlinePanel
                items={detailTabs}
                activeItemId={activeDetailTabId}
                onItemSelect={onOutlineSelect}
              />

              <StatsPanel items={sidebarStats} />

              {contextMetadataItems?.length ? (
                <MetadataPanel title={contextMetadataTitle ?? 'Lens guide'} items={contextMetadataItems} />
              ) : null}
              {releaseMetadataItems ? <MetadataPanel title="Release" items={releaseMetadataItems} /> : null}
              {adoptionMetadataItems ? <MetadataPanel title="Adoption" items={adoptionMetadataItems} /> : null}
              {migrationMetadataItems ? <MetadataPanel title="Migration" items={migrationMetadataItems} /> : null}

              <MetadataPanel items={activeMetadataItems} />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
