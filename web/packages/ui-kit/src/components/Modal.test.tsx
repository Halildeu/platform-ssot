import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  test('acikken dialog ve title render edilir', () => {
    render(
      <Modal open title="Silme onayi">
        <p>Riskli islem</p>
      </Modal>,
    );

    expect(screen.getByRole('dialog', { name: 'Silme onayi' })).toBeInTheDocument();
    expect(screen.getByText('Riskli islem')).toBeInTheDocument();
  });

  test('overlay click ile kapanir', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();

    render(
      <Modal open title="Yayin penceresi" onClose={handleClose}>
        <p>Detay</p>
      </Modal>,
    );

    const overlay = document.querySelector('[role="presentation"]');
    expect(overlay).not.toBeNull();
    await user.click(overlay as Element);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('closeOnOverlayClick false iken overlay kapanisi tetiklemez', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();

    render(
      <Modal open title="Yayin penceresi" onClose={handleClose} closeOnOverlayClick={false}>
        <p>Detay</p>
      </Modal>,
    );

    const overlay = document.querySelector('[role="presentation"]');
    expect(overlay).not.toBeNull();
    await user.click(overlay as Element);

    expect(handleClose).not.toHaveBeenCalled();
  });

  test('escape ile kapanir', () => {
    const handleClose = jest.fn();

    render(
      <Modal open title="Yayin penceresi" onClose={handleClose}>
        <p>Detay</p>
      </Modal>,
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('hidden access durumunda render etmez', () => {
    render(
      <Modal open title="Gizli pencere" access="hidden">
        <p>Gizli</p>
      </Modal>,
    );

    expect(screen.queryByRole('dialog', { name: 'Gizli pencere' })).not.toBeInTheDocument();
  });
});
