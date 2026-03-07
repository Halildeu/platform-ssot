import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../components/Badge';
import { EntitySummaryBlock } from './EntitySummaryBlock';

describe('EntitySummaryBlock', () => {
  test('entity ozeti ve detay alanlarini render eder', () => {
    render(
      <EntitySummaryBlock
        title="Acme Corp"
        subtitle="Kurumsal musteri"
        badge={<Badge tone="info">Active</Badge>}
        items={[
          { key: 'owner', label: 'Owner', value: 'Compliance' },
          { key: 'scope', label: 'Scope', value: 'Global' },
        ]}
      />,
    );

    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Kurumsal musteri')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Compliance')).toBeInTheDocument();
  });

  test('hidden access durumunda render etmez', () => {
    const { container } = render(<EntitySummaryBlock title="Hidden" items={[]} access="hidden" />);
    expect(container.firstChild).toBeNull();
  });
});
