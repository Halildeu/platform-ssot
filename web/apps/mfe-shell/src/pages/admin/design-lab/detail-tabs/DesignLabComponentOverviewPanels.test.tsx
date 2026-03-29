// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { DesignLabComponentOverviewPanels } from './DesignLabComponentOverviewPanels';

const DetailLabelComponent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const SectionBadgeComponent = ({ label }: { label: string }) => <span>{label}</span>;
const MetricCardComponent = ({
  label,
  value,
  note,
}: {
  label: string;
  value: React.ReactNode;
  note: string;
}) => (
  <div>
    <span>{label}</span>
    <span>{String(value)}</span>
    <span>{note}</span>
  </div>
);
const ShowcaseCardComponent = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <h2>{title}</h2>
    {children}
  </section>
);
const CodeBlockComponent = ({ code }: { code: string }) => <pre>{code}</pre>;

const migrationSummary = {
  contractId: 'migration.contract.v1',
  summary: {
    adoptedOutsideLabComponents: 12,
    stableAdoptedComponents: 9,
    betaAdoptedComponents: 3,
    consumerAppsCount: 4,
    adoptedStoryCoveragePercent: 97,
    adoptedStoryCoveredComponents: 11,
    stableOnlyInDesignLab: 2,
    singleAppBlastRadiusCount: 1,
    crossAppReviewComponents: 2,
    manualReviewRequiredComponents: 1,
    codemodReadyComponents: 1,
    ownerMappedAppsCount: 4,
  },
  priorityBacklog: {
    betaUsedOutsideLab: [],
    adoptedWithoutStory: [],
    stableOnlyInDesignLab: ['Combobox'],
    singleAppBlastRadius: ['ToastProvider'],
  },
  consumerApps: [
    {
      appId: 'mfe-shell',
      componentCount: 2,
      components: ['ToastProvider', 'NotificationDrawer'],
      ownerHandles: ['@design-systems'],
      ownerSource: 'codeowners',
      highestChangeClass: 'single-app',
      singleAppComponents: ['ToastProvider'],
      sharedComponents: ['NotificationDrawer'],
    },
  ],
  rules: ['Legacy aliaslar canonical hedefe map edilmeden kalici tutulmaz.'],
  evidenceRefs: ['apps/mfe-shell/src/pages/admin/DesignLabPage.tsx#L834'],
};

describe('DesignLabComponentOverviewPanels', () => {
  afterEach(() => {
    cleanup();
  });

  it('migration panelinde legacy ve parity matrix kartlarini gosterir', () => {
    render(
      <DesignLabComponentOverviewPanels
        activePanelId="migration"
        item={{
          name: 'MenuBar',
          description: 'legacy migration panel fixture',
          availability: 'exported',
          lifecycle: 'stable',
          demoMode: 'live',
        }}
        releaseSummary={null}
        releaseFamilyContext={null}
        adoptionSummary={null}
        migrationSummary={migrationSummary}
        visualRegressionSummary={null}
        themePresetSummary={null}
        themePresetGalleryItems={[]}
        defaultThemePreset={null}
        contrastThemePreset={null}
        compactThemePreset={null}
        recipeSummary={null}
        relatedRecipes={[]}
        renderRecipeComponentPreview={() => null}
        DetailLabelComponent={DetailLabelComponent}
        SectionBadgeComponent={SectionBadgeComponent}
        MetricCardComponent={MetricCardComponent}
        ShowcaseCardComponent={ShowcaseCardComponent}
        CodeBlockComponent={CodeBlockComponent}
      />,
    );

    expect(screen.getByText('Legacy replacement matrix')).toBeInTheDocument();
    expect(
      screen.getByText(/Legacy taxonomy ve variant aliaslari yeni 4 katmanli modele gore siniflandirildi/i),
    ).toBeInTheDocument();
    expect(screen.getByText('AI UX taxonomy section')).toBeInTheDocument();
    expect(screen.getByText('Visualization taxonomy section')).toBeInTheDocument();
    expect(screen.getByText('Search header variant id')).toBeInTheDocument();
    expect(screen.getByText('Selection action header variant id')).toBeInTheDocument();
    expect(screen.getByText('adapter 3')).toBeInTheDocument();
    expect(screen.getAllByText('missing 0').length).toBeGreaterThan(0);
    expect(
      screen.getByText(/design-lab\.legacy-replacement-matrix\.v1\.json/i),
    ).toBeInTheDocument();

    expect(screen.getByText('AntD / MUI parity matrix')).toBeInTheDocument();
    expect(
      screen.getByText(/12\/12 aligned, 0 partial, 97% overall/i),
    ).toBeInTheDocument();
    expect(screen.getByText('Target model')).toBeInTheDocument();
    expect(screen.getByText(/5 katmanli model aktif/i)).toBeInTheDocument();
    expect(screen.getByText('aligned 12')).toBeInTheDocument();
    expect(screen.getByText('misplaced 0')).toBeInTheDocument();
    expect(
      screen.getByText(/design-lab\.benchmark-parity-matrix\.v1\.json/i),
    ).toBeInTheDocument();
  });
});
