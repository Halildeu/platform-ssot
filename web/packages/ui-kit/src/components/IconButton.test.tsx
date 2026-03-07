import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  test('loading durumda kare hit-area korunur ve spinner-only görünüm kullanır', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <IconButton
        icon={<span aria-hidden="true">⟳</span>}
        label="Yenileniyor"
        loading
        onClick={handleClick}
      />,
    );

    const button = screen.getByRole('button', { name: 'Yenileniyor' });
    expect(button).toHaveClass('h-11');
    expect(button).toHaveClass('w-11');
    expect(screen.queryByText('Yenileniyor')).toBeNull();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
