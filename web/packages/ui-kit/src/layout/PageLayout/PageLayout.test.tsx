import React from 'react';
import { render, screen } from '@testing-library/react';
import { PageLayout } from './PageLayout';

describe('PageLayout', () => {
  test('title, breadcrumb ve action alanini render eder', () => {
    render(
      <PageLayout
        title="Kullanici Dizini"
        description="Route shell"
        breadcrumbItems={[{ title: 'Admin', path: '#' }, { title: 'Users' }]}
        actions={<button type="button">Yeni kayit</button>}
      >
        <div>Main</div>
      </PageLayout>,
    );

    expect(screen.getByTestId('page-layout-title')).toHaveTextContent('Kullanici Dizini');
    expect(screen.getByRole('button', { name: 'Yeni kayit' })).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  test('hidden access durumunda render etmez', () => {
    const { container } = render(
      <PageLayout title="Gizli" access="hidden">
        <div>Gizli</div>
      </PageLayout>,
    );

    expect(container.firstChild).toBeNull();
  });
});
