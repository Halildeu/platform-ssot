import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  LibraryDocsSection,
  LibraryDetailTabs,
  LibraryMetadataPanel,
  LibraryMetricCard,
  LibraryOutlinePanel,
  LibraryPreviewPanel,
  LibrarySectionBadge,
  LibraryShowcaseCard,
  LibraryStatsPanel,
} from './LibraryDocsPrimitives';

describe('LibraryDocsPrimitives', () => {
  test('detail tabs aktif sekmeyi render eder ve degisimi bildirir', async () => {
    const user = userEvent.setup();
    const handleTabChange = jest.fn();

    render(
      <LibraryDetailTabs
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'api', label: 'API' },
        ]}
        activeTabId="overview"
        onTabChange={handleTabChange}
        testIdPrefix="library-docs"
      />,
    );

    await user.click(screen.getByTestId('library-docs-tab-api'));
    expect(handleTabChange).toHaveBeenCalledWith('api');
  });

  test('section badge, metric card ve preview panel basliklarini render eder', () => {
    render(
      <>
        <LibrarySectionBadge label="wave-1" />
        <LibraryMetricCard label="Track" value="Yeni Paketler" note="Kaynağın yayın hattı" />
        <LibraryPreviewPanel title="Varyant matrisi">
          <div>Preview content</div>
        </LibraryPreviewPanel>
      </>,
    );

    expect(screen.getByText('wave-1')).toBeInTheDocument();
    expect(screen.getByText('Track')).toBeInTheDocument();
    expect(screen.getByText('Yeni Paketler')).toBeInTheDocument();
    expect(screen.getByText('Varyant matrisi')).toBeInTheDocument();
    expect(screen.getByText('Preview content')).toBeInTheDocument();
  });

  test('docs section ve showcase card metinlerini render eder', () => {
    render(
      <>
        <LibraryDocsSection eyebrow="Demo" title="Alternatifler" description="Tek sayfada coklu varyant akisi.">
          <div>Section content</div>
        </LibraryDocsSection>
        <LibraryShowcaseCard title="Filled input" description="Profil formu varyanti.">
          <div>Showcase content</div>
        </LibraryShowcaseCard>
      </>,
    );

    expect(screen.getByText('Alternatifler')).toBeInTheDocument();
    expect(screen.getByText('Tek sayfada coklu varyant akisi.')).toBeInTheDocument();
    expect(screen.getByText('Section content')).toBeInTheDocument();
    expect(screen.getByText('Filled input')).toBeInTheDocument();
    expect(screen.getByText('Profil formu varyanti.')).toBeInTheDocument();
    expect(screen.getByText('Showcase content')).toBeInTheDocument();
  });

  test('outline, stats ve metadata paneli render eder ve outline secimini bildirir', async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();

    render(
      <>
        <LibraryOutlinePanel
          items={[
            { id: 'overview', label: 'Overview' },
            { id: 'api', label: 'API' },
          ]}
          activeItemId="overview"
          onItemSelect={handleSelect}
        />
        <LibraryStatsPanel
          items={[
            { label: 'Total', value: 76 },
            { label: 'Live', value: 28 },
          ]}
        />
        <LibraryMetadataPanel
          items={[
            { label: 'Status', value: <span>Stable</span> },
            { label: 'Package', value: <span>mfe-ui-kit</span> },
          ]}
        />
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'API' }));
    expect(handleSelect).toHaveBeenCalledWith('api');
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('76')).toBeInTheDocument();
    expect(screen.getByText('Stable')).toBeInTheDocument();
    expect(screen.getByText('mfe-ui-kit')).toBeInTheDocument();
  });
});
