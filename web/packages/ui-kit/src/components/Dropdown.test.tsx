import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  test('trigger ile acilir ve item secildiginde callback calisir', async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();

    render(
      <Dropdown
        trigger={<span>Aksiyon</span>}
        items={[
          { key: 'edit', label: 'Duzenle' },
          { key: 'archive', label: 'Arsivle' },
        ]}
        onSelect={handleSelect}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Aksiyon' }));
    await user.click(screen.getByRole('menuitem', { name: 'Duzenle' }));

    expect(handleSelect).toHaveBeenCalledWith('edit');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('disariya tiklandiginda kapanir', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown
        trigger={<span>Aksiyon</span>}
        items={[{ key: 'edit', label: 'Duzenle' }]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Aksiyon' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('readonly access durumunda menuyu acmaz', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown
        trigger={<span>Aksiyon</span>}
        items={[{ key: 'edit', label: 'Duzenle' }]}
        access="readonly"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Aksiyon' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('escape ile kapanir', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown
        trigger={<span>Aksiyon</span>}
        items={[{ key: 'edit', label: 'Duzenle' }]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Aksiyon' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
