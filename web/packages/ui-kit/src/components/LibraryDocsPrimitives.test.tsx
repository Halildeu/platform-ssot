import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  LibraryDetailTabs,
  LibraryMetricCard,
  LibraryPreviewPanel,
  LibrarySectionBadge,
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
});

