import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  test('type belirtilmezse button olarak render edilir', () => {
    render(<Button>Kaydet</Button>);

    const button = screen.getByRole('button', { name: 'Kaydet' });
    expect(button).toHaveAttribute('type', 'button');
  });

  test('aktif durumdayken onClick fonksiyonunu çağırır', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Kaydet</Button>);

    await user.click(screen.getByRole('button', { name: 'Kaydet' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('loading durumunda spinner ve busy state ile render edilir ve click bloklanır', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button loading loadingLabel="Kaydediliyor" onClick={handleClick}>
        Kaydet
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Kaydediliyor' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('data-loading', 'true');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('readonly access durumunda click bloklanir ve aria-readonly set edilir', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button access="readonly" onClick={handleClick}>
        İncele
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'İncele' });
    expect(button).toHaveAttribute('aria-readonly', 'true');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
