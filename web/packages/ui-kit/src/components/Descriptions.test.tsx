import React from 'react';
import { render, screen } from '@testing-library/react';
import Descriptions from './Descriptions';

describe('Descriptions', () => {
  const items = [
    { key: 'owner', label: 'Sahip', value: 'Uyum Ekibi', helper: 'Akışın karar sahibi.' },
    { key: 'status', label: 'Durum', value: 'Aktif', tone: 'success' as const },
    { key: 'scope', label: 'Kapsam', value: 'Tüm grup şirketler', span: 2 as const },
  ];

  test('label ve value çiftlerini gösterir', () => {
    render(<Descriptions title="Özet" items={items} columns={2} />);

    expect(screen.getByText('Özet')).toBeInTheDocument();
    expect(screen.getByText('Uyum Ekibi')).toBeInTheDocument();
    expect(screen.getByText('Tüm grup şirketler')).toBeInTheDocument();
  });

  test('helper metnini gösterir', () => {
    render(<Descriptions items={items} />);

    expect(screen.getByText('Akışın karar sahibi.')).toBeInTheDocument();
  });

  test('empty state gösterir', () => {
    render(<Descriptions items={[]} emptyStateLabel="Detay yok" />);

    expect(screen.getByText('Detay yok')).toBeInTheDocument();
  });

  test('hidden access durumunda render etmez', () => {
    const { container } = render(<Descriptions items={items} access="hidden" />);

    expect(container).toBeEmptyDOMElement();
  });
});
