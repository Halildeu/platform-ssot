import React from 'react';
import { render, screen } from '@testing-library/react';
import IconButton from './IconButton';

describe('IconButton', () => {
  test('erişilebilir isim ile render edilir', () => {
    render(<IconButton icon={<span aria-hidden="true">+</span>} label="Yeni kayıt" />);

    expect(screen.getByRole('button', { name: 'Yeni kayıt' })).toBeInTheDocument();
  });

  test('selected durumda secondary görünüm işaretini taşır', () => {
    render(<IconButton icon={<span aria-hidden="true">★</span>} label="Favori" selected />);

    const button = screen.getByRole('button', { name: 'Favori' });
    expect(button).toHaveAttribute('data-variant', 'secondary');
  });
});
