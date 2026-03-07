import React from 'react';
import { render, screen } from '@testing-library/react';
import TableSimple from './TableSimple';

describe('TableSimple', () => {
  const columns = [
    { key: 'policy', label: 'Politika', accessor: 'policy' as const, emphasis: true },
    { key: 'owner', label: 'Sahip', accessor: 'owner' as const },
    { key: 'status', label: 'Durum', accessor: 'status' as const, align: 'center' as const },
  ];

  const rows = [
    { policy: 'Etik Politikası', owner: 'Uyum', status: 'Aktif' },
    { policy: 'Hediye Politikası', owner: 'Hukuk', status: 'Taslak' },
  ];

  test('caption ve tablo satırlarını gösterir', () => {
    render(<TableSimple caption="Politika listesi" columns={columns} rows={rows} />);

    expect(screen.getByText('Politika listesi')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Etik Politikası')).toBeInTheDocument();
    expect(screen.getByText('Hediye Politikası')).toBeInTheDocument();
  });

  test('empty state gösterir', () => {
    render(<TableSimple caption="Boş tablo" columns={columns} rows={[]} emptyStateLabel="Kayıt yok" />);

    expect(screen.getByText('Kayıt yok')).toBeInTheDocument();
  });

  test('loading durumunda skeleton satırları gösterir', () => {
    render(<TableSimple caption="Yükleniyor" columns={columns} rows={[]} loading />);

    expect(screen.getByText('Yükleniyor')).toBeInTheDocument();
  });

  test('hidden access durumunda render etmez', () => {
    const { container } = render(<TableSimple caption="Gizli tablo" columns={columns} rows={rows} access="hidden" />);

    expect(container).toBeEmptyDOMElement();
  });
});
