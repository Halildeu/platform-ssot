import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  test('mevcut sayfayı aria-current ile işaretler', () => {
    render(<Pagination totalItems={120} pageSize={10} defaultPage={3} />);

    expect(screen.getByRole('button', { name: 'Sayfa 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText(/Sayfa/i)).toBeInTheDocument();
  });

  test('next tıklanınca uncontrolled state ilerler', () => {
    render(<Pagination totalItems={120} pageSize={10} defaultPage={1} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sonraki sayfa' }));

    expect(screen.getByRole('button', { name: 'Sayfa 2' })).toHaveAttribute('aria-current', 'page');
  });

  test('yüksek sayfa sayısında ellipsis gösterir', () => {
    render(<Pagination totalItems={500} pageSize={10} page={10} />);

    expect(screen.getAllByText('…').length).toBeGreaterThanOrEqual(1);
  });
});
