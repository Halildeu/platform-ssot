import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  test('label, aciklama ve yardim metnini birlikte gosterir', () => {
    render(
      <Checkbox
        label="Raporu e-posta ile gönder"
        description="Tamamlanan akış sonrası otomatik bildirim üretir."
        hint="İstediğinde kapatabilirsin."
        defaultChecked
      />,
    );

    expect(screen.getByRole('checkbox', { name: /Raporu e-posta ile gönder/i })).toBeChecked();
    expect(screen.getByText('Tamamlanan akış sonrası otomatik bildirim üretir.')).toBeInTheDocument();
    expect(screen.getByText('İstediğinde kapatabilirsin.')).toBeInTheDocument();
  });

  test('uncontrolled kullanimda onCheckedChange yeni durumu verir', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = jest.fn();

    render(<Checkbox label="Takip listesine ekle" onCheckedChange={handleCheckedChange} />);

    const checkbox = screen.getByRole('checkbox', { name: /Takip listesine ekle/i });
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(handleCheckedChange).toHaveBeenLastCalledWith(true, expect.any(Object));
  });

  test('readonly access durumunda degisim bloklanir', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = jest.fn();

    render(
      <Checkbox
        label="Salt okunur seçim"
        defaultChecked
        access="readonly"
        onCheckedChange={handleCheckedChange}
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: /Salt okunur seçim/i });
    expect(checkbox).toHaveAttribute('aria-readonly', 'true');

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  test('indeterminate durumu native input uzerinde yansitilir', () => {
    render(<Checkbox label="Kısmi seçim" indeterminate />);

    const checkbox = screen.getByRole('checkbox', { name: /Kısmi seçim/i }) as HTMLInputElement;

    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  });

  test('hidden access durumunda render etmez', () => {
    render(<Checkbox label="Gizli seçim" access="hidden" />);

    expect(screen.queryByRole('checkbox', { name: /Gizli seçim/i })).not.toBeInTheDocument();
  });
});
