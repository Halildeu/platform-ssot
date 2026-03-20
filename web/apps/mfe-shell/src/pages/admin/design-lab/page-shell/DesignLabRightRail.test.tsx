import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { DesignLabRightRail } from './DesignLabRightRail';

const OutlinePanelComponent = ({
  items,
  activeItemId,
  onItemSelect,
}: {
  items: Array<{ id: string; label: string }>;
  activeItemId: string;
  onItemSelect: (id: string) => void;
}) => (
  <div data-testid="outline-panel">
    {items.map((item) => (
      <button
        key={item.id}
        type="button"
        data-testid={`outline-${item.id}`}
        aria-current={item.id === activeItemId ? 'page' : undefined}
        onClick={() => onItemSelect(item.id)}
      >
        {item.label}
      </button>
    ))}
  </div>
);

const StatsPanelComponent = ({ items }: { items: Array<{ label: string; value: React.ReactNode }> }) => (
  <div data-testid="stats-panel">{items.map((item) => item.label).join(',')}</div>
);

const MetadataPanelComponent = ({
  title,
  items,
}: {
  title?: string;
  items: Array<Record<string, unknown>>;
}) => (
  <div data-testid={`metadata-${title ?? 'active'}`}>{items.length}</div>
);

describe('DesignLabRightRail', () => {
  afterEach(() => {
    cleanup();
  });

  it('varsayilan kapali durumda yalniz acma tetikleyicisini gosterir', () => {
    render(
      <DesignLabRightRail
        isOpen={false}
        onToggle={() => {}}
        openLabel="Sağ paneli aç"
        closeLabel="Sağ paneli kapat"
        detailTabs={[{ id: 'overview', label: 'Overview' }]}
        activeDetailTabId="overview"
        onOutlineSelect={() => {}}
        sidebarStats={[{ label: 'Total', value: 10 }]}
        releaseMetadataItems={null}
        adoptionMetadataItems={null}
        migrationMetadataItems={null}
        activeMetadataItems={[{ key: 'value' }]}
        OutlinePanelComponent={OutlinePanelComponent}
        StatsPanelComponent={StatsPanelComponent}
        MetadataPanelComponent={MetadataPanelComponent}
      />,
    );

    expect(screen.getByTestId('design-lab-right-rail-open')).toBeInTheDocument();
    expect(screen.queryByTestId('design-lab-right-rail-content')).not.toBeInTheDocument();
  });

  it('acildiginda content render eder ve kapanma callbackini tetikler', () => {
    const onToggle = vi.fn();
    const onOutlineSelect = vi.fn();

    render(
      <DesignLabRightRail
        isOpen
        onToggle={onToggle}
        openLabel="Sağ paneli aç"
        closeLabel="Sağ paneli kapat"
        detailTabs={[{ id: 'overview', label: 'Overview' }]}
        activeDetailTabId="overview"
        onOutlineSelect={onOutlineSelect}
        sidebarStats={[{ label: 'Total', value: 10 }]}
        contextMetadataTitle="Lens guide"
        contextMetadataItems={[{ key: 'lens' }]}
        releaseMetadataItems={[{ key: 'release' }]}
        adoptionMetadataItems={null}
        migrationMetadataItems={null}
        activeMetadataItems={[{ key: 'value' }]}
        OutlinePanelComponent={OutlinePanelComponent}
        StatsPanelComponent={StatsPanelComponent}
        MetadataPanelComponent={MetadataPanelComponent}
      />,
    );

    expect(screen.getByTestId('design-lab-right-rail-content')).toBeInTheDocument();
    expect(screen.getByTestId('outline-panel')).toBeInTheDocument();
    expect(screen.getByTestId('stats-panel')).toBeInTheDocument();
    expect(screen.getByTestId('metadata-Lens guide')).toBeInTheDocument();
    expect(screen.getByTestId('metadata-Release')).toBeInTheDocument();
    expect(screen.getByTestId('metadata-active')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('outline-overview'));
    expect(onOutlineSelect).toHaveBeenCalledWith('overview');

    fireEvent.click(screen.getByTestId('design-lab-right-rail-close'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
