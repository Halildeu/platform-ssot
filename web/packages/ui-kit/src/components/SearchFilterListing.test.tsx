import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchFilterListing from './SearchFilterListing';

describe('SearchFilterListing', () => {
  test('page header, summary ve result list render eder', () => {
    render(
      <SearchFilterListing
        title="Policy inventory"
        filters={<div>Filter slot</div>}
        summaryItems={[
          { key: 'results', label: 'Results', value: '24' },
          { key: 'saved', label: 'Saved views', value: '4' },
          { key: 'owners', label: 'Owners', value: '6' },
        ]}
        items={[
          { key: 'policy-1', title: 'Access policy', description: 'Primary listing item' },
        ]}
      />,
    );

    expect(screen.getByText('Policy inventory')).toBeInTheDocument();
    expect(screen.getByText('Filter slot')).toBeInTheDocument();
    expect(screen.getByText('Access policy')).toBeInTheDocument();
  });

  test('empty durumda fallback gosterir', () => {
    render(<SearchFilterListing title="Empty listing" items={[]} emptyStateLabel="Sonuc yok" />);

    expect(screen.getByText('Sonuc yok')).toBeInTheDocument();
  });
});
