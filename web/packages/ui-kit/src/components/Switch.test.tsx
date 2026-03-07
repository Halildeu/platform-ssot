import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Switch from './Switch';

describe('Switch', () => {
  test('label, aciklama ve yardim metnini birlikte gosterir', () => {
    render(
      <Switch
        label="Canlı yayını aç"
        description="Public görünürlüğü tek hareketle değiştirir."
        hint="Dilersen akış tamamlanmadan kapatabilirsin."
        defaultChecked
      />,
    );

    expect(screen.getByRole('switch', { name: /Canlı yayını aç/i })).toBeChecked();
    expect(screen.getByText('Public görünürlüğü tek hareketle değiştirir.')).toBeInTheDocument();
    expect(screen.getByText('Dilersen akış tamamlanmadan kapatabilirsin.')).toBeInTheDocument();
  });

  test('uncontrolled kullanimda onCheckedChange yeni durumu verir', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = jest.fn();

    render(<Switch label="Bildirimleri aç" onCheckedChange={handleCheckedChange} />);

    const toggle = screen.getByRole('switch', { name: /Bildirimleri aç/i });
    await user.click(toggle);

    expect(toggle).toBeChecked();
    expect(handleCheckedChange).toHaveBeenLastCalledWith(true, expect.any(Object));
  });

  test('readonly access durumunda degisim bloklanir', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = jest.fn();

    render(
      <Switch
        label="Salt okunur toggle"
        defaultChecked
        access="readonly"
        onCheckedChange={handleCheckedChange}
      />,
    );

    const toggle = screen.getByRole('switch', { name: /Salt okunur toggle/i });
    expect(toggle).toHaveAttribute('aria-readonly', 'true');

    await user.click(toggle);

    expect(toggle).toBeChecked();
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  test('hidden access durumunda render etmez', () => {
    render(<Switch label="Gizli toggle" access="hidden" />);

    expect(screen.queryByRole('switch', { name: /Gizli toggle/i })).not.toBeInTheDocument();
  });
});
