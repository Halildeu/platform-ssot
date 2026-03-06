import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Breadcrumb from './Breadcrumb';

describe('Breadcrumb', () => {
  test('son elemani varsayilan olarak current page kabul eder', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Ana sayfa', href: '/' },
          { label: 'Kullanicilar', href: '/users' },
          { label: 'Detay' },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Ana sayfa' })).toBeInTheDocument();
    expect(screen.getByText('Detay')).toHaveTextContent('Detay');
    expect(screen.queryByRole('link', { name: 'Detay' })).toBeNull();
  });

  test('maxItems verildiginde orta segmentleri ellipsis ile collapse eder', () => {
    render(
      <Breadcrumb
        maxItems={4}
        items={[
          { label: 'A', href: '/a' },
          { label: 'B', href: '/b' },
          { label: 'C', href: '/c' },
          { label: 'D', href: '/d' },
          { label: 'E' },
        ]}
      />,
    );

    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'B' })).toBeNull();
    expect(screen.getByRole('link', { name: 'A' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'D' })).toBeInTheDocument();
  });

  test('disabled item tiklama davranisini bloklar', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Breadcrumb
        items={[
          { label: 'Ana sayfa', href: '/' },
          { label: 'Kilitli', href: '/locked', disabled: true, onClick: handleClick },
          { label: 'Detay' },
        ]}
      />,
    );

    expect(screen.queryByRole('link', { name: 'Kilitli' })).toBeNull();
    await user.click(screen.getByText('Kilitli'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
