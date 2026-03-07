import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './Popover';

describe('Popover', () => {
  test('trigger ile acilir ve icerik gosterir', async () => {
    const user = userEvent.setup();

    render(
      <Popover
        title="Yardım paneli"
        content={<p>Detaylı yardım</p>}
        trigger={<button type="button">Popover aç</button>}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Popover aç' }));
    expect(screen.getByRole('dialog', { name: 'Yardım paneli' })).toBeInTheDocument();
    expect(screen.getByText('Detaylı yardım')).toBeInTheDocument();
  });

  test('ikinci click ile kapanir', async () => {
    const user = userEvent.setup();

    render(
      <Popover
        content={<p>İçerik</p>}
        trigger={<button type="button">Popover aç</button>}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Popover aç' });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('disariya tiklaninca kapanir', async () => {
    const user = userEvent.setup();

    render(
      <Popover
        content={<p>İçerik</p>}
        trigger={<button type="button">Popover aç</button>}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Popover aç' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(document.body);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('readonly access durumunda acilmaz', async () => {
    const user = userEvent.setup();

    render(
      <Popover
        access="readonly"
        content={<p>İçerik</p>}
        trigger={<button type="button">Popover aç</button>}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Popover aç' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
