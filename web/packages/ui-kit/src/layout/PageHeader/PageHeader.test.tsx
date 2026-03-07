import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../components/Badge';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  test('title, description, status ve actions render eder', () => {
    render(
      <PageHeader
        eyebrow="Policy"
        title="Rollout Summary"
        description="Acilis metni"
        status={<Badge tone="success">Stable</Badge>}
        actions={<button type="button">Kaydet</button>}
      />,
    );

    expect(screen.getByText('Rollout Summary')).toBeInTheDocument();
    expect(screen.getByText('Acilis metni')).toBeInTheDocument();
    expect(screen.getByText('Stable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Kaydet' })).toBeInTheDocument();
  });

  test('hidden access durumunda render etmez', () => {
    const { container } = render(<PageHeader title="Gizli" access="hidden" />);
    expect(container.firstChild).toBeNull();
  });
});
