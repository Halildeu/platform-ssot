import React from 'react';
import { render, screen } from '@testing-library/react';
import DetailSummary from './DetailSummary';

describe('DetailSummary', () => {
  test('header, entity ve json alanini render eder', () => {
    render(
      <DetailSummary
        title="Release detail"
        summaryItems={[{ key: 'owners', label: 'Owners', value: '3' }]}
        entity={{
          title: 'Wave 11',
          subtitle: 'Recipe rollout',
          items: [{ key: 'status', label: 'Status', value: 'stable' }],
        }}
        detailItems={[{ key: 'contract', label: 'Contract', value: 'ui-library-wave-11-recipes-v1' }]}
        jsonValue={{ wave: '11', stable: true }}
      />,
    );

    expect(screen.getByText('Release detail')).toBeInTheDocument();
    expect(screen.getByText('Wave 11')).toBeInTheDocument();
    expect(screen.getByText('ui-library-wave-11-recipes-v1')).toBeInTheDocument();
    expect(screen.getByText('payload')).toBeInTheDocument();
  });
});
