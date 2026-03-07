import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormDrawer } from './FormDrawer';

describe('FormDrawer', () => {
  test('acikken dialog olarak render edilir', () => {
    render(
      <FormDrawer open title="Yeni kayıt" onClose={() => undefined}>
        <div>İçerik</div>
      </FormDrawer>,
    );

    expect(screen.getByRole('dialog', { name: 'Yeni kayıt' })).toBeInTheDocument();
    expect(screen.getByText('İçerik')).toBeInTheDocument();
  });

  test('escape ile kapanir', () => {
    const handleClose = jest.fn();

    render(
      <FormDrawer open title="Yeni kayıt" onClose={handleClose}>
        <div>İçerik</div>
      </FormDrawer>,
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('readonly iken submit butonu disable olur ama close acik kalir', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();

    render(
      <FormDrawer open title="Yeni kayıt" onClose={handleClose} access="readonly">
        <div>İçerik</div>
      </FormDrawer>,
    );

    expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Kapat' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
