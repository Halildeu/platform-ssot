import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  test('hover ile tooltip acilir ve metni gosterir', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip text="Kisa yardim">
        <button type="button">Bilgi</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole('button', { name: 'Bilgi' }));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Kisa yardim');
  });

  test('unhover ile tooltip kaybolur', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip text="Kisa yardim">
        <button type="button">Bilgi</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Bilgi' });
    await user.hover(button);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.unhover(button);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  test('focus ile tooltip gorunur ve blur ile kaybolur', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip text="Klavye yardimi">
        <button type="button">Odak</button>
      </Tooltip>,
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Odak' })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Klavye yardimi');

    await user.tab();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  test('hidden access durumunda render etmez', () => {
    render(
      <Tooltip text="Gizli ipucu" access="hidden">
        <button type="button">Bilgi</button>
      </Tooltip>,
    );

    expect(screen.queryByRole('button', { name: 'Bilgi' })).not.toBeInTheDocument();
  });
});
