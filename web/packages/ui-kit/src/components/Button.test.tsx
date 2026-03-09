import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  test('içindeki metin ile render edilir', () => {
    render(<Button>Tıkla Bana</Button>);
    expect(screen.getByRole('button', { name: /Tıkla Bana/i })).toBeInTheDocument();
  });

  test('tıklandığında onClick fonksiyonunu çağırır', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Tıkla Bana</Button>);
    await user.click(screen.getByRole('button', { name: /Tıkla Bana/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
