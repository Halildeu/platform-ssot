import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetailDrawer } from './DetailDrawer';

describe('DetailDrawer', () => {
  test('acikken dialog ve baslik render edilir', () => {
    render(
      <DetailDrawer
        open
        title="Kayıt detay"
        onClose={() => undefined}
        sections={[{ key: 'summary', title: 'Özet', content: <span>Detay</span> }]}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Kayıt detay' })).toBeInTheDocument();
    expect(screen.getByText('Detay')).toBeInTheDocument();
  });

  test('tab secimi ile panel icerigi degisir', async () => {
    const user = userEvent.setup();

    render(
      <DetailDrawer
        open
        title="Kayıt detay"
        onClose={() => undefined}
        tabs={[
          { key: 'summary', label: 'Özet', sections: [{ key: 'summary-1', content: <span>Özet içerik</span> }] },
          { key: 'audit', label: 'Audit', sections: [{ key: 'audit-1', content: <span>Audit içerik</span> }] },
        ]}
      />,
    );

    expect(screen.getByText('Özet içerik')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Audit' }));
    expect(screen.getByText('Audit içerik')).toBeInTheDocument();
  });

  test('escape ile kapanir', () => {
    const handleClose = jest.fn();

    render(
      <DetailDrawer
        open
        title="Kayıt detay"
        onClose={handleClose}
        sections={[{ key: 'summary', content: <span>İçerik</span> }]}
      />,
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
